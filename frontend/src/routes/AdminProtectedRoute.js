 
import { Navigate } from "react-router-dom";

const AdminProtectedRoute = ({ children }) => {
  const token = JSON.parse(localStorage.getItem("user") || "{}").access_token;
;
  const role = JSON.parse(localStorage.getItem("user") || "{}").role;
;

  if (!token) {
    return <Navigate to="/login" />;
  }

  if (role !== "admin") {
    return <Navigate to="/login" />; 
  }

  return children;
};

export default AdminProtectedRoute;
