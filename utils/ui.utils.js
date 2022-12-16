import { ethers } from "ethers";

import { Illustration } from "@web3uikit/core";
/* eslint-disable @next/next/no-img-element */
import { Bell } from "@web3uikit/icons";
import { Eth } from "@web3uikit/icons";
import Image from "next/image";

import { ContractAddresses } from "../constants";

export const truncatedAddress = (address) => {
    return (
        address &&
        address.substring(0, 5) + "..." + address.substring(address.length - 4, address.length)
    );
};
export const dropDownList = [
    {
        id: "offChain",
        label: "IPFS",
    },
    {
        id: "onChain",
        label: "Blockchain",
    },
];
export const handleNewNotification = (dispatch, type, title, message, icon, position) => {
    dispatch({
        type,
        message: message || "Transaction successful!",
        title: title || "Transaction Notification",
        icon: icon || <Bell />,
        position: position || "topR",
    });
};
export const handleSuccess = async (tx, dispatch) => {
    await tx.wait(1);
    handleNewNotification(dispatch, "success");
    console.log("success");
};

export const handleError = (error, dispatch) => {
    const message = error.data && error.data.message ? error.data.message : error.message;
    handleNewNotification(dispatch, "error", "Transaction Failed", message);
    console.log(error);
    console.log("Transaction error: ", message);
};

export const storageType = {
    BLOCKCHAIN: "onChain",
    IPFS: "offChain",
};

export const getContractAddresses = (chainId, contractName = []) => {
    const addresses = [];
    if (chainId in ContractAddresses) {
        contractName.forEach((item) => {
            const address =
                ContractAddresses[chainId][item][ContractAddresses[chainId][item].length - 1];
            addresses.push(address);
        });
    }
    return addresses.length ? addresses : [];
};

const baseUrl = "https://ipfs.io/ipfs/";

const manipulateLink = (imgLink) => {
    if (imgLink.startsWith("ipfs://")) {
        const case1 = "ipfs://ipfs/";
        const case2 = "ipfs://";
        if (imgLink.slice(0, case1.length) === case1) {
            return `${baseUrl}${imgLink.slice(case1.length)}`;
        } else if (imgLink.slice(0, case2.length) === case2) {
            return `${baseUrl}${imgLink.slice(case2.length)}`;
        }
    }
    return imgLink;
};

export const image = (animation, image) => {
    if (animation?.includes(".mp4") || image?.includes(".mp4")) {
        return (
            <video height={"210px"} width={"100%"} controls autoPlay loop muted>
                <source src={manipulateLink(animation || image || "")} type="video/mp4" />
            </video>
        );
    }
    if (image) {
        if (image.includes("pinata")) {
            return (
                <img
                    src={image}
                    height="210px"
                    width={"218px"}
                    style={{
                        borderTopLeftRadius: "10px",
                        borderTopRightRadius: "10px",
                    }}
                    alt=""
                />
            );
        }
        return (
            <img
                src={manipulateLink(image)}
                height="210px"
                width={"218px"}
                style={{
                    borderTopLeftRadius: "10px",
                    borderTopRightRadius: "10px",
                }}
                alt=""
            />
        );
    }
    if (animation) {
        if (animation.includes("pinata")) {
            return (
                <img
                    src={animation}
                    height="210px"
                    width={"218px"}
                    style={{
                        borderTopLeftRadius: "10px",
                        borderTopRightRadius: "10px",
                    }}
                    alt=""
                />
            );
        }
        return (
            <img
                src={manipulateLink(animation)}
                height="210px"
                width={"218px"}
                style={{
                    borderTopLeftRadius: "10px",
                    borderTopRightRadius: "10px",
                }}
                alt=""
            />
        );
    }
    return <Illustration logo="lazyNft" height="210px" width={"100%"} />;
};

export const numberIntoDecimal = (number) => {
    if (!number) return;
    return ethers.utils.formatEther(number);
};

export const replaceIpfsFromURI = (metaDataUri) => {
    if (!metaDataUri) return;
    // const replaceIPFS = metaDataUri.replace("ipfs://", "");
    // const uri = addStr(replaceIPFS, replaceIPFS.indexOf("/"), ".ipfs.cf-ipfs.com");
    // return `https://${uri}`;
    const IPFS_GATEWAY = process.env.NEXT_PUBLIC_IPFS_GATEWAY;
    return metaDataUri.replace("ipfs://", IPFS_GATEWAY);
};

function addStr(str, index, stringToAdd) {
    return str.substring(0, index) + stringToAdd + str.substring(index, str.length);
}

export const formatDollarAmount = (number, decimals) => {
    const value = number?.toString();
    const divisor = String(1).padEnd(decimals + 1, "0");

    return value / divisor;
};

export const formatCurrency = (amount) => {
    const formatter = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
    });

    return formatter.format(amount);
};

export const getPriceDollars = (eth, dollarPrice) => {
    return formatCurrency(eth * dollarPrice);
};

const chainData = {
    matic: {
        icon: (size, styles) => (
            <Image
                alt="polygon token"
                src="/polygon-token.webp"
                style={styles}
                height={size}
                width={size}
            />
        ),
        unit: "MATIC",
    },
    eth: {
        icon: (size, styles) => <Eth style={styles} fontSize={`${size}px`} />,
        unit: "ETH",
    },
};

const chainInfo = {
    137: { ...chainData.matic },
    80001: { ...chainData.matic },
    1: { ...chainData.eth },
    5: { ...chainData.eth },
    31337: { ...chainData.eth },
};

export const getChainIcon = (chainId, size, styles = {}) => {
    if (chainInfo[chainId]) {
        return chainInfo[chainId].icon(size, styles);
    }
};

export const getChainUnit = (chainId) => {
    if (chainInfo[chainId]) {
        return chainInfo[chainId].unit;
    }
};

export const formatRelativeDate = (date) => {
    const nowDate = Date.now();
    const rft = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

    const SECOND = 1000;
    const MINUTE = 60 * SECOND;
    const HOUR = 60 * MINUTE;
    const DAY = 24 * HOUR;
    const WEEK = 7 * DAY;
    const MONTH = 30 * DAY;
    const YEAR = 365 * DAY;
    const intervals = [
        { ge: YEAR, divisor: YEAR, unit: "year" },
        { ge: MONTH, divisor: MONTH, unit: "month" },
        { ge: WEEK, divisor: WEEK, unit: "week" },
        { ge: DAY, divisor: DAY, unit: "day" },
        { ge: HOUR, divisor: HOUR, unit: "hour" },
        { ge: MINUTE, divisor: MINUTE, unit: "minute" },
        { ge: 30 * SECOND, divisor: SECOND, unit: "seconds" },
        { ge: 0, divisor: 1, text: "just now" },
    ];

    const now = new Date(nowDate).getTime();
    const diff = now - date.getTime();
    const diffAbs = Math.abs(diff);

    for (const interval of intervals) {
        if (diffAbs >= interval.ge) {
            const x = Math.round(Math.abs(diff) / interval.divisor);
            const isFuture = diff < 0;
            return interval.unit ? rft.format(isFuture ? x : -x, interval.unit) : interval.text;
        }
    }
};
