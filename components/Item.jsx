import { useEffect, useState } from "react";

import { ethers } from "ethers";
import Image from "next/image";
import Link from "next/link";

import { useMoralis, useWeb3Contract } from "react-moralis";

import { Card, Illustration } from "@web3uikit/core";

import { BasicNftAbi } from "../constants";
import { truncatedAddress } from "../utils/ui.utils";

const IPFS_GATEWAY = process.env.NEXT_PUBLIC_IPFS_GATEWAY;
console.log({ IPFS_GATEWAY });

function Item({ nftAddress, tokenId, seller, price }) {
    const [imageUri, setImageUri] = useState("");
    const [tokenMeta, setTokenMeta] = useState("");
    const { isWeb3Enabled, account } = useMoralis();

    // Contract functions
    const { runContractFunction: getTokenURI } = useWeb3Contract({
        abi: BasicNftAbi,
        contractAddress: nftAddress,
        functionName: "tokenURI",
        params: {
            tokenId: tokenId,
        },
    });

    useEffect(() => {
        if (isWeb3Enabled) {
            updateUI();
        }
    }, [isWeb3Enabled]);

    async function updateUI() {
        const tokenUri = await getTokenURI();
        // Note: if TokenUri is undefined, verify these steps
        // 1. Your wallet is connected to localhost hardhat node.
        // 2. Checkout DB listed items contract address are recent one.
        // 3. Your IPFS gateway is responding.
        console.log("tokenUri", tokenUri);
        if (tokenUri) {
            let responseUrl = tokenUri.replace("ipfs://", IPFS_GATEWAY);
            console.log("responseUrl", responseUrl);
            try {
                const meta = await (await fetch(responseUrl))?.json();
                setTokenMeta(meta);
                const image = meta.image.replace("ipfs://", IPFS_GATEWAY);
                setImageUri(image);
                console.log("tokenMeta", meta);
                console.log("tokenMeta image", image);
            } catch (error) {
                console.log("tokenMeta error:", error);
            }
        }
    }

    const isOwner = account === seller || seller === undefined;

    return (
        <Link href={`/assets/${encodeURIComponent(nftAddress)}/${encodeURIComponent(tokenId)}`}>
            <div
                style={{
                    width: "250px",
                }}
            >
                <Card
                    onClick={function noRefCheck() {}}
                    setIsSelected={function noRefCheck() {}}
                    title={tokenMeta.name}
                    description={tokenMeta.description}
                    tooltipText="Coming soon"
                >
                    <div>
                        <p># {tokenId}</p>
                        <p className="italic text-sm">
                            Owned By: {isOwner ? "You" : truncatedAddress(seller)}
                        </p>
                        {!imageUri ? (
                            <Illustration height="200px" logo="lazyNft" width="200" />
                        ) : (
                            <Image
                                loader={() => imageUri}
                                src={imageUri}
                                alt="Nft image"
                                height="200"
                                width="200"
                            />
                        )}
                        <div className="text-center">
                            <p className="font-bold">
                                Price: {ethers.utils.formatEther(price)} ether
                            </p>
                        </div>
                    </div>
                </Card>
            </div>
        </Link>
    );
}

export default Item;
