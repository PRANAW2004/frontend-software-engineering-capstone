import React from "react";
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Login from "./components/login_and_signup/login";
import SignUp from "./components/login_and_signup/signup";
import HomePage from "./components/main_components/homepage";
import LandingPage from "./components/landing_page/landing";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />}/>
        <Route path="/signup" element={<SignUp />} />
        <Route path = "/homepage" element={<HomePage />} />
      </Routes>
    </Router>
  );
}

export default App;
