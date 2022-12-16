import { useCallback, useEffect, useState } from "react";

import axios from "axios";
import { useMoralis, useMoralisQuery } from "react-moralis";

import { Tab, TabList, useNotification } from "@web3uikit/core";

import Card from "../components/Card";
import { handleNewNotification, replaceIpfsFromURI } from "../utils/ui.utils";

export default function Explore() {
    const [onChainItems, setOnChainItem] = useState([]);
    const [offChainItems, setOffChainItem] = useState([]);
    const { chainId: chainIdHex } = useMoralis();
    const chainId = parseInt(chainIdHex, 16);

    const { data: itemListed } = new useMoralisQuery("ItemList", (query) =>
        query.equalTo("chainId", chainId).equalTo("isListed", true)
    );
    const dispatch = useNotification();

    const requestListItem = async (uri) => {
        try {
            return await axios.get(uri);
        } catch (e) {
            console.log("🚀 ~ file: explore.js ~ line 26 ~ requestListItem ~ e", e);
            return { image: uri };
        }
    };

    const getNFTs = useCallback(async (data) => {
        if (data) {
            const { onChainItems, ofChainItems } = await filterListedItems(data);
            setOnChainItem(onChainItems);
            setOffChainItem(ofChainItems);
        }
    }, []);

    useEffect(() => {
        getNFTs(itemListed);
    }, [getNFTs, itemListed]);

    const filterListedItems = async (items) => {
        const removeDuplicateData = [];
        let onChainItems = [];
        let ofChainItems = [];

        for await (const item of items) {
            const {
                attributes: { metadataUri, tokenId, nftAddress, price },
            } = item;
            if (!removeDuplicateData.includes(metadataUri)) {
                removeDuplicateData.push(metadataUri);
                if (metadataUri && metadataUri?.includes("data:application/json")) {
                    const uri = metadataUri.split("base64,");
                    const decodedUri = JSON.parse(window.atob(uri[1]));
                    onChainItems = [...onChainItems, { ...decodedUri, tokenId, nftAddress, price }];
                } else {
                    const correctMetaData = replaceIpfsFromURI(metadataUri);
                    const { data } = await requestListItem(correctMetaData);
                    if (data && data.image) {
                        data.image = replaceIpfsFromURI(data?.image);
                        ofChainItems = [...ofChainItems, { ...data, tokenId, nftAddress, price }];
                    } else {
                        handleNewNotification(
                            dispatch,
                            "warning",
                            "Warning",
                            "Not able to fetch meta data from IPFS gateway"
                        );
                        console.log("Not able to fetch data from IPFS");
                    }
                }
            }
        }
        return { onChainItems, ofChainItems };
    };

    return (
        <>
            <div className="flex flex-col p-4 mt-2">
                <TabList defaultActiveKey={1} tabStyle="bar">
                    <Tab
                        tabKey={1}
                        tabName={
                            <div style={{ display: "flex" }}>
                                <span style={{ paddingLeft: "4px" }}>OnChain NFT Collection </span>
                            </div>
                        }
                    >
                        <ul className="px-4 flex flex-col sm:flex-row">
                            {onChainItems.map(
                                (
                                    { name, description, image, price, tokenId, nftAddress },
                                    index
                                ) => {
                                    return (
                                        <Card
                                            key={index}
                                            name={name}
                                            description={description}
                                            image={image}
                                            price={price}
                                            tokenId={tokenId}
                                            nftAddress={nftAddress}
                                            chainId={chainId}
                                            buy={() => {}}
                                            nftCollection={"OnChain Collection"}
                                        />
                                    );
                                }
                            )}
                        </ul>
                    </Tab>
                    <Tab
                        tabKey={2}
                        tabName={
                            <div style={{ display: "flex" }}>
                                <span style={{ paddingLeft: "4px" }}>OffChain NFT Collection </span>
                            </div>
                        }
                    >
                        <ul className="px-4 flex flex-col sm:flex-row">
                            {offChainItems.map(
                                (
                                    { name, description, image, price, tokenId, nftAddress },
                                    index
                                ) => {
                                    return (
                                        <Card
                                            key={index}
                                            name={name}
                                            description={description}
                                            image={image}
                                            price={price}
                                            tokenId={tokenId}
                                            nftAddress={nftAddress}
                                            chainId={chainId}
                                            buy={() => {}}
                                            nftCollection={"OffChain Collection"}
                                        />
                                    );
                                }
                            )}
                        </ul>
                    </Tab>
                </TabList>
            </div>
        </>
    );
}
