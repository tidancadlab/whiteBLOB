import { useEffect, useState } from 'react';
import Card from 'components/card';
import { PATH } from 'configuration';

function HomePage() {
  const [videos, setVideos] = useState([]);
  const [hasError, setHasError] = useState({ status: false });
  let token = window.localStorage.getItem('token');

  const getVideos = async () => {
    try {
      const response = await fetch(PATH.API_PATH + 'api/video', { headers: { authorization: `bearer ${token}` } });
      const data = await response.json();
      setHasError({ ...data, status: true });
      if (response.ok) {
        setVideos(data.video);
        const time = setTimeout(() => {
          setHasError({ status: false, ...data });
          clearTimeout(time);
        }, 5000);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getVideos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="relative m-auto grow bg-black pb-20 text-white">
      <div
        aria-expanded={hasError.status}
        aria-selected={hasError.ok}
        className="absolute -top-52 left-1/2 rounded-xl bg-red-500 px-4 py-2 text-red-900 outline delay-700 duration-1000 ease-in-out aria-expanded:top-7 aria-expanded:z-50 aria-selected:bg-green-200 aria-selected:text-green-900">
        <h1>{hasError.message}</h1>
      </div>
      <div className="flex max-w-[1480px] flex-wrap items-center gap-8 p-4">
        {videos.map((v) => (
          <Card videoId={v.id} url={v.video_url} thumbnail={v.thumbnails[0]?.url} title={v.full_name} key={v.id} />
        ))}
      </div>
    </div>
  );
}

export default HomePage;
