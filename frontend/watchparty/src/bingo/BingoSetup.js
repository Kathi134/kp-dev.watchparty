import "./setup.css";
import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useWebSocket } from "../global/useWebSocket";
import CollectBingoEvents from "./CollectBingoEvents";
import ConfigureBingoBoard from "./ConfigureBingoBoard";
import RunningBingoGame from "./RunningBingoGame";
import { API_URL } from "../global/api";

// TODO: rename from Setup to BingoDetail or sth
export default function BingoSetup({lobby, me}) {
    const { id: lobbyId } = useParams();
    const [game, setGame] = useState(lobby.game);
    
    useWebSocket(`/topic/lobby/${lobbyId}/game`, setGame)
    
    const [selectedItem, setSelectedItem] = useState("");
    const [setupComplete, setSetupComplete] = useState(false);

    const updateSetupStatus = useCallback(() => {
        fetch(`${API_URL}/lobbies/${lobbyId}/game/configured/${me.id}`)
            .then(data => data.json())
            .then(res => setSetupComplete(res))
            .catch(console.error);
    }, [me, lobbyId]);

    useEffect(() => {
        updateSetupStatus(me);
    }, [me, updateSetupStatus])

    return (
        <div>
            <h2>Bingo {game?.id}</h2>

            {setupComplete 
                ? <RunningBingoGame game={game} me={me} lobbyId={lobby.id}/>
                : <div id="setup-container" className="vertical-container">
                    <CollectBingoEvents updateGameObject={setGame} handleItemSelection={setSelectedItem} game={game} />
                    <ConfigureBingoBoard lobby={lobby} me={me} selectedItem={selectedItem} unsetSelectedItem={() => setSelectedItem("")} onSetupStateChange={updateSetupStatus} />
                </div>
            }
        </div>
    );
}
