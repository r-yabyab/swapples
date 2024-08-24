import './index.css'
import GameBoardComponent from "./components/game/GameBoardComponent";
import { Route, Routes } from 'react-router-dom';
import Lobby from './components/lobby/Lobby';

function App() {

  return (
    <>
      <div className="h-screen w-screen bg-gradient-to-t from-cyan-400 to-teal-400">

        <Routes>
          {/* <Route path="/" element={<Lobby />} /> */}
          {/* <Route path="/game" element={<GameBoardComponent />} /> */}
          <Route path="/" element={<GameBoardComponent />} />

        </Routes>
      </div>
    </>
  )

}

export default App;
