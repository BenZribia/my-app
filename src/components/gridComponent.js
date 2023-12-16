import whiteTennisBall from "../assets/whiteTennisBall.avif";
import { useEffect, useState } from "react";
export default function GridComponent() {

  const initialStepsArray = [1, 2, 3, 4, 5, 6];

  const [stepsArray, setStepsArray] = useState(initialStepsArray);

  const [stepsArrayString, setStepsArrayString] = useState(initialStepsArray.join(""));

  const [currentStep, setCurrentStep] = useState(initialStepsArray[0]);

  const [startPlay, setStartPlay] = useState(false);

  const [randomNumber, setRandomNumber] = useState(0);

  const [stepIndex, setStepIndex] = useState(0);

  const [timer, setTimer] = useState(1000);

  const [inputTimerValue, setInputTimerValue] = useState("1000");

  const isMatching = (celNumber) => celNumber === currentStep;

  useEffect(() => {
    if (startPlay === true) {
      const intervalId = setInterval(() => {
        setRandomNumber(Math.random());
      }, timer); // 1000ms = 1 second

      // Clear the interval when the component unmounts
      return () => clearInterval(intervalId);
    }
  }, [startPlay]);

  useEffect(() => {
    console.log(
      "new random number " +
        randomNumber +
        " current i " +
        stepIndex +
        " in cells " +
        stepsArray[stepIndex],
    );
    setCurrentStep(stepsArray[stepIndex]);
    setStepIndex(stepIndex + 1);
    if (stepIndex === stepsArray.length) {
      stopProgram();
    }
  }, [randomNumber]);

  const startProgram = () => {
    setStartPlay(true);
  };

  const stopProgram = () => {
    setStartPlay(false);
    setStepIndex(0);
  };

  const handleInputTimerChange = (event) => {
    setInputTimerValue(event.target.value);
  };
  const switchTimer = () => {
    const newIntInputTimerValue = parseInt(inputTimerValue, 10);

    if (!isNaN(newIntInputTimerValue)) {
      setTimer(newIntInputTimerValue);
    } else {
      console.error("Invalid input. Please enter a valid integer.");
    }
  };

  const handleInputStepsArrayChange = (event) => {
    setStepsArrayString(event.target.value);
  };

  const switchStepsArray = () => {
    const newStepsArray = stepsArrayString
      .split("")
      .map((item) => parseInt(item, 10));
    setStepIndex(0);
    setStepsArray(newStepsArray);
  };

  return (
    <div className="App">
      <div className="container-fluid">
        {[0, 1, 2].map((x, index1) => (
          <div className="row" key={index1}>
            {[1, 2, 3].map((y, index2) => (
              <div className="col-sm-4 gridCell" key={index2}>
                {isMatching(y + 3 * x) && (
                  <img
                    src={whiteTennisBall}
                    width="150"
                    height="145"
                    alt="No Ball"
                  />
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
      <div className="container mt-5 text-start">
        <div>
          {" "}
          <a
            className="btn btn-primary"
            onClick={startProgram}
            style={{ margin: "5px" }}
          >
            Start
          </a>{" "}
          <a className="btn btn-primary" onClick={stopProgram}>
            Stop
          </a>{" "}
        </div>

        <div className="input-group mb-3 mt-3" style={{ width: 450 }}>
          <input
            type="text"
            className="form-control"
            value={inputTimerValue}
            onChange={handleInputTimerChange}
          />
          <button
            className="btn btn-primary"
            type="button"
            onClick={switchTimer}
            style={{ width: 165 }}
          >
            change timer (ms)
          </button>
        </div>

        <div className="input-group mb-3" style={{ width: 450 }}>
          <input
            type="text"
            className="form-control"
            value={stepsArrayString}
            onChange={handleInputStepsArrayChange}
          />
          <button
            className="btn btn-primary"
            type="button"
            onClick={switchStepsArray}
            style={{ width: 165 }}
          >
            add the steps
          </button>

          <div className="container border border-primary mt-3" style={{ width: 450 }}>
            <span>Current steps: </span>
            {stepsArray.map((item, index) => (
                <span key={index}>{item}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
