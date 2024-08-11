import { useEffect, useState } from "react";
import Board from "./components/Board";
import { BoardOptions } from "./config/BoardOptions";
import './index.css'

function App() {

  // const [tracking, setTracking] = useState(null);
  const [tracking, setTracking] = useState({
    initialCell: null,
    targetCell: null,
    count: 0,
  });

  const [fruitsMatched, setFruitsMatched] = useState(0)

  const [flash, setFlash] = useState(false)

  useEffect(() => {
    if (tracking.count > 0) {
      // Trigger the flash effect
      setFlash(true);
      // Remove the flash effect after 1 second
      const timer = setTimeout(() => {
        setFlash(false);
      }, 200);

      return () => clearTimeout(timer); // Clean up the timer
    }
  }, [tracking.count]);

  return (
<>

<div className=" bg-blue-500">App.js</div>

<Board rows={BoardOptions.rows} cols={BoardOptions.cols} setTracking={setTracking} setFruitsMatched={setFruitsMatched} />

      <div>
        <div className="flex-col">
          <div>tracking:</div>
          <div>Initial {tracking.initialCell}</div>
          <div>Target {tracking.targetCell}</div>
        </div>
        <div>
        <div className={`success-box ${flash ? 'flash' : ''}`}>Matches: {tracking.count}</div>
        <div className={`success-box ${flash ? 'flash' : ''}`}># of fruits matched: {fruitsMatched}</div>
        
        </div>
      </div>


</>
  );
}

export default App;
