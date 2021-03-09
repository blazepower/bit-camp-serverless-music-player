import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleLeft, faAngleRight, faPause, faPlay } from "@fortawesome/free-solid-svg-icons";
import { PlayerProps, SongModel } from "../types";

const Player = ({ currSong, isPlaying, setIsPlaying, audioRef, songInfo, setSongInfo, songs, setCurrentSong, setSongs }: PlayerProps) => {

    const playSongHandler = () => {
        if (isPlaying) {
            audioRef.pause();
            setIsPlaying(!isPlaying);
        } else {
            setIsPlaying(!isPlaying);
            audioRef.play();
        }
    };

    const activeLibraryHandler = (nextPrev: SongModel) => {
        const newSongs = songs.map(s => {
            if (s.id === nextPrev.id) {
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
    };

    const skipTrackHandler = async (skipDirection: string) => {
        let currIndex = songs.findIndex(song => song.id === currSong.id);
        switch (skipDirection) {
            case 'skip-back':
                if (currIndex === 0) {
                    await setCurrentSong(songs[songs.length - 1]);
                    activeLibraryHandler(songs[songs.length - 1]);
                    break;
                }
                await setCurrentSong(songs[--currIndex]);
                activeLibraryHandler(songs[--currIndex]);
                break;
            default:
                await setCurrentSong(songs[(currIndex + 1) % songs.length]);
                activeLibraryHandler(songs[(currIndex + 1) % songs.length]);
                break;
        }
        if (isPlaying)
            await audioRef.play();
    };

    const dragHandler = (event: any) => {
        audioRef.currentTime = event.target.value;
        setSongInfo({ ...songInfo, currentTime: event.target.value });
    };

    const getTime = (time: number): string => {
        return (
            Math.floor(time / 60) + ":" + ("0" + Math.floor(time % 60)).slice(-2)
        );
    };

    const trackAnimation = {
        transform: `translateX(${songInfo.animationPercent}%)`
    };

    return (
        <div className={"player"}>
            <div className={"time-control"}>
                <p>{getTime(songInfo.currentTime)}</p>
                <div className={"track"} style={{ background: `linear-gradient(to right, ${currSong.color[0]}, ${currSong.color[1]}` }}>
                    <input min={0} max={songInfo.duration || 0} value={songInfo.currentTime} type={"range"} onChange={dragHandler}/>
                    <div className={"animate-track"} style={trackAnimation}/>
                </div>
                <p>{songInfo.duration ? getTime(songInfo.duration) : "0:00"}</p>
            </div>
            <div className={"play-control"}>
                <FontAwesomeIcon icon={faAngleLeft} className={"back"} size={"2x"} onClick={() => skipTrackHandler('skip-back')}/>
                <FontAwesomeIcon icon={isPlaying ? faPause : faPlay} className={"play"} size={"2x"} onClick={playSongHandler}/>
                <FontAwesomeIcon icon={faAngleRight} className={"forward"} size={"2x"} onClick={() => skipTrackHandler('skip-forward')}/>
            </div>
        </div>
    );
};

export default Player;
