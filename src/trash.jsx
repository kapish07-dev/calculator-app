import React, { useState, useEffect } from "react";
import "./app.css";
import { evaluate } from "mathjs";

function App() {
  const [input, setInput] = useState("");
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);

  // ✅ Simple click sound
  const clickSound = new Audio(
    "https://cdn.pixabay.com/download/audio/2022/03/15/audio_7a61f15b74.mp3?filename=click-button-140881.mp3"
  );
  clickSound.volume = 0.3;

  const handleClick = (value) => {
    playClick();

    if (value === "=") {
      calculateResult();
    } else if (value === "Clear") {
      setInput("");
    } else if (value === "History") {
      setShowHistory(!showHistory);
    } else {
      setInput((prev) => prev + value);
    }
  };

  // ✅ Separate function for evaluation
  const calculateResult = () => {
    try {
      const result = evaluate(input).toString();
      setHistory((prev) => [...prev, `${input} = ${result}`]);
      setInput(result);
    } catch (error) {
      setInput("Error");
    }
  };

  // ✅ Play sound safely
  const playClick = () => {
    const sound = clickSound.cloneNode();
    sound.play().catch(() => {});
  };

  // ✅ Handle Keyboard Input (numbers, operators, enter, =, etc.)
  useEffect(() => {
    const handleKeyDown = (event) => {
      const { key } = event;

      if (/^[0-9+\-*/.%]$/.test(key)) {
        setInput((prev) => prev + key);
        playClick();
      }
      // ✅ Handle Enter or "=" key as "Evaluate"
      else if (key === "Enter" || key === "=") {
        playClick();
        calculateResult();
      }
      // Backspace
      else if (key === "Backspace") {
        playClick();
        setInput((prev) => prev.slice(0, -1));
      }
      // Escape → Clear
      else if (key === "Escape") {
        playClick();
        setInput("");
      }
      // H / h → Toggle History
      else if (key.toLowerCase() === "h") {
        playClick();
        setShowHistory((prev) => !prev);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [input]);

  const buttons = [
    { label: "=", className: "upBtn equalBtn" },
    { label: "Clear", className: "upBtn clearBtn" },
    { label: "History", className: "upBtn historyBtn" },
    { label: "7", className: "btn" },
    { label: "8", className: "btn" },
    { label: "9", className: "btn" },
    { label: "+", className: "btnOp" },
    { label: "4", className: "btn" },
    { label: "5", className: "btn" },
    { label: "6", className: "btn" },
    { label: "-", className: "btnOp" },
    { label: "1", className: "btn" },
    { label: "2", className: "btn" },
    { label: "3", className: "btn" },
    { label: "*", className: "btnOp" },
    { label: "00", className: "btn" },
    { label: "0", className: "btn" },
    { label: ".", className: "btn" },
    { label: "%", className: "btnOp" },
  ];

  return (
    <div className="container">
      <input disabled id="inputbox" placeholder="0" value={input} />

      <div className="keypad">
        <div className="upper">
          {buttons.slice(0, 3).map((btn, i) => (
            <button
              key={i}
              className={btn.className}
              onClick={() => handleClick(btn.label)}
            >
              {btn.label}
            </button>
          ))}
        </div>

        <div className="lower">
          {buttons.slice(3).map((btn, i) => (
            <button
              key={i + 3}
              className={btn.className}
              onClick={() => handleClick(btn.label)}
            >
              {btn.label}
            </button>
          ))}
        </div>
      </div>

      {/* History Panel */}
      {showHistory && (
        <div className="history-panel">
          <h4>History</h4>
          <ul>
            {history.length === 0 && <li>No calculations yet.</li>}
            {history.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default App;
