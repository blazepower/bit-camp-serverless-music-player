# Bitcamp Serverless Blog

## Rishik Hombal

___

### Abstract

This project is a music player built in React using Typescript and SASS. The application features a library allowing
users to select which song they would like to play and also includes play, pause, skip, and seek functionality.
Additionally, the app is mobile friendly and is capable of resizing and restructuring to have a pleasant user experience
on devices with a smaller form factor. One of the main reasons I made the project is to have a single place where I can
listen to music - particularly open access music. There are many times when I hear a song in a YouTube intro or outro,
and it is very inconvenient for me to listen to that song. Sometimes these songs aren't available on Spotify, so I have
to hunt for a Soundcloud profile, or some other service that I can use to listen to this song, and then every time I
want to listen to this song, I will need to return to this service. This application removes that need. Instead of going
to many different services, users can stay in this application and stream all of their open access music. This allows
for a much more convenient listening experience for an end user, and hopefully, this will lead to them listening to
smaller artists who are not on big music streaming services such as Spotify or Apple Music.

___

### My setup and I

<img src="https://github.com/blazepower/bit-camp-learning-lab-test/blob/master/images/PXL_20210316_222851149.jpg?raw=true" alt="Project picture" width="400"/>
<img src="https://github.com/blazepower/bit-camp-learning-lab-test/blob/master/images/IMG_20190608_164411.jpg?raw=true" alt="Project picture" width="400"/>

___

## A React Music Player to listen to and discover small artists creating open access music

Hello everyone! My name is Rishik, and I'll walk you through the steps on how to replicate my application for the
Bitproject Serverless Camp. The main purpose of this project is to help users have a more cohesive experience when
finding and listening to music from smaller artists. Instead of visiting many different sites in order to find a certain
song to listen to, users can stay on this one site and listen to all the music they want.

In this tutorial, we will focus on writing the display code first, then styling, finally we will look at how to provide
data using an Azure Function. Before we start, here are some technologies you should be familiar with:

* Javascript
* Typescript
* React
* CSS
* SASS

To begin, we will create a React application using a Typescript template. You can use your preferred way of doing this,
but I will use
`npx create-react-app app-name --template typescript`. To prevent any errors, make sure that your application name is in
all lowercase and any words are separated by dashes. Next, to add SASS to our application, we will use the
command `npm install node-sass`.

Now we will start building the application. First for organization, we are going to create two folders inside our src
directory. Call these folders components and styles. The `create-react-app` template gives us some starter files and
code. Most of this we will not need. In fact, keep only the `App.tsx, index.tsx, react-app-env.d.ts, and App.css` files.
In the `App.tsx` file, delete all the code within the function, and rename the `App.css` file to `App.scss` and move it
to your styles folder.

Next, within your components folder, create five `.tsx`
files: `Library.tsx, LibrarySong.tsx, Nav.tsx, Player.tsx, and Song.tsx` and `import React from 'react'` at the top of
each. Create corresponding scss files for each of those except `LibrarySong.tsx` Now, going back to the `App.tsx` file,
we are ready to start writing some code. First, we will need to write some utility functions to perform some actions
within our application. First, we are going to write code to update the current time of our song. To do that, we're
going to create a time update handler function like so:

```typescript
const timeUpdateHandler = (event: any) => {
    const currentTime = event.target.currentTime;
    const duration = event.target.duration;

    const roundedCurrentTime = Math.round(currentTime);
    const roundedDuration = Math.round(duration);
    const animationPercent = Math.round((roundedCurrentTime / roundedDuration) * 100);
};
```

This function takes in the event that is fired whenever a song's current time changes and then it does some math to
output the current time in the song. It also determines how much of the progress bar should be filled at a given time.
You may notice that despite this function doing a lot of computation, the results of this computation are not used
anywhere. To use these results, we will add the current song info to the state. To do this, we must first
import `useState` from react, then we have to create a Type for this state so that we keep with Typescript's concept of
strongly typing all parts of our application that we can. Create a `types.ts` file somewhere within the src directory to
hold all the types we will use for this application. For this particular part of state, we will create a type called
SongInfo.

```typescript
export type SongInfo = {
    currentTime: number;
    duration: number;
    animationPercent: number;
}
```

This creates a type with three properties. The current time, duration, and the percent that the progress bar should be
filled. We can now go back to the `App.tsx` file and import this type.

Now, using the `useState` hook in React, we will create a state hook storing the song info.

```typescript
const [songInfo, setSongInfo] = useState<SongInfo>({
    currentTime: 0,
    duration: 0,
    animationPercent: 0
});
```

As you may recall, `useState` has two parts. A getter to return the current value of the state, and a mutator to change
the state. Here, `songInfo` is our getter, and `setSongInfo` is our mutator. We must also include an initial value for
the state. Now going back to the handler we wrote, we can add the values to the state.

``
setSongInfo({ ...songInfo, currentTime, duration, animationPercent });
``

Now, lets add some more types and parts of state to set us up for building the rest of the application. Going back to
the `types.ts` file, we can add a new type.

```typescript
export interface SongModel {
    name: string;
    cover: string;
    artist: string;
    audio: string;
    color: string[];
    id: string;
    active: boolean;
}
```

This allows us to store the information for each song we send to our application. Going back to the `App.tsx` file, lets
add some more state We need to add some parts of state to check if our library bar is open, to store our songs, to
determine what our current song is, and to determine whether a song is playing. We will do this in a similar way to our
last piece of state.

```typescript
const [isLibraryOpen, setIsLibraryOpen] = useState(false);
const [songs, setSongs] = useState<SongModel[]>([{
    color: [],
    id: "",
    active: false,
    artist: "",
    audio: "",
    cover: "",
    name: ""
}]);
const [currentSong, setCurrentSong] = useState<SongModel>(songs[0]);
const [isPlaying, setIsPlaying] = useState(false);
```

Now let's add another handler to skip to the next song when the current one ends.

```typescript
const songEndHandler = async () => {
    let currIndex = songs.findIndex(song => song.id === currentSong.id);
    await setCurrentSong(songs[(currIndex + 1) % songs.length]);
    if (isPlaying)
        await audioRef.current.play();
};
```

This async handler determines which song has just ended, and then goes to the next song. If the previous song was
playing, this next song will also play when it is loaded.

Now, we can start building our components. Go to the `nav.tsx` file. Our navbar will bre responsible for display and for
opening and closing our library of music. to create this element, we will use a React functional component. First, we
will need to determine what information this component needs. We do not want to give it too much access to our
application as this leads to inefficiency, but it also must be able to fulfill its purpose. Recall that we created a
part of state to track our library. Our nav component will need access to that part of state, so we will pass that in
props. To do this, we first need to create a type to inform typescript about what parameters our function will take.
Going back to our `types.ts` file, we will create a new type.

```typescript
export type NavProps = {
    isLibraryOpen: boolean,
    setLibraryOpen: (open: boolean) => void
}
```

This is a type with two parameters, the first is a normal boolean, the second indicates that it is a method which takes
in a boolean input, and returns void

Back in our `Nav.tsx` file, we can now create this component.

```typescript
const Nav = ({ isLibraryOpen, setLibraryOpen }: NavProps) => {
    return (

    )
}
```

This creates our functional component which can return some babel style tsx code.

Inside the return, we will put what content we want in the navbar. In our case, a name, and a button to open and close
the library.

```typescript jsx
<nav>
    <h1>Rishik Music Player</h1>
    <button onClick={() => setLibraryOpen(!isLibraryOpen)}>
        Library
    </button>
</nav>
```

The button toggles the boolean in the state to open and close the library. Finally, we `export default Nav` at the end
of the file so we can use this component in other places.

In the `App.tsx` file, we can now add this component.

Just like we did in our nav component, we will also have a return here. In our return, we will create a div to store our
components, and then we will add our Nav component.

```typescript jsx
return (
    <div>
        <Nav isLibraryOpen={isLibraryOpen} setLibraryOpen={setIsLibraryOpen}/>
    </div>
)
```

While we're here, lets also add our audio into the application. Inside this div, lets create an audio tag which will
implement the handlers we created for it.

```typescript jsx
<audio onTimeUpdate={timeUpdateHandler} onLoadedMetadata={timeUpdateHandler}
       onEnded={songEndHandler} src={currentSong.audio}/>
```

We will also need to use reference this audio in order to use it within our application. To do this, we will use
the `useRef` hook within react.

```typescript
const audioRef = useRef<HTMLAudioElement>(null!);
```

To link this with the audio tag, we will add a html attribute `ref={audioRef}` on the audio tag.

We will do the Song similarly to the Nav component. We will determine what data it needs to take in, we will create a
type for those props, then we will create and export the component. For the song, all it needs to know is which song is
currently playing, so it can display the information.

We create the type for the props

```typescript
export type SongProps = {
    currSong: SongModel
}
```

Then create the component

```typescript jsx
const Song = ({ currSong }: SongProps) => {
    return (
        <div className={"song-container"}>
            <img src={currSong.cover} alt={"album cover"}/>
            <h2>{currSong.name}</h2>
            <h3>{currSong.artist}</h3>
        </div>
    );
};
```

For the LibrarySong, we will need to add some more logic to set the current song when we select it in the library. We
will create another method to use the state mutator. Setting the current song is something we will do quite often, so we
can create a file with reusable methods.

Create a file called `util.ts` and let's create a function to set an active song. To do this, we will need to get the
selected song and set it to be active, and get all other songs and make sure they are inactive to ensure that we do not
have concurrent audio streams. Finally, we will update the songs state with this new information.

```typescript
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
```

We can now use this to select a song from the library.

```typescript
const songSelectHandler = async () => {
    await setCurrentSong(song);

    setCurrentSongActive(song, songs, setSongs);
    if (isPlaying) {
        await audioRef.play();
    }
}
```

This async handler will set the current song part of the state, and then it will set the selected song as active and
play it if the previous song was also playing.

Now we can create the type and component

```typescript
export type LibrarySongProps = {
    song: SongModel,
    songs: SongModel[],
    setCurrentSong: (song: SongModel) => void,
    audioRef: HTMLAudioElement,
    isPlaying: boolean,
    setSongs: (songs: SongModel[]) => void
}
```

```typescript jsx
return (
    <div onClick={songSelectHandler}>
        <img src={song.cover} alt={"album cover"}/>
        <div className={"song-description"}>
            <h3>{song.name}</h3>
            <h4>{song.artist}</h4>
        </div>
    </div>
);
```

Now, when we click on a song in our library, it will become selected and active. Now, lets create the library. The
library will need to display all the Library songs which we will map. We will have the props type and the component.

```typescript
export type LibraryProps = {
    songs: SongModel[],
    setCurrentSong: (song: SongModel) => void,
    audioRef: HTMLAudioElement,
    isPlaying: boolean,
    setSongs: (songs: SongModel[]) => void,
    isLibraryOpen: boolean,
}
```

```typescript jsx
const Library = ({ songs, setCurrentSong, audioRef, isPlaying, setSongs, isLibraryOpen }: LibraryProps) => {
    return (
        <div>
            <h2>Library</h2>
            <div>
                {songs.map(song => <LibrarySong song={song} setCurrentSong={setCurrentSong} songs={songs} key={song.id}
                                                audioRef={audioRef} isPlaying={isPlaying} setSongs={setSongs}/>)}
            </div>
        </div>
    );
};
```

Our final component is the player. The player will have the most logic of all our components. First we need to set a
song as active from the library if we select it in the player using our next or previous buttons.

```typescript
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
```

Now we need a handler to play a song. With our isPlaying state, this is relatively easy.

```typescript
const playSongHandler = () => {
    if (isPlaying) {
        audioRef.pause();
        setIsPlaying(!isPlaying);
    } else {
        setIsPlaying(!isPlaying);
        audioRef.play();
    }
};
```

Next we need to skip. We can combine forwards and backwards into one function using a switch statement. We will also
need to handle wrapping when we reach the end or beginning of our library. To do this, we can use our currentSong state
along with our `activeLibraryHandler` we created earlier.

```typescript
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
```

Finally, we must handle the seeking feature. To start, we need to handle the dragging on the progress bar.

```typescript
const dragHandler = (event: any) => {
    audioRef.currentTime = event.target.value;
    setSongInfo({ ...songInfo, currentTime: event.target.value });
};
```

Then, we need to format the time for display

```typescript
const getTime = (time: number): string => {
    return (
        Math.floor(time / 60) + ":" + ("0" + Math.floor(time % 60)).slice(-2)
    );
};
```

This takes the time of the song and formats it in the format mm:ss

Finally, we need to fill the progress bar depending on how time has elapsed in the song.

```typescript
const trackAnimation = {
    transform: `translateX(${songInfo.animationPercent}%)`
};
```

Now we can return the jsx code to display our player controls.

```typescript jsx
return (
    <div className={"player"}>
        <div className={"time-control"}>
            <p>{getTime(songInfo.currentTime)}</p>
            <div className={"track"}
                 style={{ background: `linear-gradient(to right, ${currSong.color[0]}, ${currSong.color[1]}` }}>
                <input min={0} max={songInfo.duration || 0} value={songInfo.currentTime} type={"range"}
                       onChange={dragHandler}/>
                <div className={"animate-track"} style={trackAnimation}/>
            </div>
            <p>{songInfo.duration ? getTime(songInfo.duration) : "0:00"}</p>
        </div>
        <div className={"play-control"}>
            <FontAwesomeIcon icon={faAngleLeft} className={"back"} size={"2x"}
                             onClick={() => skipTrackHandler('skip-back')}/>
            <FontAwesomeIcon icon={isPlaying ? faPause : faPlay} className={"play"} size={"2x"}
                             onClick={playSongHandler}/>
            <FontAwesomeIcon icon={faAngleRight} className={"forward"} size={"2x"}
                             onClick={() => skipTrackHandler('skip-forward')}/>
        </div>
    </div>
);
```

This logic displays the progress bar, the play/pause button depending on whether the song is currently playing, and the
skip buttons. These icons are from the FontAwesome npm package.

Now we can finally put this all together and start the styling. In our `App.tsx` file, we can add our final components
and pass in their props.

```typescript jsx
return (
    <div>
        <Nav isLibraryOpen={isLibraryOpen} setLibraryOpen={setIsLibraryOpen}/>
        <Song currSong={currentSong}/>
        <Player isPlaying={isPlaying} setIsPlaying={setIsPlaying} currSong={currentSong} audioRef={audioRef.current}
                songInfo={songInfo} setSongInfo={setSongInfo} songs={songs} setCurrentSong={setCurrentSong}
                setSongs={setSongs}/>
        <Library songs={songs} setCurrentSong={setCurrentSong} audioRef={audioRef.current} isPlaying={isPlaying}
                 setSongs={setSongs} isLibraryOpen={isLibraryOpen}/>
        <audio onTimeUpdate={timeUpdateHandler} ref={audioRef} onLoadedMetadata={timeUpdateHandler}
               onEnded={songEndHandler} src={currentSong.audio}/>
    </div>
);
```

### Styling

Now we can start styling our components.

Let's start by styling the main `App.tsx` file with our `App.scss` file. In our `App.tsx` file, we need to add classes
to our wrapping div to add in transitions and to change our main layout if the library is open. In the div, we add the
attribute
`` className={`App ${isLibraryOpen ? 'library-active' : ""}`} `` and in the `app.scss` file, we will add some styling
for these classes.

```scss
.App {
  transition: all 0.5s ease;
}

.library-active {
  margin-left: 30%;
}
```

And now, we can add styling for some general types in our entire project.

```scss
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

h1, h2, h3 {
  color: rgb(54, 54, 54);
}

body {
  font-family: "Amatic SC", cursive;
}

h3, h4 {
  font-weight: 400;
  color: rgb(100, 100, 100);
}

@import "./song";
@import "./player";
@import "./library";
@import "./nav";

@import url('https://fonts.googleapis.com/css2?family=Amatic+SC:wght@400;700&display=swap');
```

The final line of code allows for this project to import a non-standard font from Google Fonts. The other import
statements allow for us to pass our global styling into the other stylesheets.

Let's style library next. Similarly to the previous file, we will need to add classed depending on whether the library
is open or not. We do this with the attribute `` className={`library ${isLibraryOpen ? 'active-library': ""}`} `` on the
wrapping div. Now in our `library.scss` file,

```scss
.library {
  position: fixed;
  top: 0;
  left: 0;
  width: 20rem;
  height: 100%;
  background: white;
  box-shadow: 2px 2px 50px #a2a2a2;
  overflow: scroll;
  transform: translateX(-100%);
  transition: all 0.5s ease;
  opacity: 0;

  h2 {
    padding: 2rem;
  }
}

.library-song {
  display: flex;
  align-items: center;
  padding: 1rem 2rem 1rem 2rem;
  cursor: pointer;
  transition: background 0.5s ease;

  img {
    width: 30%;
  }

  &:hover {
    background: gainsboro;
  }
}

.song-description {
  padding-left: 1rem;

  h3 {
    font-size: 2rem;
  }

  h4 {
    font-size: 1rem;
  }
}

.selected {
  background: #aeadad;
}

.active-library {
  transform: translateX(0%);
  opacity: 1;
}

* {
  scrollbar-width: thin;
  scrollbar-color: rgba(155, 155, 155, 0.5) transparent;
}

*::-webkit-scrollbar {
  width: 5px;
}

*::-webkit-scrollbar-track {
  background: transparent;
}

*::-webkit-scrollbar-thumb {
  background-color: rgba(155, 155, 155, 0.5);
  border-radius: 20px;
  border: transparent;
}

@media screen and (max-width: 768px) {
  .library {
    width: 100%;
  }
}
```

This stylesheet styles the library component and the scrollbar for both Chromium and Mozilla browsers. Additionally, on
mobile devices, the library's size is rescaled.

Next we style our navbar,

```scss
nav {
  min-height: 10vh;
  display: flex;
  justify-content: space-around;
  align-items: center;

  button {
    background: transparent;
    cursor: pointer;
    border: 2px solid rgb(65, 65, 65);
    padding: 0.5rem;
    transition: all 0.3s ease;

    &:hover {
      background: rgb(65, 65, 65);
      color: white;
    }
  }
}


@media screen and (max-width: 768px) {
  nav {
    button {
      z-index: 10;
    }
  }
}
```

This styles the navbar and rescales the UI on mobile devices.

Similarly, we need to style the player:

```scss
.player {
  min-height: 20vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
}

.time-control {
  width: 50%;
  display: flex;

  input {
    width: 100%;
    -webkit-appearance: none;
    -moz-appearance: none;
    background: transparent;
    cursor: pointer;
  }

  p {
    padding: 1rem;
  }
}

.play-control {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  width: 30%;

  svg {
    cursor: pointer;
  }
}

p {
  font-size: 1.5rem;
}

input[type="range"]:focus {
  outline: none;
}

input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  height: 16px;
  width: 16px;
  background: black;
}

input[type="range"]::-moz-range-thumb {
  -moz-appearance: none;
  height: 16px;
  width: 16px;
  background: transparent;
  border: transparent;
}

.track {
  background: lightblue;
  width: 100%;
  height: 1rem;
  position: relative;
  border-radius: 1rem;
  overflow: hidden;
}

.animate-track {
  background: rgb(204, 204, 204);
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  transform: translateX(0%);
  pointer-events: none;
}

@media screen and (max-width: 768px) {
  .time-control {
    width: 90%;
  }

  .play-control {
    width: 70%;
  }
}
```

This styles the progress bar on both Chromium and Mozilla browsers.

Finally, we need to style the song component,

```scss
.song-container {
  min-height: 60vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  img {
    width: 20%;
    border-radius: 50%;
  }

  h2 {
    padding: 3rem 1rem 1rem 1rem;
    font-size: 3rem;
  }

  h3 {
    font-size: 2rem;
  }
}

@media screen and (max-width: 768px) {
  .song-container {
    img {
      width: 60%;
    }
  }
}
```

### Serverless Function

Now we can get started on the creation of our http trigger to deliver our song data to our application. First, we must
create a standard Http Trigger using the Azure extension in Visual Studio Code. After we get the starter files, open
the `index.js` file.  
As an example I will provide a sample array of music that we can use for this tutorial. If you wish, you may provide any
music you choose that meets the same format.

```javascript
const songData = [
    {
        name: "Beaver Creek",
        cover:
            "https://chillhop.com/wp-content/uploads/2020/09/0255e8b8c74c90d4a27c594b3452b2daafae608d-1024x1024.jpg",
        artist: "Aso, Middle School, Aviino",
        audio: "https://mp3.chillhop.com/serve.php/?mp3=10075",
        color: ["#205950", "#2ab3bf"],
        id: uuidv4(),
        active: false,
    },
    {
        name: "Daylight",
        cover:
            "https://chillhop.com/wp-content/uploads/2020/07/ef95e219a44869318b7806e9f0f794a1f9c451e4-1024x1024.jpg",
        artist: "Aiguille",
        audio: "https://mp3.chillhop.com/serve.php/?mp3=9272",
        color: ["#EF8EA9", "#ab417f"],
        id: uuidv4(),
        active: false,
    },
];
```

Insert this song array into the `module.exports` section of the file. We will also need to import the uuid package to
assign ids to our songs. Finally, the function should end with the `context.res` section. Inside that section, we must
pass the songData as a part of the request.

```javascript
context.res = {
    body: songData
};
```

This makes the body of the request include the songData array we provided.

### Consuming the API call

Finally, we must put these parts together to get the songs within our application.

To do this, we must create a function to fetch from our endpoint. This function will check to see whether the data has
already been loaded, if it has not, then we will use the fetch method to return a Promise from the endpoint with the
song data we provided earlier. We then add the songs to the state.

```typescript
let loaded = false;
const getSongData = async (): Promise<void | SongModel[]> => {
    if (loaded) return;
    return await fetch("url")
        .then(res => {
            return res.json() as Promise<SongModel[]>;
        })
        .then(res => {
            setSongs(res);
            loaded = true;
        });
};
```

However, we will still need to call this function as the page loads. To do this, we can use the `useEffect` react hook.
The `useEffect` hook takes in a callback function, and an array of dependencies that the hook watches for. When the
dependencies update, the hook will fire. In the callback function, we need to get the data, and then we need to set the
currentSong.

```typescript
useEffect(() => {
    if (!loaded) {
        getSongData();
        setCurrentSong(songs[0]);
    }
}, [loaded]);
```

My hope with this project is that if it gets deployed, it can help develop a love for smaller artists who are not big
enough to get their music on large streaming platforms. To further improve the user experience for this application, I
would like to add a way for a user to add music to the application without hardcoding it into the function. I would also
like to color more components to give the player a unique look for each album that is played.
