import { useEffect, useState } from "react";
import { useMoralis } from "react-moralis";
import { ethers } from "ethers";
import { Accordion, Dropdown } from "@web3uikit/core";
import { LineChart, Line, XAxis, YAxis, Tooltip } from "recharts";
import styles from "/styles/View.module.css";
import Image from "next/image";
import Loader from "./Loader";

const timePeriods = [
    {
        id: "All time",
        label: "All time",
    },
    {
        id: "Last 7 days",
        label: "Last 7 days",
        value: 7,
    },
    {
        id: "Last 14 days",
        label: "Last 14 days",
        value: 14,
    },
    {
        id: "Last 30 days",
        label: "Last 30 days",
        value: 30,
    },
    {
        id: "Last year",
        label: "Last year",
        value: 365,
    },
];

export default function PriceHistory({ assetId, nftAddress }) {
    const [timePeriodIndex, setTimePeriodIndex] = useState(0);
    const [priceData, setPriceData] = useState([]);
    const [isLoading, setLoading] = useState(true);
    const { Moralis } = useMoralis();

    useEffect(() => {
        !isLoading && setLoading(true);
        if (assetId && nftAddress) {
            const targetDate = new Date();
            const dateFilter = timePeriods[timePeriodIndex].value;
            targetDate.setDate(targetDate.getDate() - dateFilter);

            const query = new Moralis.Query("NftmarketplaceLogs");
            query.equalTo("name", "ItemListed");
            query.equalTo("tokenId", assetId);
            query.equalTo("nftAddress", nftAddress);
            dateFilter && query.greaterThanOrEqualTo("createdAt", targetDate);

            query
                .find()
                .then(function (results) {
                    const priceHistory = [];

                    results?.forEach((result) => {
                        const { price, createdAt } = result?.attributes;
                        const priceEth = ethers.utils.formatEther(price);
                        const date = createdAt?.toDateString()?.split(" ");
                        priceHistory.push({ date: `${date[2]} ${date[1]}`, price: priceEth });
                    });

                    setPriceData(priceHistory);
                    setLoading(false);
                })
                .catch(function (error) {
                    console.log(error);
                    setLoading(false);
                });
        }
    }, [assetId, nftAddress, timePeriodIndex]);

    const handleTimePeriodChange = (updatedId) => {
        const optionIndex = timePeriods.findIndex((data) => data.id === updatedId);
        setTimePeriodIndex(optionIndex);
    };

    const getLineChart = () => {
        return priceData.length > 0 ? (
            <div>
                <LineChart
                    width={568}
                    height={130}
                    data={priceData}
                    margin={{
                        top: 12,
                        right: 0,
                        left: 0,
                        bottom: 8,
                    }}
                >
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="price" stroke="#8884d8" activeDot={{ r: 8 }} />
                </LineChart>
            </div>
        ) : (
            <div className={styles.pricePlaceholderChart}>
                <Image alt="no data" src="/no-chart-data.svg" height={101} width={138} />
                <div>No item activity yet</div>
            </div>
        );
    };

    const getContent = () => {
        return isLoading ? (
            <div className={styles.priceHistoryLoader}>
                <Loader isPageLoader={false} />
            </div>
        ) : (
            <>
                <div className="mb-5 ml-2">
                    <Dropdown
                        onChange={(selectedOption) => handleTimePeriodChange(selectedOption?.id)}
                        selectedState={timePeriodIndex}
                        options={timePeriods}
                    />
                </div>
                {getLineChart()}
            </>
        );
    };

    return (
        <div className="mt-5">
            <Accordion
                id="accordion"
                subTitle=""
                tagText=""
                theme="blue"
                title="Price History"
                className={styles.accordinBorder}
                isExpanded={true}
            >
                <div className={styles.priceActivity}>{getContent()}</div>
            </Accordion>
        </div>
    );
}
