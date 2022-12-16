import { useRef } from 'react';

import Image from 'next/image';

import { Camera } from '@web3uikit/icons';

function Upload(props) {
    const {
        disabled,
        onChange,
        onClear,
        value,
        isProfileUpload,
        cssStyle,
        pictureIconStyle,
        placeHolder,
        id,
    } = props;
    const inputElement = useRef();
    const isShowPlaceHolder = isProfileUpload && !value && id === "profile";
    return (
        <div
            className="flex justify-center items-center w-full h-full relative"
            onClick={(e) => {
                value && e.stopPropagation();
                value && e.preventDefault();
            }}
        >
            {isShowPlaceHolder && (
                <div>
                    <Image
                        className="inset-0 absolute rounded-full"
                        src={placeHolder || null}
                        alt="selected file preview"
                        style={{ margin: "0 75px" }}
                        width="500"
                        height="250"
                        layout={`${isProfileUpload ? "fill" : "intrinsic"}`}
                    />
                </div>
            )}
            {isProfileUpload && (
                <label
                    className={`absolute ${pictureIconStyle}  mr-3 mb-4 border rounded-3xl p-2 bg-white cursor-pointer z-10 `}
                    htmlFor={`dropzone-file-${id}`}
                >
                    <Camera fontSize="25px" />
                </label>
            )}
            <label
                htmlFor={`${!isProfileUpload && `dropzone-file-${id}`}`}
                className={`w-full flex flex-col justify-center items-center w-full bg-gray-50 rounded-lg border-2 border-gray-300     dark:border-gray-600 ${cssStyle}`}
            >
                {value ? (
                    <div className="flex max-h-full" style={{ justifyContent: "center" }}>
                        <Image
                            className={`inset-0 absolute ${id === "profile" && "rounded-full"}`}
                            src={URL.createObjectURL(value)}
                            alt="selected file preview"
                            style={{ margin: "0 75px" }}
                            width="500"
                            height="250"
                            layout={`${isProfileUpload ? "fill" : "intrinsic"}`}
                        />
                        <svg
                            className="w-6 h-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                            onClick={(e) => {
                                value && e.stopPropagation();
                                value && e.preventDefault();
                                onClear(null);
                                inputElement.current.value = "";
                            }}
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                        </svg>
                    </div>
                ) : (
                    !isProfileUpload && (
                        <div className="flex flex-col justify-center items-center pt-5 pb-6">
                            <svg
                                aria-hidden="true"
                                className="mb-3 w-10 h-10 text-gray-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                                ></path>
                            </svg>
                            <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                                <span className="font-semibold">Click to upload</span> or drag and
                                drop
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                SVG, PNG, JPG or GIF (MAX. 800x400px)
                            </p>
                        </div>
                    )
                )}
                <input
                    id={`dropzone-file-${id}`}
                    type="file"
                    className="hidden"
                    disabled={disabled}
                    ref={inputElement}
                    onChange={(e) => onChange(e)}
                />
            </label>
        </div>
    );
}
export default Upload;
