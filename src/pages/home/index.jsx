import { useContext, useEffect, useState } from 'react';
import { StorageContext } from 'storage';
import { apiStateStatus } from 'utilities';

import Card from 'components/card';
import { NoInternet } from 'components/no-internet';
import { useSearchParams } from 'react-router-dom';
import protectedApi from 'api/protected.api';

const cacheVideoApiJsonData = {};

function HomePage() {
  let { isOnline } = useContext(StorageContext);

  const [apiStatus, setApiStatus] = useState(apiStateStatus.initial);
  const [alertMessage, setAlertMessage] = useState('');
  let [allVideoList, setAllVideoList] = useState([]);
  const [categories, setCategories] = useState([]);
  // eslint-disable-next-line
  const [search, setSearch] = useSearchParams();

  const getVideos = async () => {
    setApiStatus(apiStateStatus.pending);
    if (cacheVideoApiJsonData['api/video']) {
      setAllVideoList(cacheVideoApiJsonData['api/video']);
      setApiStatus(apiStateStatus.resolved);
    }
    try {
      const response = await protectedApi('api/video');
      if (response.status === 200) {
        setApiStatus(apiStateStatus.resolved);
        setAllVideoList(response.data.videos);
        cacheVideoApiJsonData['api/video'] = response.data.videos;
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

  useEffect(() => {
    if (allVideoList.length <= 0) return;
    setCategories(
      allVideoList.reduce((list, item) => {
        if (list.includes(item.category?.toLowerCase())) {
          return list;
        }
        return [...list, item.category?.toLowerCase()];
      }, []),
    );
  }, [allVideoList]);

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
      {categories?.sort().map((category) => (
        <div key={category}>
          <h1 className="-mb-4 ml-4 mt-10 text-xl font-bold uppercase first:mt-2">{category}</h1>
          <div className="relative m-auto grid grow grid-cols-1 gap-4 self-stretch overflow-hidden p-4 py-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4">
            {allVideoList
              .filter((v) => v.category.toLowerCase() === category)
              .map((v) => (
                <Card videoId={v.id} {...v} url={v.video_url} isPlayerCard thumbnail={v.thumbnails[0]?.url} title={v.title} key={v.id} />
              ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default HomePage;
