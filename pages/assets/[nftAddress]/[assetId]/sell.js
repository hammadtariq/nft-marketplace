import React, { useState } from "react";
import { AiOutlineLeft, AiOutlineInfoCircle } from "react-icons/ai";
import { useRouter } from "next/router";
import Image from "next/image";
import { handleError, handleSuccess, getChainUnit, getChainIcon } from "/utils/ui.utils";
import { useNotification } from "@web3uikit/core";
import { useMoralis, useWeb3Contract } from "react-moralis";
import { OffChainNftAbi, OnChainNftAbi, NftMarketplaceAbi } from "/constants";
import { ethers } from "ethers";

export default function Sell() {
    const router = useRouter();

    const {
        query: {
            name,
            imageUri: img,
            nftAddress,
            isOnchain,
            assetId,
            NftMarketplaceAddress,
            nftCollection,
        },
    } = router;

    const dispatch = useNotification();
    const [price, setPrice] = useState(0);

    const { runContractFunction } = useWeb3Contract();
    const { chainId: chainIdHex } = useMoralis();
    const chainId = parseInt(chainIdHex, 16);

    const convertWeiToEther = () => {
        return ethers.utils.parseEther(price ? price : "0", "ether");
    };

    const handleList = () => {
        runContractFunction({
            onSuccess: async (tx) => {
                await handleSuccess(tx, dispatch);
                router.push({
                    pathname: `/assets/${nftAddress}/${assetId}`,
                });
            },

            onError: (error) => {
                handleError(error, dispatch);
            },
            params: {
                abi: NftMarketplaceAbi,
                contractAddress: NftMarketplaceAddress,
                functionName: "listItem",
                params: {
                    nftAddress: nftAddress,
                    tokenId: assetId,
                    price: convertWeiToEther(),
                },
            },
        });
    };

    const handleClick = () => {
        runContractFunction({
            onSuccess: async (tx) => {
                handleList();
            },
            onError: (error) => {
                console.log("🚀 ~ file: sell.js ~ line 67 ~ handleClick ~ error", error);
                handleError(error, dispatch);
            },
            params: {
                abi: isOnchain ? OnChainNftAbi : OffChainNftAbi,
                contractAddress: nftAddress,
                functionName: "approve",
                params: {
                    to: NftMarketplaceAddress,
                    tokenId: parseInt(assetId),
                },
            },
        });
    };
    return (
        <div className="h-28 bg-slate-50 w-screen sticky  p-5">
            <div className="w-5/6 my-0 mx-auto h-full">
                <div className="flex h-full">
                    <div
                        className="flex items-center h-full cursor-pointer"
                        onClick={() => {
                            window.history.back();
                        }}
                    >
                        {AiOutlineLeft ? <AiOutlineLeft /> : null}
                    </div>
                    <div className="flex h-full">
                        <div className="mx-1 items-center h-full flex">
                            <Image
                                className="flex items-center h-full ml-0.5 rounded"
                                loader={() => img}
                                src={img}
                                alt="nft image"
                                height={56}
                                width={56}
                            />
                        </div>
                        <div className="flex  flex-col ml-2">
                            <p className="text-gray-900 text-base font-semibold font-sans">
                                {" "}
                                {name}
                            </p>
                            <p> {nftCollection}</p>
                        </div>
                    </div>
                </div>
            </div>
            <div className="w-5/6 mx-auto h-full my-9 flex">
                <form className="flex flex-col w-full sm:w-6/12 ">
                    <p className="text-lg my-9 font-sans text-base">List item for sale</p>
                    <div className="flex flex-col">
                        <div className="flex justify-between w-full">
                            <p className="font-sans text-base">Type</p>
                            <div className="order-last">
                                <AiOutlineInfoCircle />
                            </div>
                        </div>
                        <div className="">
                            <div className="">
                                <div
                                    className="flex flex-col  p-5 w-full border-zinc-200 rounded-md text-center cursor-default border-2 my-3.5 hover:drop-shadow-lg "
                                    style={{
                                        backgroundColor: "#f0f9ff",
                                    }}
                                >
                                    <p>$</p>
                                    <p> Fixed Price</p>
                                </div>
                                <div>
                                    <p> Price </p>
                                    <div className="flex">
                                        <input
                                            type={"number"}
                                            placeholder="Amount"
                                            style={{ borderColor: "#f2f4f5", height: "48px" }}
                                            value={price}
                                            onChange={(event) => {
                                                const price = event.target.value?.toString();
                                                setPrice(price);
                                            }}
                                            className="flex-1 border-2 p-3 rounded-tr-none rounded-br-none rounded-tl-xl rounded-bl-xl"
                                        />
                                        <span
                                            style={{
                                                borderColor: "#f2f4f5",
                                                backgroundColor: "#f2f4f5",
                                            }}
                                            className="w-24 text-center rounded-tr-md rounded-br-md text-center flex items-center justify-center cursor-default"
                                        >
                                            {getChainUnit(chainId)}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex flex-col mt-3.5">
                                    <div className="flex justify-between w-full">
                                        <p className="font-sans text-xs font-bold">Fees</p>
                                        <div className="order-last">
                                            <AiOutlineInfoCircle />
                                        </div>
                                    </div>
                                    <div className="flex justify-between w-full mt-5">
                                        <p className="font-sans text-xs font-bold text-zinc-400">
                                            Service Fee
                                        </p>
                                        <div className="order-last text-xs font-semibold text-zinc-400">
                                            2.5%
                                        </div>
                                    </div>

                                    <div className="flex justify-between w-full mt-1">
                                        <p className="font-sans text-xs font-bold text-zinc-400">
                                            Creator Fee
                                        </p>
                                        <div className="order-last text-xs font-semibold text-zinc-400">
                                            0%
                                        </div>
                                    </div>
                                    <input
                                        type="button"
                                        value="Complete Listing"
                                        width={400}
                                        className="rounded-3xl mt-9 p-3 w-fit border-2 border-slate-400"
                                        onClick={handleClick}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
                <div className="flex flex-col w-6/12 block  ">
                    <div className="ml-40 mt-9 hidden sm:block">
                        <p className=""> Preview </p>
                        <div
                            className="mt-5 w-fit py-16 pt-16 border-2 rounded-md"
                            style={{ maxWidth: "490px" }}
                        >
                            <Image
                                className="flex  h-full ml-0.5 rounded"
                                loader={() => img}
                                src={img}
                                alt="nft image"
                                height={300}
                                width={400}
                            />
                            <div className="flex justify-between w-full mt-5 px-3">
                                <p className="font-sans text-xs font-bold text-zinc-400">
                                    OffChain Collection
                                </p>
                                <div className="order-last text-xs font-semibold text-zinc-400">
                                    <span className="flex">
                                        {" "}
                                        {price} {getChainIcon(chainId, 12)}
                                    </span>
                                </div>
                            </div>
                            <div className="flex justify-between w-full px-3 ">
                                <p className="font-sans text-xs font-bold text-zinc-900">
                                    Service Fee
                                </p>
                                <div className="order-last text-xs font-semibold text-zinc-900">
                                    2.5%
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
