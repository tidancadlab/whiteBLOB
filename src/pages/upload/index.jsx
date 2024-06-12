import { useEffect, useState } from 'react';
import { v4 } from 'uuid';

import { apiStateStatus } from 'utilities';
import { Alert } from 'components/alert';

import CanvasThumbnail from './components/canvasThumbnail';
import VideoMetadataForm from './components/videoMetadataForm';
import { uploadVideo } from './functions/uploadVideo.worker';
import { handleReadImageFile, handleReadImageURL, offscreenCanvasImageCrop } from './functions';

let controller = new AbortController();
let videoChunks = [];

const splitIntoChunk = async (file, size) => {
  videoChunks = [];
  if (!file) return;
  let offset = 0;
  while (offset < file.size) {
    const chunkSize = size || 1024 * 1024 * 24;
    const chunk = file.slice(offset, offset + chunkSize);
    videoChunks.push(chunk);
    offset += chunkSize;
  }
  return;
};

function UploadPage() {
  const [videoFile, setVideoFile] = useState(null);

  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [initialThumbnailUrl, setInitialThumbnailUrl] = useState(null);
  const [thumbnailUrl, setThumbnailUrl] = useState(null);
  const [readImageProgress, setReadImageProgress] = useState(0);

  const [readImageStatus, setReadImageStatus] = useState(apiStateStatus.initial);
  const [cropImageStatus, setCropImageStatus] = useState(apiStateStatus.initial);
  const [apiUploadStatus, setApiUploadStatus] = useState(apiStateStatus.initial);

  const [alertMessage, setAlertMessage] = useState('');

  const [videoUploadProgress, setVideoUploadProgress] = useState({ rate: 0, progress: 0, completedChunks: 0, totalChunk: 1 });

  const handleSetVideoFile = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    file.id = v4();
    setVideoFile(file);
  };

  const handleRemoveVideoFile = () => {
    setVideoFile(null);
  };

  const handleSetThumbnailFile = (event) => {
    if (!event) return;
    if (!event.target) {
      setThumbnailFile(event);
      return;
    }
    const file = event.target.files[0];
    if (!file) return;
    setThumbnailFile(file);
  };

  const handleRemoveThumbnailFile = () => {
    setThumbnailFile(null);
    setInitialThumbnailUrl(null);
    setThumbnailUrl(null);
  };

  const handleConvertImage = async (canvasDimension) => {
    setCropImageStatus(apiStateStatus.pending);
    try {
      const url = await offscreenCanvasImageCrop(canvasDimension, initialThumbnailUrl);
      setThumbnailUrl(url);
      setInitialThumbnailUrl(null);
      setCropImageStatus(apiStateStatus.resolved);
    } catch (error) {
      alert(error.message);
      setCropImageStatus(apiStateStatus.rejected);
    }
  };

  const handleInitialReadFile = async () => {
    setReadImageStatus(apiStateStatus.pending);
    setReadImageProgress(0);
    try {
      const url = await handleReadImageFile(thumbnailFile, setReadImageProgress);
      setInitialThumbnailUrl(url);
      setReadImageStatus(apiStateStatus.resolved);
    } catch (error) {
      alert(error.message);
      setReadImageStatus(apiStateStatus.rejected);
    }
  };

  const handleInitialDirectUrl = async (url) => {
    setReadImageStatus(apiStateStatus.pending);
    setReadImageProgress(0);
    try {
      const imageURL = await handleReadImageURL(url, setReadImageProgress);
      setInitialThumbnailUrl(imageURL);
      setReadImageStatus(apiStateStatus.resolved);
    } catch (error) {
      alert(error.message);
      setReadImageStatus(apiStateStatus.rejected);
    }
  };

  const handleUploadChunk = async (data) => {
    controller = new AbortController();
    setApiUploadStatus(apiStateStatus.pending);
    console.log('called');
    try {
      const res = await uploadVideo({
        id: videoFile.id,
        file: data?.file,
        chunk: videoChunks[0],
        body: data?.body,
        fileName: videoFile.name,
        isLast: videoChunks.length <= 1,
        controller: controller,
        onProgress: setVideoUploadProgress,
      });
      if (res.status === 200) {
        videoChunks.shift();
        setApiUploadStatus(apiStateStatus.resolved);
        setVideoUploadProgress((previous) => ({ ...previous, completedChunks: previous.completedChunks + 1, progress: 0 }));
        if (videoChunks.length <= 0) return;
        handleUploadChunk();
      }
    } catch (error) {
      setAlertMessage(error.message);
      setApiUploadStatus(apiStateStatus.rejected);
    }
  };

  const handleAbortRequest = () => {
    controller.abort('Uploading Cancelled');
  };

  const handleStartVideoUpload = async ({ videoMetaData }) => {
    try {
      await splitIntoChunk(videoFile, 1024 * 1024 * 90);
      setVideoUploadProgress((previous) => ({ ...previous, totalChunk: videoChunks.length, completedChunks: 0 }));
      handleUploadChunk({
        file: videoFile,
        body: {
          thumbnail: thumbnailUrl,
          ...videoMetaData,
        },
      });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (!thumbnailFile) return;
    handleInitialReadFile();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [thumbnailFile]);

  useEffect(() => {
    return () => {
      setVideoFile(null);
      setThumbnailFile(null);
      handleAbortRequest();
    };
  }, []);

  return (
    <>
      <div className="m-2 flex grow flex-col items-center justify-start gap-4">
        <div className="flex w-full max-w-2xl grow flex-col justify-center gap-4">
          {apiUploadStatus === apiStateStatus.rejected && <Alert type="error">{alertMessage}</Alert>}
          <VideoMetadataForm
            video={{ videoFile, handleRemoveVideoFile, handleSetVideoFile }}
            thumbnail={{ handleInitialDirectUrl, handleRemoveThumbnailFile, handleSetThumbnailFile, thumbnailFile, thumbnailUrl }}
            upload={{
              handleAbortRequest,
              handleRestartVideoUpload: () => handleUploadChunk({ id: videoFile.id, chunk: videoChunks[0] }),
              handleStartVideoUpload,
              apiUploadStatus,
              videoUploadProgress,
            }}
          />
        </div>
        <CanvasThumbnail src={initialThumbnailUrl} handleCropImage={handleConvertImage} status={readImageStatus} progress={readImageProgress} />
      </div>
    </>
  );
}

export default UploadPage;
