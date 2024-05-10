import CardCategoryStrip from "../component/CardCategoryStrip";
import Player from "../component/Player";
import videoTable from '../data.json'

function PlayerPage() {

    return ( 
        <div className="bg-black text-white grow">
            <Player videoTable={videoTable}/>
        </div>
     );
}

export default PlayerPage;