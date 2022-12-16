async function createItemList(item, isListed, logger) {
    const ItemList = Moralis.Object.extend("ItemList");
    const itemList = new ItemList();

    const nftAddress = isListed ? item.get("nftAddress") : item.get("address");
    const query = new Moralis.Query(ItemList);
    query.equalTo("nftAddress", nftAddress);
    query.equalTo("tokenId", item.get("tokenId"));

    logger.info(`Item List | Query: ${query}`);
    const alreadyListedItem = await query.first();
    console.log(`alreadyListedItem ${JSON.stringify(alreadyListedItem)}`);

    if (isListed) {
        itemList.set("marketplaceAddress", item.get("marketplaceAddress"));
        itemList.set("nftAddress", alreadyListedItem.get("nftAddress"));
        itemList.set("price", item.get("price"));
        itemList.set("tokenId", alreadyListedItem.get("tokenId"));
        itemList.set("creator", alreadyListedItem.get("creator"));
        itemList.set("currentOwner", item.get("seller"));
        itemList.set("metadataUri", alreadyListedItem.get("metadataUri"));

        logger.info(
            `Adding listed item with TokenId: ${alreadyListedItem.get("tokenId")} to item list`
        );
    } else {
        itemList.set("tokenId", item.get("tokenId"));
        itemList.set("metadataUri", item.get("metadataUri"));
        itemList.set("creator", item.get("owner"));
        itemList.set("currentOwner", item.get("owner"));
        itemList.set("nftAddress", item.get("address"));
        logger.info(`Adding unlisted item with TokenId: ${item.get("tokenId")} to item list`);
    }
    itemList.set("isListed", isListed);

    if (alreadyListedItem) {
        logger.info(`Deleting ${alreadyListedItem.id}`);
        await alreadyListedItem.destroy();
        logger.info(
            `Deleted item with tokenId ${item.get(
                "tokenId"
            )} at address ${nftAddress} from item list since the listing is being updated. `
        );
    }

    logger.info("Saving...");
    await itemList.save();
}

Moralis.Cloud.afterSave("ItemListed", async (request) => {
    const confirmed = request.object.get("confirmed");
    const logger = Moralis.Cloud.getLogger();
    logger.info("Looking for confirmed TX...");
    if (confirmed) {
        logger.info("Found item!");
        const ActiveItem = Moralis.Object.extend("ActiveItem");

        // In case of listing update, search for already listed ActiveItem and delete
        const query = new Moralis.Query(ActiveItem);
        query.equalTo("nftAddress", request.object.get("nftAddress"));
        query.equalTo("tokenId", request.object.get("tokenId"));
        query.equalTo("marketplaceAddress", request.object.get("address"));
        query.equalTo("seller", request.object.get("seller"));
        logger.info(`Marketplace | Query: ${query}`);
        const alreadyListedItem = await query.first();
        console.log(`alreadyListedItem ${JSON.stringify(alreadyListedItem)}`);
        if (alreadyListedItem) {
            logger.info(`Deleting ${alreadyListedItem.id}`);
            await alreadyListedItem.destroy();
            logger.info(
                `Deleted item with tokenId ${request.object.get(
                    "tokenId"
                )} at address ${request.object.get("address")} since the listing is being updated. `
            );
        }

        // Add new ActiveItem
        const activeItem = new ActiveItem();
        activeItem.set("marketplaceAddress", request.object.get("address"));
        activeItem.set("nftAddress", request.object.get("nftAddress"));
        activeItem.set("price", request.object.get("price"));
        activeItem.set("tokenId", request.object.get("tokenId"));
        activeItem.set("seller", request.object.get("seller"));
        logger.info(
            `Adding Address: ${request.object.get("address")} TokenId: ${request.object.get(
                "tokenId"
            )}`
        );
        logger.info("Saving...");
        await activeItem.save();

        createItemList(activeItem, true, logger);
    }
});

Moralis.Cloud.afterSave("OffChainNftMinted", async (request) => {
    const confirmed = request.object.get("confirmed");
    const logger = Moralis.Cloud.getLogger();
    logger.info("Looking for confirmed TX...");
    if (confirmed) {
        logger.info("Found item!");
        createItemList(request.object, false, logger);
    }
});

Moralis.Cloud.afterSave("OnChainNftMinted", async (request) => {
    const confirmed = request.object.get("confirmed");
    const logger = Moralis.Cloud.getLogger();
    logger.info("Looking for confirmed TX...");
    if (confirmed) {
        logger.info("Found item!");
        createItemList(request.object, false, logger);
    }
});

Moralis.Cloud.afterSave("ItemCanceled", async (request) => {
    const confirmed = request.object.get("confirmed");
    logger.info(`Marketplace | Object: ${request.object}`);
    if (confirmed) {
        const logger = Moralis.Cloud.getLogger();
        const ActiveItem = Moralis.Object.extend("ActiveItem");
        const query = new Moralis.Query(ActiveItem);
        query.equalTo("marketplaceAddress", request.object.get("address"));
        query.equalTo("nftAddress", request.object.get("nftAddress"));
        query.equalTo("tokenId", request.object.get("tokenId"));
        logger.info(`Marketplace | Query: ${query}`);
        const canceledItem = await query.first();
        logger.info(`Marketplace | CanceledItem: ${JSON.stringify(canceledItem)}`);
        if (canceledItem) {
            logger.info(`Deleting ${canceledItem.id}`);
            await canceledItem.destroy();
            logger.info(
                `Deleted item with tokenId ${request.object.get(
                    "tokenId"
                )} at address ${request.object.get("address")} since it was canceled. `
            );
            updateItemList(request.object);
        } else {
            logger.info(
                `No item canceled with address: ${request.object.get(
                    "address"
                )} and tokenId: ${request.object.get("tokenId")} found.`
            );
        }
    }
});

async function updateItemList(item, txType = "cancelled") {
    const ItemList = Moralis.Object.extend("ItemList");
    const itemList = new ItemList();

    const query = new Moralis.Query(ItemList);
    query.equalTo("nftAddress", item.get("nftAddress"));
    query.equalTo("tokenId", item.get("tokenId"));

    logger.info(`Item List | Query: ${query}`);
    const alreadyListedItem = await query.first();
    console.log(`alreadyListedItem ${JSON.stringify(alreadyListedItem)}`);

    itemList.set("marketplaceAddress", null);
    itemList.set("nftAddress", alreadyListedItem.get("nftAddress"));
    itemList.set("price", null);
    itemList.set("tokenId", alreadyListedItem.get("tokenId"));
    txType === "bought"
        ? itemList.set("currentOwner", item.get("buyer"))
        : itemList.set("currentOwner", alreadyListedItem.get("currentOwner"));
    itemList.set("metadataUri", alreadyListedItem.get("metadataUri"));
    itemList.set("creator", alreadyListedItem.get("creator"));

    logger.info(
        `Removing listed item info with TokenId: ${alreadyListedItem.get("tokenId")} from item list`
    );
    if (alreadyListedItem) {
        logger.info(`Deleting ${alreadyListedItem.id}`);
        await alreadyListedItem.destroy();
        logger.info(
            `Deleted item with tokenId ${item.get("tokenId")} at address ${item.get(
                "address"
            )} from item list since the listing is being updated. `
        );
    }

    itemList.set("isListed", false);

    logger.info("Saving...");
    await itemList.save();
}

Moralis.Cloud.afterSave("ItemBought", async (request) => {
    const confirmed = request.object.get("confirmed");
    logger.info(`Marketplace | Object: ${request.object}`);
    if (confirmed) {
        const logger = Moralis.Cloud.getLogger();
        const ActiveItem = Moralis.Object.extend("ActiveItem");
        const query = new Moralis.Query(ActiveItem);
        query.equalTo("marketplaceAddress", request.object.get("address"));
        query.equalTo("nftAddress", request.object.get("nftAddress"));
        query.equalTo("tokenId", request.object.get("tokenId"));
        logger.info(`Marketplace | Query: ${query}`);
        const boughtItem = await query.first();
        logger.info(`Marketplace | boughtItem: ${JSON.stringify(boughtItem)}`);
        if (boughtItem) {
            logger.info(`Deleting boughtItem ${boughtItem.id}`);
            await boughtItem.destroy();
            logger.info(
                `Deleted item with tokenId ${request.object.get(
                    "tokenId"
                )} at address ${request.object.get(
                    "address"
                )} from ActiveItem table since it was bought.`
            );
            updateItemList(request.object, "bought");
        } else {
            logger.info(
                `No item bought with address: ${request.object.get(
                    "address"
                )} and tokenId: ${request.object.get("tokenId")} found`
            );
        }
    }
});
