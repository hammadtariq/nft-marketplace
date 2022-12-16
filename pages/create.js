import React, {
  useCallback,
  useState,
} from 'react';

import { useRouter } from 'next/router';
import { NFTStorage } from 'nft.storage';
import {
  useMoralis,
  useWeb3Contract,
} from 'react-moralis';

import {
  Button,
  Input,
  Select,
  TextArea,
  useNotification,
} from '@web3uikit/core';
import {
  List,
  Plus,
} from '@web3uikit/icons';

import CommonModal from '../components/modal';
import Upload from '../components/Upload';
import {
  OffChainNftAbi,
  OnChainNftAbi,
} from '../constants';
import {
  dropDownList,
  getContractAddresses,
  handleError,
  handleNewNotification,
  handleSuccess,
  storageType,
} from '../utils/ui.utils';

const client = new NFTStorage({
    token: process.env.NEXT_PUBLIC_NFT_STORAGE_API_KEY,
});

const Create = () => {
    const [modal, setModal] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [nftType, setNFTType] = useState(null);
    const [NFT, setNFT] = useState({
        name: "",
        description: "",
        attributes: [],
        image: null,
        supply: 1,
    });

    const dispatch = useNotification();
    const router = useRouter();
    const { chainId: chainIdHex, isWeb3Enabled } = useMoralis();
    const chainId = parseInt(chainIdHex, 16);
    const isOnChain = nftType?.id === "onChain";
    const [OnChainNftAddress, NftAddress] = getContractAddresses(chainId, [
        "OnChainNft",
        "OffChainNft",
    ]);

    const { runContractFunction } = useWeb3Contract();

    const modalHandler = useCallback(
        (value) => {
            setModal(value);
        },
        [modal]
    );

    const NFTPropertyHandler = useCallback(
        (_NFTProperty) => {
            setNFT({ ...NFT, attributes: [...NFT.attributes, ..._NFTProperty] });
        },
        [NFT]
    );

    const params = async (supplyCount, tokenURI) => {
        const imageText = await NFT?.image?.text();
        const onChainMintParams = {
            abi: OnChainNftAbi,
            contractAddress: OnChainNftAddress,
            functionName: "mint",
            params: {
                svg: `${imageText}`,
                nftName: NFT.name,
                description: NFT.description,
                attributes: JSON.stringify(NFT.attributes).replaceAll('"', "'"),
                _supplyCount: supplyCount,
            },
        };
        const offChainMintParams = {
            abi: OffChainNftAbi,
            contractAddress: NftAddress,
            functionName: "mint",
            params: {
                _supplyCount: supplyCount,
                _tokenURI: tokenURI,
            },
        };
        return isOnChain ? onChainMintParams : offChainMintParams;
    };

    const mintNft = async (metaData) => {
        runContractFunction({
            onSuccess: async (tx) => {
                await handleSuccess(tx, dispatch);
                setIsLoading(false);
                router.push("/userportfolio");
            },
            onError: (error) => {
                setIsLoading(false);
                handleError(error, dispatch);
            },
            params: await params(NFT.supply, metaData?.url),
        });
    };

    const onCreate = async () => {
        setIsLoading(true);
        try {
            if (isWeb3Enabled) {
                switch (nftType?.id) {
                    case storageType.BLOCKCHAIN:
                        handleNewNotification(dispatch, "info", "Information", "Mining in Process...")
                        await mintNft();
                        break;
                    case storageType.IPFS:
                        handleNewNotification(dispatch, "info", "Information", "Uploading to IPFS...")
                        const metaData = await client.store(NFT);
                        handleNewNotification(dispatch, "info", "Information", "Mining in Process...")
                        await mintNft(metaData);
                        break;
                }
                console.log("Mining...please wait.");
            } else {
                setIsLoading(false);
                handleNewNotification(dispatch, "info", "Information", "Please connect your wallet first")
                console.log("Ethereum object doesn't exist!");
            }
        } catch (error) {
            setIsLoading(false);
            handleError(error, dispatch);
        }
    };

    const onUploadFile = (event) => {
        if (event) {
            try {
                const {
                    target: { files },
                } = event;
                if (!nftType) throw new Error("Please Select NFT Type");
                if (nftType.id === "onChain") {
                    const { type } = files[0];
                    if (nftType.id === "onChain" && type != "image/svg+xml") {
                        throw new Error("Please Select only SVG type Image.");
                    }
                }
                setNFT({ ...NFT, image: files[0] });
            } catch (error) {
                handleError(error, dispatch);
            }
        }
    };

    const onChange = (event) => {
        const {
            target: { name, value },
        } = event;

        setNFT({ ...NFT, [name]: value });
    };

    return (
        <div className="flex justify-center pb-10">
            <div className="w-2/4">
                <h1 className="py-4 px-4 rounded-sm font-bold text-3xl">Create New Item</h1>
                <div className="my-10">
                    <Select
                        id="Select"
                        label="Choose NFT type..."
                        onChange={(value) => setNFTType(value)}
                        options={dropDownList}
                        style={{ borderRadius: 10 }}
                    />
                    <div className="my-5" />
                    <Upload
                        onClear={() => setNFT({ ...NFT, image: null })}
                        onChange={onUploadFile}
                        disabled={!nftType}
                        value={NFT.image}
                        cssStyle="hover:bg-gray-100 cursor-pointer h-64"
                    />
                </div>
                <div className="my-10">
                    <Input
                        label="Name"
                        name="name"
                        onChange={onChange}
                        width="100%"
                        size="large"
                        validation={{
                            required: true,
                        }}
                        style={{ borderRadius: 5 }}
                    />
                </div>
                <div className="my-10">
                    <TextArea
                        label="Description"
                        name="description"
                        onChange={onChange}
                        placeholder="Type here field"
                        width="100%"
                        style={{ borderRadius: 5 }}
                        validation={{
                            required: true,
                        }}
                    />
                </div>
                <div className="my-10" style={{ borderRadius: 5 }}>
                    <Input
                        label="Supply"
                        name="supply"
                        onChange={onChange}
                        width="100%"
                        size="large"
                        style={{ borderRadius: 5 }}
                        validation={{
                            required: true,
                        }}
                    />
                </div>
                <div className="flex justify-between">
                    <div className="flex">
                        <List fontSize="20px" className="mt-1" />
                        <span className="font-bold text-lg ml-2">Properties</span>
                    </div>
                    <div>
                        <div
                            className="rounded-lg border border-slate-300 border-cyan-500 hover:border-slate-400  pl-2 pr-2 py-2"
                            onClick={() => {
                                setModal(true);
                            }}
                        >
                            <Plus fontSize="15px" color="#3399FF" />
                        </div>
                    </div>
                </div>
                <div className="flex">
                    {NFT.attributes.map(({ type, name }, index) => {
                        return (
                            <div
                                key={index}
                                className="border border-cyan-500 bg-cyan-50 w-36 h-20 text-center py-4 rounded-lg mx-2 "
                            >
                                <h4 className="text-cyan-400">{type}</h4>
                                <p>{name}</p>
                            </div>
                        );
                    })}
                </div>

                {modal && (
                    <CommonModal
                        setModal={modalHandler}
                        setNFTProperty={NFTPropertyHandler}
                        NFTProperty={NFT.attributes}
                    />
                )}
                <div className="mt-6 w-36">
                    <Button
                        color="blue"
                        onClick={onCreate}
                        text="Create"
                        theme="colored"
                        size="xl"
                        isFullWidth
                        isLoading={isLoading}
                    />
                </div>
            </div>
        </div>
    );
};

export default Create;
