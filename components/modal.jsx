import { useState } from 'react';

import {
  Button,
  Input,
  Modal,
  Typography,
} from '@web3uikit/core';
import { CrossCircle } from '@web3uikit/icons';

const CommonModal = ({ setNFTProperty, NFTProperty, setModal }) => {
    let [_NFTPropertyvalue, _setNFTPropertyvalue] = useState([
        {
            type: "",
            name: "",
        },
    ]);
    const removeProperty = (id) => {
        const items = [..._NFTPropertyvalue];
        items.splice(id - 1, 1);
        _setNFTPropertyvalue(items);
    };
    const propertyValue = (id) => {
        return (
            <div className="flex my-4">
                <span className="mt-3" onClick={() => removeProperty(id)}>
                    <CrossCircle fontSize="20px" color="red" />
                </span>
                <div className="px-3">
                    <Input
                        label="key"
                        placeholder="Color"
                        id={`key-${id}`}
                        name={`type-${id}`}
                        onChange={valueChange}
                    />
                </div>
                <div>
                    <Input
                        label="value"
                        placeholder="yellow"
                        name={`name-${id}`}
                        id={`value-${id}`}
                        onChange={valueChange}
                    />
                </div>
            </div>
        );
    };

    const valueChange = (e) => {
        const nameId = e.target.name;
        const value = e.target.value;
        const split = nameId.split("-");
        const name = split[0];
        const items = [..._NFTPropertyvalue];
        items[split[1] - 1][name] = value;
        _setNFTPropertyvalue(items);
    };
    return (
        <div>
            <Modal
                id="v-center"
                width="45%"
                isCentered
                okText="Save"
                onCloseButtonPressed={function noRefCheck() {
                    setModal(false);
                }}
                onOk={function noRefCheck() {}}
                hasCancel={false}
                hasFooter={false}
                title={
                    <div>
                        <Typography color="#68738D" variant="h3">
                            Add Properties
                        </Typography>
                    </div>
                }
            >
                <div>
                    <Typography>
                        Properties show up underneath your item, are clickable, and can be listed
                        in your collections sidebar
                    </Typography>
                </div>
                <div className="flex justify-around">
                    <Typography variant="subtitle2"> Type</Typography>
                    <Typography variant="subtitle2">Name</Typography>
                </div>
                <div className="max-h-44 overflow-scroll mb-3">
                    {_NFTPropertyvalue.length > 0 &&
                        _NFTPropertyvalue.map((element, index) => {
                            return propertyValue(index + 1);
                        })}
                </div>
                <div className="mb-4">
                    <Button
                        onClick={() => {
                            _setNFTPropertyvalue([
                                ..._NFTPropertyvalue,
                                {
                                    type: "",
                                    name: "",
                                },
                            ]);
                        }}
                        text="Add More"
                        theme="outline"
                    />
                </div>
                <div className="flex justify-center mb-3">
                    <div className="w-1/4">
                        <Button
                            onClick={() => {
                                _NFTPropertyvalue = _NFTPropertyvalue.filter(
                                    ({ type, name }) => type !== "" && name !== ""
                                );

                                setNFTProperty(_NFTPropertyvalue);
                                setModal(false);
                            }}
                            text="Save"
                            theme="outline"
                            isFullWidth
                        />
                    </div>
                </div>
            </Modal>
        </div>
    );
};
export default CommonModal;
