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
    const [showDetails, setShowDetails] = useState(false);
    
    useWebSocket(`/topic/lobby/${lobbyId}/game`, setGame)
    
    const [selectedItem, setSelectedItem] = useState("");
    const [setupComplete, setSetupComplete] = useState(false);

    const updateSetupStatus = useCallback(() => {
        fetch(`${API_URL}/lobbies/${lobbyId}/game/configured/${me.id}`)
            .then(data => data.json())
            .then(res => setSetupComplete(res))
            .catch(console.error);
    }, [me, lobbyId]);

    const checkSelectedItemAfterRemoval = useCallback((removedItem) => {
        if(removedItem === selectedItem)
            setSelectedItem("");
    }, [selectedItem]);

    useEffect(() => {
        updateSetupStatus(me);
    }, [me, updateSetupStatus])

    return (
        <div>
            <h2 className="hoverable" onClick={() => setShowDetails(!showDetails)}>Bingo {lobby?.name}</h2>
            { showDetails && 
                <div className='small top-margin vertical-container center'>
                    <span>↗️ Teile diese Id zum Beitreten:</span>
                    <span>{lobby.id}</span>
                </div>}

            {setupComplete 
                ? <RunningBingoGame game={game} me={me} lobbyId={lobby.id}/>
                : <div id="setup-container" className="vertical-container">
                    <CollectBingoEvents updateGameObject={setGame} handleItemSelection={setSelectedItem} onRemove={checkSelectedItemAfterRemoval} game={game} />
                    <ConfigureBingoBoard lobby={lobby} me={me} game={game}
                        selectedItem={selectedItem} unsetSelectedItem={() => setSelectedItem("")} 
                        onSetupStateChange={updateSetupStatus} />
                </div>
            }
        </div>
    );
}
