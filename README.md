This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

# Description

A marketplace where you can create, buy and sell your NFT build 

# Tools
- Next.js
- Tailwind CSS
- Moralis
- Solidity
- HardhatJS
- Chainlink
- Openzepplin

# Pre requisite

Create account on Moralis (https://admin.moralis.io/login). After Signup do the following steps - On the left sidebar click on the Servers.

-   Create new streams using node addStreams.js
-   Select Environmemt (for running on localhost click on the `Local Dev Chain`) - Select the Eth network - Select the region (the nearest one) - fill the Dapp name - Server will be created

Must have the MetaMask wallet on chrome, if not add the extension from the provided link
https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn?hl=en

# Installation

npm i

# Running on the localhost

Before running on localhost following are the scripts required to run

-   Go the moralis dashboard. Click on the server(The one created) settings
-   Under the `Dapp Details` there is a section called `Dapp Credentials`. Copy the value of `Dapp URL`, `Application ID`, `Master Key` and paste in .env file in order to connect to the server
-   Go to the Next Tab called `Networks`.
    Description: Ethereum is a peer-to-peer network with thousands of nodes that must be able to communicate with one another using standardized protocols.
    Connection steps:
    Copy the code under the `Hardhat` section and paste it in `frp/frpc.ini` and run the command which is mentioned on the `Run and enjoy!` section(moralis portal). Once it is executed successfully, server status will be connected after npm start but backend must be running on local host
-   run the command `node addEvent.js` in order to save the data in moralis database(Event is created on the contract level and emit when specific function of the specific contract is executed from the front end and moralis catch that event data and save it in its database)
-   Connect hardhat node with moralis `yarn moralis:sync`
-   Push updates of addEvent.js to Moralis Cloud `yarn moralis:cloud`
-   To start the application run the `npm run dev`
