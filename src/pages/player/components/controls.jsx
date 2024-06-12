import { useState, useEffect } from 'react';

import { FaGear } from 'react-icons/fa6';
import { AiOutlineFullscreen, AiOutlineFullscreenExit, AiOutlineLoading3Quarters } from 'react-icons/ai';
import { TbRewindBackward10, TbRewindForward10 } from 'react-icons/tb';

import { RenderPlayPauseButton, RenderPlayerSettingCard, RenderSeekBar, RenderTimer, RenderVolume } from './controllerComponent';

/**
 *
 * @param {{
 * player: {current: HTMLVideoElement}
 * }}
 * @returns
 */

const PlayerControls = ({ player, ...rest }) => {
  const { mediaOverlay, hlsData, mediaContainer, playerData, setPlayerData, isPlaying, isPlayer } = rest;

  const [showLevels, setShowLevels] = useState(false);

  const handleFullScreen = () => {
    if (document.isFullScreen || document.webkitIsFullScreen) {
      document.exitFullscreen();
    } else {
      mediaOverlay.current.requestFullscreen();
    }
  };

  const handlePlay = () => {
    if (isPlaying === 'waiting') return;
    const videoPlayer = player.current;
    if (videoPlayer?.paused) {
      videoPlayer.play();
    }
  };

  const handlePause = () => {
    if (isPlaying === 'waiting') return;
    const videoPlayer = player.current;
    if (!videoPlayer?.paused) {
      videoPlayer.pause();
    }
  };

  const handleSeek = (e) => {
    const time = (e.target.value / 1000) * playerData.duration;
    player.current.currentTime = time;
    setPlayerData((previous) => ({ ...previous, currentTime: time }));
  };

  const handleForward = () => {
    player.current.currentTime += 10;
    setPlayerData((previous) => ({ ...previous, currentTime: previous.currentTime + 10 }));
  };

  const handleBackward = () => {
    player.current.currentTime -= 10;
    setPlayerData((previous) => ({ ...previous, currentTime: previous.currentTime - 10 }));
  };

  const handleVolumeUpdate = (volume) => {
    const videoPlayer = player.current;
    if (typeof volume === 'number') {
      videoPlayer.volume = volume;
    } else {
      videoPlayer.volume = volume.target.value / 100;
    }
  };

  useEffect(() => {
    if (isPlaying === 'playing') {
      handlePlay();
    }
    if (isPlaying === 'paused') {
      handlePause();
    }
    // eslint-disable-next-line
  }, [isPlaying]);

  useEffect(() => {
    const videoPlayer = player.current;

    videoPlayer.addEventListener('volumechange', (e) => {
      setPlayerData((previous) => ({ ...previous, volume: videoPlayer.volume }));
    });

    videoPlayer.addEventListener('timeupdate', (e) => {
      if (!e.target?.currentTime) return;
      setPlayerData((previous) => ({ ...previous, currentTime: e.target?.currentTime }));
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const videoPlayer = player.current;

    document.addEventListener('keydown', (e) => {
      if (!videoPlayer.currentTime) return;
      if (e.code === 'ArrowRight') {
        handleForward();
      }
      if (e.code === 'ArrowLeft') {
        handleBackward();
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!isPlayer) {
    return (
      <div
        aria-disabled={isPlaying === false || isPlaying === 'waiting'}
        className="pointer-events-auto absolute top-0 z-50 flex h-full w-full flex-col bg-gradient-to-t from-black opacity-0 duration-300 ease-in hover:opacity-100 aria-disabled:pointer-events-auto aria-disabled:opacity-100">
        <div id="playerButtonOverlay" className="flex grow items-center justify-around">
          {isPlaying === 'waiting' && (
            <h1 className="flex w-full items-center justify-center opacity-30 hover:opacity-100">
              <AiOutlineLoading3Quarters className="animate-spin text-xl" />
            </h1>
          )}
        </div>
      </div>
    );
  }

  return (
    <div
      aria-disabled={isPlaying === false || isPlaying === 'waiting'}
      className="pointer-events-auto absolute top-0 flex h-full w-full flex-col bg-gradient-to-t from-black opacity-0 duration-300 ease-in hover:opacity-100 aria-disabled:pointer-events-auto aria-disabled:opacity-100">
      <div
        id="playerButtonOverlay"
        className="flex grow items-center justify-around"
        onDoubleClick={handleFullScreen}
        onClick={(e) => {
          if (e.target.id === 'playerButtonOverlay') {
            isPlaying === 'playing' ? handlePause() : handlePlay();
          }
        }}>
        <button onClick={handleBackward} className="flex items-center justify-center opacity-30 hover:opacity-100">
          <TbRewindBackward10 className="text-3xl sm:text-7xl" />
        </button>
        <RenderPlayPauseButton handlePause={handlePause} handlePlay={handlePlay} isPlaying={isPlaying} />
        <button onClick={handleForward} className="flex items-center justify-center opacity-30 hover:opacity-100">
          <TbRewindForward10 className="text-3xl sm:text-7xl" />
        </button>
      </div>
      <RenderSeekBar handleSeek={handleSeek} completedPercent={playerData.currentTime / playerData.duration} playerData={playerData} />
      <div className="absolute bottom-3 z-20 flex w-full items-center justify-between gap-2 px-6">
        <div className="ml-2 flex grow gap-4">
          <RenderTimer {...playerData} />
          <RenderVolume handleVolumeUpdate={handleVolumeUpdate} {...playerData} />
        </div>
        <button onClick={() => setShowLevels((prev) => !prev)} id="gear" className="relative mr-6">
          <FaGear size={22} aria-checked={showLevels} className="duration-300 ease-in-out aria-checked:rotate-90" />
          <p className="absolute -top-2 left-4 font-bold text-red-500">{hlsData.level[hlsData.currentLevel]?.height}</p>
        </button>
        <button className="text-3xl outline-none" onClick={handleFullScreen}>
          {!mediaContainer.isFullScreen ? <AiOutlineFullscreen /> : <AiOutlineFullscreenExit />}
        </button>
      </div>
      <RenderPlayerSettingCard {...rest} setShowLevels={setShowLevels} showLevels={showLevels} />
    </div>
  );
};

export default PlayerControls;
