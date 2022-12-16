/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    swcMinify: true,
    webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
        config.ignoreWarnings = [
            {
                message: /(magic-sdk|@walletconnect\/web3-provider|@web3auth\/web3auth)/,
            },
        ];
        return config;
    },
    images: {
        domains: ["tailwindui.com", "https://ipfs.io", "ipfs.io", "ipfs.eth.aragon.network"],
    },
};

module.exports = nextConfig;
