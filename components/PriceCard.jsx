import { PlanCard } from "@web3uikit/core";
import { CreditCard } from "@web3uikit/icons";
import { handleError, handleSuccess, getPriceDollars, getChainUnit } from "/utils/ui.utils";
import { ethers } from "ethers";
import styles from "/styles/View.module.css";

export default function PriceCard({ buyItem, isOwner, dispatch, dollarPrice, price, chainId }) {
    const getFormattedEther = () => {
        return ethers.utils.formatEther(price);
    };

    const handleBuy = async () => {
        await buyItem({
            onSuccess: async (tx) => await handleSuccess(tx, dispatch),
            onError: (error) => handleError(error, dispatch),
        });
    };

    return (
        <div className={styles.priceCardContainer}>
            <PlanCard
                description={[]}
                descriptionTitle=""
                className={styles.priceCard}
                isActive
                onChange={function noRefCheck() {}}
                subTitle=""
                title={
                    <>
                        <div>
                            <div>Current Price</div>
                            <span className={styles.priceTag}>
                                {price ? getFormattedEther() : 0} {getChainUnit(chainId)}
                            </span>{" "}
                            <span className={styles.dollarPrice}>
                                {getPriceDollars(getFormattedEther(), dollarPrice)}
                            </span>
                        </div>
                        {!isOwner && (
                            <button type="button" onClick={handleBuy} className={styles.buyButton}>
                                <CreditCard fontSize="20px" className="mr-1" />
                                Buy Now
                            </button>
                        )}
                    </>
                }
            />
        </div>
    );
}
