import Item from "./Item";

const ItemList = ({ listedItems = [] }) => {
    return listedItems.length === 0 ? (
        <p>No Nft Found!</p>
    ) : (
        <ul className="flex flex-wrap">
            {listedItems.map((item, idx) => {
                const { nftAddress, tokenId, price, seller } = item.attributes;
                console.log("attributes: ", item.attributes);
                return (
                    <li key={idx} className="px-2">
                        <Item
                            nftAddress={nftAddress}
                            tokenId={tokenId}
                            seller={seller}
                            price={price}
                        />
                    </li>
                );
            })}
        </ul>
    );
};

export default ItemList;
