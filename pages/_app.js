import "../styles/globals.css";

import { MoralisProvider } from "react-moralis";

import { NotificationProvider } from "@web3uikit/core";

import Header from "../components/Header";

const SERVER_URL = process.env.NEXT_PUBLIC_MORALIS_SERVER_URL;
const APP_ID = process.env.NEXT_PUBLIC_MORALIS_APP_ID;

function MyApp({ Component, pageProps }) {
    return (
        <MoralisProvider appId={APP_ID} serverUrl={SERVER_URL}>
            <NotificationProvider>
                <Header />
                <Component {...pageProps} />
            </NotificationProvider>
        </MoralisProvider>
    );
}

export default MyApp;
