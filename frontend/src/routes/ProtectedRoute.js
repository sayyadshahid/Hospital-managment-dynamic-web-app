// src/routes/ProtectedRoute.js
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("access_token"); 

  return token ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;
