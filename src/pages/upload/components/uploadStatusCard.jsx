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
  let { rate = 0, progress = 0, totalChunk = 0, completedChunks = 0 } = chuckProgress;

  rate = (rate / 1024).toFixed(2);

  const percentCompleted = (((completedChunks + progress) / totalChunk) * 100).toFixed(2);
  const fileSize = file?.size / 1024 / 1024 || 0;
  const isKbps = rate / 1024 < 1;

  if (percentCompleted <= 0) {
    return null;
  }

  return (
    <div className="relative flex flex-col justify-center rounded-2xl bg-gray-800 p-6 px-4 text-white">
      <Progress style={{ container: 'absolute bottom-0 z-10 w-[calc(100%-32px)]' }} progress={percentCompleted} />
      {totalChunk === completedChunks ? (
        <div className="flex w-full gap-4 text-xs text-green-500">
          <p>Uploading successfully completed</p>
        </div>
      ) : (
        <div className="flex w-full gap-4 text-sm">
          <p className="">{percentCompleted} %</p>
          <div className="flex gap-1">
            <div>{isKbps ? rate + ' kb/s' : (rate / 1024).toFixed(2) + ' mb/s'}</div> <span>-</span>
            <p className="text-white">
              {(fileSize * ((completedChunks + progress) / totalChunk)).toFixed(2)}/{fileSize.toFixed(2)} mb
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProgressAndStatus;
