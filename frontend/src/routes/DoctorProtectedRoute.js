 
import { Navigate } from "react-router-dom";

const DoctorProtectedRoute = ({ children }) => {
  const token = JSON.parse(localStorage.getItem("user") || "{}").access_token;
;
  const role = JSON.parse(localStorage.getItem("user") || "{}").role;
;

  if (!token) {
    return <Navigate to="/login" />;
  }

  if (role !== "doctor") {
    return <Navigate to="/login" />; 
  }

  return children;
};

export default DoctorProtectedRoute;
