import whiteTennisBall from "../assets/whiteTennisBall.avif";
import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

export default function GridComponent() {
  const navigate = useNavigate();
  const initialStepsArray = [1, 2, 3, 4, 5, 6];

  const [stepsArray, setStepsArray] = useState(initialStepsArray);
  const [stepsArrayString, setStepsArrayString] = useState(
    initialStepsArray.join(""),
  );
  const [currentStep, setCurrentStep] = useState(initialStepsArray[0]);
  const [startPlay, setStartPlay] = useState(false);
  const [randomNumber, setRandomNumber] = useState(0);
  const [stepIndex, setStepIndex] = useState(0);
  const [timer, setTimer] = useState(1000);
  const [inputTimerValue, setInputTimerValue] = useState("1000");
  const [timerError, setTimerError] = useState("");
  const [stepsError, setStepsError] = useState("");
  const [isComplete, setIsComplete] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [countdown, setCountdown] = useState(null); // null, 3, 2, 1, or 0
  const [useAutoGenerate, setUseAutoGenerate] = useState(false);
  const [fullIntervalTime, setFullIntervalTime] = useState(60);
  const [inputFullIntervalTime, setInputFullIntervalTime] = useState("60");
  const [fullIntervalError, setFullIntervalError] = useState("");

  const fullscreenRef = useRef(null);

  const isMatching = (celNumber) => celNumber === currentStep;

  // Handle fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    document.addEventListener("webkitfullscreenchange", handleFullscreenChange);
    document.addEventListener("mozfullscreenchange", handleFullscreenChange);
    document.addEventListener("msfullscreenchange", handleFullscreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      document.removeEventListener(
        "webkitfullscreenchange",
        handleFullscreenChange,
      );
      document.removeEventListener(
        "mozfullscreenchange",
        handleFullscreenChange,
      );
      document.removeEventListener(
        "msfullscreenchange",
        handleFullscreenChange,
      );
    };
  }, []);

  // Enter fullscreen when starting drill
  const enterFullscreen = async () => {
    const element = fullscreenRef.current;
    if (!element) return;

    try {
      if (element.requestFullscreen) {
        await element.requestFullscreen();
      } else if (element.webkitRequestFullscreen) {
        await element.webkitRequestFullscreen();
      } else if (element.mozRequestFullScreen) {
        await element.mozRequestFullScreen();
      } else if (element.msRequestFullscreen) {
        await element.msRequestFullscreen();
      }
    } catch (error) {
      console.log("Fullscreen request failed:", error);
    }
  };

  // Exit fullscreen
  const exitFullscreen = async () => {
    try {
      if (document.exitFullscreen) {
        await document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
        await document.webkitExitFullscreen();
      } else if (document.mozCancelFullScreen) {
        await document.mozCancelFullScreen();
      } else if (document.msExitFullscreen) {
        await document.msExitFullscreen();
      }
    } catch (error) {
      console.log("Exit fullscreen failed:", error);
    }
  };

  // Countdown effect
  useEffect(() => {
    if (countdown === null) return;

    if (countdown === 0) {
      // Countdown finished, start the drill
      setCountdown(null);
      setStartPlay(true);
      return;
    }

    // Countdown from 3, 2, 1
    const countdownTimer = setTimeout(() => {
      setCountdown(countdown - 1);
    }, 1000);

    return () => clearTimeout(countdownTimer);
  }, [countdown]);

  useEffect(() => {
    if (startPlay === true) {
      const intervalId = setInterval(() => {
        setRandomNumber(Math.random());
      }, timer);

      return () => clearInterval(intervalId);
    }
  }, [startPlay, timer]);

  useEffect(() => {
    if (randomNumber === 0) return;

    setCurrentStep(stepsArray[stepIndex]);
    setStepIndex(stepIndex + 1);

    if (stepIndex === stepsArray.length) {
      // Drill complete - stop and exit fullscreen
      setStartPlay(false);
      setStepIndex(0);
      exitFullscreen();
      setIsComplete(true);
      setTimeout(() => setIsComplete(false), 3000);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [randomNumber]);

  const startProgram = () => {
    setIsComplete(false);

    // If auto-generate is enabled, generate random sequence
    if (useAutoGenerate) {
      const sequenceLength = Math.floor((fullIntervalTime * 1000) / timer);
      const randomSequence = generateRandomSequence(sequenceLength);
      setStepsArray(randomSequence);
      setStepsArrayString(randomSequence.join(""));
    }

    setStepIndex(0);
    setCountdown(3); // Start countdown from 3
    enterFullscreen();
  };

  // Generate random sequence of positions (1-9)
  const generateRandomSequence = (length) => {
    return Array.from({ length }, () => Math.floor(Math.random() * 9) + 1);
  };

  const togglePause = () => {
    // Toggle between pause and resume
    setStartPlay(!startPlay);
    // Don't reset stepIndex - keep position in sequence
    // Don't exit fullscreen - stay in fullscreen mode
  };

  const resetProgram = () => {
    setStartPlay(false);
    setCountdown(null);
    setStepIndex(0);
    setCurrentStep(initialStepsArray[0]);
    setIsComplete(false);
    if (isFullscreen) {
      exitFullscreen();
    }
  };

  const handleInputTimerChange = (event) => {
    setInputTimerValue(event.target.value);
    setTimerError("");
  };

  const switchTimer = () => {
    const newIntInputTimerValue = parseInt(inputTimerValue, 10);

    if (isNaN(newIntInputTimerValue) || newIntInputTimerValue < 100) {
      setTimerError("Please enter a valid number (minimum 100ms)");
      return;
    }
    if (newIntInputTimerValue > 10000) {
      setTimerError("Maximum interval is 10 seconds (10000ms)");
      return;
    }

    setTimer(newIntInputTimerValue);
    setTimerError("");
    // Show success feedback
    const btn = document.getElementById("timer-btn");
    if (btn) {
      btn.textContent = "✓ Updated!";
      setTimeout(() => {
        btn.textContent = "Set Interval";
      }, 1500);
    }
  };

  const handleInputStepsArrayChange = (event) => {
    setStepsArrayString(event.target.value);
    setStepsError("");
  };

  const switchStepsArray = () => {
    const cleanedString = stepsArrayString.replace(/[^0-9]/g, "");

    if (cleanedString.length === 0) {
      setStepsError("Please enter at least one position (1-9)");
      return;
    }

    const newStepsArray = cleanedString
      .split("")
      .map((item) => parseInt(item, 10))
      .filter((num) => num >= 1 && num <= 9);

    if (newStepsArray.length === 0) {
      setStepsError("Please use numbers between 1 and 9");
      return;
    }

    setStepIndex(0);
    setStepsArray(newStepsArray);
    setStepsArrayString(newStepsArray.join(""));
    setStepsError("");

    // Show success feedback
    const btn = document.getElementById("steps-btn");
    if (btn) {
      btn.textContent = "✓ Sequence Set!";
      setTimeout(() => {
        btn.textContent = "Set Sequence";
      }, 1500);
    }
  };

  const quickSetSequence = (sequence) => {
    setStepsArray(sequence);
    setStepsArrayString(sequence.join(""));
    setStepIndex(0);
    setStepsError("");
  };

  const handleFullIntervalTimeChange = (event) => {
    setInputFullIntervalTime(event.target.value);
    setFullIntervalError("");
  };

  const switchFullIntervalTime = () => {
    const newFullIntervalTime = parseInt(inputFullIntervalTime, 10);

    if (isNaN(newFullIntervalTime) || newFullIntervalTime < 1) {
      setFullIntervalError("Please enter a valid number (minimum 1 second)");
      return;
    }
    if (newFullIntervalTime > 600) {
      setFullIntervalError("Maximum time is 10 minutes (600 seconds)");
      return;
    }

    setFullIntervalTime(newFullIntervalTime);
    setFullIntervalError("");

    // Show success feedback
    const btn = document.getElementById("full-interval-btn");
    if (btn) {
      btn.textContent = "✓ Updated!";
      setTimeout(() => {
        btn.textContent = "Set Time";
      }, 1500);
    }
  };

  const generateNewRandomSequence = () => {
    const sequenceLength = Math.floor((fullIntervalTime * 1000) / timer);
    const randomSequence = generateRandomSequence(sequenceLength);
    setStepsArray(randomSequence);
    setStepsArrayString(randomSequence.join(""));
    setStepsError("");

    // Show success feedback
    const btn = document.getElementById("generate-sequence-btn");
    if (btn) {
      btn.textContent = "✓ Generated!";
      setTimeout(() => {
        btn.textContent = "🎲 Generate New Sequence";
      }, 1500);
    }
  };

  return (
    <div className="App">
      {/* Header - only show when not in fullscreen */}
      {!isFullscreen && (
        <header className="app-header">
          <div className="container">
            <button
              className="back-button"
              onClick={() => navigate("/")}
              aria-label="Back to home"
            >
              ← Back to Home
            </button>
            <div className="app-header-content">
              <h1 className="app-title">🎾 Tennis Training APP</h1>
              <p className="app-subtitle">Agility & Positioning Drills</p>
            </div>
          </div>
        </header>
      )}
      {/* Fullscreen Container */}
      <div
        ref={fullscreenRef}
        className={`fullscreen-container ${isFullscreen ? "active-fullscreen" : ""}`}
      >
        {/* Exit Fullscreen Button - only show in fullscreen */}
        {isFullscreen && (
          <button
            className="exit-fullscreen-btn"
            onClick={exitFullscreen}
            aria-label="Exit fullscreen"
            title="Exit Fullscreen (ESC)"
          >
            ✕ Exit
          </button>
        )}

        {/* Countdown Overlay - show during countdown */}
        {countdown !== null && countdown > 0 && (
          <div className="countdown-overlay">
            <div className="countdown-number">{countdown}</div>
            <div className="countdown-text">Get Ready!</div>
          </div>
        )}

        {/* Main Grid */}
        <div className="grid-container">
          <div className="container-fluid p-0">
            {/* Progress Bar */}
            {startPlay && (
              <div className="progress-bar-container">
                <div className="progress">
                  <div
                    className="progress-bar progress-bar-striped progress-bar-animated"
                    role="progressbar"
                    style={{
                      width: `${(stepIndex / stepsArray.length) * 100}%`,
                    }}
                    aria-valuenow={stepIndex}
                    aria-valuemin="0"
                    aria-valuemax={stepsArray.length}
                  >
                    Step {stepIndex} of {stepsArray.length}
                  </div>
                </div>
              </div>
            )}

            {/* Success Message */}
            {isComplete && (
              <div
                className="alert alert-success text-center animate-fade"
                role="alert"
              >
                <h4>🎉 Drill Complete!</h4>
                <p>Great job! Ready for another round?</p>
              </div>
            )}

            {/* Tennis Court Grid */}
            <div className="tennis-grid">
              {[0, 1, 2].map((x, index1) => (
                <div className="row g-0" key={index1}>
                  {[1, 2, 3].map((y, index2) => {
                    const cellNumber = y + 3 * x;
                    const isActive = isMatching(cellNumber);
                    return (
                      <div
                        className={`col-4 grid-cell ${isActive ? "active" : ""}`}
                        key={index2}
                      >
                        <div className="cell-number">{cellNumber}</div>
                        {isActive && (
                          <img
                            src={whiteTennisBall}
                            className="grid-cell-image animate-bounce"
                            alt="Tennis Ball Position"
                          />
                        )}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>{" "}
      {/* End Fullscreen Container */}
      {/* Controls Section - only show when not in fullscreen */}
      {!isFullscreen && (
        <div className="controls-section">
          <div className="container">
            {/* Control Buttons */}
            <div className="control-buttons">
              <button
                className="btn btn-success btn-lg"
                onClick={startProgram}
                disabled={startPlay || countdown !== null || stepIndex > 0}
                aria-label="Start drill"
              >
                <span className="btn-icon">▶</span> Start Drill
              </button>
              <button
                className="btn btn-warning btn-lg"
                onClick={togglePause}
                disabled={countdown !== null || stepIndex === 0}
                aria-label={startPlay ? "Pause drill" : "Resume drill"}
              >
                <span className="btn-icon">{startPlay ? "⏸" : "▶"}</span>{" "}
                {startPlay ? "Pause" : "Resume"}
              </button>
              <button
                className="btn btn-secondary btn-lg"
                onClick={resetProgram}
                disabled={startPlay || countdown !== null}
                aria-label="Reset drill"
              >
                <span className="btn-icon">↻</span> Reset
              </button>
            </div>

            {/* Settings Card */}
            <div className="card settings-card mt-4">
              <div className="card-body">
                <h5 className="card-title">
                  ⚙️ Drill Settings
                  <button
                    className="btn btn-link btn-sm float-end"
                    onClick={() => setShowHelp(!showHelp)}
                    aria-label="Toggle help"
                  >
                    {showHelp ? "Hide Help" : "Show Help"}
                  </button>
                </h5>

                {/* Help Section */}
                {showHelp && (
                  <div className="alert alert-info" role="alert">
                    <h6>📖 How to Use:</h6>
                    <ul className="mb-0">
                      <li>
                        <strong>Time Interval:</strong> Set how many
                        milliseconds between each position (100-10000ms).
                        Example: 1000ms = 1 second.
                      </li>
                      <li>
                        <strong>Position Sequence:</strong> Enter numbers 1-9 to
                        set drill positions. The ball will appear in these
                        positions in order.
                      </li>
                      <li>
                        <strong>Auto-Generate:</strong> Enable to automatically
                        create a random sequence based on total drill time.
                        Perfect for endurance training!
                      </li>
                      <li>
                        <strong>Grid Numbers:</strong> Top row is 1-3, middle
                        row is 4-6, bottom row is 7-9.
                      </li>
                    </ul>
                  </div>
                )}

                <div className="row g-3">
                  {/* Timer Input */}
                  <div className="col-md-6">
                    <label htmlFor="timer-input" className="form-label fw-bold">
                      ⏱ Time Interval (milliseconds)
                    </label>
                    <div className="input-group">
                      <input
                        id="timer-input"
                        type="number"
                        className={`form-control ${timerError ? "is-invalid" : ""}`}
                        value={inputTimerValue}
                        onChange={handleInputTimerChange}
                        onKeyDown={(e) => e.key === "Enter" && switchTimer()}
                        placeholder="1000"
                        min="100"
                        max="10000"
                        disabled={startPlay}
                        aria-describedby="timer-help"
                      />
                      <button
                        id="timer-btn"
                        className="btn btn-primary"
                        type="button"
                        onClick={switchTimer}
                        disabled={startPlay}
                        aria-label="Set time interval"
                      >
                        Set Interval
                      </button>
                    </div>
                    {timerError && (
                      <div className="invalid-feedback d-block">
                        {timerError}
                      </div>
                    )}
                    <small id="timer-help" className="form-text text-muted">
                      Current: {timer}ms ({(timer / 1000).toFixed(1)} seconds)
                    </small>
                  </div>

                  {/* Steps Input */}
                  <div className="col-md-6">
                    <label htmlFor="steps-input" className="form-label fw-bold">
                      📍 Position Sequence
                    </label>
                    <div className="input-group">
                      <input
                        id="steps-input"
                        type="text"
                        className={`form-control ${stepsError ? "is-invalid" : ""}`}
                        value={stepsArrayString}
                        onChange={handleInputStepsArrayChange}
                        onKeyDown={(e) =>
                          e.key === "Enter" && switchStepsArray()
                        }
                        placeholder="123456"
                        disabled={startPlay || useAutoGenerate}
                        aria-describedby="steps-help"
                      />
                      <button
                        id="steps-btn"
                        className="btn btn-primary"
                        type="button"
                        onClick={switchStepsArray}
                        disabled={startPlay || useAutoGenerate}
                        aria-label="Set position sequence"
                      >
                        Set Sequence
                      </button>
                    </div>
                    {stepsError && (
                      <div className="invalid-feedback d-block">
                        {stepsError}
                      </div>
                    )}
                    <small id="steps-help" className="form-text text-muted">
                      {useAutoGenerate ? (
                        "Manual sequence disabled (Auto-Generate is ON)"
                      ) : (
                        <>
                          Current sequence: {stepsArray.join(", ")} (
                          {stepsArray.length} positions)
                        </>
                      )}
                    </small>
                  </div>
                </div>

                {/* Auto-Generate Random Sequence */}
                <div className="mt-4">
                  <div className="form-check form-switch">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="auto-generate-switch"
                      checked={useAutoGenerate}
                      onChange={(e) => setUseAutoGenerate(e.target.checked)}
                      disabled={startPlay}
                    />
                    <label
                      className="form-check-label fw-bold"
                      htmlFor="auto-generate-switch"
                    >
                      🎲 Auto-Generate Random Sequence
                    </label>
                  </div>
                  <small className="form-text text-muted d-block mb-2">
                    When enabled, a random sequence will be generated based on
                    full drill time
                  </small>

                  {useAutoGenerate && (
                    <div className="row g-3 mt-1">
                      <div className="col-md-6">
                        <label
                          htmlFor="full-interval-input"
                          className="form-label fw-bold"
                        >
                          ⏰ Full Drill Time (seconds)
                        </label>
                        <div className="input-group">
                          <input
                            id="full-interval-input"
                            type="number"
                            className={`form-control ${fullIntervalError ? "is-invalid" : ""}`}
                            value={inputFullIntervalTime}
                            onChange={handleFullIntervalTimeChange}
                            onKeyDown={(e) =>
                              e.key === "Enter" && switchFullIntervalTime()
                            }
                            placeholder="60"
                            min="1"
                            max="600"
                            disabled={startPlay}
                            aria-describedby="full-interval-help"
                          />
                          <button
                            id="full-interval-btn"
                            className="btn btn-primary"
                            type="button"
                            onClick={switchFullIntervalTime}
                            disabled={startPlay}
                            aria-label="Set full drill time"
                          >
                            Set Time
                          </button>
                        </div>
                        {fullIntervalError && (
                          <div className="invalid-feedback d-block">
                            {fullIntervalError}
                          </div>
                        )}
                        <small
                          id="full-interval-help"
                          className="form-text text-muted"
                        >
                          Total drill duration: {fullIntervalTime} seconds
                        </small>
                      </div>
                      <div className="col-md-6">
                        <label className="form-label fw-bold">
                          📊 Calculated Sequence
                        </label>
                        <div className="alert alert-success mb-0">
                          <strong>Positions:</strong>{" "}
                          {Math.floor((fullIntervalTime * 1000) / timer)}
                          <br />
                          <small>
                            {fullIntervalTime}s ÷ {(timer / 1000).toFixed(1)}s ={" "}
                            {Math.floor((fullIntervalTime * 1000) / timer)}{" "}
                            random positions
                          </small>
                        </div>
                      </div>
                      <div className="col-12">
                        <div className="generate-sequence-section mt-3">
                          <button
                            id="generate-sequence-btn"
                            className="btn btn-outline-primary btn-lg w-100 generate-btn"
                            type="button"
                            onClick={generateNewRandomSequence}
                            disabled={startPlay}
                            aria-label="Generate new random sequence"
                          >
                            <span className="btn-icon">🎲</span>
                            <span className="btn-text">
                              Generate New Random Sequence
                            </span>
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Quick Presets */}
                <div className="mt-3">
                  <label className="form-label fw-bold">
                    🚀 Quick Presets:
                  </label>
                  {useAutoGenerate && (
                    <small className="text-muted d-block mb-1">
                      (Disabled - Auto-Generate is enabled)
                    </small>
                  )}
                  <div className="btn-group-presets">
                    <button
                      className="btn btn-outline-secondary btn-sm"
                      onClick={() =>
                        quickSetSequence([1, 2, 3, 4, 5, 6, 7, 8, 9])
                      }
                      disabled={startPlay || useAutoGenerate}
                    >
                      All Positions
                    </button>
                    <button
                      className="btn btn-outline-secondary btn-sm"
                      onClick={() => quickSetSequence([1, 3, 7, 9])}
                      disabled={startPlay || useAutoGenerate}
                    >
                      Corners
                    </button>
                    <button
                      className="btn btn-outline-secondary btn-sm"
                      onClick={() => quickSetSequence([2, 4, 6, 8])}
                      disabled={startPlay || useAutoGenerate}
                    >
                      Cross Pattern
                    </button>
                    <button
                      className="btn btn-outline-secondary btn-sm"
                      onClick={() => quickSetSequence([1, 5, 9, 5])}
                      disabled={startPlay || useAutoGenerate}
                    >
                      Diagonal
                    </button>
                    <button
                      className="btn btn-outline-secondary btn-sm"
                      onClick={() => quickSetSequence([4, 5, 6])}
                      disabled={startPlay || useAutoGenerate}
                    >
                      Center Line
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}{" "}
      {/* End Controls Section conditional */}
    </div>
  );
}
