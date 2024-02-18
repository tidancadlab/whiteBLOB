import { useState } from "react";
import VideoSelect from "./SelectVideo";
import axios from "axios";

const getFileExtension = async (filename) => {
  return filename.split(".").pop();
};

function VideoUpload() {
  const [file, setFile] = useState(null);
  const [arrayChunk, setArrayChunk] = useState([]);
  const [internetSpeed, setInternetSpeed] = useState(0);
  const [chuckProgress, setChuckProgress] = useState({
    completedChunk: 0,
    totalChunk: 0.000001,
    progress: 0,
    rate: 0,
  });
  const control = new AbortController();
  const onUploadStart = async (chunks, file, ext) => {
    setChuckProgress((previous) => ({
      ...previous,
      totalChunk: chunks.length,
    }));
    const start = (chunk, size, isLast = false, id = "") => {
      const formData = new FormData();
      formData.append("id", id);
      formData.append("video", chunk);
      formData.append("extension", ext);
      formData.append("isLast", isLast);
      formData.append("name", file.name);
      axios
        .post(`${process.env.REACT_APP_SERVER_URL}/api/upload`, formData, {
          onUploadProgress: (e) => {
            setInternetSpeed(e.rate / 1024 / 1024);
            setChuckProgress((previous) => ({
              ...previous,
              ...e,
              rate: e.rate || previous.rate,
            }));
          },
          signal: control.signal,
        })
        .then((data) => {
          if (data.status === 200) {
            setChuckProgress((previous) => ({
              ...previous,
              completedChunk: previous.completedChunk + 1,
              progress: 0,
            }));
            chunks = chunks.slice(1);
            if (chunks.length > 0) {
              setArrayChunk(chunks);
              const last = chunks.length === 1;
              start(chunks[0], size, last, data.data.id);
            }
          }
        })
        .catch((err) => {
          if (
            window.confirm(
              err.message + " 😒😒😒😒 \nAre you want to stop uploading?"
            )
          ) {
            setFile(null);
            setChuckProgress({
              completedChunk: 0,
              totalChunk: 0.000001,
              progress: 0,
            });
            control.abort();
          } else {
            // Do nothing!
            start(chunks[0], file.size);
          }
        });
    };
    start(chunks[0], file.size);
  };
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
      getFileExtension(file.name).then((ext) =>
        onUploadStart(chunks, file, ext)
      );
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className="grow p-4 flex justify-center items-center">
        <div className="max-w-2xl w-full max-h-[572px] h-full bg-[#141414] rounded-2xl p-10 relative">
          <VideoSelect
            props={{
              setFile,
              handleUpload,
              file,
              arrayChunk,
              chuckProgress,
              internetSpeed,
              control,
            }}
          />
          <div
            aria-disabled={!file}
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
                  <div
                    contentEditable
                    aria-required
                    className="focus:aria-required:outline-red-500 bg-white focus:valid:outline-green-500  outline-none rounded-xl px-4 py-2 text-black"
                    type="text"
                    name=""
                    id="title"
                    placeholder="description"
                  >
                    <p>sdsfdsfsdf</p>
                  </div>
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
          </div>
        </div>
      </div>
    </>
  );
}

export default VideoUpload;
