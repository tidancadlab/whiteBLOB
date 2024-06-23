import { twMerge } from 'tailwind-merge';
import { Link, useNavigate } from 'react-router-dom';
import { useContext, useEffect, useState } from 'react';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa6';
import { GoSortAsc, GoSortDesc, GoArrowLeft } from 'react-icons/go';

import { StorageContext } from 'storage';
import protectedApi from 'api/protected.api';
import { useUpdateSearchParams } from 'hooks';
import { Button } from 'components/form-field';
import { imageToColor } from 'pages/upload/functions';
import { apiStateStatus, hashLightColors as colors } from 'utilities';

let videoRequestTimer;
// let cancelRequest = new 

function StudioPage() {
  const [videos, setVideos] = useState([]);
  const [apiStatus, setApiStatus] = useState(apiStateStatus.initial);
  const { setStudioVideos } = useContext(StorageContext);
  const [params, setParams] = useUpdateSearchParams();
  const navigate = useNavigate();

  const orderBy = params?.orderBy || 'time_stamp';
  const order = params?.order || 'desc';
  const keyword = params?.search;
  const activeVideoId = params?.id;

  if (videos.length > 1) {
    videos.sort((a, b) => {
      if (typeof a[orderBy] === 'string' || typeof a[orderBy] === 'string') {
        return order === 'asc'
          ? a[orderBy]?.toLowerCase() < b[orderBy]?.toLowerCase()
            ? 1
            : -1
          : a[orderBy]?.toLowerCase() > b[orderBy]?.toLowerCase()
            ? 1
            : -1;
      }
      return order === 'asc' ? (a[orderBy] < b[orderBy] ? 1 : -1) : a[orderBy] > b[orderBy] ? 1 : -1;
    });
  }

  const handleOrderVideos = (name) => {
    setParams({ orderBy: name, order: order === 'asc' ? 'desc' : 'asc' });
  };

  const getVideos = async () => {
    setApiStatus(apiStateStatus.pending);
    try {
      let url = 'api/studio/videos';
      const queryParamsArray = [];
      if (keyword) {
        queryParamsArray.push('keyword=' + keyword.trim());
      }
      const queryParams = url + '?' + queryParamsArray.join('&');
      const response = await protectedApi({
        url: queryParams,
      });

      if (response.status === 200) {
        setVideos(response.data);
        setStudioVideos(response.data);
        setApiStatus(apiStateStatus.resolved);
      } else {
        setApiStatus(apiStateStatus.rejected);
      }
    } catch (error) {
      alert(error.response.data.message);
      if (error.response.status === 403) {
        return navigate('/login', { replace: true });
      }
      setApiStatus(apiStateStatus.rejected);
    }
  };

  useEffect(() => {
    clearTimeout(videoRequestTimer);
    if (apiStatus === apiStateStatus.initial) {
      getVideos();
      return;
    }
    videoRequestTimer = setTimeout(() => {
      getVideos();
    }, 1000);

    return () => {
      clearTimeout(videoRequestTimer);
    };
  }, [keyword]);

  if (apiStateStatus.initial === apiStatus || apiStateStatus.pending === apiStatus) {
    return (
      <div className="flex grow items-center justify-center">
        <img src="img/gif/animatedLogo.gif" alt="" />
      </div>
    );
  }

  if (videos.length <= 0)
    return (
      <div className="flex grow items-center justify-center">
        <h1 className="text-center text-7xl font-bold text-gray-800">Not Found</h1>
      </div>
    );

  return (
    <div className="flex grow items-stretch">
      <div className="mx-auto flex max-w-5xl grow flex-col gap-4 p-4">
        <div className=" text-sm text-white/50 hover:text-white">
          <button title="back" className="flex items-center gap-1" onClick={() => window.history.back()}>
            <GoArrowLeft /> Back
          </button>
        </div>
        <ul className="text-white">
          <li className="mb-2 hidden grid-cols-12 divide-x-2 divide-slate-700 rounded-lg bg-slate-800 font-semibold sm:grid">
            <button
              className="col-span-2 flex items-center justify-center gap-1 p-2 text-center"
              onClick={() => {
                handleOrderVideos('time_stamp');
              }}>
              {orderBy === 'time_stamp' && (order === 'desc' ? <GoSortDesc /> : <GoSortAsc />)} Date
            </button>
            <button onClick={() => handleOrderVideos('title')} className="col-span-6 flex items-center justify-center gap-1 p-2 px-4">
              {orderBy === 'title' && (order === 'desc' ? <GoSortDesc /> : <GoSortAsc />)} Title
            </button>
            <button onClick={() => handleOrderVideos('category')} className="col-span-2 flex items-center justify-center gap-1 p-2 text-center">
              {orderBy === 'category' && (order === 'desc' ? <GoSortDesc /> : <GoSortAsc />)} Category
            </button>
            <button className="col-span-2 flex items-center justify-center gap-1 p-2 text-center">
              {orderBy === 'isReleased' && (order === 'desc' ? <GoSortDesc /> : <GoSortAsc />)} Status
            </button>
          </li>
          {videos.map((v, index) => {
            let titleColor = null;
            imageToColor(v.thumbnail_url, (hashColor) => {
              titleColor = hashColor;
            });

            let videoStatus = { color: '', backgroundColor: '', status: '' };

            switch (v.status?.code) {
              case v.status ? v.status?.isError : false:
                videoStatus = { color: 'text-red-700', backgroundColor: 'bg-red-300', status: 'Error' };
                break;
              case 520:
                videoStatus = { color: 'text-green-700', backgroundColor: 'bg-green-300', status: 'Published' };
                break;
              default:
                videoStatus = { color: 'text-yellow-700', backgroundColor: 'bg-yellow-300', status: 'Pending' };
            }
            return (
              <li
                key={v.id}
                style={
                  activeVideoId === v.id || window.innerWidth <= 640
                    ? { backgroundImage: `url(${v.thumbnail_url})`, outlineColor: titleColor }
                    : { outline: 'none' }
                }
                aria-selected={activeVideoId === v.id}
                role="option"
                className="relative mb-4 rounded-lg bg-slate-900/70 bg-cover bg-center bg-blend-multiply outline sm:mb-2 sm:outline-0 ">
                <div
                  aria-busy={activeVideoId === v.id}
                  className={`flex h-full grid-cols-12 flex-col 
                  divide-slate-950 
                  rounded-lg 
                  from-black/70 
                  to-transparent to-50% 
                  p-2
                  backdrop-blur-2xl
                  duration-100 
                  ease-in-out aria-busy:divide-none 
                  aria-busy:bg-gradient-to-t 
                  aria-busy:p-4 
                  sm:grid 
                  sm:divide-x-2 
                  sm:p-0 
                  aria-busy:sm:p-6`}>
                  <p
                    role="option"
                    aria-selected={activeVideoId === v.id}
                    className={`group col-span-2 px-2 text-sm 
                    aria-selected:col-span-12 
                    aria-selected:text-start 
                    sm:p-2 
                    sm:text-center 
                    aria-selected:sm:p-0 
                    aria-selected:sm:px-4`}>
                    {new Date(v.time_stamp).toDateString().split(' ').slice(1).join(' ')}
                  </p>
                  <h1
                    role="option"
                    style={activeVideoId === v.id || window.innerWidth <= 640 ? { color: titleColor } : {}}
                    aria-selected={activeVideoId === v.id}
                    className={`sm: 
                    col-span-6 
                    line-clamp-2 
                    p-2
                    text-xl
                    aria-selected:leading-none
                    font-bold
                    capitalize 
                    aria-selected:col-span-12 
                    aria-selected:text-2xl 
                    aria-selected:font-bold 
                    sm:p-2 sm:px-4
                    sm:text-sm sm:font-normal 
                    aria-selected:sm:text-7xl`}>
                    {keyword?.length > 0
                      ? v.title
                          ?.toLowerCase()
                          .split(keyword?.trimEnd()?.toLowerCase() || '')
                          .map((s, idx, item) =>
                            idx === item.length - 1 ? (
                              s
                            ) : (
                              <span key={'tk' + idx}>
                                {s}
                                <span className="rounded bg-yellow-500 text-black">{keyword?.trim()}</span>
                              </span>
                            ),
                          )
                      : v.title || 'untitle'}
                  </h1>
                  {activeVideoId === v.id && (
                    <p className="col-span-12 mb-4 line-clamp-6 whitespace-pre-wrap px-2 text-xs opacity-50 sm:mb-8 sm:mt-4 sm:px-4 sm:text-lg">
                      {keyword?.length > 0
                        ? v.description
                            ?.toLowerCase()
                            .split(keyword?.trimEnd()?.toLowerCase() || '')
                            .map((s, idx, item) =>
                              idx === item.length - 1 ? (
                                s
                              ) : (
                                <span key={'dk' + idx}>
                                  {s}
                                  <span className="rounded bg-yellow-500 text-black">{keyword?.trim()}</span>
                                </span>
                              ),
                            )
                        : v.description}
                    </p>
                  )}
                  {activeVideoId === v.id && (
                    <div className="col-span-4 mb-2 ml-2 flex flex-wrap gap-1 sm:ml-4 sm:gap-2">
                      {v.tags &&
                        (typeof JSON.parse(v.tags) === 'string' ? JSON.parse(v.tags).split(',') : JSON.parse(v.tags)).map((tag, idx) => {
                          if (tag.length > 0) {
                            return (
                              <span
                                key={tag + idx}
                                style={{ backgroundColor: colors[(index + idx) % 20] }}
                                className="rounded-full px-3 py-0.5 sm:py-1 text-xs text-black sm:text-sm">
                                {tag.toLowerCase()}
                              </span>
                            );
                          }
                          return null;
                        })}
                    </div>
                  )}
                  {activeVideoId !== v.id && <span className="col-span-2 hidden p-2 text-center text-xs capitalize sm:block lg:text-sm">{v.category}</span>}
                  {activeVideoId !== v.id && (
                    <span className={twMerge('col-span-2 hidden p-2 text-center text-green-500 sm:block', videoStatus.color)}>{videoStatus.status}</span>
                  )}
                  <div role="option" aria-selected={activeVideoId === v.id} className="absolute right-4 top-0 flex gap-2 aria-selected:flex sm:hidden">
                    <span
                      className={twMerge(
                        'rounded-b bg-green-600 px-2 py-0.5 text-center text-xs capitalize text-black sm:px-4 sm:py-1 sm:text-base',
                        videoStatus.backgroundColor,
                      )}>
                      {videoStatus.status}
                    </span>
                    <span
                      style={titleColor ? { backgroundColor: titleColor } : {}}
                      className="rounded-b bg-stone-700 px-2 py-0.5 text-center text-xs capitalize sm:px-4 sm:py-1 sm:text-base">
                      {v.category}
                    </span>
                  </div>
                  {activeVideoId === v.id && (
                    <div className="col-span-12 flex justify-end gap-4 border-none px-6 pt-2">
                      <Button>
                        <Link to={v.id + '/edit'} className="pointer-events-auto">
                          Edit
                        </Link>
                      </Button>
                      <Button className="bg-violet-500">Private</Button>
                      <Button className="bg-red-500">Delete</Button>
                    </div>
                  )}
                  {activeVideoId !== v.id && (
                    <button
                      onClick={() => {
                        setParams({ id: v.id });
                      }}
                      className="absolute h-full w-full"></button>
                  )}
                </div>
              </li>
            );
          })}
          <li className="flex justify-end gap-2">
            <Button className="w-fit rounded bg-gray-700 px-3 py-0.5 text-center">{<FaArrowLeft />}</Button>
            <Button className="w-fit rounded bg-white px-3 py-0.5 text-center text-black">1</Button>
            <Button className="w-fit rounded bg-gray-700 px-3 py-0.5 text-center">2</Button>
            <Button className="w-fit rounded bg-gray-700 px-3 py-0.5 text-center">{<FaArrowRight />}</Button>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default StudioPage;
