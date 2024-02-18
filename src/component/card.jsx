import { Link } from "react-router-dom";
import thambnail from '../images/BG.png'

function Card({ data }) {
    return (
        data ? <Link to={'/player/' + data.id} className=" snap-center first:ml-5 lg:first:ml-8">
            <div style={{ backgroundImage: `url(${data.thumbnail})` }} className={`bg-center bg-scroll hover:scale-125 ease-in-out duration-300 hover:delay-100 bg-cover rounded-md 
                min-w-[136px] w-[16vw] max-w-[16rem]
                aspect-video text-white flex items-end`}>
                <p className="text-xs font-semibold rounded text-ellipsis whitespace-nowrap overflow-hidden bg-gray-800 bg-opacity-50 p-1.5">{data.title}</p>
            </div>
        </Link> : <div style={{ backgroundImage: `url(${thambnail})` }} className={`border border-white bg-cover rounded-md  min-w-[136px] w-[100px]
             aspect-[12/16] text-white flex items-end`}>
            <p className="text-xs font-semibold mb-1.5 ml-1 text-ellipsis whitespace-nowrap overflow-hidden">Title Name</p>
        </div>
    );
}

export default Card;