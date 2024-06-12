import { useState } from 'react';
import { apiStateStatus } from 'utilities';

import { Button, Input, Radio } from 'components/form-field';
import { RenderSelectThumbnailContainer, RenderSelectVideoContainer } from './componentElements';
import ProgressAndStatus from './uploadStatusCard';

const category = [
  { id: 0, title: 'movie' },
  { id: 1, title: 'show' },
  { id: 2, title: 'family' },
  { id: 3, title: 'kids' },
  { id: 4, title: 'other' },
];

const FormFields = ({ videoFile, apiUploadStatus, handleStartVideoUpload, handleRestartVideoUpload, handleAbortRequest, disabled }) => {
  const [formData, setFormData] = useState({
    title: videoFile?.name.split('.')[0],
    description: '',
    category: category[0].title,
    tags: [],
  });

  const onInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'tags') {
      setFormData((previous) => ({ ...previous, [name]: value.split(' ') }));
      return;
    }
    setFormData((previous) => ({ ...previous, [name]: value }));
  };

  return (
    <form className="flex flex-col gap-4">
      <Input disabled={disabled} onChange={onInputChange} name="title" required value={formData.title}>
        Title
      </Input>
      <Input disabled={disabled} onChange={onInputChange} name="description" type="textArea" value={formData.description}>
        Description
      </Input>
      <p className="-mb-2">Category</p>
      <div className="flex gap-4 overflow-x-auto p-2">
        {category.map((value, index) => (
          <Radio
            disabled={disabled}
            key={value.id}
            onChange={onInputChange}
            checked={formData.category === value.title}
            aria-checked={formData.category === value.title}
            className="select-none duration-100 ease-in-out disabled:outline-none peer-checked:outline peer-hover:outline-2 disabled:peer-active:outline-8"
            name="category"
            id={value.id}
            value={value.title}
            required>
            {value.title}
          </Radio>
        ))}
      </div>
      <Input disabled={disabled} onChange={onInputChange} value={formData.tags.join(' ')} name="tags" type="textArea">
        Tags (put space after every tag){' '}
      </Input>
      <div className="flex items-center justify-end gap-4">
        <div className="flex gap-4 self-end">
          {apiUploadStatus === apiStateStatus.initial && (
            <Button
              onClick={(e) => {
                e.preventDefault();
                handleStartVideoUpload({ videoMetaData: formData });
              }}
              type="submit">
              Upload
            </Button>
          )}
          {apiUploadStatus === apiStateStatus.rejected && <Button onClick={handleRestartVideoUpload}>Start</Button>}
          <Button type="button" disabled={apiUploadStatus !== apiStateStatus.pending} onClick={handleAbortRequest} className="bg-red-500">
            Cancel
          </Button>
        </div>
      </div>
    </form>
  );
};

/**
 *
 * @param {{
 * video: {
 *  videoFile: File,
 *  handleSetVideoFile: function(): void,
 *  handleRemoveVideoFile: function(): void,
 * }
 * thumbnail:{
 *  thumbnailFile: File,
 *  thumbnailUrl: string | null
 *  handleRemoveThumbnailFile: function(): void,
 *  handleSetThumbnailFile: function(): void,
 *  handleInitialDirectUrl: function(): void,
 * }
 * upload:{
 *  apiUploadStatus: string,
 *  handleStartVideoUpload: function({videoMetaData}): void,
 *  handleRestartVideoUpload: function(): void,
 *  handleAbortRequest: function(): void,
 *  videoUploadProgress: {
 *    rate: number,
 *    totalChunk: number,
 *    completedChunks: number,
 *    loaded: number
 *  }
 * }
 * }}
 * @returns {import('react').JSX}
 */

const VideoMetadataForm = ({ video, thumbnail, upload }) => {
  const { videoFile, handleSetVideoFile, handleRemoveVideoFile } = video;
  const { thumbnailFile, thumbnailUrl, handleSetThumbnailFile, handleInitialDirectUrl, handleRemoveThumbnailFile } = thumbnail;
  const { apiUploadStatus, handleAbortRequest, videoUploadProgress, handleRestartVideoUpload, handleStartVideoUpload } = upload;

  return (
    <>
      {videoFile && <ProgressAndStatus chuckProgress={videoUploadProgress} file={videoFile} />}
      <div aria-expanded={videoFile !== null || thumbnailUrl} className="flex flex-wrap aria-expanded:gap-4 sm:flex-nowrap">
        <RenderSelectVideoContainer {...{ handleRemoveVideoFile, handleSetVideoFile, videoFile, disabled: apiStateStatus.initial !== apiUploadStatus }} />
        <RenderSelectThumbnailContainer
          {...{
            handleRemoveThumbnailFile,
            handleSetThumbnailFile,
            thumbnailFile,
            thumbnailUrl,
            videoFile,
            handleInitialDirectUrl,
            disabled: apiStateStatus.initial !== apiUploadStatus,
          }}
        />
      </div>
      <div
        aria-expanded={videoFile !== null}
        className="pointer-events-none relative h-fit max-h-0 w-full overflow-hidden rounded-2xl bg-gray-800 px-6 duration-300 ease-in-out aria-expanded:pointer-events-auto aria-expanded:max-h-[672px] ">
        <div className=" p-4 py-8 font-mono text-white">
          {videoFile !== null && (
            <FormFields
              {...{
                apiUploadStatus,
                handleAbortRequest,
                handleRestartVideoUpload,
                handleStartVideoUpload,
                videoFile,
                disabled: apiUploadStatus !== apiStateStatus.initial,
              }}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default VideoMetadataForm;
