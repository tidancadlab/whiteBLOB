function Progress({ uploadProgress = 50 }) {
    return (
        uploadProgress > 0 && (
            <div className="mt-4 self-stretch">
                <p className="mb-2 text-white">Upload Progress: {uploadProgress}%</p>
                <div className="bg-gray-300 h-4 relative rounded-lg">
                    <div
                        className={`bg-blue-500 absolute h-full rounded`}
                        style={{ width: `${uploadProgress}%` }}
                    ></div>
                </div>
            </div>
        )
    );
}

export default Progress;