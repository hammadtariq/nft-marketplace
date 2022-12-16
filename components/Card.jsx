import Link from "next/link";
import React, { useState } from "react";
import { numberIntoDecimal, getChainIcon } from "../utils/ui.utils";
import Image from "next/image";
const styles = {
    height: "inherit",
    width: "-webkit-fill-available",
    borderTopLeftRadius: "10px",
    borderTopRightRadius: "10px",
};
const Card = ({
    name,
    description,
    price,
    image: img,
    tokenId,
    nftAddress,
    chainId,
    buy,
    nftCollection,
}) => {
    const [isShown, setIsShown] = useState(false);
    return (
        <Link
            href={{
                pathname: `/assets/${encodeURIComponent(nftAddress)}/${encodeURIComponent(
                    tokenId
                )}`,
                query: { nftCollection },
            }}
        >
            <div className={"my-2"}>
                <div
                    className="rounded-lg shadow-2xl bg-white w-52 mr-4 overflow-hidden z-10"
                    style={{ maxHeight: "365px" }}
                    onMouseEnter={() => setIsShown(true)}
                    onMouseLeave={() => setIsShown(false)}
                >
                    <div className="h-52 border-gray-400 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 ">
                        <Image
                            className={`${
                                isShown ? "scale-105" : "scale-100"
                            } ease-in duration-500`}
                            loader={() => img}
                            src={img}
                            alt="nft image"
                            height={208}
                            width={208}
                            style={styles}
                        />
                    </div>
                    <div className="p-2">
                        <h5 className="text-gray-900 text-base font-semibold font-sans">{name}</h5>
                        <p className="text-gray-700 text-sm mb-4">{description}</p>

                        <p className="text-gray-700 text-sm font-bold">Price</p>
                        <p className="text-gray-700 text-sm mb-4 flex">
                            {price ? (
                                <>
                                    <span className="mr-1">
                                        {getChainIcon(chainId, 20, { display: "inline" })}
                                    </span>
                                    <span>{numberIntoDecimal(price)}</span>
                                </>
                            ) : (
                                "Not Listed"
                            )}
                        </p>
                    </div>
                    <div className="pb-3 pl-2">
                        <p className="text-gray-400 text-sm font-bold">End in a day</p>
                    </div>
                    {buy && price && (
                        <div
                            id="nft-footer"
                            className={`${isShown && "hover-effect"}`}
                            style={{
                                borderBottomRight: "25px",
                                borderBottomLeft: "25px",
                            }}
                        >
                            <button
                                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded w-full"
                                style={{
                                    borderTopRightRadius: "0",
                                    borderTopLeftRadius: "0",
                                }}
                            >
                                Buy
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </Link>
    );
};
export default Card;
