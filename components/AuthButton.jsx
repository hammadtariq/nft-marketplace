import { useState } from 'react';

import Moralis from 'moralis-v1';
import { useMoralis } from 'react-moralis';

import { truncatedAddress } from '../utils/ui.utils';

export const AuthButton = () => {
    const { authenticate, enableWeb3, account, chainId } = useMoralis();
    const [authError, setAuthError] = useState(null);
    const [isAuthenticating, setIsAuthenticating] = useState(false);

    const handleAuth = async (provider) => {
        try {
            setAuthError(null);
            setIsAuthenticating(true);

            // Enable web3 to get user address and chain
            await enableWeb3({ throwOnError: true, provider });

            if (!account) {
                throw new Error("Connecting to chain failed, as no connected account was found");
            }
            if (!chainId) {
                throw new Error("Connecting to chain failed, as no connected chain was found");
            }

            // Get message to sign from the auth api
            const { message } = await Moralis.Cloud.run("requestMessage", {
                address: account,
                chain: parseInt(chainId, 16),
                network: "evm",
            });

            // Authenticate and login via parse
            await authenticate({
                signingMessage: message,
                throwOnError: true,
            });
        } catch (error) {
            setAuthError(error);
            console.log("Auth Error:: ", authError)
        } finally {
            setIsAuthenticating(false);
        }
    };

    const applyBtnText = () => {
        let text = "Connect Wallet";
        if (isAuthenticating) {
            text = "Connecting";
        } else if (!isAuthenticating && account) {
            text = `${truncatedAddress(account)}`;
        }
        return text;
    };

    return (
        <div className="mx-5">
            <button
                type="button"
                className="inline-block px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out"
                onClick={() => handleAuth("metamask")}
            >
                {applyBtnText()}
            </button>
        </div>
    );
};
