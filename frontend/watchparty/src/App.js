import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "./global/MainLayout"
import BingoHome from "./bingo/BingoHome"
import Lobby from "./lobby/Lobby";

function App() {
  return (
    <BrowserRouter>
      <MainLayout>
        <Routes>
          <Route path="/" element={<BingoHome/>} /> {/*TODO: actual home with different watch party games*/}
          <Route path="/bingo" element={<BingoHome/>} />
          <Route path="/bingo/:id" element={<Lobby/>} />
        </Routes>
      </MainLayout>
    </BrowserRouter>
  );
}

export default App;
