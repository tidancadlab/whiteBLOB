import { useContext, useState } from 'react';
import { v4 as uuidV4 } from 'uuid';

import { Input } from 'components/form-field';
import UploadFormSection from './components/uploadSection';
import { StorageContext } from 'storage';

function VideoUpload() {
  const { isOnline, onUploadFile, uploadFile } = useContext(StorageContext);
  const [file, setFile] = useState(null);

  const FileDetails = () => {
    if (uploadFile) {
      return <UploadFormSection file={file} setFile={setFile} />;
    }

    if (!isOnline) {
      return <h1 className="flex grow items-center justify-center text-center text-7xl font-extrabold text-gray-800">You are offline</h1>;
    }
    return <h1 className="flex grow items-center justify-center text-center text-7xl font-extrabold text-gray-800">No Video to upload</h1>;
  };

  return (
    <>
      <div className="flex grow flex-col items-center justify-start gap-4 p-4">
        <div className="flex w-full max-w-2xl grow flex-col gap-4">
          <Input
            accept="video/*, .mkv"
            onChange={(e) => {
              const file = e.target.files[0];
              file.id = uuidV4();
              onUploadFile(file);
            }}
            name="file"
            hidden={uploadFile !== null || !isOnline}
            id="file"
            type="file">
            Select file
          </Input>
          <FileDetails />
        </div>
      </div>
    </>
  );
}

export default VideoUpload;
