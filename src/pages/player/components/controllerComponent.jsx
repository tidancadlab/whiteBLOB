import { useState } from 'react';
import { FaPlay, FaPause } from 'react-icons/fa6';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import { HiMiniSpeakerWave, HiMiniSpeakerXMark } from 'react-icons/hi2';
import languageObject from 'asset/json/iso-636-3.json';
import { minToTime } from 'utilities';
let volumeShowTimerId = null;

export const RenderPlayPauseButton = ({ isPlaying, handlePlay, handlePause }) => (
  <div className="">
    {isPlaying === 'waiting' ? (
      <h1 className="flex w-full items-center justify-center opacity-30 hover:opacity-100">
        <AiOutlineLoading3Quarters size={120} className="animate-spin" />
      </h1>
    ) : !isPlaying ? (
      <button onClick={handlePlay} className="flex w-full items-center justify-center opacity-30 hover:opacity-100">
        <FaPlay size={120} />
      </button>
    ) : (
      <button onClick={handlePause} className="flex w-full items-center justify-center opacity-30 hover:opacity-100">
        <FaPause size={120} />
      </button>
    )}
  </div>
);

export const RenderPopupTime = ({ left, time }) => {
  return (
    <div style={{ left: `${left}px` }} className="absolute -top-10 z-50 rounded-md bg-white px-2 py-1 text-black">
      {minToTime(time)}
    </div>
  );
};

export const RenderSeekBar = ({ completedPercent, duration, handleSeek }) => {
  // const [timerLeft, setTimerLeft] = useState({ left: 0, time: 0 });
  return (
    <div className="absolute bottom-12 w-full px-4">
      {/* <RenderPopupTime {...timerLeft} /> */}
      <div className="relative h-2 w-full">
        <input
          // onMouseMove={(e) => {
          //   setTimerLeft((pre) => ({ ...pre, left: e.clientX - 20, time: ((e.clientX -14) / e.target.clientWidth) * duration }));
          // }}
          type="range"
          className="seek-track absolute top-1/2 z-20 w-full -translate-y-1/2 bg-transparent outline-none"
          min={0}
          max={1000}
          value={completedPercent * 1000 || 0}
          onChange={handleSeek}
        />
        <div style={{ width: `${completedPercent * 100}%` }} className="absolute top-1/2 z-10 h-1 -translate-y-1/2 rounded-lg bg-red-500"></div>
        <div className="absolute top-1/2 h-1 w-full -translate-y-1/2 rounded-md bg-white/50"></div>
      </div>
    </div>
  );
};

export const RenderPlayerSettingCard = ({ showLevels, setShowLevels, audioTrack, hls, hlsData, setHlsData }) => (
  <div
    aria-disabled={!showLevels}
    onBlur={() => setShowLevels(false)}
    tabIndex="0"
    className="divide-b absolute bottom-20 right-4 flex divide-x-2 divide-green-500 rounded-md bg-black text-white outline outline-green-500 duration-500 ease-in-out aria-disabled:hidden">
    {audioTrack.track.length > 1 && (
      <div className="">
        <h1 className="mb-2 bg-green-500 py-1 text-center font-bold text-black">Audio</h1>
        {audioTrack.track?.map((audio) => (
          <div key={audio.id} aria-checked={audio.id === hls.current.audioTrack} className="px-2 aria-checked:bg-red-500">
            <input
              type="radio"
              name="audio"
              id={'audio' + audio.id}
              data-id={audio.id}
              hidden
              className="group peer"
              onChange={(e) => {
                hls.current.audioTrack = parseInt(e.target.dataset.id, 10);
              }}
            />
            <label htmlFor={'audio' + audio.id} className="cursor-pointer px-4 hover:text-green-300">
              {languageObject[audio.lang]}
            </label>
          </div>
        ))}
      </div>
    )}
    <div id="levels" value={hlsData?.currentLevel} className="">
      <h1 className="mb-2 bg-green-500 px-4 py-1 text-center font-bold text-black">Quality</h1>
      <div aria-checked={hlsData.autoLevelEnabled} className="aria-checked:bg-red-500">
        <input
          type="radio"
          name="levels"
          value={parseInt(-1, 10)}
          id={parseInt(-1, 10)}
          className="peer"
          onChange={(e) => {
            hls.current.nextLevel = parseInt(e.target.id, 10);
            setHlsData((pre) => ({ ...pre, autoLevelEnabled: true }));
          }}
          hidden
        />
        <label htmlFor="-1" className="px-4 pt-2 hover:text-green-300">
          Auto
        </label>
      </div>
      {hlsData.level?.map((v, i) => (
        <div key={i} aria-checked={!hlsData.autoLevelEnabled && i === hlsData.nextLevel} className="aria-checked:bg-red-500">
          <input
            type="radio"
            key={i}
            name="levels"
            id={i}
            hidden
            className="group/check peer"
            onChange={(e) => {
              hls.current.nextLevel = parseInt(e.target.id, 10);
              setHlsData((pre) => ({ ...pre, autoLevelEnabled: false }));
            }}
          />
          <label htmlFor={i} className="cursor-pointer px-4 hover:text-green-300">
            {v.height}p
          </label>
        </div>
      ))}
    </div>
  </div>
);

export const RenderVolume = ({ volume, handleVolumeUpdate }) => {
  const [showVolume, setShowVolume] = useState(false);
  const [lastVolume, setLastVolume] = useState(volume);

  const handleShowVolume = () => {
    setShowVolume(true);
    if (volumeShowTimerId) {
      clearTimeout(volumeShowTimerId);
    }
    volumeShowTimerId = setTimeout(() => {
      setShowVolume(false);
    }, 3000);
  };

  return (
    <div className="flex items-center gap-1" onMouseMove={handleShowVolume}>
      <button
        onClick={() => {
          if (volume <= 0) {
            handleVolumeUpdate(lastVolume);
          } else {
            setLastVolume(volume);
            handleVolumeUpdate(0);
          }
        }}>
        {volume <= 0 ? <HiMiniSpeakerXMark size={22} /> : <HiMiniSpeakerWave size={22} />}
      </button>
      <div aria-hidden={!showVolume} className="flex h-1 w-16 items-center duration-300 ease-in-out aria-hidden:w-0">
        <input
          aria-hidden={!showVolume}
          type="range"
          value={volume * 100}
          className="h-1 w-full rounded-lg duration-300 ease-out aria-hidden:opacity-0"
          min={0}
          max={100}
          onChange={handleVolumeUpdate}
        />
      </div>
    </div>
  );
};

export const RenderTimer = ({ currentTime, duration }) => (
  <p>
    {minToTime(currentTime)} / {minToTime(duration)}
  </p>
);
