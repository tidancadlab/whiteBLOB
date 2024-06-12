import React, { useEffect, useState, useRef } from 'react';
import { apiStateStatus } from 'utilities';
import Hls from 'hls.js';

import PlayerControls from 'pages/player/components/controls';
import protectedApi from 'api/protected.api';

let abortRequest = new AbortController();

const onRestAbortController = () => {
  abortRequest = new AbortController();
};

let controllerTimerId = null;

function Player({ id, isPlayer, maxHeight, setVideoMetadata }) {
  const [apiStatus, setApiStatus] = useState(apiStateStatus.initial);
  const [showControls, setShowControls] = useState(true);
  const [hlsData, setHlsData] = useState({ level: [], currentLevel: 0 });
  const [audioTrack, setAudioTrack] = useState({ track: [], current: 0 });
  const [isPlaying, setIsPlaying] = useState('waiting');
  const [playerData, setPlayerData] = useState({
    currentTime: 0,
    duration: 0,
    volume: 0,
  });
  const [mediaContainer, setMediaContainer] = useState({ playing: false, seeking: false, isFullScreen: false });
  const [videoMetaData, setVideoMetaData] = useState(null);

  /**
   * @type {{current: HTMLVideoElement}}
   */
  const player = useRef(null);

  /**
   * @type {{current: HTMLDivElement}}
   */
  const mediaOverlay = useRef(null);

  /**
   * @type {{current: Hls}}
   */
  const hls = useRef(null);

  useEffect(() => {
    setPlayerData({
      currentTime: 0,
      duration: 0,
      volume: 0,
    });
    const token = window.localStorage.getItem('token');
    onRestAbortController();

    hls.current = new Hls({
      xhrSetup: (xhr, url) => {
        xhr.setRequestHeader('authorization', `bearer ` + token);
      },
      enableWorker: true,
      lowLatencyMode: true,
      backBufferLength: 90,
    });

    const getVideoUrl = async () => {
      setApiStatus(apiStateStatus.pending);
      try {
        const response = await protectedApi('api/video/player/' + id, {
          signal: abortRequest.signal,
        });

        if (response.status === 200) {
          setVideoMetaData(response.data.data);
          document.title = 'whiteBLOB | ' + response.data.data.title;
          if (isPlayer) {
            setVideoMetadata(response.data.data);
          }

          setApiStatus(apiStateStatus.resolved);
        } else {
          setApiStatus(apiStateStatus.rejected);
        }
      } catch (error) {
        if (error.message === 'canceled') return;
        console.log(error);
        setApiStatus(apiStateStatus.rejected);
      }
    };

    getVideoUrl();

    return () => {
      hls.current?.destroy();
      abortRequest.abort('cancel');
      document.title = 'whiteBLOB';
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
    if (videoMetaData) {
      hls.current.attachMedia(player.current);
      hls.current.loadSource(videoMetaData.url);

      hls.current.once(Hls.Events.MANIFEST_PARSED, (event, data) => {
        player.current.poster = videoMetaData.thumbnail;
        setHlsData({ level: hls.current.levels, currentLevel: hls.current.nextLevel });
        setAudioTrack({ track: data.audioTracks, current: hls.current.audioTrack });

        player.current.addEventListener('loadedmetadata', (e) => {
          setPlayerData((previous) => ({ ...previous, duration: player.current.duration, volume: player.current.volume }));
        });
      });

      hls.current.on(Hls.Events.LEVEL_SWITCHED, (e, data) => {
        setHlsData((prev) => ({ ...prev, currentLevel: data.level, autoLevelEnabled: hls.current.autoLevelEnabled }));
      });

      hls.current.on(Hls.Events.LEVEL_SWITCHING, (e, data) => {
        setHlsData((prev) => ({ ...prev, nextLevel: data.level, currentLevel: data.level, autoLevelEnabled: hls.current.autoLevelEnabled }));
      });

      hls.current.on(Hls.Events.AUDIO_TRACK_SWITCHING, (e, data) => {
        setAudioTrack((previous) => ({ ...previous, current: data.id }));
      });

      hls.current.on(Hls.Events.BUFFER_APPENDED, (e, data) => {
        setPlayerData((previous) => ({ ...previous, timeRanges: data.timeRanges }));
      });

      player.current.addEventListener('loadeddata', () => {
        player.current.play();
        setIsPlaying(player.current.paused ? 'pause' : 'playing');
      });

      player.current.addEventListener('playing', (e) => {
        setIsPlaying('playing');
      });

      player.current.addEventListener('pause', (e) => {
        setIsPlaying('pause');
      });

      player.current.addEventListener('waiting', (e) => {
        setIsPlaying('waiting');
      });

      window.addEventListener('keydown', function (e) {
        if (e.code === 'Space') {
          document.body.style.overflow = 'hidden';
        }
      });
      window.addEventListener('keyup', function (e) {
        if (e.code === 'Space') {
          document.body.style.overflow = 'auto';
        }
      });

      if (isPlayer) {
        document.addEventListener('keyup', (e) => {
          if (e.code === 'Space') {
            const videoPlayer = player.current;
            if (!videoPlayer || e.target.tagName === 'VIDEO' || videoPlayer?.readyState < videoPlayer?.HAVE_FUTURE_DATA) return;

            if (videoPlayer?.paused) {
              videoPlayer?.play();
            } else {
              videoPlayer?.pause();
            }
          }
          return false;
        });
      }

      document.addEventListener('fullscreenchange', (e) => {
        if (!player.current) return;
        setMediaContainer((prev) => ({ ...prev, isFullScreen: !prev.isFullScreen }));
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [videoMetaData?.url]);

  const onShowControllers = () => {
    setShowControls(true);
    clearTimeout(controllerTimerId);
    controllerTimerId = null;
    controllerTimerId = setTimeout(() => {
      setShowControls(false);
    }, 5000);
  };

  if (apiStatus === apiStateStatus.pending) {
    return (
      <div className="flex aspect-video h-full max-h-[80vh] w-full items-center justify-center bg-gray-800 text-xl font-extrabold text-gray-950 sm:text-7xl">
        <p className="animate-pulse text-[80%]">Loading...</p>
      </div>
    );
  }

  if (apiStatus === apiStateStatus.rejected) {
    return (
      <div className="flex aspect-video max-h-[80vh] w-full items-center justify-center bg-red-800 text-xl font-extrabold text-red-950 sm:text-7xl">
        <p className="text-center text-[80%]">video not found</p>
      </div>
    );
  }

  return (
    <>
      {videoMetaData && (
        <div id="screen" className="relative">
          <div onMouseMove={onShowControllers} onClick={onShowControllers} ref={mediaOverlay} className="group relative aspect-video max-h-[90vh] w-full ">
            <video
              muted="muted"
              autoPlay
              ref={player}
              style={{ maxHeight: `${maxHeight}px` }}
              className="h-full w-full cursor-none bg-black outline-none sm:rounded-lg"></video>
            {(showControls || isPlaying !== 'playing') && (
              <PlayerControls
                isPlayer={isPlayer}
                isPlaying={isPlaying}
                playerData={playerData}
                setPlayerData={setPlayerData}
                audioTrack={audioTrack}
                hls={hls}
                hlsData={hlsData}
                mediaOverlay={mediaOverlay}
                player={player}
                videoUrl={videoMetaData.url}
                mediaContainer={mediaContainer}
              />
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default Player;
