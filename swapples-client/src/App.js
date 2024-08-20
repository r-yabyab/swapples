import { useEffect, useState } from "react";
import Board from "./components/Board";
import { BoardOptions } from "./config/BoardOptions";
import './index.css'
import Volume from "./components/Volume";

function App() {

  // const [tracking, setTracking] = useState(null);
  const [tracking, setTracking] = useState({
    initialCell: null,
    targetCell: null,
    count: 0,
  });

  const [fruitsMatched, setFruitsMatched] = useState(0)
  const [flash, setFlash] = useState(false)
  const [isGameActive, setIsGameActive] = useState(false)
  const [gameEndTime, setGameEndTime] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [preStart, setPreStart] = useState("New")

  const [volume, setVolume] = useState(0.5)

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

  useEffect(() => {
    if (isGameActive && gameEndTime) {
      // Set initial time left
      setTimeLeft(Math.max(Math.floor((gameEndTime - Date.now()) / 1000), 0));

      // Update the countdown every second
      const intervalId = setInterval(() => {
        const remainingTime = Math.max(Math.floor((gameEndTime - Date.now()) / 1000), 0);
        setTimeLeft(remainingTime);

        if (remainingTime <= 0) {
          clearInterval(intervalId);
          endGame();
        }
      }, 1000);

      // Clear interval on component unmount
      return () => clearInterval(intervalId);
    }
  }, [isGameActive, gameEndTime]);

  const startGame = () => {
    setPreStart("Ready")


    setTimeout(() =>{
      setIsGameActive(true);
      const endTime = Date.now() + 10000; // Set the end time to 60 seconds from now
      setGameEndTime(endTime);
      setPreStart("Playing")
    }, 1000)

  };

  const endGame = () => {
    setIsGameActive(false);
    setGameEndTime(null);
    setPreStart("Done")
  };

  return (
<>

<div className=" bg-blue-500">App.js</div>

      <div>
        {isGameActive ? `Time Left: ${timeLeft} seconds` : 'Game Over'}
      </div>

      <div className="relative">
          <Board
            rows={BoardOptions.BOARD_ROWS}
            cols={BoardOptions.BOARD_COLUMNS}
            setTracking={setTracking}
            setFruitsMatched={setFruitsMatched}
            isGameActive={isGameActive}
            volume={volume}
          />
        <div className="absolute text-8xl  bg-zinc-200 top-1/2 -translate-y-[50%] 0">
          {preStart === "Ready" && "Ready?"}
          <div onClick={startGame} className="hover:cursor-pointer hover:bg-green-400">{preStart === "New" && "Start game"}</div>
          {preStart === "Done" && "Game Over"}
        </div>
      </div>


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


      <div>
        {!isGameActive && (
          <button onClick={startGame}>Start Game</button>
        )
        }
      </div>

      <div>
        <Volume setVolume={setVolume} volume={volume} />
      </div>


    </>
  );
}

export default App;
