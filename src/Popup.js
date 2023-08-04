import React from "react";
import "./App.css";

export default function Popup({ message, onClose, style }) {
    return (
      <div className="popup-overlay" onClick={onClose}>
        <div className="popup-container" style={style}>
          <p>{message}</p>
          <button onClick={onClose}>Close</button>
        </div>
      </div>
    );
}
