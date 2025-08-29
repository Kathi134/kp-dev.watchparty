import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LobbyList from "./LobbyList"
import { API_URL } from "../global/api";

export default function LobbyHome() {
    const [lobbies, setLobbies] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetch(`${API_URL}/lobbies`)
            .then(res => res.json())
            .then(setLobbies)
            .catch(console.error);
    }, []);


    const joinLobby = (lobbyId) => {
        const storageKey = `lobby:${lobbyId}:me`;

        // If already joined, just navigate
        if (localStorage.getItem(storageKey)) {
            navigate(`/bingo/${lobbyId}`);
            return;
        }

        fetch(`${API_URL}/lobbies/${lobbyId}/join`, { method: "POST" })
            .then(res => res.json())
            .then(data => {
                console.log(`joined lobby as ${JSON.stringify(data.me)}`)
                localStorage.setItem(storageKey, JSON.stringify(data.me));
                navigate(`/bingo/${data.lobby.id}`);
            })
            .catch(console.error);
    };

    const createLobbyClick = () => {
        fetch(`${API_URL}/lobbies`, { method: "POST" })
            .then(res => res.json())
            .then(newLobby => joinLobby(newLobby.id))
            .catch(console.error);
    };

    const joinLobbyClick = (id) => {
        joinLobby(id);
    };


    return (<>
        <div className="vertical-container center">
            <button onClick={createLobbyClick}>Erstelle eine neue Watchparty</button>
            oder 
            <span>tritt einer Watchparty bei:</span>
            
            <LobbyList lobbies={lobbies} onLobbyClick={joinLobbyClick}/>
        </div>
    </>)
}