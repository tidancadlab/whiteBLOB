import { useEffect, useRef } from "react";
import MovieContainer from "./movieContainer";
import data from '../data.json'

function Player() {
    const htmlVideo = useRef(null)
    const shaka = window.shaka;

    function initApp(url = 'http://192.168.1.8/mpd/main.mpd') {
        shaka.polyfill.installAll();
        if (shaka.Player.isBrowserSupported()) {
            initPlayer(url);
        } else {
            console.error('Browser not supported!');
            alert('Browser not supported!');
        }
    }

    async function initPlayer(manifestUri) {
        // Create a Player instance.
        // const video = document.getElementById('video');
        const player = new shaka.Player(htmlVideo.current);

        // Attach player to the window to make it easy to access in the JS console.
        window.player = player;

        // Listen for error events.
        player.addEventListener('error', onErrorEvent);

        // Try to load a manifest.
        // This is an asynchronous process.
        try {
            await player.load(manifestUri);
            // This runs if the asynchronous load is successful.
            console.log('The video has now been loaded!');
        } catch (e) {
            // onError is executed if the asynchronous load fails.
            onError(e);
        }
    }

    function onErrorEvent(event) {
        // Extract the shaka.util.Error object from the event.
        onError(event.detail);
    }

    function onError(error) {
        // Log the error.
        console.error('Error code', error.code, 'object', error);
    }

    let url = document.URL.split('/')[4]
    let videoUrl = data.filter((v) => {
        return v.id === url;
    })
    useEffect(() => {
        initApp(videoUrl[0].video_link)
    }, [htmlVideo, url])

    return (
        <>
            <div className="mb-4">
                <video ref={htmlVideo} className="w-full" id="video" controls autoPlay></video>
                <h1 className="p-4 text-xl">{videoUrl[0].title}</h1>
            </div>
            <MovieContainer />
        </>
    );
}

export default Player;