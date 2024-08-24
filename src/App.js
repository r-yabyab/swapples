import './index.css'
import GameBoardComponent from "./components/game/GameBoardComponent";
import { Route, Routes } from 'react-router-dom';
import Lobby from './components/lobby/Lobby';

function App() {

  return (
    <>

    <Routes>
      {/* <Route path="/" element={<Lobby />} /> */}
      {/* <Route path="/game" element={<GameBoardComponent />} /> */}
      <Route path="/" element={<GameBoardComponent />} />

    </Routes>
    </>
  )
 
}

export default App;
