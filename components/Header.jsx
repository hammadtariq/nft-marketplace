import Link from 'next/link';
import { useRouter } from 'next/router';

// import { ConnectButton } from '@web3uikit/web3';
import { AuthButton } from './AuthButton';

export default function Header() {
    const router = useRouter();
    return (
        <nav className="border-b-2 flex flex-row justify-between items-center overflow-hidden">
            <h1
                className="py-4 px-4 font-bold text-2xl text-gray-600 cursor-pointer"
                onClick={() => {
                    router.push("/");
                }}
            >
                Nisum Nft Marketplace
            </h1>
            <div className="flex flex-row items-center">
                <Link href="/">
                    <a className="mr-4 p-6">Home</a>
                </Link>
                <Link href="/create">
                    <a className="mr-4 p-6">Create</a>
                </Link>
                <Link href="/userportfolio">
                    <a className="mr-4 p-6">Portfolio</a>
                </Link>
                {/* <ConnectButton moralisAuth={true} /> */}
                <AuthButton />
            </div>
        </nav>
    );
}
