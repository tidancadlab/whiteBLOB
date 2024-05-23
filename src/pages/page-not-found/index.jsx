import { useParams } from 'react-router-dom';

function PageNotFound() {
  let url = useParams();

  return (
    <div className="flex grow items-center justify-center bg-black text-white">
      <div className="flex flex-col items-center justify-center text-center text-gray-800">
        <h1 className=" text-9xl font-extrabold">404</h1>
        <p className="text-5xl">Page Not Found</p>
        <p className="text-xl mt-4">The {url['*']} page you are looking for does not exist.</p>
      </div>
    </div>
  );
}

export default PageNotFound;
