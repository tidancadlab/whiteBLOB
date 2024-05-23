import { useContext, useEffect, useState } from 'react';
import { URL } from 'configuration';
import { StorageContext } from 'storage';
import { apiStateStatus } from 'utilities';

import Card from 'components/card';
import { NoInternet } from 'components/no-internet';

function HomePage() {
  const { allVideoList, setAllVideoList, isOnline } = useContext(StorageContext);

  const [apiStatus, setApiStatus] = useState(apiStateStatus.initial);

  let token = window.localStorage.getItem('token');

  const getVideos = async () => {
    setApiStatus(apiStateStatus.pending);
    try {
      const response = await fetch(URL.API_BASE_URL.WHITE_BLOB + 'api/video', { headers: { authorization: `bearer ${token}` } });
      const data = await response.json();
      if (response.ok) {
        setApiStatus(apiStateStatus.resolved);
        setAllVideoList(data.video);
      } else {
        setApiStatus(apiStateStatus.rejected);
      }
    } catch (error) {
      setApiStatus(apiStateStatus.rejected);
      console.error(error);
    }
  };

  useEffect(() => {
    getVideos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!isOnline) return <NoInternet />;

  if (apiStatus === apiStateStatus.pending) {
    return (
      <div className="flex w-full grow items-center justify-center text-xl font-extrabold text-gray-950 sm:text-7xl">
        <p className="animate-pulse text-[80%]">Loading...</p>
      </div>
    );
  }

  if (apiStatus === apiStateStatus.rejected) {
    return (
      <div className="flex w-full grow items-center justify-center text-xl font-extrabold text-red-950 sm:text-7xl">
        <p className="text-center text-[80%]">video not found</p>
      </div>
    );
  }

  return (
    <div className="relative grow bg-black pb-20 text-white">
      <div className="relative grid grow grid-cols-1 gap-4 self-stretch overflow-hidden p-4 py-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
        {allVideoList.map((v) => (
          <Card videoId={v.id} url={v.video_url} isPlayerCard thumbnail={v.thumbnails[0]?.url} title={v.full_name} key={v.id} />
        ))}
      </div>
    </div>
  );
}

export default HomePage;
