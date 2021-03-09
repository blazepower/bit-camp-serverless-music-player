import React from "react";
import LibrarySong from "./LibrarySong";
import { LibraryProps } from "../types";

const Library = ({ songs, setCurrentSong, audioRef, isPlaying, setSongs, isLibraryOpen}: LibraryProps) => {
    return (
        <div className={`library ${isLibraryOpen ? 'active-library': ""}`}>
            <h2>Library</h2>
            <div>
                {songs.map(song => <LibrarySong song={song} setCurrentSong={setCurrentSong} songs={songs} key={song.id} audioRef={audioRef} isPlaying={isPlaying} setSongs={setSongs}/>)}
            </div>
        </div>
    );
};

export default Library;
