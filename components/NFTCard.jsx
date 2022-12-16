import Image from 'next/image';

import {
  Card,
  Illustration,
} from '@web3uikit/core';

export default function NFTCard({ image, name }) {
    return (
        <div className="flex">
            <div
                style={{
                    width: "508px",
                }}
                className="shrink"
            >
                <Card>
                    <div style={{ height: "544px", width: "450px" }} className="mx-auto">
                        {!image ? (
                            <Illustration height={544} logo="lazyNft" width={452} />
                        ) : (
                            <Image
                                layout="responsive"
                                height={544}
                                width={452}
                                loader={() => image}
                                src={image}
                                alt={name}
                                title={name}
                            />
                        )}
                    </div>
                </Card>
            </div>
        </div>
    );
}
