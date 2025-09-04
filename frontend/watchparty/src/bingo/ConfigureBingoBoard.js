import "../global/basic.css"
import { useCallback, useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { useWebSocket } from "../global/useWebSocket";
import Board from "./Board";
import { API_URL } from "../global/api";
import HorizontalSelector from "../global/components/HorizontalSelector";


export default function ConfigureBingoBoard({lobby, me, selectedItem, unsetSelectedItem, onSetupStateChange}) {
    const { id: lobbyId } = useParams();
    const [game, setGame] = useState(lobby?.game);
    
    const [size, setSize] = useState(0);
    const [cellValues, setCellValues] = useState({});
    
    useWebSocket(`/topic/lobby/${lobbyId}/game`, setGame)
    
    const configComplete = useMemo(() => {
        return size > 0 &&  Object.keys(cellValues).length === size * size 
    }, [size, cellValues])

    const hasSelectedItem = useMemo(() => {
        return selectedItem && selectedItem !== ""
    }, [selectedItem])

    const bingoSizeOptions = useMemo(() => {
        const len = game?.bingoEvents?.length ?? 0;
        const max = Math.floor(Math.sqrt(len));
        return Array.from({length: Math.max(0, max-1)}, (_,i) => i+2);
    }, [game]);

    useEffect(() => {
        if(!bingoSizeOptions.find(x=>x===size))
            setSize(bingoSizeOptions[bingoSizeOptions.length-1]);
    }, [bingoSizeOptions, size])
    
    const handleSelectCell = (rowIdx, colIdx, _) => {
        if(!hasSelectedItem)
            return

        const key = rowIdx + "-" + colIdx
        cellValues[key] = selectedItem;
        setCellValues({...cellValues})
        unsetSelectedItem();
    }

    const assignRandom = useCallback(() => {
        // shuffle allItems, map to a object of "key"->"item"
        const shuffled = [...(lobby.game.bingoEvents)].sort(() => Math.random() - 0.5);

        const indices = Array.from({ length: size }, (_, row) => Array.from({ length: size }, (_, col) => `${row}-${col}`)).flat();
        const assignments = indices
            .map((key, i) => [key, shuffled[i]])
            .reduce((acc, [key, val]) => ({ ...acc, [key]: val }), {});

        setCellValues(assignments);
        unsetSelectedItem();
    }, [lobby, size, unsetSelectedItem])

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
        
        <div className="section-container">
            <h3>Bingo Board konfigurieren</h3>
            
            <div className="center vertical-container gap-1">
                <div>Wähle die Größe deines Bingo Boards:</div>
                {bingoSizeOptions.length <= 0
                    ? <span>Mindestens 4 Bingo-Events nötig.</span>
                    : <HorizontalSelector selected={size} options={bingoSizeOptions} onChange={setSize} className='primary'/> 
                }
            </div>

            {size > 0 && (<>
                <div className="top-margin center horizontal-container">
                    <Board size={size} onClickCell={handleSelectCell} values={cellValues} hoverable={hasSelectedItem}/>
                </div>

                <div className="top-margin vertical-container center">
                    {hasSelectedItem
                        ? <>
                            <span>Platziere das gewählte Ereignis</span>
                            <span className="justify marked">"{selectedItem}"</span>
                        </>
                        : <span className="small"> 
                            💡Wähle ein Ereignis aus der Liste und klicke dann das Bingofeld an, auf dem es platziert werden soll.
                        </span>
                    }
                </div>

                <div className="top-margin vertical-container center">
                    <button onClick={assignRandom} className="small">Alle Felder zufällig befüllen</button>
                </div>
            </>)}
        </div>

        {configComplete > 0 && 
            <div className="section-container center">
                <button onClick={storeBingoBoardConfig}>Konfiguration abschließen</button>
            </div>
        }
    </div>);
}

// TODO: hover auf cell nur möglich wenn ereignis ausgewählt
// TODO: keine doppelten ereignis belegungen
// TODO: leere bingo cells markieren
// TODO: weiter nur klickbar wenn alle felder befüllt
// TODO: events in feldern tauschen