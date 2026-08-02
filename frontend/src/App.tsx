import React, { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AvatarProvider } from "./hooks/AvtarContex";
import { SuperAdminRoute, HospitalAdminRoute, DoctorRoute, PatientRoute, ProtectedRoute } from "./routes/RoleRoutes";
import { Navigate } from "react-router-dom";

const RegisterForm = lazy(() => import("./pages/auth/register"));
const LoginForm = lazy(() => import("./pages/auth/Login"));
const ForgotPassword = lazy(() => import("./pages/auth/ForgotPassword"));
const VerifyOTP = lazy(() => import("./pages/auth/VerifyOTP"));
const ResetPassword = lazy(() => import("./pages/auth/ResetPassword"));
const LandingPage = lazy(() => import("./pages/home/Home"));
const HospitalList = lazy(() => import("./pages/hospital_lists/HospitalList"));
const HospitalRegister = lazy(() => import("./pages/hospital_register/HospitalRegister"));
const ChatUI = lazy(() => import("./pages/ai/Ai"));
const AboutUs = lazy(() => import("./pages/about/AbouUs"));
const Hospital = lazy(() => import("./pages/hospitals/Hospital"));
const Doctors = lazy(() => import("./pages/doctors/Doctors"));
const ConfirmAppointment = lazy(() => import("./pages/confirm_appointment/ConfirmAppointment"));
const ScheduleForm = lazy(() => import("./pages/schedule/Schedule"));
const AppointmentSuccess = lazy(() => import("./pages/appointment_success/appointment_success"));
const ReportDetails = lazy(() => import("./pages/report_details/ReportDetail"));
const ProfileDetail = lazy(() => import("./pages/profile/Profile"));
const DoctorRegister = lazy(() => import("./pages/doctor_register/AddDoctors"));

const SuperAdminDashboard = lazy(() => import("./pages/SuperAdmin/SuperAdminDashboard"));
const HospitalAdminDashboard = lazy(() => import("./pages/HospitalAdmin/HospitalAdminDashboard"));
const DoctorDashboard = lazy(() => import("./pages/DoctorDashboard/DoctorDashboard"));
const AdminPanelLayout = lazy(() => import("./pages/Admin/AdminLayout"));

function App() {
  return (
    <AvatarProvider>
      <Router>
        <Suspense fallback={<div style={{ textAlign: "center", marginTop: "2rem" }}>Loading...</div>}>
          <Routes>
            <Route path="/register" element={<RegisterForm />} />
            <Route path="/login" element={<LoginForm />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/verify-reset-otp" element={<VerifyOTP />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/" element={<LandingPage />} />
            <Route path="/hospitalList" element={<HospitalList />} />
            <Route path="/hospitalregister" element={<ProtectedRoute><HospitalRegister /></ProtectedRoute>} />
            <Route path="/chat" element={<ProtectedRoute><ChatUI /></ProtectedRoute>} />
            <Route path="/aboutUs" element={<AboutUs />} />
            <Route path="/hospital/:id" element={<ProtectedRoute><Hospital /></ProtectedRoute>} />
            <Route path="/doctors" element={<ProtectedRoute><Doctors /></ProtectedRoute>} />
            <Route path="/doctor-register" element={<HospitalAdminRoute><DoctorRegister /></HospitalAdminRoute>} />
            <Route path="/confirm-appointment" element={<ProtectedRoute><ConfirmAppointment /></ProtectedRoute>} />
            <Route path="/schedule-form" element={<ProtectedRoute><ScheduleForm /></ProtectedRoute>} />
            <Route path="/appointment-successs" element={<ProtectedRoute><AppointmentSuccess /></ProtectedRoute>} />
            <Route path="/report-details" element={<ProtectedRoute><ReportDetails /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><ProfileDetail /></ProtectedRoute>} />

            <Route path="/admin" element={<SuperAdminRoute><AdminPanelLayout /></SuperAdminRoute>} />
            <Route path="/super-admin" element={<SuperAdminRoute><AdminPanelLayout /></SuperAdminRoute>} />
            <Route path="/hospital-admin/*" element={<HospitalAdminRoute><HospitalAdminDashboard /></HospitalAdminRoute>} />
            <Route path="/doctor/*" element={<DoctorRoute><DoctorDashboard /></DoctorRoute>} />
            <Route path="/patient/*" element={<PatientRoute><Navigate to="/report-details" replace /></PatientRoute>} />
          </Routes>
        </Suspense>
        <Toaster position="bottom-center" toastOptions={{ duration: 3000, style: { fontFamily: "Poppins, sans-serif" } }} />
      </Router>
    </AvatarProvider>
  );
}

export default App;
