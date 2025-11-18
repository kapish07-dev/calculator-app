import React, { useState, useEffect, useRef, useCallback } from "react";
import Calculator from "./components/Calculator";
import HistoryDrawer from "./components/HistoryDrawer";
import ThemeToggle from "./components/ThemeToggle";
import useLocalStorage from "./hooks/useLocalStorage";
import { evaluate } from "mathjs";
import "./App.css";

export default function App() {
  const [input, setInput] = useState("");
  const [history, setHistory] = useLocalStorage("calc_history_v1", []);
  const [theme, setTheme] = useLocalStorage("calc_theme", "light");
  const [showHistory, setShowHistory] = useState(false);

  const clickSoundRef = useRef(null);
  const equalSoundRef = useRef(null);

  useEffect(() => {
    clickSoundRef.current = new Audio(
      "https://cdn.pixabay.com/download/audio/2022/03/15/audio_7a61f15b74.mp3?filename=click-button-140881.mp3"
    );
    equalSoundRef.current = new Audio(
      "https://cdn.pixabay.com/download/audio/2021/08/04/audio_2f7bb4a9b2.mp3?filename=short-confirm-6541.mp3"
    );
    clickSoundRef.current.volume = 0.22;
    equalSoundRef.current.volume = 0.28;
  }, []);

  useEffect(() => {
    document.body.dataset.theme = theme;
  }, [theme]);

  const playSound = useCallback((type) => {
    const sound =
      type === "click" ? clickSoundRef.current : equalSoundRef.current;
    if (!sound) return;
    const s = sound.cloneNode();
    s.play().catch(() => {});
  }, []);

  const calculateResult = useCallback(() => {
    if (!input) return;
    try {
      const result = evaluate(input).toString();
      setHistory((prev) => [...prev.slice(-99), `${input} = ${result}`]);
      setInput(result);
      playSound("equal");
    } catch {
      setInput("Error");
      playSound("click");
    }
  }, [input, playSound, setHistory]);

  const handleButtonClick = (label) => {
    playSound("click");
    switch (label) {
      case "=":
        calculateResult();
        break;
      case "Clear":
        setInput("");
        break;
      case "DEL":
        setInput((prev) => prev.slice(0, -1));
        break;
      case "History":
        setShowHistory((s) => !s);
        break;
      default:
        setInput((prev) => prev + label);
    }
  };

  const toggleTheme = () => setTheme((t) => (t === "light" ? "dark" : "light"));
  const clearHistory = () => setHistory([]);
  const exportHistory = () => {
    const blob = new Blob([history.join("\n")], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "calculator_history.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  // Keyboard support
  useEffect(() => {
    const handleKeyDown = (ev) => {
      const { key, code } = ev;
      const numpadMap = {
        Numpad0: "0",
        Numpad1: "1",
        Numpad2: "2",
        Numpad3: "3",
        Numpad4: "4",
        Numpad5: "5",
        Numpad6: "6",
        Numpad7: "7",
        Numpad8: "8",
        Numpad9: "9",
        NumpadAdd: "+",
        NumpadSubtract: "-",
        NumpadMultiply: "*",
        NumpadDivide: "/",
        NumpadDecimal: ".",
        NumpadEnter: "Enter",
      };
      const allowedChars = /^[0-9+\-*/.%()=]$/;

      if (code in numpadMap) {
        const mapped = numpadMap[code];
        if (mapped === "Enter") {
          ev.preventDefault();
          playSound("click");
          calculateResult();
        } else {
          setInput((prev) => prev + mapped);
          playSound("click");
        }
        return;
      }

      if (allowedChars.test(key)) {
        if (key === "=") {
          ev.preventDefault();
          playSound("click");
          calculateResult();
        } else {
          setInput((prev) => prev + key);
          playSound("click");
        }
        return;
      }

      if (key === "Enter") {
        ev.preventDefault();
        playSound("click");
        calculateResult();
        return;
      }
      if (key === "Backspace") {
        ev.preventDefault();
        setInput((prev) => prev.slice(0, -1));
        playSound("click");
        return;
      }
      if (key === "Escape") {
        ev.preventDefault();
        setInput("");
        playSound("click");
        return;
      }
      if (key.toLowerCase && key.toLowerCase() === "h") {
        ev.preventDefault();
        setShowHistory((s) => !s);
        playSound("click");
        return;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [calculateResult, playSound]);

  return (
    <div className="container">
      <div className="topbar">
        <div className="spacer" />
        <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
      </div>

      <Calculator input={input} handleButtonClick={handleButtonClick} />

      <button
        className="floating-history clickable"
        onClick={() => setShowHistory((s) => !s)}
      >
        🕑
      </button>

      <HistoryDrawer
        show={showHistory}
        history={history}
        clearHistory={clearHistory}
        exportHistory={exportHistory}
        closeDrawer={() => setShowHistory(false)}
      />
    </div>
  );
}
