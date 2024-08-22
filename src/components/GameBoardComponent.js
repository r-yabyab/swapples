import { useEffect, useState } from "react";
import Board from "./Board";
import { BoardOptions } from "../config/BoardOptions";
import '../index.css'
import Volume from "./Volume";
import WebSocketClient from "./WebSocketClient";

// 
export default function GameBoardComponent() {


  // const [tracking, setTracking] = useState(null);
  const [tracking, setTracking] = useState({
    initialCell: null,
    targetCell: null,
    count: 0,
  });

  const [fruitsMatched, setFruitsMatched] = useState(0)
  const [flash, setFlash] = useState(false)
      // 0 = not started, 1 = started, 2 = ended
      // private int gameState;
  const [gameState, setGameState] = useState(0)
  // const [isGameActive, setIsGameActive] = useState(false)
  const [gameEndTime, setGameEndTime] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [preStart, setPreStart] = useState("New")

  const [volume, setVolume] = useState(0.25)

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
    if (gameState == 1 && gameEndTime) {
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
  }, [gameState, gameEndTime]);

  const startGame = () => {
    setPreStart("Ready")


    setTimeout(() =>{
      setGameState(1);
      const endTime = Date.now() + 10000; // Set the end time to 60 seconds from now
      setGameEndTime(endTime);
      setPreStart("Playing")
    }, 1000)

  };

  const endGame = () => {
    setGameState(2);
    setGameEndTime(null);
    setPreStart("Done")
  };

  return (
<>

<div className=" bg-blue-500">App.js</div>

      <div>
        {gameState == 1 ? `Time Left: ${timeLeft} seconds` : 'Game Over'}
      </div>

      <div className="relative">
          <Board
            rows={BoardOptions.BOARD_ROWS}
            cols={BoardOptions.BOARD_COLUMNS}
            setTracking={setTracking}
            setFruitsMatched={setFruitsMatched}
            gameState={gameState}
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
        {gameState == 0 || gameState == 2 && (
          <button onClick={startGame}>Start Game</button>
        )
        }
      </div>

      <div>
        <Volume setVolume={setVolume} volume={volume} />
      </div>

<WebSocketClient />

    </>
  );
}