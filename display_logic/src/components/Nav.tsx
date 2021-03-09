import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMusic } from "@fortawesome/free-solid-svg-icons";
import { NavProps } from "../types";

const Nav = ({isLibraryOpen, setLibraryOpen}: NavProps) => {
    return (
        <nav>
            <h1>Rishik Music Player</h1>
            <button onClick={() => setLibraryOpen(!isLibraryOpen)}>
                Library
                <FontAwesomeIcon icon={faMusic}/>
            </button>
        </nav>
    );
};

export default Nav;
