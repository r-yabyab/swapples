import { useState } from "react";
import Board from "./components/Board";

function App() {

  // const [tracking, setTracking] = useState(null);
  const [tracking, setTracking] = useState({
    initialCell: null,
    targetCell: null,
    count: 0,
  });

  return (
<>

<div className=" bg-blue-500">App.js</div>

<Board rows={8} cols={8} setTracking={setTracking} />

      <div>
        <div className="flex-col">
          <div>tracking:</div>
          <div>Initial {tracking.initialCell}</div>
          <div>Target {tracking.targetCell}</div>
        </div>
        <div>
          <div>success: {tracking.count}</div>
        </div>
      </div>


</>
  );
}

export default App;
