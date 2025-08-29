

export default function LobbyList({lobbies, onLobbyClick}) {    
    return (<>
        {lobbies.length 
        ? <ul>
                {lobbies.map(l => 
                    <li key={l.id} onClick={() => onLobbyClick(l.id)}>
                        Lobby {l.id} ({l.members.length} Mitglieder)
                    </li>
                )}
            </ul>
            : "Keine Lobbies zur Verfügung."}
    </>);
}