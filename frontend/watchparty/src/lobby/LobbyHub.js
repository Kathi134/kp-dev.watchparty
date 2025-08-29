import './lobby.css'

export default function LobbyHub({lobby, me, onStartGame}) {
    return (
        <div className="vertical-container center">
            <h2>Lobby {lobby.id}</h2>
            <h3>Mitglieder:</h3>
            <ul>
                {lobby.members?.map(member => (
                    <li key={member.id} className={member.id === me.id ? 'marked' : ''}>{member.name} ({member.id})</li>
                ))}
            </ul>
            <button onClick={onStartGame}>Spiel starten</button>
        </div>
    );
}