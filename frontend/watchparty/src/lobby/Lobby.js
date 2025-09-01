import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import LobbyHub from "./LobbyHub";
import { API_URL } from "../global/api";
import { useWebSocket } from "../global/useWebSocket";
import BingoSetup from "../bingo/BingoSetup";


export default function Lobby() {
    const { id } = useParams();
    const [lobby, setLobby] = useState(null);
    const [me, setMe] = useState(null);
    const [game, setGame] = useState(null);



    useWebSocket(`/topic/lobby/${id}`, setLobby);


    // fetching lobby data 
    useEffect(() => {
        if (!id) // only look for stored key if id is set correctly
            return; 

        const storageKey = `lobby:${id}:me`;
        const savedMe = localStorage.getItem(storageKey);
        if (savedMe)
            setMe(JSON.parse(savedMe));

        fetch(`${API_URL}/lobbies/${id}`)
            .then(res => res.json())
            .then(data => setLobby(data))
            .catch(console.error);
    }, [id]);

    // leaving lobby
    // useEffect(() => {
    //     const handleLeave = () => {
    //         if (me) {
    //             navigator.sendBeacon(
    //                 `/api/lobbies/${id}/leave`,
    //                 JSON.stringify({ memberId: me.id })
    //             );
    //             localStorage.removeItem(`lobby:${id}:me`);
    //         }
    //     };
    //     window.addEventListener("beforeunload", handleLeave);
    //     return () => window.removeEventListener("beforeunload", handleLeave);
    // }, [id, me]);


    const startGame = useCallback(() => {
        fetch(`${API_URL}/lobbies/${id}/start`, {method: "POST"})
            .then(res => res.json())
            .then(data => {
                setLobby(data);
                setGame(data.game);
            })
            .catch(console.error);
    }, [id]);


    return (<>
        {!lobby
            ? <div>Lade Lobby...</div>
            : (lobby.game 
                ? <BingoSetup lobby={lobby} me={me} game={game} />
                : <LobbyHub lobby={lobby} me={me} onStartGame={startGame}/> 
            )
        }
    </>)
}
