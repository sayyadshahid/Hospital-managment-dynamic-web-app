import React from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import RegisterForm from "./pages/auth/register";
import LoginForm from "./pages/auth/Login";
import LandingPage from "./pages/Home";
import HospitalList from "./pages/HospitalList";
import HospitalRegister from "./pages/HospitalRegister";
import ChatUI from './pages/Ai';
import AboutUs from './pages/AbouUs';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/register" element={<RegisterForm />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/" element={<LandingPage />} />
        <Route path="/hospitalList" element={<HospitalList />} />
        <Route path="/hospitalregister" element={<HospitalRegister />} />
        <Route path="/chat" element={<ChatUI />} />
        <Route path="/aboutUs" element={<AboutUs />} />



      </Routes>

      {/* Toaster for Notifications */}
      <Toaster
        position="bottom-center"
        toastOptions={{
          duration: 3000,
        }}
      />
    </Router>
  );
}

export default App;
