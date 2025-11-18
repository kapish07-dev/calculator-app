import React from "react";

export default function HistoryDrawer({
  show,
  history,
  clearHistory,
  exportHistory,
  closeDrawer,
}) {
  if (!show) return null;

  return (
    <div className={`history-panel ${show ? "open" : ""}`}>
      <div className="history-header">
        <h4>History</h4>
        <div className="history-controls">
          <button className="small" onClick={clearHistory}>
            Clear
          </button>
          <button className="small" onClick={exportHistory}>
            Export
          </button>
          <button className="small" onClick={closeDrawer}>
            Close
          </button>
        </div>
      </div>
      <ul className="history-list">
        {history.length === 0 && (
          <li className="empty">No calculations yet.</li>
        )}
        {history
          .slice()
          .reverse()
          .map((item, idx) => (
            <li key={idx} className="history-item">
              {item}
            </li>
          ))}
      </ul>
    </div>
  );
}
