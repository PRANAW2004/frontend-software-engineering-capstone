import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from "./components/login_and_signup/login";
import SignUp from "./components/login_and_signup/signup";
import HomePage from "./components/main_components/homepage";
import LandingPage from "./components/landing_page/landing";
import ProtectedRoute from "./components/protected_routes/protectedRoute";
import AOS from 'aos';
import 'aos/dist/aos.css';

function App() {

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/homepage" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
      </Routes>
    </Router>
  );
}

export default App;
