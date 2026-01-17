import "./App.css";

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import WelcomePage from "./components/WelcomePage";
import GridComponent from "./components/gridComponent";
import LightsExercise from "./components/LightsExercise";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<WelcomePage />} />
        <Route path="/grid" element={<GridComponent />} />
        <Route path="/lights" element={<LightsExercise />} />
      </Routes>
    </Router>
  );
}

export default App;
