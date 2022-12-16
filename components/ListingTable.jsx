import { useEffect, useState } from "react";
import { useMoralis } from "react-moralis";
import { ethers } from "ethers";
import { getChainUnit, truncatedAddress, getPriceDollars } from "/utils/ui.utils";
import Loader from "/components/Loader";
import { Accordion, Table } from "@web3uikit/core";
import styles from "/styles/View.module.css";

export default function ListingTable({ assetId, nftAddress, dollarPrice, chainId }) {
    const [listingsData, setListingsData] = useState([]);
    const [isLoading, setLoading] = useState(true);
    const { Moralis } = useMoralis();

    useEffect(() => {
        !isLoading && setLoading(true);
        if (assetId && nftAddress) {
            const query = new Moralis.Query("NftmarketplaceLogs");
            query.equalTo("name", "ItemListed");
            query.equalTo("tokenId", assetId);
            query.equalTo("nftAddress", nftAddress);
            query.equalTo("chainId", chainId);

            query
                .find()
                .then(function (results) {
                    const listings = [];

                    results?.forEach((result) => {
                        const { price, seller } = result?.attributes;
                        const priceEth = ethers.utils.formatEther(price);

                        const priceCell = getPriceCell(priceEth);
                        const dollarCell = getPriceDollars(priceEth, dollarPrice);
                        const sellerCell = getFromCell(seller);

                        listings.push([priceCell, dollarCell, "a day ago", sellerCell]);
                    });
                    setListingsData(listings);
                    setLoading(false);
                })
                .catch(function (error) {
                    console.log(error);
                    setLoading(false);
                });
        }
    }, [assetId, nftAddress, dollarPrice]);

    const getPriceCell = (price) => {
        return price ? (
            <div className="font-semibold">
                {price} {getChainUnit(chainId)}
            </div>
        ) : null;
    };

    const getFromCell = (address) => {
        return <span className={styles.addressText}>{truncatedAddress(address)}</span>;
    };

    const getContent = () => {
        return isLoading ? (
            <div className={styles.tableLoader}>
                <Loader isPageLoader={false} />
            </div>
        ) : (
            <div className={styles.activityTable}>
                <Table
                    columnsConfig="2.5fr 2fr 2fr 2fr"
                    data={listingsData}
                    header={[
                        <span key="price">Price</span>,
                        <span key="usd-price">USD Price</span>,
                        <span key="expiration">Expiration</span>,
                        <span key="from">From</span>,
                    ]}
                    isColumnSortable={[false, true, false, false]}
                    maxPages={3}
                    alignCellItems="center"
                    onPageNumberChanged={function noRefCheck() {}}
                    onRowClick={function noRefCheck() {}}
                    pageSize={5}
                />
            </div>
        );
    };

    return (
        <div className="mt-5">
            <Accordion
                id="accordion"
                subTitle=""
                tagText=""
                theme="blue"
                title="Listings"
                className={styles.accordinBorder}
                isExpanded={true}
            >
                {getContent()}
            </Accordion>
        </div>
    );
}
