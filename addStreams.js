const Moralis = require("moralis").default;
const { EvmChain } = require("@moralisweb3/evm-utils");
const Moralisv1 = require("moralis-v1/node");

const ContractAddresses = require("./constants/ContractAddresses.json");

require("dotenv").config();
const MORALIS_API_KEY = process.env.moralisApiKey;
const chainId = process.env.chainId;
const webhookUrl = process.env.WEBHOOK_URL;
const moralisChainId = chainId === "31337" ? "1337" : chainId;

const nftMarketplaceAddressArray = ContractAddresses[chainId]["NftMarketplace"];
const offChainNFTAddressArray = ContractAddresses[chainId]["OffChainNft"];
const onChainNFTAddressArray = ContractAddresses[chainId]["OnChainNft"];

const nftMarketplaceAddress = nftMarketplaceAddressArray[nftMarketplaceAddressArray.length - 1];
const offChainNFTAddress = offChainNFTAddressArray[offChainNFTAddressArray.length - 1];
const onChainNFTAddress = onChainNFTAddressArray[onChainNFTAddressArray.length - 1];

const serverUrl = process.env.NEXT_PUBLIC_MORALIS_SERVER_URL;
const appId = process.env.NEXT_PUBLIC_MORALIS_APP_ID;
const masterKey = process.env.masterKey;

const addContractStream = async (streamObj, contractAddress) => {
    const newStream = await Moralis.Streams.add(streamObj);
    const { id } = newStream.toJSON(); // { id: 'YOUR_STREAM_ID', ...newStream }

    return Moralis.Streams.addAddress({ address: contractAddress, id });
}

async function main() {
    Moralisv1.start({
        appId,
        serverUrl,
    });

    Moralis.start({
        apiKey: MORALIS_API_KEY,
    });

    const offChainNftStream = {
        chains: [EvmChain.MUMBAI], // list of blockchains to monitor
        description: "Offchain Nft contract", // your description
        tag: "OffchainNft", // give it a tag
        abi: [
            {
                type: "event",
                anonymous: false,
                name: "OffChainNftMinted",
                inputs: [
                    { type: "uint256", name: "tokenId", indexed: true },
                    { type: "string", name: "metadataUri", indexed: false },
                    { type: "address", name: "owner", indexed: true },
                ],
            },
        ],
        includeContractLogs: true,
        topic0: ["OffChainNftMinted(uint256, string, address)"], // topic of the event
        advancedOptions: [],
        webhookUrl, // webhook url to receive events,
        includeNativeTxs: true,
    };

    const onChainNftStream = {
        chains: [EvmChain.MUMBAI], // list of blockchains to monitor
        description: "Onchain Nft contract", // your description
        tag: "OnchainNft", // give it a tag
        abi: [
            {
                "type": "event",
                "anonymous": false,
                "name": "OnChainNftMinted",
                "inputs": [
                    {
                        "type": "uint256",
                        "name": "tokenId",
                        "indexed": true
                    },
                    {
                        "type": "string",
                        "name": "metadataUri",
                        "indexed": false
                    },
                    {
                        "type": "address",
                        "name": "owner",
                        "indexed": true
                    }
                ]
            },
        ],
        includeContractLogs: true,
        topic0: ["OnChainNftMinted(uint256, string, address)"], // topic of the event
        advancedOptions: [],
        webhookUrl, // webhook url to receive events,
        includeNativeTxs: true,
    };

    const nftMarketplaceStream = {
        chains: [EvmChain.MUMBAI], // list of blockchains to monitor
        description: "Nft marketplace contract", // your description
        tag: "NftMarketplace", // give it a tag
        abi: [
            {
                "type": "event",
                "anonymous": false,
                "name": "ItemBought",
                "inputs": [
                    {
                        "type": "address",
                        "name": "buyer",
                        "indexed": true
                    },
                    {
                        "type": "address",
                        "name": "nftAddress",
                        "indexed": true
                    },
                    {
                        "type": "uint256",
                        "name": "tokenId",
                        "indexed": true
                    },
                    {
                        "type": "uint256",
                        "name": "price",
                        "indexed": false
                    }
                ]
            },
            {
                "type": "event",
                "anonymous": false,
                "name": "ItemCanceled",
                "inputs": [
                    {
                        "type": "address",
                        "name": "seller",
                        "indexed": true
                    },
                    {
                        "type": "address",
                        "name": "nftAddress",
                        "indexed": true
                    },
                    {
                        "type": "uint256",
                        "name": "tokenId",
                        "indexed": true
                    }
                ]
            },
            {
                "type": "event",
                "anonymous": false,
                "name": "ItemListed",
                "inputs": [
                    {
                        "type": "address",
                        "name": "seller",
                        "indexed": true
                    },
                    {
                        "type": "address",
                        "name": "nftAddress",
                        "indexed": true
                    },
                    {
                        "type": "uint256",
                        "name": "tokenId",
                        "indexed": true
                    },
                    {
                        "type": "uint256",
                        "name": "price",
                        "indexed": false
                    }
                ]
            },
        ],
        includeContractLogs: true,
        topic0: ["ItemBought(address, address, uint256, uint256)", "ItemCanceled(address, address, uint256)", "ItemListed(address, address, uint256, uint256)"], // topic of the event
        advancedOptions: [],
        webhookUrl, // webhook url to receive events,
        includeNativeTxs: true,
    };

    // const newStream = await Moralis.Streams.add(offChainNftStream);
    // const { id } = newStream.toJSON(); // { id: 'YOUR_STREAM_ID', ...newStream }

    // await Moralis.Streams.addAddress({ address: offChainNFTAddress, id });

    try {
        const results = await Promise.allSettled([addContractStream(offChainNftStream, offChainNFTAddress),
        addContractStream(onChainNftStream, onChainNFTAddress),
        addContractStream(nftMarketplaceStream, nftMarketplaceAddress)]);
        console.log("All streams were added successfully ", results);
    } catch (e) {
        throw e;
    }

}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.log("🚀 ~ file: addEventV2.js ~ error", error);
        process.exit(1);
    });
