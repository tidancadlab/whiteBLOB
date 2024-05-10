import Card from "./card";
import data from '../data.json'
function MovieContainer() {





    return (
        <div className="flex gap-2 flex-wrap justify-center p-2">
            {data.map((v, i) => {
                return (
                    <Card data={v} />
                )
            })}
            <Card/>
            <Card/>
            <Card/>
            <Card/>
            <Card/>
            <Card/>
            <Card/>
            <Card/>
        </div>
    );
}

export default MovieContainer;