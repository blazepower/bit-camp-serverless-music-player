export interface SongModel {
    name: string;
    cover: string;
    artist: string;
    audio: string;
    color: string[];
    id: string;
    active: boolean;
}

export type SongProps = {
    currSong: SongModel
}

export type PlayerProps = {
    currSong: SongModel,
    isPlaying: boolean,
    setIsPlaying: (playStatus: boolean) => void,
    audioRef: HTMLAudioElement,
    songInfo: SongInfo,
    setSongInfo: (songInfo: SongInfo) => void,
    songs: SongModel[],
    setCurrentSong: (song: SongModel) => void,
    setSongs: (songs: SongModel[]) => void
}

export type SongInfo = {
    currentTime: number;
    duration: number;
    animationPercent: number;
}

export type LibraryProps = {
    songs: SongModel[],
    setCurrentSong: (song: SongModel) => void,
    audioRef: HTMLAudioElement,
    isPlaying: boolean,
    setSongs: (songs: SongModel[]) => void,
    isLibraryOpen: boolean,
}

export type LibrarySongProps = {
    song: SongModel,
    songs: SongModel[],
    setCurrentSong: (song: SongModel) => void,
    audioRef: HTMLAudioElement,
    isPlaying: boolean,
    setSongs: (songs: SongModel[]) => void
}

export type NavProps = {
    isLibraryOpen: boolean,
    setLibraryOpen: (open: boolean) => void
}
