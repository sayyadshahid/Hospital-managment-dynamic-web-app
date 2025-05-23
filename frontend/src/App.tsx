import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import RegisterForm from './pages/auth/register'
import LoginForm from "./pages/auth/Login";
import LandingPage from './pages/Home'

function App() {
  return (
    <Router>
      <Routes>
      <Route path="/register" element={<RegisterForm/>}/>
      <Route path="/login" element={<LoginForm/>}/>
      <Route  path="/landingpage" element={<LandingPage/>}/>
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