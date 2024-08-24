import { useEffect, useState } from "react";

export default function CountdownTimer({ game }) {
    const [timeLeft, setTimeLeft] = useState(null);
    const [initialTime, setInitialTime] = useState(null);
    const [lastUpdateTime, setLastUpdateTime] = useState(Date.now());
  
    useEffect(() => {
      if (game.timerStart) {
        // Convert timerStart to milliseconds and initialize state
        const startTimeMs = game.timerStart * 1000;
        setInitialTime(startTimeMs); // Initialize initialTime
        setTimeLeft(startTimeMs); // Initialize timeLeft
      }
    }, [game.timerStart]);
  
    useEffect(() => {
      if (game.gameState === 1) {
        // Update timeLeft from WebSocket data
        if (game.timer) {
          setTimeLeft(game.timer * 1000); // Convert seconds to milliseconds
        }
      }
    }, [game.timer, game.gameState]);
  
    useEffect(() => {
      if (game.gameState === 1 && timeLeft !== null && initialTime !== null) {
        const intervalId = setInterval(() => {
          const currentTime = Date.now();
          const elapsedTime = currentTime - lastUpdateTime;
          
          setTimeLeft((prevTime) => {
            const newTime = prevTime - elapsedTime;
            if (newTime == 0) {
              clearInterval(intervalId);
              return 0;
            }
            return newTime;
          });
  
          setLastUpdateTime(currentTime);
        }, 10); // Update every 10 milliseconds
  
        return () => clearInterval(intervalId);
      }
    }, [game.gameState, timeLeft, initialTime, lastUpdateTime]);
  
    if (initialTime === null || timeLeft === null) {
      return <div>Loading...</div>;
    }
  
    const progress = (timeLeft / initialTime) * 100;
  
    return (
      <div>
        <div className="mb-[10px]">
          Time left: {(timeLeft / 1000).toFixed(3)} seconds
        </div>
        <div className="w-full bg-[#ccc]">
          <div
            style={{
              width: `${progress}%`,
              height: '30px',
              backgroundColor: 'green',
            }}
          />
        </div>
      </div>
    );
  }