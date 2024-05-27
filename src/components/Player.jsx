import React, { useEffect, useState, useRef } from 'react';
import { apiStateStatus } from 'utilities';
import Hls from 'hls.js';

import { URL } from 'configuration';
import PlayerControls from 'pages/player/components/controls';

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

    hls.current = new Hls({ maxBufferSize: 5, backBufferLength: 5, lowLatencyMode: true });

    const getVideoUrl = async () => {
      setApiStatus(apiStateStatus.pending);
      try {
        const response = await fetch(URL.API_BASE_URL.WHITE_BLOB + 'api/video/player/' + id, {
          method: 'GET',
          headers: {
            authorization: 'bearer ' + window.localStorage.getItem('token'),
          },
          signal: abortRequest.signal,
        });

        if (response.ok) {
          const result = await response.json();
          setVideoUrl(result.data.url);
          if (isPlayer) {
            setVideoMetadata(result.data);
          }

          setApiStatus(apiStateStatus.resolved);
        } else {
          setApiStatus(apiStateStatus.rejected);
        }
      } catch (error) {
        if (error === 'cancel') return;
        setApiStatus(apiStateStatus.rejected);
      }
    };

    getVideoUrl();

    return () => {
      hls.current?.destroy();
      abortRequest.abort('cancel');
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
        setHlsData((prev) => ({ ...prev, currentLevel: data.level }));
      });

      hls.current.on(Hls.Events.LEVEL_SWITCHING, (e, data) => {
        setHlsData((prev) => ({ ...prev, nextLevel: data.level, currentLevel: data.level }));
      });

      hls.current.on(Hls.Events.AUDIO_TRACK_SWITCHING, (e, data) => {
        setAudioTrack((previous) => ({ ...previous, current: data.id }));
      });

      if (isPlayer) {
        document.addEventListener('keypress', (e) => {
          e.preventDefault();
          const videoPlayer = player.current;
          if (!videoPlayer || e.target.tagName === 'VIDEO' || videoPlayer?.readyState < videoPlayer?.HAVE_FUTURE_DATA) return;
          if (e.code === 'Space') {
            if (videoPlayer?.paused) {
              console.log(videoPlayer?.paused);
              videoPlayer?.play();
            } else {
              videoPlayer?.pause();
            }
          }
        });
      }

      // document.addEventListener('fullscreenchange', (e) => {
      //   setMediaContainer((prev) => ({ ...prev, isFullScreen: !prev.isFullScreen }));
      // });
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

  const onHideController = () => {
    clearTimeout(controllerTimerId);
    setShowControls(false);
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
        <div
          onMouseMove={onShowControllers}
          onTouchStart={onShowControllers}
          onMouseLeave={onHideController}
          ref={mediaOverlay}
          className="group relative aspect-video max-h-[90vh]  w-full ">
          <video
            autoPlay
            ref={player}
            controls
            style={{ maxHeight: `${maxHeight}px` }}
            className="h-full w-full bg-black outline-none sm:rounded-lg"></video>
          {showControls && isPlayer && (
            <PlayerControls
              audioTrack={audioTrack}
              hls={hls}
              hlsData={hlsData}
              mediaOverlay={mediaOverlay}
              player={player}
              videoUrl={videoUrl}
              mediaContainer={mediaContainer}
            />
          )}
        </div>
      )}
    </>
  );
}

export default Player;
