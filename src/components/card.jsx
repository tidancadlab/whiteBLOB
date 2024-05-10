import { Link } from 'react-router-dom';
import localThumbnail from 'asset/image/BG.png';
import logo from 'asset/image/LOGO_314p.png'

function Card({ videoId, thumbnail, title }) {
  return videoId ? (
    <Link to={'/watch/' + videoId} className=" shad w-full min-w-[300px] snap-center rounded-lg bg-white text-black shadow-2xl sm:w-80">
      <div
        style={{ backgroundImage: `url(${thumbnail ?? logo})` }}
        className={`flex aspect-video w-full items-start justify-end rounded-t-md bg-contain bg-scroll bg-center p-2
                duration-200 ease-in-out sm:hover:scale-105`}>
        <p className="bg-white px-2 py-0.5 rounded-lg opacity-70 font-bold">Movie</p>
      </div>
      <div className="flex gap-1 p-2">
        <div className="min-w-fit">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-10 w-10">
            <path
              fillRule="evenodd"
              d="M18.685 19.097A9.723 9.723 0 0 0 21.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 0 0 3.065 7.097A9.716 9.716 0 0 0 12 21.75a9.716 9.716 0 0 0 6.685-2.653Zm-12.54-1.285A7.486 7.486 0 0 1 12 15a7.486 7.486 0 0 1 5.855 2.812A8.224 8.224 0 0 1 12 20.25a8.224 8.224 0 0 1-5.855-2.438ZM15.75 9a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <div className="">
          <h1 className="mb-0.5 line-clamp-2 text-xl font-medium leading-6">Untitled</h1>
          <p className="line-clamp-1 text-lg font-normal capitalize leading-5 text-gray-700">{title}</p>
        </div>
      </div>
    </Link>
  ) : (
    <div
      style={{ backgroundImage: `url(${localThumbnail})` }}
      className={`flex aspect-[12/16] w-[100px] min-w-[136px]  items-end rounded-md
             border border-white bg-cover text-white`}>
      <p className="mb-1.5 ml-1 overflow-hidden text-ellipsis whitespace-nowrap text-xs font-semibold">Title Name</p>
    </div>
  );
}

export default Card;
