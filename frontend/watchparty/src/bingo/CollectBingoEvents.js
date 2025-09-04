import "./setup.css"
import { useState } from "react";
import { useParams } from "react-router-dom";
import { API_URL } from "../global/api";
import { useWebSocket } from "../global/useWebSocket";

export default function CollectBingoEvents({game, updateGameObject, handleItemSelection = () => {}, onRemove = () => {}}) {
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
        onRemove(item);
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

    return (<div className="vertical-container section-container">
        <h3>Ereignis-Sammlung</h3>
        <div className="horizontal-container gap-1 center">
            <input className="decent-input primary" value={input} onChange={e => setInput(e.target.value)} onKeyDown={handleKeyDown}/>
            <button className="small primary" onClick={addItem}><b>✔️</b></button>
        </div>

        <div id="event-list" className="vertical-container top-margin gap-1">
            {game?.bingoEvents.length > 0 
                ? game?.bingoEvents.map(item => (
                    <div key={item} id="event-list-entry" className="horizontal-container gap-1 space-between">
                        <div className="event-list-item" onClick={() => handleItemSelection(item)}>{item}</div>
                        <button className="unset primary" onClick={() => removeItem(item)}>🗑️</button> 
                    </div>
                 ))
                : <span className="center small">Noch keine Ereignisse angelegt.</span>
            }
        </div>
    </div>);
}
