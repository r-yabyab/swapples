import React, { useEffect, useState } from 'react';
import { Client } from '@stomp/stompjs';

const BROKER_URL = 'ws://localhost:8080/gs-guide-websocket'

export default function WebSocketClient ({ game, setGame, clientRef, board, setBoard }) {

  // const clientRef = useRef(null);
  const [connectionAttempts, setConnectionAttempts] = useState(0);
  const [isConnected, setIsConnected] = useState(false);

  // const [board1, setBoard1] = useState([])

  useEffect(() => {

    const client = new Client({
      brokerURL: BROKER_URL, // Replace with your WebSocket endpoint
      reconnectDelay: 1000,
      onConnect: () => {
        console.log('Connected to WebSocket');
        setIsConnected(true)
        setConnectionAttempts(0)

        // Subscribe to the /topic/game destination
        client.subscribe('/topic/game', (message) => {
          const receivedGame = JSON.parse(message.body);
          console.log(receivedGame)
          setGame(receivedGame);
        });

        client.publish({
          destination: '/app/hello',
          body: 'rejoin',
        });
        console.log("Connected with 'rejoin'")

        // Sub to /topic/board for generating board
        client.subscribe('/topic/board', (message) => {
          const receivedBoard = JSON.parse(message.body);
          console.log(receivedBoard)
          setBoard(receivedBoard.board)
        })

        client.publish({
          destination: '/app/generateBoard',
          body: 'generate'
        })

      },
      onStompError: (frame) => {
        console.error('Broker reported error: ' + frame.headers['message']);
        console.error('Additional details: ' + frame.body);
      },
      onWebSocketClose: () => {
        console.log('WebSocket closed, retrying connection...');
        setIsConnected(false);
        setConnectionAttempts((prevAttempts) => prevAttempts + 1); // Increment attempt count
      },
    });

    clientRef.current = client;
    console.log('clientRef:', clientRef.current);

    // Activate the client
    client.activate();

    // Cleanup on unmount
    return () => {
      client.deactivate();
    };
  }, []);

    const sendBeginMessageToWebsocket = () => {
      // .connected is found in _stompHandler { connected: true } 
      // this will set _stompHandler.active to true
      if (clientRef.current && clientRef.current.connected) {
        console.log("Hello clientref reached")
        clientRef.current.publish({
          destination: '/app/hello',
          body: 'begin'
        });
        clientRef.current.publish({
          destination: '/app/generateBoard',
          body: 'generate'
        })
        console.log('clientRef:', clientRef.current.connected);
        // console.log('clientRef:', clientRef.current);
      }

    }

    return (
        <>
            {(game.gameState === 2 || game.gameState === 0) && 
            <button onClick={sendBeginMessageToWebsocket}>Start Game</button>
            }

{!isConnected && <div className='absolute text-lg bg-red-500'>Unable to connect to websocket. Attempts: {connectionAttempts}</div>}
        </>
    );

}