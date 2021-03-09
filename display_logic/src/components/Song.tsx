import React from 'react';
import { SongProps } from "../types";

const Song = ({ currSong }: SongProps) => {
    return (
        <div className={"song-container"}>
            <img src={currSong.cover} alt={"album cover"}/>
            <h2>{currSong.name}</h2>
            <h3>{currSong.artist}</h3>
        </div>
    );
};

export default Song;
