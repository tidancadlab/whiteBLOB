import { useState } from 'react';
/**
 *
 * @param {{chuckProgress : {total: number, loaded: number, completedChunk: number, totalChunk: number}}} props
 * @returns
 */
function VideoSelect({ props }) {
  const { file, handleUpload, chuckProgress } = props;
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
          aria-invalid={isDarg}
          title="click to select video file for upload"
          className={`flex h-full cursor-pointer flex-col items-center justify-center rounded-2xl border-2
           border-dashed border-[#1c1c1e] aria-[invalid="true"]:border-green-500`}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1}
            stroke="currentColor"
            className={`h-24 w-24 stroke-[#1c1c1e] ${isDarg ? 'opacity-20' : ''}`}>
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
            />
          </svg>
          <h1 className="font-sans text-5xl text-[#1c1c1e]">Drag and Drop</h1>
          <input
            type="file"
            accept="video/*, .mkv"
            onChange={(e) => {
              handleUpload(e.target.files[0]);
              setIsDrag(false);
            }}
            onDrop={(e) => {
              handleUpload(e.target.files[0]);
            }}
            name="file"
            id="file"
            className="absolute left-0 h-full w-full opacity-0"
          />
        </label>
      ) : (
        <div
          className={`absolute right-3 top-3 flex ${
            Math.ceil(completedChunk + progress) / totalChunk > 0 ? 'h-32 w-52' : 'h-full w-full'
          } flex-col items-center justify-center gap-4 rounded-2xl border-2 border-dashed border-[#1c1c1e] duration-1000 ease-in-out`}>
          <div className="absolute -left-0 -z-0 h-full w-full">
            <div
              aria-disabled={totalChunk === completedChunk}
              className="absolute right-2 top-2 z-10 rounded-2xl bg-white px-2 py-1 text-xs aria-disabled:hidden">
              {rate / 1024 / 1024 < 1 ? (rate / 1024).toFixed(2) + ' kb/s' : (rate / 1024 / 1024).toFixed(2) + ' mb/s'}
            </div>
            <div
              style={{
                width: ((completedChunk + progress) / totalChunk) * 100 + '%',
              }}
              className={`absolute -left-0 h-full self-start rounded-2xl bg-black opacity-20`}></div>
          </div>
          <div className="z-10">
            <p className="rounded-2xl bg-white px-4 py-2 text-emerald-500">
              {totalChunk !== completedChunk ? (((completedChunk + progress) / totalChunk) * 100).toFixed(2) + ' %' : 'Completed'}
            </p>
          </div>
          <p className="text-white">
            {' '}
            {((file.size / 1024 / 1024) * ((completedChunk + progress) / totalChunk)).toFixed(2)} of {(file.size / 1024 / 1024).toFixed(2)}
          </p>
          {/* <p className="text-white">{remainTime}</p> */}
        </div>
      )}
    </>
  );
}

export default VideoSelect;
