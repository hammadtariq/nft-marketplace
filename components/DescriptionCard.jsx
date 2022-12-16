import { PlanCard, Accordion } from "@web3uikit/core";
import { Chart } from "@web3uikit/icons";
import { truncatedAddress } from "../utils/ui.utils";
import styles from "/styles/View.module.css";

const contractDetails = [
    { label: "Contract Address", key: "nftAddress" },
    { label: "Token ID", key: "tokenId" },
    { label: "Token Standard", key: "tokenStandard" },
    { label: "Blockchain", key: "blockchain" },
    { label: "Metadata", key: "metaData" },
    { label: "Creator Earnings", key: "creatorEarnings" },
];

export default function DescriptionCard({ nftDetails, tokenMeta, owner, isOwner }) {
    const details = {
        ...nftDetails,
        blockchain: "Ethereum",
        metaData: nftDetails?.isOnchain ? "Decentralized" : "Centralized",
        tokenStandard: "ERC-1155",
        creatorEarnings: "0%",
        nftAddress: truncatedAddress(nftDetails?.nftAddress),
    };

    return (
        <div className="flex flex-col mt-5">
            <PlanCard
                description={[]}
                className={styles.detailCard}
                descriptionTitle=""
                isActive
                onChange={function noRefCheck() {}}
                subTitle=""
                title={
                    <>
                        <div className={styles.descriptionText}>
                            <Chart className="inline" fontSize="24px" />
                            <span>Description</span>
                        </div>
                        <p className={styles.ownerText}>
                            By {isOwner ? "You" : truncatedAddress(owner?.address)}
                        </p>
                        {tokenMeta?.attributes && (
                            <div>
                                <Accordion
                                    id="accordion"
                                    subTitle=""
                                    tagText=""
                                    theme="blue"
                                    title="Properties"
                                    className={`${styles.descriptionAccordin}`}
                                >
                                    <div
                                        className={`${styles.propertiesSection} ${styles.descriptionCardSection}`}
                                    >
                                        {tokenMeta?.attributes?.map(({ type, name }) => {
                                            return (
                                                <div key={type} className={styles.itemProperty}>
                                                    <h4 className={styles.propertyType}>{type}</h4>
                                                    <p className={styles.propertyName}>{name}</p>
                                                    <p className={styles.propertyRarity}>
                                                        New trait
                                                    </p>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </Accordion>
                            </div>
                        )}
                        <div>
                            <Accordion
                                id="accordion"
                                subTitle=""
                                tagText=""
                                theme="blue"
                                className={`${styles.descriptionAccordin}`}
                                title={`About ${truncatedAddress(owner.address)}`}
                            >
                                <div className={styles.descriptionCardSection}> {owner?.about}</div>
                            </Accordion>
                        </div>
                        <div>
                            <Accordion
                                id="accordion"
                                subTitle=""
                                tagText=""
                                theme="blue"
                                title="Details"
                                className={`${styles.descriptionAccordin} ${styles.detailDescAccordin}`}
                            >
                                <div className={styles.descriptionCardSection}>
                                    {details &&
                                        contractDetails.map((detail) => (
                                            <div key={detail?.label}>
                                                <span>{detail?.label}</span>
                                                <span className="float-right">
                                                    {details[detail.key]}
                                                </span>
                                            </div>
                                        ))}
                                </div>
                            </Accordion>
                        </div>
                    </>
                }
            />
        </div>
    );
}
