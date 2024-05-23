import Progress from './ProgressBar';

/**
 * @typedef {{
 * file: File,
 * chuckProgress: { rate: number, progress: number, totalChunk: number, completedChunk: number }
 * }} propsObject
 */

/**
 *
 * @param {propsObject}
 * @returns
 */
const ProgressAndStatus = ({ file, chuckProgress }) => {
  let { rate = 0, progress = 0, totalChunk = 0, completedChunk = 0 } = chuckProgress;
  rate = (rate / 1024).toFixed(2);

  const percentCompleted = (((completedChunk + progress) / totalChunk) * 100).toFixed(2);
  const fileSize = file?.size / 1024 / 1024 || 0;
  const isKbps = rate / 1024 < 1;

  return (
    <div className="flex grow flex-col justify-center px-4 text-white">
      <div className="flex gap-2">
        <p className="line-clamp-1 cursor-pointer text-sm">{file?.name}</p>
      </div>
      <Progress uploadProgress={percentCompleted} />
      {totalChunk === completedChunk ? (
        <div className="flex w-full gap-4 text-xs text-green-500">
          <p>Uploading successfully completed</p>
        </div>
      ) : (
        <div className="flex w-full gap-4 text-xs">
          <p className="">{percentCompleted} %</p>
          <div className="flex gap-1">
            <div>{isKbps ? rate + ' kb/s' : (rate / 1024).toFixed(2) + ' mb/s'}</div> <span>-</span>
            <p className="text-white">
              {(fileSize * ((completedChunk + progress) / totalChunk)).toFixed(2)}/{fileSize.toFixed(2)} mb
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProgressAndStatus;
