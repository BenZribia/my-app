import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";

export default function LightsExercise() {
  const navigate = useNavigate();

  // Available colors for the exercise
  const COLORS = {
    red: '#FF0000',
    green: '#00FF00',
    blue: '#0000FF',
    black: '#000000',
    white: '#FFFFFF'
  };

  const initialColorSequence = ['red', 'green', 'blue', 'red', 'green'];

  const [colorSequence, setColorSequence] = useState(initialColorSequence);
  const [colorSequenceString, setColorSequenceString] = useState(initialColorSequence.join(','));
  const [currentColor, setCurrentColor] = useState(initialColorSequence[0]);
  const [startPlay, setStartPlay] = useState(false);
  const [randomTrigger, setRandomTrigger] = useState(0);
  const [colorIndex, setColorIndex] = useState(0);
  const [timer, setTimer] = useState(2000);
  const [inputTimerValue, setInputTimerValue] = useState("2000");
  const [timerError, setTimerError] = useState("");
  const [sequenceError, setSequenceError] = useState("");
  const [isComplete, setIsComplete] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [countdown, setCountdown] = useState(null);
  const [useAutoGenerate, setUseAutoGenerate] = useState(false);
  const [fullIntervalTime, setFullIntervalTime] = useState(60);
  const [inputFullIntervalTime, setInputFullIntervalTime] = useState("60");
  const [fullIntervalError, setFullIntervalError] = useState("");

  const fullscreenRef = useRef(null);

  // Handle fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      const isInFullscreen = !!(
        document.fullscreenElement ||
        document.webkitFullscreenElement ||
        document.mozFullScreenElement ||
        document.msFullscreenElement
      );
      setIsFullscreen(isInFullscreen);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    document.addEventListener("webkitfullscreenchange", handleFullscreenChange);
    document.addEventListener("mozfullscreenchange", handleFullscreenChange);
    document.addEventListener("msfullscreenchange", handleFullscreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      document.removeEventListener("webkitfullscreenchange", handleFullscreenChange);
      document.removeEventListener("mozfullscreenchange", handleFullscreenChange);
      document.removeEventListener("msfullscreenchange", handleFullscreenChange);
    };
  }, []);

  // Enter fullscreen
  const enterFullscreen = async () => {
    const element = fullscreenRef.current;
    if (!element) return;

    // Add body class to prevent scrolling
    document.body.classList.add('fullscreen-active');

    try {
      // Try standard fullscreen API
      if (element.requestFullscreen) {
        await element.requestFullscreen();
      } else if (element.webkitRequestFullscreen) {
        await element.webkitRequestFullscreen();
      } else if (element.mozRequestFullScreen) {
        await element.mozRequestFullScreen();
      } else if (element.msRequestFullscreen) {
        await element.msRequestFullscreen();
      } else {
        // Fallback for iOS and other devices that don't support fullscreen API
        // Use CSS-based fullscreen simulation
        setIsFullscreen(true);
      }
    } catch (error) {
      console.log("Fullscreen request failed, using CSS fallback:", error);
      // If fullscreen fails (like on iPhone), use CSS-based fullscreen
      setIsFullscreen(true);
    }
  };

  // Exit fullscreen
  const exitFullscreen = async () => {
    // Remove body class to restore scrolling
    document.body.classList.remove('fullscreen-active');

    try {
      if (document.exitFullscreen) {
        await document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
        await document.webkitExitFullscreen();
      } else if (document.mozCancelFullScreen) {
        await document.mozCancelFullScreen();
      } else if (document.msExitFullscreen) {
        await document.msExitFullscreen();
      } else {
        // Fallback for CSS-based fullscreen
        setIsFullscreen(false);
      }
    } catch (error) {
      console.log("Exit fullscreen failed, using CSS fallback:", error);
      setIsFullscreen(false);
    }
  };

  // Countdown effect
  useEffect(() => {
    if (countdown === null) return;

    if (countdown === 0) {
      setCountdown(null);
      setStartPlay(true);
      return;
    }

    const countdownTimer = setTimeout(() => {
      setCountdown(countdown - 1);
    }, 1000);

    return () => clearTimeout(countdownTimer);
  }, [countdown]);

  // Color change interval
  useEffect(() => {
    if (startPlay === true) {
      const intervalId = setInterval(() => {
        setRandomTrigger(Math.random());
      }, timer);

      return () => clearInterval(intervalId);
    }
  }, [startPlay, timer]);

  // Update color on trigger
  useEffect(() => {
    if (randomTrigger === 0) return;

    // Check if we've reached the end before accessing the array
    if (colorIndex >= colorSequence.length) {
      setStartPlay(false);
      setColorIndex(0);
      exitFullscreen();
      setIsComplete(true);
      setTimeout(() => setIsComplete(false), 3000);
      return;
    }

    setCurrentColor(colorSequence[colorIndex]);
    setColorIndex(colorIndex + 1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [randomTrigger]);

  const startProgram = () => {
    setIsComplete(false);

    if (useAutoGenerate) {
      const sequenceLength = Math.floor((fullIntervalTime * 1000) / timer);
      const randomSequence = generateRandomSequence(sequenceLength);
      setColorSequence(randomSequence);
      setColorSequenceString(randomSequence.join(','));
    }

    setColorIndex(0);
    setCountdown(3);
    enterFullscreen();
  };

  const generateRandomSequence = (length) => {
    const colorNames = Object.keys(COLORS);
    return Array.from({ length }, () => colorNames[Math.floor(Math.random() * colorNames.length)]);
  };

  const togglePause = () => {
    setStartPlay(!startPlay);
  };

  const resetProgram = () => {
    setStartPlay(false);
    setCountdown(null);
    setColorIndex(0);
    setCurrentColor(initialColorSequence[0]);
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
  };

  const handleInputSequenceChange = (event) => {
    setColorSequenceString(event.target.value);
    setSequenceError("");
  };

  const switchColorSequence = () => {
    const colors = colorSequenceString
      .split(',')
      .map(c => c.trim().toLowerCase())
      .filter(c => Object.keys(COLORS).includes(c));

    if (colors.length === 0) {
      setSequenceError("Please enter valid colors: red, green, blue, black, white");
      return;
    }

    setColorIndex(0);
    setColorSequence(colors);
    setColorSequenceString(colors.join(','));
    setSequenceError("");
  };

  const quickSetSequence = (sequence) => {
    setColorSequence(sequence);
    setColorSequenceString(sequence.join(','));
    setColorIndex(0);
    setSequenceError("");
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
  };

  const generateNewRandomSequence = () => {
    const sequenceLength = Math.floor((fullIntervalTime * 1000) / timer);
    const randomSequence = generateRandomSequence(sequenceLength);
    setColorSequence(randomSequence);
    setColorSequenceString(randomSequence.join(','));
    setSequenceError("");
  };

  const progress = colorSequence.length > 0
    ? Math.round((colorIndex / colorSequence.length) * 100)
    : 0;

  return (
    <div className={`lights-exercise ${isFullscreen ? 'lights-fullscreen' : ''}`} ref={fullscreenRef}>
      {/* Header */}
      {!isFullscreen && (
        <div className="app-header">
          <div className="container">
            <button className="back-button" onClick={() => navigate("/")}>
              ← Back to Home
            </button>
            <div className="app-header-content">
              <h1 className="app-title">💡 Lights Exercise</h1>
              <p className="app-subtitle">Advanced color reaction training drill</p>
            </div>
          </div>
        </div>
      )}

      {/* Countdown Overlay */}
      {countdown !== null && countdown > 0 && (
        <div className="countdown-overlay">
          <div className="countdown-number">{countdown}</div>
          <div className="countdown-text">Get Ready!</div>
        </div>
      )}

      {/* Exit Fullscreen Button */}
      {isFullscreen && (
        <button className="exit-fullscreen-btn" onClick={exitFullscreen}>
          ✕ Exit
        </button>
      )}

      {/* Light Display Container */}
      <div className={`light-display-container ${isFullscreen ? 'active-fullscreen' : ''}`}>
        {isFullscreen && startPlay && (
          <div className="light-window" style={{ backgroundColor: COLORS[currentColor] }}>
            <div className="light-color-label">{currentColor.toUpperCase()}</div>
          </div>
        )}

        {isFullscreen && !startPlay && !isComplete && countdown === null && (
          <div className="light-window paused">
            <div className="pause-message">⏸ PAUSED</div>
          </div>
        )}

        {/* Progress Bar */}
        {isFullscreen && (
          <div className="progress-bar-container">
            <div className="progress">
              <div
                className="progress-bar progress-bar-striped progress-bar-animated bg-success"
                role="progressbar"
                style={{ width: `${progress}%` }}
                aria-valuenow={progress}
                aria-valuemin="0"
                aria-valuemax="100"
              >
                {colorIndex} / {colorSequence.length}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Completion Message */}
      {isComplete && (
        <div className="alert alert-success text-center animate-fade" role="alert">
          <h4 className="alert-heading">
            🎉 Drill Complete!
          </h4>
          <p className="mb-0">Great work on completing the sequence!</p>
        </div>
      )}

      {/* Controls Section */}
      {!isFullscreen && (
        <div className="controls-section">
          {/* Control Buttons */}
          <div className="control-buttons mb-4">
            <button
              className="btn btn-success btn-lg"
              onClick={startProgram}
              disabled={startPlay || countdown !== null}
            >
              <span className="btn-icon">▶</span>
              Start Drill
            </button>
            <button
              className="btn btn-warning btn-lg"
              onClick={togglePause}
              disabled={countdown !== null || colorIndex === 0}
            >
              <span className="btn-icon">{startPlay ? '⏸' : '▶'}</span>
              {startPlay ? 'Pause' : 'Resume'}
            </button>
            <button
              className="btn btn-danger btn-lg"
              onClick={resetProgram}
              disabled={!startPlay && countdown === null && colorIndex === 0}
            >
              <span className="btn-icon">⏹</span>
              Reset
            </button>
          </div>

          {/* Settings Card */}
          <div className="card settings-card">
            <div className="card-body">
              <h3 className="card-title">⚙️ Drill Settings</h3>

              {/* Timer Settings */}
              <div className="mb-4">
                <label htmlFor="timer" className="form-label fw-bold">
                  Color Change Interval (milliseconds)
                </label>
                <div className="input-group">
                  <input
                    id="timer"
                    type="number"
                    className={`form-control ${timerError ? 'is-invalid' : ''}`}
                    value={inputTimerValue}
                    onChange={handleInputTimerChange}
                    min="100"
                    max="10000"
                    disabled={startPlay || countdown !== null}
                  />
                  <button
                    id="timer-btn"
                    className="btn btn-outline-primary"
                    onClick={switchTimer}
                    disabled={startPlay || countdown !== null}
                  >
                    Set Interval
                  </button>
                  {timerError && (
                    <div className="invalid-feedback">{timerError}</div>
                  )}
                </div>
                <small className="text-muted">
                  Current: {timer}ms ({(timer / 1000).toFixed(2)}s)
                </small>

                {/* Quick presets */}
                <div className="mt-2">
                  <small className="text-muted d-block mb-1">Quick presets:</small>
                  <div className="btn-group-presets">
                    <button
                      className="btn btn-sm btn-outline-secondary"
                      onClick={() => {
                        setInputTimerValue("1000");
                        setTimer(1000);
                      }}
                      disabled={startPlay || countdown !== null}
                    >
                      1s
                    </button>
                    <button
                      className="btn btn-sm btn-outline-secondary"
                      onClick={() => {
                        setInputTimerValue("2000");
                        setTimer(2000);
                      }}
                      disabled={startPlay || countdown !== null}
                    >
                      2s
                    </button>
                    <button
                      className="btn btn-sm btn-outline-secondary"
                      onClick={() => {
                        setInputTimerValue("3000");
                        setTimer(3000);
                      }}
                      disabled={startPlay || countdown !== null}
                    >
                      3s
                    </button>
                  </div>
                </div>
              </div>

              {/* Auto Generate Toggle */}
              <div className="mb-4">
                <div className="form-check form-switch">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="autoGenerateToggle"
                    checked={useAutoGenerate}
                    onChange={(e) => setUseAutoGenerate(e.target.checked)}
                    disabled={startPlay || countdown !== null}
                  />
                  <label className="form-check-label fw-bold" htmlFor="autoGenerateToggle">
                    🎲 Auto-Generate Random Color Sequence
                  </label>
                </div>
                <small className="text-muted">
                  When enabled, a random sequence will be generated based on the full interval time
                </small>
              </div>

              {/* Full Interval Time (for auto-generate) */}
              {useAutoGenerate && (
                <div className="mb-4">
                  <label htmlFor="fullInterval" className="form-label fw-bold">
                    Full Interval Time (seconds)
                  </label>
                  <div className="input-group">
                    <input
                      id="fullInterval"
                      type="number"
                      className={`form-control ${fullIntervalError ? 'is-invalid' : ''}`}
                      value={inputFullIntervalTime}
                      onChange={handleFullIntervalTimeChange}
                      min="1"
                      max="600"
                      disabled={startPlay || countdown !== null}
                    />
                    <button
                      id="full-interval-btn"
                      className="btn btn-outline-primary"
                      onClick={switchFullIntervalTime}
                      disabled={startPlay || countdown !== null}
                    >
                      Set Time
                    </button>
                    {fullIntervalError && (
                      <div className="invalid-feedback">{fullIntervalError}</div>
                    )}
                  </div>
                  <small className="text-muted">
                    This will generate {Math.floor((fullIntervalTime * 1000) / timer)} colors
                  </small>
                </div>
              )}

              {/* Manual Sequence Input */}
              {!useAutoGenerate && (
                <div className="mb-4">
                  <label htmlFor="colorSequence" className="form-label fw-bold">
                    Color Sequence
                  </label>
                  <div className="input-group">
                    <input
                      id="colorSequence"
                      type="text"
                      className={`form-control ${sequenceError ? 'is-invalid' : ''}`}
                      value={colorSequenceString}
                      onChange={handleInputSequenceChange}
                      placeholder="red,green,blue,black,white"
                      disabled={startPlay || countdown !== null}
                    />
                    <button
                      id="sequence-btn"
                      className="btn btn-outline-primary"
                      onClick={switchColorSequence}
                      disabled={startPlay || countdown !== null}
                    >
                      Set Sequence
                    </button>
                    {sequenceError && (
                      <div className="invalid-feedback">{sequenceError}</div>
                    )}
                  </div>
                  <small className="text-muted">
                    Enter colors separated by commas (red, green, blue, black, white)
                  </small>

                  {/* Quick presets */}
                  <div className="mt-2">
                    <small className="text-muted d-block mb-1">Quick presets:</small>
                    <div className="btn-group-presets">
                      <button
                        className="btn btn-sm btn-outline-secondary"
                        onClick={() => quickSetSequence(['red', 'green', 'blue'])}
                        disabled={startPlay || countdown !== null}
                      >
                        RGB
                      </button>
                      <button
                        className="btn btn-sm btn-outline-secondary"
                        onClick={() => quickSetSequence(['red', 'green', 'blue', 'red', 'green', 'blue'])}
                        disabled={startPlay || countdown !== null}
                      >
                        RGB x2
                      </button>
                      <button
                        className="btn btn-sm btn-outline-secondary"
                        onClick={() => quickSetSequence(['black', 'white', 'black', 'white'])}
                        disabled={startPlay || countdown !== null}
                      >
                        B&W
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Generate Button (when auto-generate is enabled) */}
              {useAutoGenerate && (
                <div className="generate-sequence-section mb-4">
                  <button
                    id="generate-sequence-btn"
                    className="generate-btn w-100"
                    onClick={generateNewRandomSequence}
                    disabled={startPlay || countdown !== null}
                  >
                    <span className="btn-icon">🎲</span>
                    <span className="btn-text">Generate New Sequence</span>
                  </button>
                </div>
              )}

              {/* Color Sequence Display */}
              <div className="mb-3">
                <label className="form-label fw-bold">Current Color Sequence:</label>
                <div className="color-sequence-preview">
                  {colorSequence.map((color, index) => (
                    <div
                      key={index}
                      className="color-preview-box"
                      style={{ backgroundColor: COLORS[color] }}
                      title={color}
                    >
                      {index === colorIndex && startPlay && <span className="current-indicator">▶</span>}
                    </div>
                  ))}
                </div>
                <small className="text-muted">
                  Total colors: <strong>{colorSequence.length}</strong> |
                  Duration: <strong>{((colorSequence.length * timer) / 1000).toFixed(1)}s</strong>
                </small>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
