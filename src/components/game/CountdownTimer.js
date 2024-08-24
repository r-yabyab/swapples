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

            <div className=" bg-zinc-600 rounded-lg relative mb-2">
                <div
                    className="h-[40px] bg-yellow-400 rounded-lg shadow-md shadow-black"
                    style={{
                        width: `${progress}%`,
                    }}
                />
                <div className="absolute inset-x-0 bottom-0 h-[15px] bg-gradient-to-t from-amber-500 via-amber-500 to-transparent rounded-b-lg"
                    style={{
                        width: `${progress}%`,
                    }} />
                <div className="absolute inset-x-0 top-0 h-[5px] bg-gradient-to-b from-amber-100 via-amber-100 to-transparent rounded-b-lg"
                    style={{
                        width: `${progress}%`,
                    }} />
                <div className=" absolute text-shadow -translate-x-1/2 left-1/2 top-1/2 -translate-y-1/2 text-zinc-100 font-bold inner-shadow text-3xl">
                    {(timeLeft / 1000).toFixed(1)}
                </div>
            </div>
        </div>
    );
}