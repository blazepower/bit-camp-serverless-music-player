import { SongModel } from "./types";

export function setCurrentSongActive(song: SongModel, songs: SongModel[], setSongs: Function): void {
    const newSongs = songs.map(s => {
        if (s.id === song.id) {
            return {
                ...s,
                active: true,
            };
        } else {
            return {
                ...s,
                active: false
            };
        }
    });
    setSongs(newSongs);
}
