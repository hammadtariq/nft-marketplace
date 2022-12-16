import React from 'react';

import {
  useMoralis,
  useMoralisWeb3Api,
  useMoralisWeb3ApiCall,
} from 'react-moralis';

import {
  Skeleton,
  Tooltip,
} from '@web3uikit/core';
import {
  Eth,
  Info,
} from '@web3uikit/icons';
import { color } from '@web3uikit/styles';

import {
  image,
  numberIntoDecimal,
} from '../utils/ui.utils';
import FetchedNFT from './NFTFetched';

const NFT = ({
    address,
    chain,
    contractType = "ERC721",
    name,
    tokenId,
    fetchMetadata,
    metadata,
    ...props
}) => {
    const { isInitialized, isInitializing } = useMoralis();
    const Web3API = useMoralisWeb3Api();
    const { data, error, isLoading, isFetching } = useMoralisWeb3ApiCall(
        Web3API.token.getTokenIdMetadata,
        {
            address,
            chain,
            token_id: String(tokenId),
        },
        {
            autoFetch: isInitialized && fetchMetadata && /^0x[a-fA-F0-9]{40}$/.test(address),
        }
    );

    if (!/^0x[a-fA-F0-9]{40}$/.test(address)) {
        return <div data-testid="test-nft-no-valid-address">No valid address</div>;
    }

    if (!fetchMetadata) {
        return <FetchedNFT contractType={contractType} metadata={metadata} name={name} />;
    }

    if (!isInitialized && !isInitializing) {
        return <div data-testid="test-nft-no-moralis-instance" />;
    }

    if (isLoading || isFetching) {
        return (
            <div data-testid="test-nft-metadata-loading" {...props}>
                <div id="nft">
                    <Skeleton theme="text" width="100%" height="200px" />
                    <div id="information">
                        <Skeleton theme="text" width="30%" height="18px" />
                        <Skeleton theme="image" width="60px" height="60px" />
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return <div data-testid="test-nft-metadata-error">{error.message}</div>;
    }

    if (!data) {
        return <div data-testid="test-nft-metadata-error">No response</div>;
    }

    if (!data?.metadata) {
        return (
            <div id="nft">
                <Skeleton theme="text" width="100%" height="200px" />
                <div id="information">
                    <Tooltip
                        content={"There is no metadata"}
                        position={"top"}
                    >
                        <Info fill={color.yellowDark} />
                    </Tooltip>
                </div>
            </div>
        );
    }

    return (
        <div data-testid="test-nft">
            <div id="nft">
                {image(
                    JSON.parse(String(data.metadata))?.animation_url,
                    JSON.parse(String(data.metadata))?.image ||
                        JSON.parse(String(data.metadata))?.image_url
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
                                {JSON.parse(String(data.metadata))?.name || name}
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
        </div>
    );
};

export default NFT;
