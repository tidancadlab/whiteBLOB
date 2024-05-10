import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { PATH } from '../config';
import Hls from 'hls.js';
import logo from '../images/LOGO_314p.png';

function Player() {
  const [hlsData, setHlsData] = useState({ level: [], currentLevel: 0 });
  const [mediaContainer, setMediaContainer] = useState({ playing: false, seeking: false, isFullScreen: false });
  const [showLevels, setShowLevels] = useState(false);
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
  const { id } = useParams();

  useEffect(() => {
    hls.current = new Hls({ maxBufferSize: 5 });

    const getVideoUrl = async () => {
      try {
        const response = await fetch(PATH.API_PATH + 'api/video/player/' + id, {
          method: 'GET',
          headers: {
            authorization: 'bearer ' + window.localStorage.getItem('token'),
          },
        });

        if (response.ok) {
          const result = await response.json();
          setVideoUrl(result.data.url);
        }
      } catch (error) {
        console.error(error);
      }
    };

    getVideoUrl();

    return () => {
      if (hls.current) {
        hls.current.destroy();
      }
    };
  }, [id]);

  useEffect(() => {
    if (videoUrl) {
      hls.current.loadSource(videoUrl);
      hls.current.attachMedia(player.current);
      hls.current.on(Hls.Events.MEDIA_ATTACHED, function (e, data) {
        player.current.muted = true;
        player.current.play();
        player.current.playing = true;
      });
      hls.current.once(Hls.Events.MANIFEST_PARSED, (event, data) => {
        setHlsData({ level: hls.current.levels, currentLevel: hls.current.nextLevel });
      });
      hls.current.on(Hls.Events.LEVEL_SWITCHED, (e, data) => {
        setHlsData((prev) => ({ ...prev, currentLevel: data.level }));
      });
      hls.current.on(Hls.Events.LEVEL_SWITCHING, (e, data) => {
        setHlsData((prev) => ({ ...prev, nextLevel: data.level, currentLevel: data.level }));
      });
      window.player = player.current;
      document.addEventListener('fullscreenchange', (e) => {
        console.log(e.target)
        setMediaContainer((prev) => ({ ...prev, isFullScreen: !prev.isFullScreen }));
      });
    }
  }, [videoUrl]);
  const onFullScreen = () => {
    if (mediaContainer.isFullScreen) {
      document.exitFullscreen();
    } else {
      mediaOverlay.current.requestFullscreen();
    }
  };
  return (
    <>
      <div className="mb-4 lg:px-4">
        <div className="max-h-[90vh]"></div>
      </div>
      {videoUrl && (
        <div ref={mediaOverlay} className="group relative aspect-video max-h-[calc(100vh_-64px)] w-full lg:max-w-screen-md">
          <video
            disablePictureInPicture
            controlsList="nodownload noplaybackrate nofullscreen"
            autoPlay={hlsData.level?.length > 0}
            ref={player}
            controls
            className="h-full w-full bg-gray-900"></video>
          <div className="absolute top-0 flex w-full justify-end bg-gradient-to-b from-black/70 from-0% to-black/10 to-100% p-4 text-xs text-white opacity-0 duration-300 ease-in group-hover:opacity-100 lg:text-base">
            <button onClick={() => setShowLevels((prev) => !prev)} className="relative mr-6">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6">
                <path
                  fillRule="evenodd"
                  d="M11.078 2.25c-.917 0-1.699.663-1.85 1.567L9.05 4.889c-.02.12-.115.26-.297.348a7.493 7.493 0 0 0-.986.57c-.166.115-.334.126-.45.083L6.3 5.508a1.875 1.875 0 0 0-2.282.819l-.922 1.597a1.875 1.875 0 0 0 .432 2.385l.84.692c.095.078.17.229.154.43a7.598 7.598 0 0 0 0 1.139c.015.2-.059.352-.153.43l-.841.692a1.875 1.875 0 0 0-.432 2.385l.922 1.597a1.875 1.875 0 0 0 2.282.818l1.019-.382c.115-.043.283-.031.45.082.312.214.641.405.985.57.182.088.277.228.297.35l.178 1.071c.151.904.933 1.567 1.85 1.567h1.844c.916 0 1.699-.663 1.85-1.567l.178-1.072c.02-.12.114-.26.297-.349.344-.165.673-.356.985-.57.167-.114.335-.125.45-.082l1.02.382a1.875 1.875 0 0 0 2.28-.819l.923-1.597a1.875 1.875 0 0 0-.432-2.385l-.84-.692c-.095-.078-.17-.229-.154-.43a7.614 7.614 0 0 0 0-1.139c-.016-.2.059-.352.153-.43l.84-.692c.708-.582.891-1.59.433-2.385l-.922-1.597a1.875 1.875 0 0 0-2.282-.818l-1.02.382c-.114.043-.282.031-.449-.083a7.49 7.49 0 0 0-.985-.57c-.183-.087-.277-.227-.297-.348l-.179-1.072a1.875 1.875 0 0 0-1.85-1.567h-1.843ZM12 15.75a3.75 3.75 0 1 0 0-7.5 3.75 3.75 0 0 0 0 7.5Z"
                  clipRule="evenodd"
                />
              </svg>
              <p className="absolute -top-2 left-4 font-bold text-red-500">{hlsData.level[hlsData.currentLevel]?.height}</p>
            </button>
            <button onClick={onFullScreen}>
              {mediaContainer.isFullScreen ? (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6">
                  <path
                    fillRule="evenodd"
                    d="M3.22 3.22a.75.75 0 0 1 1.06 0l3.97 3.97V4.5a.75.75 0 0 1 1.5 0V9a.75.75 0 0 1-.75.75H4.5a.75.75 0 0 1 0-1.5h2.69L3.22 4.28a.75.75 0 0 1 0-1.06Zm17.56 0a.75.75 0 0 1 0 1.06l-3.97 3.97h2.69a.75.75 0 0 1 0 1.5H15a.75.75 0 0 1-.75-.75V4.5a.75.75 0 0 1 1.5 0v2.69l3.97-3.97a.75.75 0 0 1 1.06 0ZM3.75 15a.75.75 0 0 1 .75-.75H9a.75.75 0 0 1 .75.75v4.5a.75.75 0 0 1-1.5 0v-2.69l-3.97 3.97a.75.75 0 0 1-1.06-1.06l3.97-3.97H4.5a.75.75 0 0 1-.75-.75Zm10.5 0a.75.75 0 0 1 .75-.75h4.5a.75.75 0 0 1 0 1.5h-2.69l3.97 3.97a.75.75 0 1 1-1.06 1.06l-3.97-3.97v2.69a.75.75 0 0 1-1.5 0V15Z"
                    clipRule="evenodd"
                  />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6">
                  <path
                    fillRule="evenodd"
                    d="M15 3.75a.75.75 0 0 1 .75-.75h4.5a.75.75 0 0 1 .75.75v4.5a.75.75 0 0 1-1.5 0V5.56l-3.97 3.97a.75.75 0 1 1-1.06-1.06l3.97-3.97h-2.69a.75.75 0 0 1-.75-.75Zm-12 0A.75.75 0 0 1 3.75 3h4.5a.75.75 0 0 1 0 1.5H5.56l3.97 3.97a.75.75 0 0 1-1.06 1.06L4.5 5.56v2.69a.75.75 0 0 1-1.5 0v-4.5Zm11.47 11.78a.75.75 0 1 1 1.06-1.06l3.97 3.97v-2.69a.75.75 0 0 1 1.5 0v4.5a.75.75 0 0 1-.75.75h-4.5a.75.75 0 0 1 0-1.5h2.69l-3.97-3.97Zm-4.94-1.06a.75.75 0 0 1 0 1.06L5.56 19.5h2.69a.75.75 0 0 1 0 1.5h-4.5a.75.75 0 0 1-.75-.75v-4.5a.75.75 0 0 1 1.5 0v2.69l3.97-3.97a.75.75 0 0 1 1.06 0Z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </button>
            <div
              id="levels"
              value={hlsData?.currentLevel}
              aria-disabled={!showLevels}
              className="absolute top-9 h-36 overflow-y-hidden rounded-md bg-black text-white duration-500 ease-in-out aria-disabled:h-0">
              <div aria-checked={parseInt(-1, 10) === hlsData.nextLevel} className="aria-checked:bg-red-500">
                <input
                  type="radio"
                  name="levels"
                  value={parseInt(-1, 10)}
                  id={parseInt(-1, 10)}
                  className="peer"
                  onChange={(e) => {
                    hls.current.currentLevel = parseInt(e.target.id, 10);
                  }}
                  hidden
                />
                <label htmlFor="-1" className="px-4 pt-2 hover:text-green-300">
                  Auto
                </label>
              </div>
              {hlsData.level?.map((v, i) => (
                <div key={i} aria-checked={i === hlsData.nextLevel} className="aria-checked:bg-red-500">
                  <input
                    type="radio"
                    key={i}
                    name="levels"
                    id={i}
                    hidden
                    className="group/check peer"
                    onChange={(e) => {
                      hls.current.currentLevel = parseInt(e.target.id, 10);
                    }}
                  />
                  <label htmlFor={i} className="cursor-pointer px-4 hover:text-green-300">
                    {v.height}
                  </label>
                </div>
              ))}
            </div>
          </div>
          <button className="absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 opacity-0  duration-300 ease-in group-hover:opacity-100 lg:inline">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-20 w-20">
              <path
                fillRule="evenodd"
                d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm14.024-.983a1.125 1.125 0 0 1 0 1.966l-5.603 3.113A1.125 1.125 0 0 1 9 15.113V8.887c0-.857.921-1.4 1.671-.983l5.603 3.113Z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
      )}
      {/* <p>{hlsData.levelIdx}</p> */}
    </>
  );
}

export default Player;