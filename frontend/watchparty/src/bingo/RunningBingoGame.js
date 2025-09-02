import { useState, useEffect, useCallback } from "react";
import Board from "./Board";
import { API_URL } from "../global/api";
import { useWebSocket } from "../global/useWebSocket";

export default function RunningBingoGame({game, me, lobbyId}) {
    // const [game, setGame] = useState(gameInit);
    const [boards, setBoards] = useState(game.boards);
    const [myBoard, setMyBoard] = useState({});

    useWebSocket(`/topic/lobby/${lobbyId}/game`, (game) => setBoards(game.boards));

    useEffect(() => {
        if(!me)
            return

        fetch(`${API_URL}/lobbies/${lobbyId}/game/boards/${me?.id}`)
            .then(data => data.json())
            .then(res => setMyBoard(res))
            .catch(console.error);
    }, [lobbyId, me])

    const handleCellClick = useCallback((_,__,value) => {
        fetch(`${API_URL}/lobbies/${lobbyId}/game/boards/${me?.id}/ticks`, {
            method: 'PUT',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify([value])
        })
            .then(data => data.json())
            .then(res => setMyBoard(res))
            .catch(console.error);
    }, [me, lobbyId])

    const transformFlatListToValues = (values, elementExtractor) => {
        var arr = Object.entries(values ?? []) 
        const result = {};
        let idx = 0;
        const size = Math.sqrt(arr.length);

        for (let row = 0; row < size; row++) {
            for (let col = 0; col < size; col++) {
                if (idx < arr.length) {
                    result[`${row}-${col}`] = elementExtractor(arr[idx]);
                    idx++;
                }
            }
        }

        return result;
    }

    const transformFlatListToIndexedEvents = (values) => 
        transformFlatListToValues(values, (obj)=>obj[0]);

    const transformFlatListToCrossedValues = (values) =>
        transformFlatListToValues(values, (obj)=>obj[1]);


    return (<div>

        <div className="section-container vertical-container center">
            <h3>Mein Bingo Board</h3>
            <span className="small">Klicke ein Feld an, um es abzuhaken.</span>
            <Board size={myBoard?.size} className="top-margin"
                onClickCell={handleCellClick} hoverable={true}
                values={transformFlatListToIndexedEvents(myBoard?.events)} 
                crossedValues={transformFlatListToCrossedValues(myBoard?.events)}/>
        </div>

        <div className="section-container vertical-container center">
            <h3>Bingo Boards der Mitspieler*innen</h3>
            {boards.filter(b => b.ownerId !== me.id).map(b => <>
                <span className="small">Board von {b.ownerName}</span>
                <Board size={b.size} className='top-margin'
                    values={transformFlatListToIndexedEvents(b.events)} 
                    crossedValues={transformFlatListToCrossedValues(b.events)}/>
            </>)}
        </div>
    </div>)   
}