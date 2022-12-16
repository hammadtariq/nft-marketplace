const Loader = ({ isPageLoader = true }) => (
    <div
        className={`grid place-content-center ${
            isPageLoader ? "min-h-screen -mt-20" : "min-h-fit"
        }`}
    >
        <div className="flex items-center gap-2 text-gray-500">
            <span className="h-8 w-8 block rounded-full border-4 border-t-blue-300 animate-spin"></span>
            loading...
        </div>
    </div>
);

export default Loader;
