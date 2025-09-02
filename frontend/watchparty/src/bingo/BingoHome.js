import "../global/basic.css"
import LobbyHome from "../lobby/LobbyHome";

export default function BingoHome() {
  const title = "Reality TV Bingo";

  return (<div className="vertical-container center space-between">
    <h1>{title}</h1>

    <main>
      <div id="join-lobby" className="vertical-container center top-margin section-container">
          <h2 className="no-top-margin">Los geht's!</h2>
          <LobbyHome/>
      </div>

      <div id="info" className="top-margin vertical-container small center">
        <h3>Wie funktioniert {title}?</h3>
        <div className="vertical-container gap-1 center">
          <span>👪 Sammle dich mit deinen Freund*innen in einer Lobby, um gemeinsam zu spielen.</span>
          <span>📋 Erstellt eine Liste mit Ereignissen oder Begriffen, von denen ihr glaubt, dass sie während eurer Watchparty in der Serie auftreten werden.</span>
          <span>🖋️ Legt die Größe eurer BingoBoards fest und verteilt die Events auf die Felder.</span>
          <span>🎲 Kreuzt Felder ab, vergleicht eure Boards und sammelt Bingos!</span>
        </div>
      </div>
    </main>
  </div>);
}