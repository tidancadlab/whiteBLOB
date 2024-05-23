import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { twMerge } from 'tailwind-merge';

import Player from './Player';

let timer = null;

function Card({ videoId, thumbnail, title, isPlayerCard }) {
  const [isHovered, setIsHovered] = useState(false);

  /**
   * @type {{current: HTMLDivElement}}
   */

  const element = useRef();

  const cardElement = element.current;
  const { innerWidth, innerHeight } = window;
  const clientWidth = cardElement?.clientWidth;
  const clientHeight = cardElement?.clientHeight;

  const horizontalSideAfterScale = (clientWidth * 1.25 - clientWidth) / 2;
  const verticalSideAfterScale = (clientHeight * 1.25 - clientHeight) / 2;

  const offsetHeight = cardElement?.offsetHeight;
  const offsetWidth = cardElement?.offsetWidth;
  const offsetLeft = cardElement?.offsetLeft;
  const offsetTop = cardElement?.offsetTop;

  const left = offsetLeft <= horizontalSideAfterScale ? horizontalSideAfterScale - 8 : 0;
  const right = innerWidth - offsetWidth - offsetLeft <= horizontalSideAfterScale ? horizontalSideAfterScale - 8 : 0;

  const top = offsetTop <= verticalSideAfterScale ? verticalSideAfterScale - 8 : 0;
  const bottom = innerHeight - offsetHeight - offsetTop <= verticalSideAfterScale ? verticalSideAfterScale - 8 : 0;

  const onHover = () => {
    if (timer) return;

    timer = setTimeout(() => {
      setIsHovered((pre) => (!pre ? true : pre));
    }, 500);
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
      className="relative h-full w-full shadow-red-500 duration-200 ease-in-out hover:z-[5]  aria-selected:hover:shadow-2xl sm:aria-selected:hover:scale-125">
      {isHovered && isPlayerCard ? (
        <div
          style={{
            position: `${(top > 0 || bottom > 0 || left > 0 || right > 0) && innerWidth > 639 && isPlayerCard ? 'absolute' : 'unset'}`,
            top: `${top > 0 ? top + 'px' : 'auto'}`,
            left: `${left > 0 ? left + 'px' : 'auto'}`,
            bottom: `${bottom > 0 ? bottom + 'px' : 'auto'}`,
            right: `${right > 0 ? right + 'px' : 'auto'}`,
          }}
          aria-checked={isHovered}
          className={twMerge(
            `group relative flex aspect-video h-full w-full flex-col rounded-md bg-cover bg-center bg-no-repeat shadow outline outline-green-500`,
          )}>
          <Player id={videoId} />
        </div>
      ) : (
        <div
          style={{ backgroundImage: `url(${thumbnail})` }}
          className={`group relative flex aspect-video h-full flex-col rounded-md bg-cover bg-center bg-no-repeat shadow outline outline-white `}>
          <div
            className={`absolute bottom-0 flex w-full  flex-col rounded-b-lg bg-gradient-to-t from-black from-0% to-100% p-1 text-white group-hover:h-full group-hover:items-center 
        group-hover:justify-center group-hover:text-center group-hover:backdrop-blur-sm`}>
            <h1 className="mx-1 line-clamp-1 font-bold group-hover:line-clamp-3 group-hover:text-xl sm:text-[120%]">Something</h1>
          </div>
        </div>
      )}
    </Link>
  );
}

export default Card;
