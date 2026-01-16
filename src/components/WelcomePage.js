import React from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";

export default function WelcomePage() {
  const navigate = useNavigate();

  return (
    <div className="welcome-page">
      <div className="welcome-container">
        <div className="welcome-header">
          <h1 className="welcome-title">🎾 Tennis Coach Training App</h1>
          <p className="welcome-subtitle">
            Professional training drills to enhance player performance
          </p>
        </div>

        <div className="exercises-container">
          <h2 className="exercises-heading">Choose Your Exercise</h2>

          <div className="exercise-cards">
            <div className="exercise-card">
              <div className="exercise-card-icon">📊</div>
              <h3 className="exercise-card-title">Grid Exercise</h3>
              <p className="exercise-card-description">
                Visual positioning drill with a 3x3 grid. Players react to
                tennis ball positions appearing on screen, improving court
                coverage and reaction time.
              </p>
              <button
                className="exercise-card-button"
                onClick={() => navigate("/grid")}
              >
                Start Grid Drill
              </button>
            </div>

            <div className="exercise-card">
              <div className="exercise-card-icon">💡</div>
              <h3 className="exercise-card-title">Lights Exercise</h3>
              <p className="exercise-card-description">
                Advanced reaction training with visual light cues. Enhance
                speed, agility, and decision-making under pressure.
              </p>
              <button
                className="exercise-card-button exercise-card-button-secondary"
                onClick={() => navigate("/lights")}
              >
                Start Lights Drill
              </button>
            </div>
          </div>
        </div>

        <div className="welcome-footer">
          <p>Built for coaches • Designed for excellence</p>
        </div>
      </div>
    </div>
  );
}
