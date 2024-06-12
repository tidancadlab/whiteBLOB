import { useContext, useEffect, useState } from 'react';
import { StorageContext } from 'storage';

import Player from 'components/Player';
import MovieContainer from 'components/movieContainer';
import { NoInternet } from 'components/no-internet';
import { useParams } from 'react-router-dom';

function shuffle(array) {
  let currentIndex = array.length;

  while (currentIndex !== 0) {
    let randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
  }
}

function PlayerPage() {
  let { allVideoList, isOnline } = useContext(StorageContext);
  const [videoMetadata, setVideoMetadata] = useState({});
  const { id } = useParams();

  shuffle(allVideoList);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    allVideoList = allVideoList.filter((value) => value.id !== id);
  }, [allVideoList]);

  if (!isOnline) {
    return <NoInternet />;
  }

  const MoreRecommendedVideos = () => {
    if (allVideoList.length <= 0) {
      return (
        <ul className=" scroll_style flex gap-3 overflow-x-scroll">
          {[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0].map((v, i) => (
            <li key={i} className="aspect-video h-32 animate-pulse rounded bg-gray-800"></li>
          ))}
        </ul>
      );
    }
    return <MovieContainer data={allVideoList} className="scroll_style  grid h-52 grid-flow-col grid-rows-1 overflow-x-auto py-10 lg:h-64" />;
  };
  return (
    <div className="flex grow flex-col items-center justify-start bg-black text-white">
      <div className="self-stretch">
        <Player id={id} isPlayer setVideoMetadata={setVideoMetadata} />
        <div>
          {videoMetadata.title ? (
            <p className="m-4 line-clamp-1 self-start font-bold sm:text-3xl">{videoMetadata.title}</p>
          ) : (
            <p className="mt-4 h-10 rounded-md bg-gray-800"></p>
          )}
        </div>
      </div>
      <div className="max-h-[50vh] w-full self-start overflow-y-auto sm:max-h-full">
        <div className="m-4 mb-1 self-start ">
          <h1 className="font-bold sm:mb-4 sm:text-3xl">About Video</h1>
          {videoMetadata.description ? (
            <p className="line-clamp-6 text-gray-400">{videoMetadata.description}</p>
          ) : (
            <p className="h-32 rounded-md bg-gray-800"></p>
          )}
          {videoMetadata.video_created_at && (
            <div className="text-sm\ mt-4">
              <p>- Praveen Kumar ({new Date(videoMetadata?.video_created_at).toDateString()})</p>
            </div>
          )}
        </div>
        <h1 className="m-4 mb-1 self-start font-bold sm:mb-4 sm:text-3xl">More Videos</h1>
        <div className="mx-4 mb-4 w-[calc(100%-32px)] self-start">
          <MoreRecommendedVideos />
        </div>
      </div>
    </div>
  );
}

export default PlayerPage;
