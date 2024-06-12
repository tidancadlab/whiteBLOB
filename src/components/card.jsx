import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { twMerge } from 'tailwind-merge';

import Player from './Player';
import { minToTime } from 'utilities';

let timer = null;

function Card({ videoId, thumbnail, title, isPlayerCard, ...rest }) {
  const [isHovered, setIsHovered] = useState(false);

  /**
   * @type {{current: HTMLDivElement}}
   */

  const element = useRef();

  // Below comment code

  // const cardElement = element.current;
  // const { innerWidth, innerHeight } = window;
  // const clientWidth = cardElement?.clientWidth;
  // const clientHeight = cardElement?.clientHeight;

  // const horizontalSideAfterScale = (clientWidth * 1.25 - clientWidth) / 2;
  // const verticalSideAfterScale = (clientHeight * 1.25 - clientHeight) / 2;

  // const offsetHeight = cardElement?.offsetHeight;
  // const offsetWidth = cardElement?.offsetWidth;
  // const offsetLeft = cardElement?.offsetLeft;
  // const offsetTop = cardElement?.offsetTop;

  // const left = offsetLeft <= horizontalSideAfterScale ? horizontalSideAfterScale - 8 : 0;
  // const right = innerWidth - offsetWidth - offsetLeft <= horizontalSideAfterScale ? horizontalSideAfterScale - 8 : 0;

  // const top = offsetTop <= verticalSideAfterScale ? verticalSideAfterScale - 8 : 0;
  // const bottom = innerHeight - offsetHeight - offsetTop <= verticalSideAfterScale ? verticalSideAfterScale - 8 : 0;

  const onHover = () => {
    if (timer) return;

    timer = setTimeout(() => {
      setIsHovered((pre) => (!pre ? true : pre));
    }, 1000);
  };

  const onRemoveHover = () => {
    if (timer) {
      clearTimeout(timer);
      timer = null;
      setIsHovered(false);
    }
  };
  return (
    <Link
      ref={element}
      to={'/watch/' + videoId}
      onMouseEnter={onHover}
      onMouseLeave={onRemoveHover}
      aria-selected={isHovered && isPlayerCard}
      className="relative h-full w-full duration-200 ease-in-out hover:z-[5]">
      {isHovered && isPlayerCard ? (
        <div
          aria-checked={isHovered}
          className={twMerge(
            `group relative flex aspect-video h-full w-full flex-col rounded-md bg-cover bg-center bg-no-repeat shadow outline outline-white`,
          )}>
          <Player maxHeight={element.current?.offsetHeight} id={videoId} />
        </div>
      ) : (
        <div
          style={{ backgroundImage: `url(${thumbnail})` }}
          className={`group relative flex aspect-video h-full flex-col rounded-md bg-cover bg-center bg-no-repeat shadow `}>
          <div
            className={`absolute bottom-0 flex w-full flex-col rounded-b-lg bg-gradient-to-t from-black from-0% to-100% p-1 text-white group-hover:h-full group-hover:items-center 
        group-hover:justify-center group-hover:text-center group-hover:backdrop-blur-sm`}>
            <h1 className="mx-1 line-clamp-1 max-w-full font-bold group-hover:line-clamp-3 group-hover:text-5xl sm:text-[100%]">{title || 'title'}</h1>
          </div>
          <p className="absolute right-1 top-1 rounded bg-black/50 px-2">{minToTime(rest.duration || 0)}</p>
          <p className="absolute left-1 top-1 rounded bg-black/50 px-2">{rest.category}</p>
        </div>
      )}
    </Link>
  );
}

export default Card;
