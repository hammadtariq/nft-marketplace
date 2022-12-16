import { Accordion, Table } from "@web3uikit/core";
import { useEffect, useState } from "react";
import { useMoralis } from "react-moralis";
import Loader from "/components/Loader";
import {
    getChainUnit,
    numberIntoDecimal,
    truncatedAddress,
    formatRelativeDate,
} from "/utils/ui.utils";
import styles from "/styles/View.module.css";

export default function ActivityTable({ assetId, nftAddress, chainId, nftDetails, account }) {
    const [events, setEvents] = useState([]);
    const [isLoading, setLoading] = useState(true);
    const { Moralis } = useMoralis();

    const getEventFilter = () => {
        return {
            ItemListed: (event) => [
                "Listed",
                getPriceCell(event.price),
                formatAddress(event.seller),
                "",
                formatRelativeDate(event.createdAt),
            ],
            ItemCancelled: (event) => [
                "Cancelled",
                "",
                formatAddress(event.seller),
                "",
                formatRelativeDate(event.createdAt),
            ],
            ItemBought: (event) => [
                "Bought",
                getPriceCell(event.price),
                formatAddress(event.seller),
                formatAddress(event.buyer),
                formatRelativeDate(event.createdAt),
            ],
        };
    };

    useEffect(() => {
        !isLoading && setLoading(true);
        if (assetId && nftAddress) {
            const query = new Moralis.Query("NftmarketplaceLogs");
            query.equalTo("tokenId", assetId);
            query.equalTo("nftAddress", nftAddress);
            query.equalTo("chainId", chainId);
            query.equalTo("confirmed", true);

            query
                .find()
                .then(function (results) {
                    let events = [
                        [
                            "Minted",
                            "",
                            "",
                            formatAddress(nftDetails.creator),
                            formatRelativeDate(nftDetails.createdAt),
                        ],
                    ];
                    const eventFilter = getEventFilter();

                    for (const event of results) {
                        const attributes = event.attributes;
                        const formattedEvent = eventFilter[attributes.name](attributes);
                        events = [formattedEvent, ...events];
                    }
                    setEvents(events);
                    setLoading(false);
                })
                .catch(function (error) {
                    console.log(error);
                    setLoading(false);
                });
        }
    }, [assetId, nftAddress, account]);

    const formatAddress = (address) => (
        <div className={styles.addressText}>
            {account === address ? "You" : truncatedAddress(address)}
        </div>
    );

    const getPriceCell = (price) => {
        return price ? (
            <>
                {numberIntoDecimal(price)} {getChainUnit(chainId)}
            </>
        ) : null;
    };

    const getContent = () => {
        return isLoading ? (
            <div className={styles.tableLoader}>
                <Loader isPageLoader={false} />
            </div>
        ) : (
            <div className={styles.activityTable}>
                <Table
                    columnsConfig="2fr 2fr 2fr 2fr 2fr"
                    data={events}
                    header={[
                        <span key="event">Event</span>,
                        <span key="price">Price</span>,
                        <span key="from">From</span>,
                        <span key="to">To</span>,
                        <span key="date">Date</span>,
                    ]}
                    isColumnSortable={[false, true, false, false]}
                    maxPages={3}
                    alignCellItems="center"
                    onPageNumberChanged={function noRefCheck() {}}
                    onRowClick={function noRefCheck() {}}
                    pageSize={4}
                />
            </div>
        );
    };

    return (
        <Accordion
            id="accordion"
            subTitle=""
            tagText=""
            theme="blue"
            title="Item Activity"
            className={`my-8 ${styles.accordinBorder}`}
        >
            {getContent()}
        </Accordion>
    );
}
