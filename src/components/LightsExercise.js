import React from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";

export default function LightsExercise() {
  const navigate = useNavigate();

  return (
    <div className="lights-exercise">
      <div className="lights-container">
        <div className="lights-header">
          <button className="back-button" onClick={() => navigate("/")}>
            ← Back to Home
          </button>
          <h1 className="lights-title">💡 Lights Exercise</h1>
          <p className="lights-subtitle">Advanced reaction training drill</p>
        </div>

        <div className="coming-soon-container">
          <div className="coming-soon-icon">🚧</div>
          <h2 className="coming-soon-title">Coming Soon!</h2>
          <p className="coming-soon-text">
            This exercise is currently under development. Check back soon for an
            exciting new training drill that will help improve reaction time and
            agility.
          </p>
          <button className="btn-primary" onClick={() => navigate("/")}>
            Return to Home
          </button>
        </div>
      </div>
    </div>
  );
}
