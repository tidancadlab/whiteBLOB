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
  const [hlsData, setHlsData] = useState({ level: [], currentLevel: 0 });
  const [showControls, setShowControls] = useState(false);
  const [audioTrack, setAudioTrack] = useState({ track: [], current: 0 });
  const [mediaContainer, setMediaContainer] = useState({ playing: false, seeking: false, isFullScreen: false });
  const [videoUrl, setVideoUrl] = useState(null);

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
    onRestAbortController();

    hls.current = new Hls({ maxBufferSize: 60, backBufferLength: 60, lowLatencyMode: true });

    const getVideoUrl = async () => {
      setApiStatus(apiStateStatus.pending);
      try {
        const response = await protectedApi('api/video/player/' + id, {
          signal: abortRequest.signal,
        });

        if (response.status === 200) {
          setVideoUrl(response.data.data.url);
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
  }, [id]);

  useEffect(() => {
    if (videoUrl) {
      hls.current.attachMedia(player.current);
      hls.current.loadSource(videoUrl);

      hls.current.once(Hls.Events.MANIFEST_PARSED, (event, data) => {
        if (!isPlayer) {
          player.current.muted = 'muted';
        }

        setHlsData({ level: hls.current.levels, currentLevel: hls.current.nextLevel });
        setAudioTrack({ track: data.audioTracks, current: hls.current.audioTrack });

        if (!player.current?.paused) {
          player.current.play();
        }
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

      if (isPlayer) {
        document.addEventListener('keydown', (e) => {
          e.preventDefault();
          const videoPlayer = player.current;
          if (!videoPlayer || e.target.tagName === 'VIDEO' || videoPlayer?.readyState < videoPlayer?.HAVE_FUTURE_DATA) return;
          if (e.code === 'Space') {
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
  }, [videoUrl]);

  const onShowControllers = () => {
    setShowControls(true);
    clearTimeout(controllerTimerId);
    controllerTimerId = null;
    controllerTimerId = setTimeout(() => {
      setShowControls(false);
    }, 3000);
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
      {videoUrl && (
        <div id="screen" className="relative">
          <div
            onMouseMove={onShowControllers}
            onTouchStart={onShowControllers}
            // onMouseLeave={onHideController}
            ref={mediaOverlay}
            className="group relative aspect-video max-h-[90vh] w-full ">
            <video autoPlay ref={player} style={{ maxHeight: `${maxHeight}px` }} className="h-full w-full bg-black outline-none sm:rounded-lg"></video>
            {isPlayer && (
              <PlayerControls
                showControls={showControls}
                audioTrack={audioTrack}
                hls={hls}
                hlsData={hlsData}
                setHlsData={setHlsData}
                mediaOverlay={mediaOverlay}
                player={player}
                videoUrl={videoUrl}
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
