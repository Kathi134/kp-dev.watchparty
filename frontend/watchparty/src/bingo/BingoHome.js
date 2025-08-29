import "../global/basic.css"
import LobbyHome from "../lobby/LobbyHome";

export default function BingoHome() {
  const title = "Reality TV Bingo";

  return (<>
    <h1>{title}</h1>

    <main>
        <div id="join-lobby" className="vertical-container center">
            <h2>Los geht's!</h2>

            <LobbyHome/>
        </div>

      <div id="info" className="vertical-container">
        <h2>Wie funktioniert {title}?</h2>
        <div></div>
      </div>
    </main>
  </>);
}