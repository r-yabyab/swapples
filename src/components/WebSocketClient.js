import React, { useEffect, useState } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

const BROKER_URL = 'ws://localhost:8080/gs-guide-websocket'

export default function WebSocketClient () {

    const [game, setGame] = useState(null);

    useEffect(() => {
      // Create a new STOMP client
      const client = new Client({
        brokerURL: BROKER_URL, // Replace with your WebSocket endpoint
        reconnectDelay: 5000,
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
    }, []);

}