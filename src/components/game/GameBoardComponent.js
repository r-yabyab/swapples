import { useEffect, useRef, useState } from "react";
import Board from "./Board";
import { BoardOptions } from "../../config/BoardOptions";
import Volume from "./Volume";
import WebSocketClient from "./WebSocketClient";
import { Client } from "@stomp/stompjs";
import CountdownTimer from "./CountdownTimer";

// 
const BROKER_URL = 'ws://localhost:8080/gs-guide-websocket'

export default function GameBoardComponent() {

  const clientRef = useRef(null);


  // const [tracking, setTracking] = useState(null);
  const [tracking, setTracking] = useState({
    initialCell: null,
    targetCell: null,
    count: 0,
  });

  const [fruitsMatched, setFruitsMatched] = useState(0)
  const [flash, setFlash] = useState(false)
      // 0 = not started, 1 = started, 2 = ended, 3 = preStart
      // private int gameState;
  const [gameState, setGameState] = useState(0)
  const [game, setGame] = useState({
    gameState: 0,
    score: null,
    timer: null
  });
  const [startGameState, setStartGameState] = useState(false)
  // const [isGameActive, setIsGameActive] = useState(false)
  const [gameEndTime, setGameEndTime] = useState(null);
  // const [timeLeft, setTimeLeft] = useState(0);
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

  // useEffect(() => {
  //   if (game.gameState == 1 && gameEndTime) {
  //     // Set initial time left
  //     setTimeLeft(Math.max(Math.floor((gameEndTime - Date.now()) / 1000), 0));

  //     // Update the countdown every second
  //     const intervalId = setInterval(() => {
  //       const remainingTime = Math.max(Math.floor((gameEndTime - Date.now()) / 1000), 0);
  //       setTimeLeft(remainingTime);

  //       if (remainingTime <= 0) {
  //         clearInterval(intervalId);
  //         endGame();
  //       }
  //     }, 1000);

  //     // Clear interval on component unmount
  //     return () => clearInterval(intervalId);
  //   }
  // }, [game.gameState, gameEndTime]);

  const startGame = () => {
    // setPreStart("Ready")


    // setTimeout(() =>{
    //   setGameState(1);
    //   const endTime = Date.now() + 10000; // Set the end time to 60 seconds from now
    //   setGameEndTime(endTime);
    //   setPreStart("Playing")
    // }, 1000)

    setGame({
      gameState: 3
    })
    console.log(startGameState)
    // setTimeout(() => {
    //   setStartGameState(false)
    //   console.log(startGameState)
    // }, 500)

  };

  const endGame = () => {
    setGameState(2);
    setGameEndTime(null);
    setPreStart("Done")
  };

  const connectToGame = () => {
    const client = new Client({
      brokerURL: BROKER_URL, // Replace with your WebSocket endpoint
      reconnectDelay: 1000,
      onConnect: () => {
        console.log('Connected to WebSocket');

        // Subscribe to the /topic/game destination
        client.subscribe('/topic/game', (message) => {
          const receivedGame = JSON.parse(message.body);
          console.log(receivedGame)
          setGame(receivedGame);
        });

        // Send the "begin" message to /app/hello
        client.publish({
          destination: '/app/hello', // Matches the @MessageMapping("/hello") in your Spring controller
          body: 'begin',
        });
      },
      onStompError: (frame) => {
        console.error('Broker reported error: ' + frame.headers['message']);
        console.error('Additional details: ' + frame.body);
      },
    });

    // Activate the client
    client.activate();

    // Cleanup on unmount
    return () => {
      client.deactivate();
    };
  }

  const reConnectToGame = () => {
    const client = new Client({
      brokerURL: BROKER_URL, // Replace with your WebSocket endpoint
      reconnectDelay: 1000,
      onConnect: () => {
        console.log('Connected to WebSocket');

        // Subscribe to the /topic/game destination
        client.subscribe('/topic/game', (message) => {
          const receivedGame = JSON.parse(message.body);
          console.log(receivedGame)
          setGame(receivedGame);
        });

        // Send the "begin" message to /app/hello
        client.publish({
          destination: '/app/hello', // Matches the @MessageMapping("/hello") in your Spring controller
          body: 'rejoin',
        });
      },
      onStompError: (frame) => {
        console.error('Broker reported error: ' + frame.headers['message']);
        console.error('Additional details: ' + frame.body);
      },
    });

    // Activate the client
    client.activate();

    // Cleanup on unmount
    return () => {
      client.deactivate();
    };
  }

  return (
<>

<div className=" bg-blue-500">App.js</div>

      <div>
        {/* {gameState == 1 ? `Time Left: ${timeLeft} seconds` : 'Game Over'} */}
      </div>

      <div className=" flex flex-col absolute -translate-x-1/2 left-1/2 bg-white p-3 rounded-lg">
        <div className="w-[98%] ml-1 mb-1">
        <CountdownTimer
          game={game}
          clientRef={clientRef}
        />
        </div>
        <div className="">
        <Board
          rows={BoardOptions.BOARD_ROWS}
          cols={BoardOptions.BOARD_COLUMNS}
          setTracking={setTracking}
          setFruitsMatched={setFruitsMatched}
          gameState={game.gameState}
          volume={volume}
        />
        </div>

        <div className="absolute text-8xl  bg-zinc-200 top-1/2 -translate-y-[50%] 0">
          {preStart === "Ready" && "Ready?"}
          <WebSocketClient
            game={game}
            setGame={setGame}
            startGameState={startGameState}
            connectToGame={connectToGame}
            reConnectToGame={reConnectToGame}
            clientRef={clientRef}
          />
          {/* <div onClick={startGame} className="hover:cursor-pointer hover:bg-green-400">{preStart === "New" && "Start game"}</div> */}
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
        {game.gameState == 0 || game.gameState == 2 && (
          <button onClick={startGame}>Start Game</button>
        )
        }
      </div>

      <div>
        <Volume setVolume={setVolume} volume={volume} />
      </div>

      {game ? (
        <div>
          <div className='font-bold'>Websocket Data From Spring Boot:</div>
          <div>
            <h1>Game State: {game.gameState}</h1>
            <p>Timer: {game.timer}</p>
            <p>Score: {game.score}</p>
          </div>
        </div>
      ) : (
        <p>Waiting for game data...</p>
      )}



    </>
  );
}