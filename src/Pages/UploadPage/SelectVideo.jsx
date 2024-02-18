import { useState } from "react";
/**
 *
 * @param {{chuckProgress : {total: number, loaded: number, completedChunk: number, totalChunk: number}}} props
 * @returns
 */
function VideoSelect({ props }) {
  const { file, handleUpload, chuckProgress, control } = props;
  const { rate = 0, progress = 0, totalChunk, completedChunk } = chuckProgress;
  const [isDarg, setIsDrag] = useState(false);
  return (
    <>
      {!file ? (
        <label
          onDragEnter={(e) => setIsDrag(true)}
          onDragLeave={(e) => setIsDrag(false)}
          onDragOver={(e) => setIsDrag(true)}
          onTouchStart={(e) => setIsDrag(true)}
          onTouchEnd={(e) => setIsDrag(false)}
          title="click to select video file for upload"
          className={`flex flex-col justify-center items-center border-2 border-dashed ${
            isDarg ? "border-green-500" : "border-[#1c1c1e]"
          } h-full rounded-2xl cursor-pointer`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1}
            stroke="currentColor"
            className={`w-24 h-24 stroke-[#1c1c1e] ${
              isDarg ? "opacity-20" : ""
            }`}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
            />
          </svg>
          <input
            type="file"
            accept="video/*"
            onChange={(e) => {
              handleUpload(e.target.files[0]);
              setIsDrag(false);
            }}
            onDrop={(e) => {
              handleUpload(e.target.files[0]);
            }}
            name="file"
            id="file"
            className="opacity-0 absolute left-0 h-full w-full"
          />
        </label>
      ) : (
        <div
          className={`flex absolute right-3 top-3 ${
            Math.ceil(completedChunk + progress) / totalChunk > 0
              ? "w-52 h-32"
              : "h-full w-full"
          } flex-col justify-center items-center border-2 border-dashed border-[#1c1c1e] rounded-2xl gap-4 ease-in-out duration-1000`}
        >
          <div className="absolute h-full w-full -left-0 -z-0">
            <div aria-disabled={totalChunk === completedChunk} className="absolute z-10 aria-disabled:hidden bg-white px-2 py-1 rounded-2xl top-2 right-2 text-xs">
              {rate / 1024 / 1024 < 1
                ? (rate / 1024).toFixed(2) + " kb/s"
                : (rate / 1024 / 1024).toFixed(2) + " mb/s"}
            </div>
            <div
              style={{
                width: ((completedChunk + progress) / totalChunk) * 100 + "%",
              }}
              className={`bg-black opacity-20 h-full absolute -left-0 self-start rounded-2xl`}
            ></div>
          </div>
          <div className="z-10">
            <p className="text-emerald-500 bg-white px-4 py-2 rounded-2xl">
              {totalChunk !== completedChunk
                ? (((completedChunk + progress) / totalChunk) * 100).toFixed(
                    2
                  ) + " %"
                : "Completed"}
            </p>
          </div>
        </div>
      )}
    </>
  );
}

export default VideoSelect;
