import { Button, Input } from 'components/form-field';
import { useEffect, useRef, useState } from 'react';
import { RiCloseCircleFill } from 'react-icons/ri';

export const RenderSelectVideoContainer = ({ videoFile, handleSetVideoFile, handleRemoveVideoFile, disabled }) => (
  <div
    aria-expanded={videoFile !== null}
    className="w-full rounded-2xl bg-gray-800 duration-300 ease-in-out aria-expanded:sm:w-4/6">
    {videoFile ? (
      <div
        title={videoFile.name}
        className="group relative flex h-full grow flex-col items-start justify-between gap-1 rounded-2xl p-4 px-6 font-mono text-white">
        <p className="line-clamp-1 max-w-full text-xl font-bold sm:line-clamp-2">{videoFile?.name}</p>
        <div className="flex gap-1 overflow-hidden">
          <p className="rounded-md bg-black px-2 py-1 text-xs text-green-500">{(videoFile.size / 1024 / 1024).toFixed(2)} mb</p>
          <p className="rounded-md bg-black px-2 py-1 text-xs text-green-500">{new Date(videoFile.lastModified).toDateString()}</p>
          <p className="rounded-md bg-black px-2 py-1 text-xs text-green-500">{videoFile.type}</p>
        </div>
        <Button
          title=""
          disabled={disabled}
          onClick={handleRemoveVideoFile}
          className="absolute right-1 top-1 h-fit w-fit rounded-full bg-black opacity-30 enabled:group-hover:opacity-100">
          <RiCloseCircleFill className="p-1 text-lg" size={32} />
        </Button>
      </div>
    ) : (
      <Input
        accept="video/*, .mkv"
        className={{
          container: 'rounded-2xl bg-transparent p-4 text-white',
          label: 'flex cursor-pointer items-center justify-center rounded-2xl p-4 text-2xl outline-dashed outline-1',
        }}
        onChange={handleSetVideoFile}
        name="file"
        id="file"
        type="file">
        Select Video
      </Input>
    )}
  </div>
);

export const RenderSelectThumbnailContainer = ({ videoFile, thumbnailUrl, handleSetThumbnailFile, handleRemoveThumbnailFile, handleInitialDirectUrl, disabled }) => {
  const [showOption, setShowOption] = useState(false);
  const [file, setFile] = useState(null);
  const [imageUrl, setImageUrl] = useState('');
  const optionContainer = useRef();

  const handleSetFile = (e) => {
    if (e) {
      setFile(e);
    }
  };

  const onSubmit = () => {
    if (imageUrl.length > 0) {
      if (/http(s)?:\/\/[0-9,a-z,A-Z]/i.test(imageUrl)) {
        handleInitialDirectUrl(imageUrl);
      } else {
        alert('This is not correct url, Please provide as below\nExample: https://domain.com/image/thumbnail.jpg\nprovided by you: ' + imageUrl);
      }
    } else {
      handleSetThumbnailFile(file);
    }
    setShowOption(false);
  };

  useEffect(() => {
    if (optionContainer.current && showOption) {
      optionContainer.current.focus();
    }
    return () => {
      setFile(null);
      setImageUrl('');
    };
  }, [showOption]);

  return (
    true &&
    (thumbnailUrl ? (
      <div
        style={{ backgroundImage: `url('${thumbnailUrl}')` }}
        className="group relative flex aspect-video w-56 grow flex-col items-center justify-between gap-4 rounded-2xl bg-gray-800 bg-cover font-mono text-white sm:max-w-[224px]">
        <Button
          title=""
          disabled={disabled}
          onClick={handleRemoveThumbnailFile}
          className="absolute right-1 top-1 h-fit w-fit rounded-full bg-black opacity-30 enabled:group-hover:opacity-100">
          <RiCloseCircleFill className="p-1 text-lg" size={32} />
        </Button>
      </div>
    ) : (
      <>
        <div
          onClick={() => setShowOption(true)}
          aria-disabled={videoFile === null && thumbnailUrl === null}
          aria-busy={showOption}
          className="flex w-full cursor-pointer items-center justify-center overflow-hidden rounded-2xl bg-gray-800 p-4 text-2xl text-white outline-1 aria-busy:animate-pulse aria-disabled:pointer-events-none aria-disabled:w-0 aria-disabled:p-0 sm:w-2/6">
          <p className="flex h-full w-full items-center justify-center rounded-2xl p-4 text-center outline-dashed outline-1">Thumbnail</p>
        </div>
        {showOption && (
          <div className="absolute left-1/2 top-1/2 z-50 flex h-screen w-screen -translate-x-1/2 -translate-y-1/2 items-center justify-center bg-black/50 backdrop-blur-sm">
            <div
              tabIndex={10}
              ref={optionContainer}
              onBlur={(e) => {
                if (!e.relatedTarget && e.nativeEvent.sourceCapabilities) {
                  console.log(e);
                  setShowOption(false);
                }
              }}
              className="w-96 rounded-2xl bg-slate-950/80 p-4 text-white backdrop-blur-md">
              {file ? (
                <div className="p-4">
                  <div className="rounded-2xl bg-slate-950 p-4">
                    <p>{file.name}</p>
                  </div>
                </div>
              ) : (
                <div className="">
                  <div className="p-4">
                    <Input
                      accept="image/*"
                      className={{
                        container: 'h-32 w-full rounded-2xl bg-slate-950 p-4 text-white',
                        label: 'flex cursor-pointer items-center justify-center rounded-2xl text-2xl outline-dashed outline-1',
                      }}
                      onChange={(e) => handleSetFile(e.target.files[0])}
                      name="file"
                      id="file"
                      type="file">
                      Select from Device
                    </Input>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="h-0.5 w-1/2 rounded-full bg-white/50"></div>
                    <p className="text-center text-xl text-white/50">OR</p>
                    <div className="h-0.5 w-1/2 rounded-full bg-white/50"></div>
                  </div>
                  <div className="p-4">
                    <Input
                      hidden={file}
                      type="url"
                      onChange={(e) => setImageUrl(e.target.value)}
                      value={imageUrl}
                      placeholder="https://example.com/image.jpeg"
                      labelTitle=" "
                      className={{ input: 'rounded-full bg-slate-950 text-base text-white outline outline-1' }}
                    />
                  </div>
                </div>
              )}
              <div className="flex justify-end gap-4 p-4">
                <Button
                  className="bg-red-500"
                  onClick={() => {
                    setShowOption(false);
                  }}>
                  Cancel
                </Button>
                <Button onClick={onSubmit}>Submit</Button>
              </div>
            </div>
          </div>
        )}
      </>
    ))
  );
};
