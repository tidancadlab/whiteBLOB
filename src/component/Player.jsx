import { useEffect, useRef } from "react";
import { useParams } from "react-router";
let createPlayer = async () => {
    let player = document.createElement('video');
    player.className = 'w-full rounded-lg  bg-slate-950 w-full';
    // player.setAttribute('autoPlay', true)
    player.id = 'video'
    return player
}


function Player({ videoTable }) {
    const videoContainer = useRef(null)
    const seekBar = useRef(null)
    const { videoId } = useParams()
    let videoMetaData = videoTable.filter((meta) => meta.id === videoId)


    const initPlayer = async (manifestUri) => {
        let videoPlayer = await createPlayer();
        // videoPlayer.poster = videoMetaData[0].thumbnail;
        videoContainer.current.innerHTML = ''
        videoContainer.current.appendChild(videoPlayer)
    };
    let cou = 0
    useEffect(() => {
        if (cou > 0) return
        cou++
        initPlayer(`${process.env.REACT_APP_SERVER_URL}/video/mission2/master.m3u8`)
    }, [cou])

    return (
        <>
            <div className="mb-4 lg:px-4">
                <div ref={videoContainer} className="max-h-[90vh]"></div>
            </div>
            <h1 className="p-4 text-xl">{videoMetaData[0].title}</h1>
            <div ref={seekBar}></div>
        </>
    );
}

export default Player;