import { useState } from 'react';
import VideoSelect from './SelectVideo';
import axios from 'axios';
import { PATH } from '../../config';

function VideoUpload() {
  const [file, setFile] = useState(null);
  const [hasError, setHasError] = useState(null);
  const [chuckProgress, setChuckProgress] = useState({
    completedChunk: 0,
    totalChunk: 0.000001,
    progress: 0,
    rate: 0,
  });
  const token = window.localStorage.getItem('token');
  const readyAxios = axios.create({
    baseURL: PATH.API_PATH,
    headers: {
      Authorization: `bearer ${token}`,
    },
  });
  /**
   *
   * @param {Array<Buffer>} chunks
   * @param {File} file
   */
  const onUploadStart = async (chunks, file) => {
    setChuckProgress((previous) => ({
      ...previous,
      totalChunk: chunks.length + 1,
      fileSize: file.size,
    }));
    const start = (isLast = false, id = '') => {
      const formData = new FormData();
      const chunk = chunks.shift();
      formData.append('id', id);
      formData.append('video', chunk, file.name);
      formData.append('isTail', isLast);
      readyAxios
        .post(`api/upload`, formData, {
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
            setChuckProgress((previous) => ({
              ...previous,
              completedChunk: previous.completedChunk + 1,
              progress: 0,
            }));
            if (chunks.length > 0) {
              const last = chunks.length === 1;
              start(last, data.data);
            }
          }
        })
        .catch((err) => {
          setHasError(err?.response?.data?.message);
        });
    };
    const last = chunks.length === 1;
    start(last);
  };
  /**
   *
   * @param {File} file
   */
  const handleUpload = async (file) => {
    setFile(file);
    setChuckProgress({ completedChunk: 0, totalChunk: 0.000001, progress: 0 });
    try {
      const chunkSize = 1024 * 1024 * 8;
      const chunks = [];
      let offset = 0;
      while (offset < file.size) {
        const chunk = file.slice(offset, offset + chunkSize);
        chunks.push(chunk);
        offset += chunkSize;
      }
      onUploadStart(chunks, file);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className="flex grow flex-col items-center justify-center gap-4 p-4">
        {hasError && <p className="rounded-lg border border-red-600 bg-red-300 px-4 py-2 text-lg text-red-600">{hasError}</p>}
        <div className="relative h-full max-h-[572px] w-full max-w-2xl rounded-2xl bg-[#141414] p-10">
          <VideoSelect
            props={{
              handleUpload,
              file,
              chuckProgress,
            }}
          />
          {/* <div
            aria-disabled={false}
            className="aria-disabled:opacity-0 aria-disabled:w-0 w-full ease-in-out duration-[2000ms]"
          >
            <div className=" p-4 font-mono text-white">
              <form className="flex flex-col gap-4">
                <div className="flex flex-col gap-2 max-w-xs">
                  <label className="" htmlFor="title">
                    Title
                  </label>
                  <input
                    required
                    autoComplete="off"
                    className="focus:invalid:outline-red-500 focus:valid:outline-green-500 outline-none h-10 rounded-xl px-4 text-black"
                    type="text"
                    name=""
                    id="title"
                    placeholder="title"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="" htmlFor="title">
                    Description
                  </label>
                  <textarea
                    rows={4}
                    required
                    className="focus:invalid:outline-red-500 focus:valid:outline-green-500  outline-none rounded-xl px-4 py-2 text-black"
                    type="text"
                    name=""
                    id="title"
                    placeholder="description"
                  />
                </div>
                <p className="-mb-2">Category</p>
                <div className="flex gap-4">
                  <div className="flex gap-2">
                    <input
                      className="peer hidden"
                      type="radio"
                      name="category"
                      id="movie"
                    />
                    <label
                      role="textbox"
                      className="peer-checked:bg-[rgb(79,70,229)] px-3 py-2 focus:outline outline-offset-2 outline-[rgb(79,70,229)] rounded-xl border border-gray-700 cursor-pointer peer-checked:border-[rgb(79,70,229)]"
                      htmlFor="movie"
                    >
                      Movie
                    </label>
                  </div>
                  <div className="flex gap-2">
                    <input
                      className="peer hidden"
                      type="radio"
                      name="category"
                      id="show"
                    />
                    <label
                      className="peer-checked:bg-[rgb(79,70,229)] px-3 py-2 focus:outline outline-offset-2 outline-[rgb(79,70,229)] rounded-xl border border-gray-700 cursor-pointer peer-checked:border-[rgb(79,70,229)]"
                      htmlFor="show"
                    >
                      Show
                    </label>
                  </div>
                  <div className="flex gap-2">
                    <input
                      className="peer hidden"
                      type="radio"
                      name="category"
                      id="other"
                      defaultChecked
                    />
                    <label
                      role="radio"
                      aria-checked
                      className="peer-checked:bg-[rgb(79,70,229)] px-3 py-2 focus:outline outline-offset-2 outline-[rgb(79,70,229)] rounded-xl border border-gray-700 cursor-pointer peer-checked:border-[rgb(79,70,229)]"
                      htmlFor="other"
                    >
                      Other
                    </label>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="" htmlFor="title">
                    Description
                  </label>
                </div>
              </form>
            </div>
            <div className="flex gap-4 absolute bottom-6 right-6">
              <button
                disabled
                className="flex items-center justify-center bg-[#F41B3B] disabled:opacity-30 h-6 w-14 rounded text-white font-semibold text-xs"
              >
                Cancel
              </button>
              <button
                disabled
                className="flex items-center justify-center bg-blue-500 disabled:opacity-30 h-6 w-14 rounded text-white font-semibold text-xs"
              >
                Next
              </button>
            </div>
          </div> */}
        </div>
      </div>
    </>
  );
}

export default VideoUpload;
