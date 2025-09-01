import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { useWebSocket } from "../global/useWebSocket";
import Board from "./Board";
import { API_URL } from "../global/api";

import "../global/basic.css"

export default function ConfigureBingoBoard({lobby, me, selectedItem, onSetupStateChange}) {
    const { id: lobbyId } = useParams();
    const [game, setGame] = useState(lobby?.game);
    
    const [size, setSize] = useState(0);
    const [cellValues, setCellValues] = useState({});
    
    useWebSocket(`/topic/lobby/${lobbyId}/game`, setGame)
    
    const bingoSizeOptions = useMemo(() => {
        const len = game?.bingoEvents?.length ?? 0;
        const max = Math.floor(Math.sqrt(len));
        return Array.from({length: Math.max(0, max-1)}, (_,i) => i+2);
    }, [game]);

    const handleOptionSelection = (e) => {
        setSize(e.target.value);
    }
    
    const handleSelectCell = (rowIdx, colIdx, _) => {
        const key = rowIdx + "-" + colIdx
        cellValues[key] = selectedItem;
        setCellValues({...cellValues})
    }

    const storeBingoBoardConfig = () => {
        const sortedValues = Object.keys(cellValues)
            .sort((a, b) => {
                const [rowA, colA] = a.split("-").map(Number);
                const [rowB, colB] = b.split("-").map(Number);

                if (rowA !== rowB) return rowA - rowB; // sort by row
                return colA - colB;                    // if same row, sort by column
            })
            // Step 2: Map to values only
            .map(key => cellValues[key]);

        const payload = {
            'memberId': me.id,
            'size': size,
            'values': sortedValues
        }
        fetch(`${API_URL}/lobbies/${lobbyId}/game/boards`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        }).then(data => data.json())
            .then(data => {
                setGame(data);
                onSetupStateChange();
            })
            .catch(console.error);
    }

    return (<div className="vertical-container">
        <h3>Bingo Board konfigurieren</h3>
        
        <div>
            <div>Wähle die Größe deines Bingo Boards:</div>
            {bingoSizeOptions.length <= 0
                ? <span>Mindestens 4 Bingo-Events nötig.</span>
                : <div>
                    {bingoSizeOptions.map(x => <span key={`radio-option-${x}`}>
                        <input type="radio" value={x} name="size" onChange={handleOptionSelection} />
                        <label htmlFor={x}>{x}</label>
                    </span>)}
                </div>
            }
        </div>

        <h3>Ereignisse anordnen</h3>
        <div className="fixed-container">
            Wähle ein Ereignis aus der Liste und klicke dann das bingo-feld an, auf dem es platziert werden soll. Alternativ kannst du auch
            <button>Alle Felder zufällig befüllen</button>
        </div>
        <div>Platziere das Ereignis "{selectedItem}"</div>
        <Board size={size} onClickCell={handleSelectCell} values={cellValues} hoverable={true}/>

        <h3>Konfiguration abschließen</h3>
        <div>Klicke <button onClick={storeBingoBoardConfig}>weiter</button>, um die Konfiguration abzuschließen.</div>
    </div>);
}

// TODO: hover auf cell nur möglich wenn ereignis ausgewählt
// TODO: keine doppelten ereignis belegungen
// TODO: leere bingo cells markieren
// TODO: weiter nur klickbar wenn alle felder befüllt