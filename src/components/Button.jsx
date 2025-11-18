import React from "react";

export default function Button({ label, className, onClick }) {
  return (
    <button className={`clickable ${className}`} onClick={() => onClick(label)}>
      {label}
    </button>
  );
}
