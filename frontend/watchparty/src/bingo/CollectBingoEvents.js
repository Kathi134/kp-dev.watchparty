import { useState } from "react";
import { useParams } from "react-router-dom";
import { API_URL } from "../global/api";
import { useWebSocket } from "../global/useWebSocket";


export default function CollectBingoEvents({lobby, me}) {
    const { id: lobbyId } = useParams();
    const [game, setGame] = useState(lobby.game);
    const [input, setInput] = useState("");

    useWebSocket(`/topic/lobby/${lobbyId}/game`, setGame)

    const addItem = () => {
        if (!input) return;
        fetch(`${API_URL}/lobbies/${lobbyId}/game/events/add`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: input
        })
            .then(data => data.json())
            .then(data => setGame(data))
            .catch(console.error);
        setInput("");
    };

    const removeItem = (item) => {
        fetch(`${API_URL}/lobbies/${lobbyId}/game/events/remove`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: item
        }).then(data => data.json())
            .then(data => setGame(data))
            .catch(console.error);
    };

    const handleKeyDown = (e) => {
        if(e.key === "Enter") { addItem(); }
    }

    return (
        <div>
            <h2>Bingo {game?.id}</h2>
            <h3>Ereignis-Sammlung</h3>
            <div>
                <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={handleKeyDown}/>
                <button onClick={addItem}>Add Item</button>
            </div>
            <ul>
                {game?.bingoEvents.map(item => (
                    <li key={item}>
                        {item} <button onClick={() => removeItem(item)}>Remove</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}
