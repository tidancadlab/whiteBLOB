import { useContext, useState } from 'react';
import { StorageContext } from 'storage';

import Player from 'components/Player';
import MovieContainer from 'components/movieContainer';
import { NoInternet } from 'components/no-internet';
import { useParams } from 'react-router-dom';

function shuffle(array) {
  let currentIndex = array.length;

  // While there remain elements to shuffle...
  while (currentIndex !== 0) {
    // Pick a remaining element...
    let randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
  }
}

function PlayerPage() {
  const { allVideoList, isOnline } = useContext(StorageContext);
  const [videoMetadata, setVideoMetadata] = useState({});
  const { id } = useParams();

  shuffle(allVideoList);

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
          <p className="m-4 line-clamp-1 self-start font-bold sm:text-3xl">{videoMetadata.title || `Lorem ipsum gendi et obcaecati consequatur maiores.`}</p>
        </div>
      </div>
      <div className="max-h-[50vh] w-full self-start overflow-y-auto sm:max-h-full">
        <div className="m-4 mb-1 self-start ">
          <h1 className="font-bold sm:mb-4 sm:text-3xl">About Video</h1>
          <p className="line-clamp-6 text-gray-400">
            {videoMetadata.description ||
              ` Lorem ipsum dolor sit amet consectetur adipisicing elit. Dignissimos maxime, culpa quas numquam rerum impedit qui tenetur labore soluta eos ducimus
            quidem voluptatibus assumenda, saepe odio magnam neque sequi molestias? Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsum omnis quidem
            quibusdam in dolor nemo? Ut labore aperiam quisquam eum, nulla earum explicabo sequi delectus voluptates optio mollitia culpa vitae. Lorem ipsum
            dolor sit amet consectetur adipisicing elit. Incidunt cumque illo voluptatum fugit possimus inventore sed dolorem nam corporis pariatur magni omnis
            animi, aliquam ipsum dolorum adipisci eum asperiores voluptatem! Lorem, ipsum dolor sit amet consectetur adipisicing elit. Rem eius quisquam
            repellendus quo dolore vero illum! Inventore, accusamus illo odit sunt, nostrum quisquam adipisci eveniet, soluta provident excepturi voluptatum
            consequuntur. Lorem ipsum dolor sit, amet consectetur adipisicing elit. Fugit tenetur error ipsa neque, deserunt modi repudiandae molestiae
            aspernatur minus ut aliquid ab velit reprehenderit id, rem tempore, qui voluptate veritatis.`}
          </p>
          <div className="text-sm\ mt-4">
            <p>- Praveen Kumar (25 April 2022)</p>
          </div>
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
