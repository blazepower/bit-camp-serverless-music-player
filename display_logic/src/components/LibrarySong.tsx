import React from "react";
import { LibrarySongProps } from "../types";
import { setCurrentSongActive } from "../util";

const LibrarySong = ({ song, songs, setCurrentSong, audioRef, isPlaying, setSongs }: LibrarySongProps) => {

    const songSelectHandler = async () => {
        await setCurrentSong(song);

        setCurrentSongActive(song, songs, setSongs);
        if (isPlaying) {
            await audioRef.play();
        }
    }

    return (
        <div className={`library-song ${song.active ? 'selected' : ""}`} onClick={songSelectHandler}>
            <img src={song.cover} alt={"album cover"}/>
            <div className={"song-description"}>
                <h3>{song.name}</h3>
                <h4>{song.artist}</h4>
            </div>
        </div>
    );
};

export default LibrarySong;
