import { useContext, useEffect, useState } from 'react';
import { MdLocalMovies } from 'react-icons/md';
import readyAxios from 'api/protected.api';
import { apiStateStatus } from 'utilities';
import { StorageContext } from 'storage';

import VideoMetadataForm from './videoMetadataForm';
import { Alert } from 'components/alert';
import { Button } from 'components/form-field';
import ProgressAndStatus from './uploadStatusCard';

let controller = new AbortController();

const abortRequest = (reason = '') => {
  controller.abort(reason);
};

const createNewAbortControllerInstance = () => {
  controller = new AbortController();
};

const UploadFormSection = () => {
  const { uploadFile, onUploadFile } = useContext(StorageContext);

  const [chunks, setChunks] = useState([]);
  const [apiStatus, setApiStatus] = useState(apiStateStatus.initial);
  const [chuckProgress, setChuckProgress] = useState({});

  /**
   *
   * @param {File} file
   */
  const handleUpload = (file) => {
    try {
      const chunkSize = 1024 * 1024 * 2;
      const chunkList = [];
      let offset = 0;

      while (offset < file.size) {
        const chunk = file.slice(offset, offset + chunkSize);
        chunkList.push(chunk);
        offset += chunkSize;
      }

      setChuckProgress((previous) => ({ ...previous, completedChunk: 0, totalChunk: chunkList.length }));
      setChunks(chunkList);

    } catch (error) {
      console.log(error);
    }
  };

  const onUploadChunk = (chunk, isLast = false) => {
    const { id, name, lastModified, size } = uploadFile;
    
    setApiStatus(apiStateStatus.pending);

    const formData = new FormData();
    formData.append('id', id);
    formData.append('video', chunk, name);
    formData.append('lastModified', lastModified);
    formData.append('size', size);
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
        console.log(err);
        setApiStatus(apiStateStatus.rejected);
      });
  };

  const runUploading = () => {
    if (chunks.length <= 0) return;
    const isLast = chunks.length === 1;
    const chunk = chunks[0];
    onUploadChunk(chunk, isLast);
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(runUploading, [chunks]);

  useEffect(() => {
    createNewAbortControllerInstance();
    handleUpload(uploadFile);
    return () => abortRequest();
  }, [uploadFile]);

  const UploadingStatusCard = () => {
    return (
      <div className={`flex h-20 w-full divide-[#121212] rounded-xl bg-gray-800 sm:divide-x-2`}>
        <div className=" hidden h-full items-center justify-center self-stretch px-4 sm:flex">
          <MdLocalMovies className="fill-white text-5xl" />
        </div>
        <ProgressAndStatus apiStatus={apiStatus} chuckProgress={chuckProgress} file={uploadFile} />
        <div className="absolute -top-10 left-0 flex items-center justify-center gap-2 self-stretch sm:relative sm:top-0 sm:flex-col sm:px-4">
          {chuckProgress.totalChunk !== chuckProgress.completedChunk || apiStateStatus.rejected !== apiStatus ? (
            <Button onClick={abortRequest}>Cancel</Button>
          ) : null}
          {chuckProgress.totalChunk === chuckProgress.completedChunk || apiStateStatus.rejected === apiStatus ? (
            <Button
              onClick={() => {
                onUploadFile(null);
              }}
              className="bg-red-500">
              Remove
            </Button>
          ) : null}
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
        <VideoMetadataForm file={uploadFile} />
      </div>
    </div>
  );
};

export default UploadFormSection;
