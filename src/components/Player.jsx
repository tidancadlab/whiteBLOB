import React, { useEffect, useState, useRef } from 'react';
import { apiStateStatus } from 'utilities';
import Hls from 'hls.js';

import { URL } from 'configuration';
import PlayerControls from 'pages/player/components/controls';

let abortRequest = new AbortController();

const onRestAbortController = () => {
  abortRequest = new AbortController();
};

function Player({ id, isPlayer }) {
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

    hls.current = new Hls({ maxBufferSize: 5, backBufferLength: 5 });

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

      document.addEventListener('fullscreenchange', (e) => {
        setMediaContainer((prev) => ({ ...prev, isFullScreen: !prev.isFullScreen }));
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [videoUrl]);

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
          onMouseEnter={() => setShowControls(true)}
          onMouseLeave={() => setShowControls(false)}
          onTouchEnd={() => setShowControls((previous) => !previous)}
          ref={mediaOverlay}
          className="group relative aspect-video max-h-[90vh]  w-full ">
          <video
            disablePictureInPicture
            controlsList="nodownload noplaybackrate nofullscreen"
            autoPlay
            ref={player}
            controls
            className="h-full w-full bg-black sm:rounded-lg outline-none"></video>
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
