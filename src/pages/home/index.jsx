import { useContext, useEffect, useState } from 'react';
import { URL } from 'configuration';
import { StorageContext } from 'storage';
import { apiStateStatus } from 'utilities';

import Card from 'components/card';
import { NoInternet } from 'components/no-internet';
import { useSearchParams } from 'react-router-dom';
import protectedApi from 'api/protected.api';

function HomePage() {
  let { allVideoList, setAllVideoList, isOnline } = useContext(StorageContext);

  const [apiStatus, setApiStatus] = useState(apiStateStatus.initial);
  const [alertMessage, setAlertMessage] = useState('');
  const [search, setSearch] = useSearchParams();

  const getVideos = async () => {
    setApiStatus(apiStateStatus.pending);
    try {
      const response = await protectedApi('api/video');
      if (response.status === 200) {
        setApiStatus(apiStateStatus.resolved);
        setAllVideoList(response.data.videos);
      } else {
        setApiStatus(apiStateStatus.rejected);
      }
    } catch (error) {
      setApiStatus(apiStateStatus.rejected);
      setAlertMessage(error.message);
      console.log(error);
    }
  };

  useEffect(() => {
    getVideos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  allVideoList = allVideoList.filter((v) => v.title?.toLowerCase().includes(search.get('search')?.toLowerCase() || ''));

  if (!isOnline) return <NoInternet />;

  if (apiStatus === apiStateStatus.pending) {
    return (
      <div className="flex w-full grow items-center justify-center text-xl font-extrabold text-gray-700 sm:text-7xl">
        <p className="animate-pulse text-[80%]">Loading...</p>
      </div>
    );
  }

  if (apiStatus === apiStateStatus.rejected) {
    return (
      <div className="flex w-full grow items-center justify-center text-xl font-extrabold text-red-950 sm:text-7xl">
        <p className="text-center text-[80%]">{alertMessage || 'videos not found'}</p>
      </div>
    );
  }

  if (apiStatus === apiStateStatus.resolved && allVideoList.length <= 0) {
    return (
      <div className="flex w-full grow items-center justify-center text-xl font-extrabold text-red-950 sm:text-7xl">
        <p className="text-center text-[80%]">"{search.get('search')?.trim()}" video not found</p>
      </div>
    );
  }

  return (
    <div className="relative grow bg-black pb-20 text-white">
      <div className="relative m-auto grid grow grid-cols-1 gap-4 self-stretch overflow-hidden p-4 py-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4">
        {allVideoList.map((v) => (
          <Card videoId={v.id} {...v} url={v.video_url} isPlayerCard thumbnail={v.thumbnails[0]?.url} title={v.title} key={v.id} />
        ))}
      </div>
    </div>
  );
}

export default HomePage;
