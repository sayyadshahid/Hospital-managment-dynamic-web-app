import React, { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";

// Context and route guards
import { AvatarProvider } from "./hooks/AvtarContex";
import ProtectedRoute from "./routes/ProtectedRoute";
import AdminProtectedRoute from "./routes/AdminProtectedRoute";
import DoctorProtectedRoute from "./routes/DoctorProtectedRoute";

// Lazy-loaded page components
const RegisterForm = lazy(() => import("./pages/auth/register"));
const LoginForm = lazy(() => import("./pages/auth/Login"));
const LandingPage = lazy(() => import("./pages/home/Home"));
const HospitalList = lazy(() => import("./pages/hospital_lists/HospitalList"));
const HospitalRegister = lazy(() => import("./pages/hospital_register/HospitalRegister"));
const ChatUI = lazy(() => import("./pages/ai/Ai"));
const AboutUs = lazy(() => import("./pages/about/AbouUs"));
const Hospital = lazy(() => import("./pages/hospitals/Hospital"));
const Doctors = lazy(() => import("./pages/doctors/Doctors"));
const DoctorRegister = lazy(() => import("./pages/doctor_register/AddDoctors"));
const ConfirmAppointment = lazy(() => import("./pages/confirm_appointment/ConfirmAppointment"));
const ScheduleForm = lazy(() => import("./pages/schedule/Schedule"));
const AppointmentSuccess = lazy(() => import("./pages/appointment_success/appointment_success"));
const ReportDetails = lazy(() => import("./pages/report_details/ReportDetail"));
const ProfileDetail = lazy(() => import("./pages/profile/Profile"));
const AdminPanelLayout = lazy(() => import("./pages/Admin/AdminLayout"));
const DoctorPanelLayout = lazy(() => import("./pages/DoctorAdmin/DoctorLayout"));

function App() {
  return (
    <AvatarProvider>
      <Router>
        <Suspense fallback={<div style={{ textAlign: "center", marginTop: "2rem" }}>Loading...</div>}>
          <Routes>
            <Route path="/register" element={<RegisterForm />} />
            <Route path="/login" element={<LoginForm />} />
            <Route path="/" element={<LandingPage />} />
            <Route path="/hospitalList" element={<HospitalList />} />

            <Route
              path="/hospitalregister"
              element={
                <AdminProtectedRoute>
                  <HospitalRegister />
                </AdminProtectedRoute>
              }
            />

            <Route
              path="/chat"
              element={
                <ProtectedRoute>
                  <ChatUI />
                </ProtectedRoute>
              }
            />

            <Route path="/aboutUs" element={<AboutUs />} />

            <Route
              path="/hospital/:id"
              element={
                <ProtectedRoute>
                  <Hospital />
                </ProtectedRoute>
              }
            />

            <Route
              path="/doctors"
              element={
                <ProtectedRoute>
                  <Doctors />
                </ProtectedRoute>
              }
            />

            <Route
              path="/doctor-register"
              element={
                <ProtectedRoute>
                  <DoctorRegister />
                </ProtectedRoute>
              }
            />

            <Route
              path="/confirm-appointment"
              element={
                <ProtectedRoute>
                  <ConfirmAppointment />
                </ProtectedRoute>
              }
            />

            <Route
              path="/schedule-form"
              element={
                <ProtectedRoute>
                  <ScheduleForm />
                </ProtectedRoute>
              }
            />

            <Route
              path="/appointment-successs"
              element={
                <ProtectedRoute>
                  <AppointmentSuccess />
                </ProtectedRoute>
              }
            />

            <Route
              path="/report-details"
              element={
                <ProtectedRoute>
                  <ReportDetails />
                </ProtectedRoute>
              }
            />

            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <ProfileDetail />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin"
              element={
                <AdminProtectedRoute>
                  <AdminPanelLayout />
                </AdminProtectedRoute>
              }
            />

            <Route
              path="/doctor"
              element={
                <DoctorProtectedRoute>
                  <DoctorPanelLayout />
                </DoctorProtectedRoute>
              }
            />
          </Routes>
        </Suspense>

        {/* Toaster for Notifications */}
        <Toaster
          position="bottom-center"
          toastOptions={{
            duration: 3000,
            style: {
              fontFamily: "Poppins, sans-serif",
            },
          }}
        />
      </Router>
    </AvatarProvider>
  );
}

export default App;

