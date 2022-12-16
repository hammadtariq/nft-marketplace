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

Create account on Moralis (https://admin.moralis.io/login).

-   Grab Moralis API key
-   Create new streams using node addStreams.js OR using Moralis Admin dashboard
-   Fill in the details from constants/ select Mumbai Polygon or Goerli as network

Must have the MetaMask wallet on chrome, if not add the extension from the provided link
https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn?hl=en

# Installation

npm i

# Running on the localhost

Before running on localhost following are the scripts required to run

-   Go the moralis dashboard. Click on the server(The one created) settings
-   Under the `Dapp Details` there is a section called `Dapp Credentials`. Copy the value of `Application ID` and paste in .env file in order to connect to the server
-   run the command `node addStreams.js` in order to save the data in moralis database(Event is created on the contract level and emit when specific function of the specific contract is executed from the front end and moralis catch that event data and save it in its database using its stream API)
-  `npm run dev`
