import React, { useEffect, useRef, useState } from 'react';
import './styles/app.scss';
import Song from "./components/Song";
import Player from "./components/Player";
import Library from "./components/Library";
import { SongInfo, SongModel } from "./types";
import Nav from "./components/Nav";

function App() {
    let loaded = false;
    useEffect(() => {
        if (!loaded) {
            getSongData();
            setCurrentSong(songs[0]);
        }
    }, [loaded]);
    const getSongData = async (): Promise<void | SongModel[]> => {
        if (loaded) return;
        return await fetch("http://localhost:7071/api/DataTrigger")
            .then(res => {
                return res.json() as Promise<SongModel[]>;
            })
            .then(res => {
                setSongs(res);
                loaded = true;
            });
    };

    const audioRef = useRef<HTMLAudioElement>(null!);

    const timeUpdateHandler = (event: any) => {
        const currentTime = event.target.currentTime;
        const duration = event.target.duration;

        const roundedCurrentTime = Math.round(currentTime);
        const roundedDuration = Math.round(duration);
        const animationPercent = Math.round((roundedCurrentTime / roundedDuration) * 100);

        setSongInfo({ ...songInfo, currentTime, duration, animationPercent });
    };

    const songEndHandler = async () => {
        let currIndex = songs.findIndex(song => song.id === currentSong.id);
        await setCurrentSong(songs[(currIndex + 1) % songs.length]);
        if (isPlaying)
            await audioRef.current.play();
    };

    const [isLibraryOpen, setIsLibraryOpen] = useState(false);
    const [songs, setSongs] = useState<SongModel[]>([{ color: [], id: "", active: false, artist: "", audio: "", cover: "", name: "" }]);
    const [currentSong, setCurrentSong] = useState<SongModel>(songs[0]);
    const [isPlaying, setIsPlaying] = useState(false);
    const [songInfo, setSongInfo] = useState<SongInfo>({
        currentTime: 0,
        duration: 0,
        animationPercent: 0
    });

    return (
        <div className={`App ${isLibraryOpen ? 'library-active' : ""}`}>
            <Nav isLibraryOpen={isLibraryOpen} setLibraryOpen={setIsLibraryOpen}/>
            <Song currSong={currentSong}/>
            <Player isPlaying={isPlaying} setIsPlaying={setIsPlaying} currSong={currentSong} audioRef={audioRef.current} songInfo={songInfo} setSongInfo={setSongInfo} songs={songs} setCurrentSong={setCurrentSong} setSongs={setSongs}/>
            <Library songs={songs} setCurrentSong={setCurrentSong} audioRef={audioRef.current} isPlaying={isPlaying} setSongs={setSongs} isLibraryOpen={isLibraryOpen}/>
            <audio onTimeUpdate={timeUpdateHandler} ref={audioRef} onLoadedMetadata={timeUpdateHandler} onEnded={songEndHandler} src={currentSong.audio}/>
        </div>
    );
}

export default App;
