import React from "react";
import { image } from "../utils/ui.utils";

import { Eth } from "@web3uikit/icons";

const FetchedNFT = ({ contractType, metadata, name }) => {
    return (
        <>
            <div id="nft">
                {image(
                    JSON.parse(String(metadata))?.animation_url,
                    JSON.parse(String(metadata))?.image || JSON.parse(String(metadata))?.image_url
                )}
                <div
                    id="nft-info"
                    style={{
                        backgroundColor: `rgb(32, 34, 37)`,
                    }}
                >
                    <div>
                        <div className="p-2">
                            <h5 className="text-gray-50 text-sm mb-2 font-mono">
                                {JSON.parse(String(metadata))?.name || name}
                            </h5>
                            <p className="text-gray-50 text-sm mb-2 font-mono">{"Price"}</p>
                            <p className="text-gray-50 text-sm mb-2 font-mono">
                                {" "}
                                <Eth fontSize="20px" color="yellow" className="inline" />
                                {numberIntoDecimal(data?.amount)}
                            </p>
                        </div>
                    </div>
                </div>
                <div
                    id="nft-footer"
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
            </div>
        </>
    );
};

export default FetchedNFT;
