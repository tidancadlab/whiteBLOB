import readyAxios from 'api/protected.api';
import { apiStateStatus } from 'utilities';
import VideoMetadataForm from './videoMetadataForm';
import { Alert } from 'components/alert';
import { useEffect, useState } from 'react';
import { Button } from 'components/form-field';
import { MdLocalMovies } from 'react-icons/md';
import ProgressAndStatus from './uploadStatusCard';

let controller = new AbortController();

const abortRequest = async () => {
  controller.abort();
};

const createNewAbortControllerInstance = async () => {
  controller = new AbortController();
};

/**
 *
 * @param {import('./uploadStatusCard').propsObject | {onRetry: Function, onCancel: Function}}
 * @returns
 */
const UploadFormSection = ({ file, setFile }) => {
  const [chunks, setChunks] = useState([]);
  const [apiStatus, setApiStatus] = useState(apiStateStatus.initial);

  const [chuckProgress, setChuckProgress] = useState({
    completedChunk: 0,
    totalChunk: 0.000001,
    progress: 0,
    rate: 0,
  });

  /**
   *
   * @param {File} file
   */
  const handleUpload = async (file) => {
    try {
      const chunkSize = 1024 * 1024 * 24;
      const chunkList = [];
      let offset = 0;

      while (offset < file.size) {
        const chunk = file.slice(offset, offset + chunkSize);
        chunkList.push(chunk);
        offset += chunkSize;
      }

      setChuckProgress({ completedChunk: 0, totalChunk: chunkList.length, progress: 0 });
      setChunks(chunkList);
    } catch (error) {
      console.log(error);
    }
  };

  const onUploadChunk = (chunk, isLast = false, id = file?.id) => {
    setApiStatus(apiStateStatus.pending);

    const formData = new FormData();
    formData.append('id', id);
    formData.append('video', chunk, file?.name);
    formData.append('lastModified', file?.lastModified);
    formData.append('size', file?.size);
    formData.append('isTail', isLast);

    readyAxios
      .post(`api/upload`, formData, {
        signal: controller.signal,
        onUploadProgress: (e) => {
          setChuckProgress((previous) => ({
            ...previous,
            ...e,
            rate: e.rate || previous.rate,
          }));
        },
      })
      .then((data) => {
        if (data.status === 200) {
          console.log(data.data);
          setApiStatus(apiStateStatus.resolved);
          setChuckProgress((previous) => ({
            ...previous,
            completedChunk: previous.completedChunk + 1,
            progress: 0,
          }));
          setChunks(chunks.splice(1));
        } else {
          setApiStatus(apiStateStatus.rejected);
        }
      })
      .catch((err) => {
        setApiStatus(apiStateStatus.rejected);
      });
  };

  const runUploading = () => {
    if (chunks.length <= 0) return;
    const isLast = chunks.length === 1;
    const chunk = chunks[0];
    onUploadChunk(chunk, isLast);
  };

  useEffect(runUploading, [chunks]);

  useEffect(() => {
    handleUpload(file);
  }, [file]);

  const UploadingStatusCard = () => {
    return (
      <div className={`flex h-20 w-full divide-[#121212] rounded-xl bg-gray-800 sm:divide-x-2`}>
        <div className=" hidden h-full items-center justify-center self-stretch px-4 sm:flex">
          <MdLocalMovies className="fill-white text-5xl" />
        </div>
        <ProgressAndStatus apiStatus={apiStatus} chuckProgress={chuckProgress} file={file} />
        <div className="absolute -top-10 left-0 flex items-center justify-center gap-2 self-stretch sm:relative sm:top-0 sm:flex-col sm:px-4">
          <Button
            onClick={async () => {
              await abortRequest();
              setFile(null);
            }}>
            Remove
          </Button>
          {chuckProgress.totalChunk !== chuckProgress.completedChunk ||
            (apiStateStatus.rejected === apiStatus && (
              <Button onClick={abortRequest} className="bg-red-500">
                Cancel
              </Button>
            ))}
        </div>
      </div>
    );
  };

  return (
    <div className="mt-10 flex grow flex-col items-center justify-start gap-4 sm:mt-0">
      <div className="relative flex w-full flex-col gap-4">
        <Alert
          button="retry"
          onClick={() => {
            createNewAbortControllerInstance();
            runUploading();
          }}
          hidden={apiStatus !== apiStateStatus.rejected}>
          Something went wrong
        </Alert>
        <UploadingStatusCard />
        <VideoMetadataForm file={file} />
      </div>
    </div>
  );
};

export default UploadFormSection;
