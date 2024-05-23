import { twMerge } from 'tailwind-merge';

import Card from './card';

function MovieContainer({ className, data = [] }) {
  return (
    <div className={twMerge(' gap-6 p-2', className)}>
      {data.slice(0, 10).map((v, i) => {
        return <Card thumbnail={v.thumbnails[0]?.url} videoId={v.id} title={v.full_name} key={v.id} />;
      })}
    </div>
  );
}

export default MovieContainer;
