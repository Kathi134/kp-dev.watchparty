import { useCallback, useEffect, useState } from 'react';
import './lobby.css'
import { API_URL } from '../global/api';
import EditableText from '../global/components/EditableText';

export default function LobbyHub({lobby, me, onStartGame}) {
    const [lobbyName, setLobbyName] = useState(lobby?.name)

    useEffect(() => {
        setLobbyName(lobby.name)
    }, [lobby])

    const handleLobbyNameEdit = useCallback((newValue) => {
        fetch(`${API_URL}/lobbies/${lobby.id}/name`, { 
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: newValue
        })
            .then(res => res.json())
            .then(data => setLobbyName(data.name))
            .catch(console.error);
    }, [lobby.id])

    const handleMemberNameEdit = useCallback((newValue) => {
        fetch(`${API_URL}/lobbies/${lobby.id}/members/${me.id}/name`, { 
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: newValue
        })
            .then(res => res.json())
            .then(data => {
                const updatedMe = data.members.find(x => x.id === me.id)
                const storageKey = `lobby:${lobby.id}:me`;
                localStorage.setItem(storageKey, JSON.stringify(updatedMe));
            })
            .catch(console.error);
    }, [lobby.id, me.id])

    return (
        <div className="vertical-container center gap-1">
            <div>
                <h2 className='break-anywhere no-bottom-margin'>
                    Lobby <EditableText inputFieldClassName="h2" onSave={handleLobbyNameEdit}>{lobbyName}</EditableText>
                </h2>
                <div className='small top-margin vertical-container'>
                    <span>↗️ Teile diese Id zum Beitreten:</span>
                    <span>{lobby.id}</span>
                </div>
            </div>
        
            <div>
                <h3 className='no-bottom-margin'>Spieler*innen:</h3>
                <div id="member-container" className='top-margin'>
                    {lobby.members?.map(member => (
                        <div key={member.id} className={member.id === me.id ? 'marked' : ''}>
                            {member.id === me.id 
                                ? <EditableText inputFieldClassName='marked' onSave={handleMemberNameEdit}>{member.name}</EditableText>
                                : member.name
                            }
                        </div>
                    ))}
                </div>
            </div>
            
            <div className='top-margin'>
                <button onClick={onStartGame}>Spiel starten</button>
            </div>

            <div className='top-margin'>
                <span className='small'>💡 Doppelklicke den Lobbynamen oder deinen Namen,<br/>um ihn zu ändern.</span>
            </div>
        </div>
    );
}