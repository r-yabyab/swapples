import React, { useEffect, useRef, useState } from 'react';
import { Client } from '@stomp/stompjs';

const BROKER_URL = 'ws://localhost:8080/gs-guide-websocket'

export default function WebSocketClient ({ game, setGame, startGameState, connectToGame, reConnectToGame }) {

  const clientRef = useRef(null);

  useEffect(() => {

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

          client.publish({
            destination: '/app/hello',
            body: 'rejoin',
          });
          console.log("Connected with 'rejoin'")
        
      },
      onStompError: (frame) => {
        console.error('Broker reported error: ' + frame.headers['message']);
        console.error('Additional details: ' + frame.body);
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
        })
        console.log("Sent 'begin' msg to websocket")
        console.log('clientRef:', clientRef.current);
      }

    }

    return (
        <>
            {(game.gameState === 2 || game.gameState === 0) && 
            <button onClick={sendBeginMessageToWebsocket}>Start Game</button>
            }
        </>
    );

}