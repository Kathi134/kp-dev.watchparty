

export default function LobbyList({lobbies, onLobbyClick}) {    
    return (<>
        {lobbies.length 
          ? lobbies.map(l => 
                <span key={l.id} onClick={() => onLobbyClick(l.id)}>
                    Lobby <span className="small a">{l.id}</span> ({l.members.length})
                </span>
            )
          : "Keine Lobbies zur Verfügung."
        }
    </>);
}