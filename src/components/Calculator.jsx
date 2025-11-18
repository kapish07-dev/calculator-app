import React from "react";
import Button from "./Button";

export default function Calculator({ input, handleButtonClick }) {
  const buttons = [
    { label: "=", className: "upBtn equalBtn" },
    { label: "Clear", className: "upBtn clearBtn" },
    { label: "History", className: "upBtn historyBtn" },
    "7",
    "8",
    "9",
    "/",
    "4",
    "5",
    "6",
    "+",
    "1",
    "2",
    "3",
    "-",
    "00",
    "0",
    ".",
    "*",
    "%",
    "(",
    ")",
    "DEL",
  ].map((b) =>
    typeof b === "string"
      ? {
          label: b,
          className: ["DEL"].includes(b)
            ? "clearSmall"
            : ["+", "-", "*", "/", "%"].includes(b)
            ? "btnOp"
            : "btn",
        }
      : b
  );

  return (
    <>
      <input
        disabled
        id="inputbox"
        placeholder="0"
        value={input}
        className="resultInput"
        readOnly
      />
      <div className="keypad">
        <div className="upper">
          {buttons.slice(0, 3).map((btn, i) => (
            <Button key={i} {...btn} onClick={handleButtonClick} />
          ))}
        </div>
        <div className="lower">
          {buttons.slice(3).map((btn, i) => (
            <Button key={i + 3} {...btn} onClick={handleButtonClick} />
          ))}
        </div>
      </div>
    </>
  );
}
