import Head from 'next/head';
import {
  useMoralis,
  useMoralisQuery,
} from 'react-moralis';

import ItemList from '../components/ItemList';
import Loader from '../components/Loader';
import { truncatedAddress } from '../utils/ui.utils';

export default function Portfolio() {
    const { isWeb3Enabled, account } = useMoralis();

    const {
        data: userItemsList,
        isFetching: fetchingUserItemsList,
        error: userItemsError,
    } = useMoralisQuery("MintedNft", (query) => query.equalTo("owner", account), [account]);

    console.log("userItemList list===> ", userItemsList);
    userItemsError && console.log("userItemsError===> ", userItemsError);
    return (
        <div className="container mx-auto">
            <Head>
                <title>User Portfolio</title>
                <meta name="description" content="User portfolio of owned tokens" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <section>
                <div>
                    <h1 className="py-4 text-2xl">Hey Crypto Maniac</h1>
                    <p className="py-4 italic">Account Address: {truncatedAddress(account)}</p>
                </div>
                {isWeb3Enabled ? (
                    !fetchingUserItemsList ? (
                        <div className="px-2">
                            <ItemList listedItems={userItemsList} />
                        </div>
                    ) : (
                        <Loader />
                    )
                ) : (
                    <p className="py-4 px-2">Please connect to wallet</p>
                )}
            </section>
        </div>
    );
}
