import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from "./components/login_and_signup/login";
import SignUp from "./components/login_and_signup/signup";
import HomePage from "./components/main_components/homepage";
import LandingPage from "./components/landing_page/landing";
import ProtectedRoute from "./components/protected_routes/protectedRoute";
import AOS from 'aos';
import 'aos/dist/aos.css';
import RecipiesPage from "./components/main_components/recipies_page";
import CategoriesPage from "./components/main_components/categories";
import ViewRecipePage from "./components/main_components/view_recipe";
import AddRecipesPage from "./components/main_components/addrecipe";
import ViewOwnRecipePage from "./components/main_components/view-own-recipe";

function App() {

  useEffect(() => {
    if (process.env.REACT_APP_PLAYWRIGHT_TEST === "true") {
    // AOS.init({ duration: 1000, once: true });
  }
  else{
    AOS.init({
      duration: 1000,
      once: true,
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
    
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/homepage" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
        <Route path="/recipes" element={<ProtectedRoute><RecipiesPage /></ProtectedRoute>} />
        <Route path="recipes/:category" element={<ProtectedRoute><CategoriesPage /></ProtectedRoute>} />
        <Route path="recipes/type/:type" element={<ProtectedRoute><ViewRecipePage /></ProtectedRoute>} />
        <Route path="recipes/own/" element={<ProtectedRoute><AddRecipesPage /></ProtectedRoute>} />
        <Route path="recipes/own/:id" element={<ProtectedRoute><ViewOwnRecipePage /></ProtectedRoute>} />
      </Routes>
    </Router>
  );
}

export default App;
