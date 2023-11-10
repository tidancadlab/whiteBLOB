import { Link } from "react-router-dom";

function Card({ data }) {
    return (
        data ? <Link to={'/player/' + data.id}>
            <div style={{ backgroundImage: `url(${data.thumbnail})` }} className=" bg-cover rounded-md w-[46vw] min-w-[10rem] aspect-video text-white flex justify-center items-center">
                <h1>{data.title}</h1>
            </div>
        </Link> : <div className=" bg-gray-200 rounded-md w-[46vw] min-w-[10rem] aspect-video text-white flex justify-center items-center">
            <h1>Recommendations</h1>
        </div>
    );
}

export default Card;