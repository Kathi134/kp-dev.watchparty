import { useState } from "react";
import { useParams } from "react-router-dom";
import { API_URL } from "../global/api";
import { useWebSocket } from "../global/useWebSocket";


export default function CollectBingoEvents({game, updateGameObject, handleItemSelection}) {
    const { id: lobbyId } = useParams();
    const [input, setInput] = useState("");

    useWebSocket(`/topic/lobby/${lobbyId}/game`, updateGameObject)

    const addItem = () => {
        if (!input) return;
        fetch(`${API_URL}/lobbies/${lobbyId}/game/events/add`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: input
        })
            .then(data => data.json())
            .then(data => updateGameObject(data))
            .catch(console.error);
        setInput("");
    };

    const removeItem = (item) => {
        fetch(`${API_URL}/lobbies/${lobbyId}/game/events/remove`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: item
        }).then(data => data.json())
            .then(data => updateGameObject(data))
            .catch(console.error);
    };

    const handleKeyDown = (e) => {
        if(e.key === "Enter") { addItem(); }
    }

    return (<div className="vertical-container fixed-container">
        <h3>Ereignis-Sammlung</h3>
        <div>
            <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={handleKeyDown}/>
            <button onClick={addItem}>Add Item</button>
        </div>
        <ul>
            {game?.bingoEvents.map(item => (
                <li key={item}>
                    {item}
                    <button onClick={() => removeItem(item)}>🗑️</button> 
                    <button onClick={() => handleItemSelection(item)}>Auf Board platzieren</button>
                </li>
            ))}
        </ul>
    </div>);
}
