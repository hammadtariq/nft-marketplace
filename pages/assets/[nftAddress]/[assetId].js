import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { useMoralis, useWeb3Contract } from "react-moralis";
import { Accordion, useNotification } from "@web3uikit/core";
import NFTCard from "/components/NFTCard";
import Loader from "/components/Loader";
import ActivityTable from "/components/ActivityTable";
import ListingTable from "/components/ListingTable";
import DescriptionCard from "/components/DescriptionCard";
import PriceCard from "/components/PriceCard";
import styles from "/styles/View.module.css";
import PriceHistory from "/components/PriceHistory";
import { truncatedAddress } from "/utils/ui.utils";
import { OffChainNftAbi, OnChainNftAbi, NftMarketplaceAbi, PriceConsumerV3Abi } from "/constants";
import {
    getContractAddresses,
    handleError,
    handleSuccess,
    formatDollarAmount,
    replaceIpfsFromURI,
} from "/utils/ui.utils";
const IPFS_GATEWAY = process.env.NEXT_PUBLIC_IPFS_GATEWAY;

const nft = {
    owner: {
        about: "A collection of 10K immutable NFTs, 0% royalties.Made to remind you of how fun things were when we were kids, before growing up - let’s never stop having fun!",
    },
};

export default function View() {
    const router = useRouter();
    const dispatch = useNotification();
    const { nftAddress, assetId, nftCollection } = router.query;
    const [imageUri, setImageUri] = useState("");
    const [tokenMeta, setTokenMeta] = useState(null);
    const [nftDetails, setNftDetails] = useState(null);
    const [dollarPrice, setDollarPrice] = useState(0);

    const { chainId: chainIdHex, isWeb3Enabled, account, Moralis } = useMoralis();
    const chainId = parseInt(chainIdHex, 16);
    const [NftMarketplaceAddress, PriceConsumerV3Address] = getContractAddresses(chainId, [
        "NftMarketplace",
        "PriceConsumerV3",
    ]);

    const { runContractFunction: updateListing } = useWeb3Contract({
        abi: NftMarketplaceAbi,
        contractAddress: NftMarketplaceAddress,
        functionName: "updateListing",
        params: {
            nftAddress: nftAddress,
            tokenId: assetId,
            newPrice: "500000000000000",
        },
    });

    const { runContractFunction: cancelListing } = useWeb3Contract({
        abi: NftMarketplaceAbi,
        contractAddress: NftMarketplaceAddress,
        functionName: "cancelListing",
        params: {
            nftAddress: nftAddress,
            tokenId: assetId,
        },
    });

    const { runContractFunction: buyItem } = useWeb3Contract({
        abi: NftMarketplaceAbi,
        contractAddress: NftMarketplaceAddress,
        functionName: "buyItem",
        params: {
            nftAddress: nftAddress,
            tokenId: assetId,
        },
        msgValue: nftDetails?.price,
    });

    const { runContractFunction: getLatestPrice } = useWeb3Contract({
        abi: PriceConsumerV3Abi,
        contractAddress: PriceConsumerV3Address,
        functionName: "getLatestPrice",
    });

    const getDollarPrice = async () => {
        const price = await getLatestPrice({
            onError: (error) => console.error(error, "error"),
        });
        return price ? formatDollarAmount(price[0], price[1]) : 0;
    };

    useEffect(() => {
        if (assetId && nftAddress) {
            const query = new Moralis.Query("ItemList");
            query.equalTo("tokenId", assetId);
            query.equalTo("nftAddress", nftAddress);
            query
                .find()
                .then(function (results) {
                    const isOnchain = results[0]?.attributes?.metadataUri?.startsWith("data:");
                    setNftDetails({ ...results[0]?.attributes, isOnchain });
                })
                .catch(function (error) {
                    console.log(error);
                });
        }
    }, [assetId, nftAddress]);

    useEffect(() => {
        if (isWeb3Enabled && nftDetails) {
            updateUI();
        }
    }, [isWeb3Enabled, nftDetails]);

    useEffect(() => {
        if (isWeb3Enabled) {
            const getData = async () => {
                const dollarPrice = await getDollarPrice();
                setDollarPrice(dollarPrice);
            };
            getData().catch((error) => console.error(error));
        }
    }, [getLatestPrice]);

    async function updateUI() {
        if (nftDetails?.metadataUri) {
            if (nftDetails.isOnchain) {
                const uri = nftDetails.metadataUri.split("base64,");
                const decodedUri = JSON.parse(window.atob(uri[1]));

                setImageUri(decodedUri.image);
                setTokenMeta({
                    name: decodedUri.name,
                    description: decodedUri.description,
                    attributes: JSON.parse(decodedUri.attributes?.replaceAll("'", '"')),
                });
            } else {
                let responseUrl = replaceIpfsFromURI(nftDetails.metadataUri);
                try {
                    const meta = await (await fetch(responseUrl))?.json();
                    setTokenMeta(meta);
                    const image = meta.image.replace("ipfs://", IPFS_GATEWAY);
                    setImageUri(image);
                } catch (error) {
                    console.log("tokenMeta error:", error);
                }
            }
        }
    }

    const handleSell = () => {
        console.log("🚀 ~ file: [assetId].js ~ line 168 ~ handleSell ~ tokenMeta", tokenMeta);

        router.push({
            pathname: `/assets/${nftAddress}/${assetId}/sell`,
            query: {
                name: tokenMeta.name,
                imageUri,
                nftAddress,
                NftMarketplaceAddress,
                assetId,
                isOnchain: nftDetails?.isOnchain,
                OnChainNftAbi,
                OffChainNftAbi,
                nftCollection,
            },
        });
    };

    const handleLowerPrice = async () => {
        await updateListing({
            onSuccess: async (tx) => await handleSuccess(tx, dispatch),
            onError: (error) => handleError(error, dispatch),
        });
    };

    const handleCancelListing = async () => {
        await cancelListing({
            onSuccess: async (tx) => await handleSuccess(tx, dispatch),
            onError: (error) => handleError(error, dispatch),
        });
    };

    const isOwner = account === nftDetails?.currentOwner;

    const getHeaderButtons = () => {
        return (
            <div className={styles.actionHeader}>
                {!nftDetails?.isListed && (
                    <button type="button" onClick={handleSell} className={styles.priceActionBtn}>
                        Sell
                    </button>
                )}
                {nftDetails?.isListed && (
                    <>
                        <button
                            type="button"
                            onClick={handleLowerPrice}
                            className={styles.priceActionBtn}
                        >
                            Lower price
                        </button>
                        <button
                            type="button"
                            onClick={handleCancelListing}
                            className={styles.cancelButton}
                        >
                            Cancel listings
                        </button>
                    </>
                )}
                {/* <button type="button" className={styles.editButton}>
                    Edit
                </button> */}
            </div>
        );
    };

    return isWeb3Enabled ? (
        nftDetails && tokenMeta ? (
            <>
                {isOwner && getHeaderButtons()}
                <div className="bg-white">
                    <div className={styles.viewContainer}>
                        <div className={styles.upperConent}>
                            <div>
                                <NFTCard image={imageUri} name={tokenMeta?.name} />

                                <DescriptionCard
                                    nftDetails={nftDetails}
                                    tokenMeta={tokenMeta}
                                    owner={{
                                        address: nftDetails?.currentOwner,
                                        about: nft.owner.about,
                                    }}
                                    isOwner={isOwner}
                                />
                            </div>
                            <div className="mt-2">
                                <div className={styles.nftHeading}>
                                    <h1 className={styles.nftName}>{tokenMeta?.name}</h1>
                                </div>
                                <div className="py-4 lg:col-start-1 lg:col-span-2lg:pr-8">
                                    <div className="mt-2">
                                        <h2 className={styles.ownerName}>
                                            Owned by{" "}
                                            <span className={styles.addressText}>
                                                {isOwner
                                                    ? "You"
                                                    : truncatedAddress(nftDetails?.currentOwner)}
                                            </span>
                                        </h2>
                                    </div>
                                </div>
                                {nftDetails?.price && (
                                    <PriceCard
                                        isOwner={isOwner}
                                        buyItem={buyItem}
                                        dispatch={dispatch}
                                        dollarPrice={dollarPrice}
                                        price={nftDetails?.price}
                                        chainId={chainId}
                                    />
                                )}
                                <PriceHistory assetId={assetId} nftAddress={nftAddress} />
                                <ListingTable
                                    nftAddress={nftAddress}
                                    assetId={assetId}
                                    dollarPrice={dollarPrice}
                                    chainId={chainId}
                                />
                            </div>
                        </div>
                        <div className="lg:mx-8 md:mx-16 sm:mx-16">
                            <ActivityTable
                                chainId={chainId}
                                assetId={assetId}
                                nftAddress={nftAddress}
                                nftDetails={nftDetails}
                                account={account}
                            />
                        </div>
                    </div>
                </div>
            </>
        ) : (
            <Loader />
        )
    ) : (
        <p className="py-4 px-2">Please connect to wallet</p>
    );
}
