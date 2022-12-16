import { useEffect, useState } from "react";

import axios from "axios";
import { useMoralis, useMoralisQuery } from "react-moralis";

import { Tab, TabList } from "@web3uikit/core";

import user from "../assets/userPlaceHolder.png";
import Card from "../components/Card";
import Upload from "../components/Upload";
import { replaceIpfsFromURI } from "../utils/ui.utils";

const UserPortfolio = () => {
    const [coverPhoto, setCoverPhoto] = useState(null);
    const [profilePhoto, setProfilePhoto] = useState(null);
    const [listItemCards, setListItemCards] = useState([]);
    const [boghtItemCards, setBoughtItemCards] = useState([]);

    const { chainId: chainIdHex, account, Moralis } = useMoralis();
    const chainId = parseInt(chainIdHex, 16);

    const { data: listItem, error: userItemsError } = useMoralisQuery(
        "ItemList",
        (query) => query.equalTo("creator", account).equalTo("chainId", chainId),
        [account]
    );

    const { data: itemBought } = useMoralisQuery(
        "NftmarketplaceLogs",
        (query) =>
            query
                .equalTo("buyer", account)
                .equalTo("name", "ItemBought")
                .equalTo("chainId", chainId),
        [account]
    );

    useEffect(() => {
        getItemBought(itemBought);
    }, [itemBought]);

    useEffect(() => {
        getListItemData(listItem);
    }, [listItem]);

    const getItemBought = async (data) => {
        if (data) {
            const boughtItems = await filterBoughtItems(data);
            setBoughtItemCards(boughtItems);
        }
    };
    const filterBoughtItems = async (items) => {
        let boughtItems = [];
        for await (const item of items) {
            const {
                attributes: { tokenId, price, nftAddress },
            } = item;
            const query = new Moralis.Query("ItemList");
            query.equalTo("tokenId", tokenId);
            query.equalTo("nftAddress", nftAddress);
            const result = await query.find();
            const {
                attributes: { metadataUri },
            } = result[0];
            if (metadataUri.includes("data:application/json")) {
                const uri = metadataUri.split("base64,");
                const decodedUri = JSON.parse(window.atob(uri[1]));
                boughtItems = [...boughtItems, { ...decodedUri, tokenId, nftAddress }];
            } else {
                const correctMetaData = replaceIpfsFromURI(metadataUri);
                const { data } = await requestListItem(correctMetaData);
                data.image = replaceIpfsFromURI(data.image);
                boughtItems = [...boughtItems, { ...data, tokenId, nftAddress }];
            }
        }

        return boughtItems;
    };

    const getListItemData = async (data) => {
        if (data) {
            const listItems = await filterListItems(data);
            setListItemCards(listItems);
        }
    };

    const filterListItems = async (items) => {
        const removeDuplicateData = [];
        let listItems = [];
        for await (const item of items) {
            const {
                attributes: { metadataUri, tokenId, nftAddress },
            } = item;
            if (!removeDuplicateData.includes(metadataUri)) {
                removeDuplicateData.push(metadataUri);
                if (metadataUri.includes("data:application/json")) {
                    const uri = metadataUri.split("base64,");
                    const decodedUri = JSON.parse(window.atob(uri[1]));
                    listItems = [...listItems, { ...decodedUri, tokenId, nftAddress }];
                } else {
                    const correctMetaData = replaceIpfsFromURI(metadataUri);
                    const { data } = await requestListItem(correctMetaData);
                    data.image = replaceIpfsFromURI(data.image);
                    listItems = [...listItems, { ...data, tokenId, nftAddress }];
                }
            }
        }
        return listItems;
    };
    const requestListItem = async (uri) => {
        return await axios.get(uri);
    };

    const onUpload = (event) => {
        if (event) {
            const {
                target: { files, id },
            } = event;
            if (id === "dropzone-file-profile") {
                setProfilePhoto(files[0]);
            } else {
                setCoverPhoto(files[0]);
            }
        }
    };
    return (
        <div>
            <div className="relative">
                <div className="h-52">
                    <Upload
                        onClear={() => console.log("cleared")}
                        onChange={onUpload}
                        value={coverPhoto}
                        isProfileUpload
                        cssStyle="h-full dark:bg-gray-700"
                        pictureIconStyle="right-0 -bottom-0"
                        id="cover"
                    />
                </div>
                <div className="absolute -bottom-12">
                    <div className="border rounded-full w-36 h-36 ml-4">
                        <Upload
                            onClear={() => console.log("cleared")}
                            onChange={onUpload}
                            value={profilePhoto}
                            placeHolder={user}
                            isProfileUpload
                            cssStyle="rounded-full h-full"
                            pictureIconStyle="-right-3 -bottom-4"
                            id="profile"
                        />
                    </div>
                </div>
            </div>
            <div className="mt-14 pl-6 text-2xl">
                <h1>Hammad Tariq</h1>
            </div>
            <div className="mt-10 ml-6">
                <TabList defaultActiveKey={1} onChange={function noRefCheck() {}} tabStyle="bar">
                    <Tab
                        tabKey={1}
                        tabName={
                            <div style={{ display: "flex" }}>
                                <span style={{ paddingLeft: "4px" }}>Collected </span>
                            </div>
                        }
                    >
                        <div className="flex">
                            {boghtItemCards.map(
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
                                            chainId={chainId}
                                            nftAddress={nftAddress}
                                        />
                                    );
                                }
                            )}
                        </div>
                    </Tab>

                    <Tab
                        tabKey={2}
                        tabName={
                            <div style={{ display: "flex" }}>
                                <span style={{ paddingLeft: "4px" }}>Created </span>
                            </div>
                        }
                    >
                        <div className="flex">
                            {listItemCards.map(
                                ({ name, description, image, tokenId, nftAddress }, index) => {
                                    return (
                                        <Card
                                            key={index}
                                            name={name}
                                            description={description}
                                            image={image}
                                            tokenId={tokenId}
                                            chainId={chainId}
                                            nftAddress={nftAddress}
                                        />
                                    );
                                }
                            )}
                        </div>
                    </Tab>
                </TabList>
            </div>
        </div>
    );
};

export default UserPortfolio;
