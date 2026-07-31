import React from "react";
import { Navigate } from "react-router-dom";

const useAuth = () => {
  try {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    return { token: user.access_token, role: user.role };
  } catch {
    return { token: null, role: null };
  }
};

export const SuperAdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { token, role } = useAuth();
  if (!token) return <Navigate to="/login" />;
  if (role !== "super_admin" && role !== "admin") return <Navigate to="/" />;
  return <>{children}</>;
};

export const HospitalAdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { token, role } = useAuth();
  if (!token) return <Navigate to="/login" />;
  if (role !== "hospital_admin") return <Navigate to="/" />;
  return <>{children}</>;
};

export const DoctorRoute = ({ children }: { children: React.ReactNode }) => {
  const { token, role } = useAuth();
  if (!token) return <Navigate to="/login" />;
  if (role !== "doctor") return <Navigate to="/" />;
  return <>{children}</>;
};

export const PatientRoute = ({ children }: { children: React.ReactNode }) => {
  const { token, role } = useAuth();
  if (!token) return <Navigate to="/login" />;
  if (role !== "patient") return <Navigate to="/" />;
  return <>{children}</>;
};

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { token } = useAuth();
  if (!token) return <Navigate to="/login" />;
  return <>{children}</>;
};
