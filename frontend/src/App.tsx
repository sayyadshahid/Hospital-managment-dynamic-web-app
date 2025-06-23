import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import RegisterForm from "./pages/auth/register";
import LoginForm from "./pages/auth/Login";
import LandingPage from "./pages/home/Home";
import HospitalList from "./pages/hospital_lists/HospitalList";
import HospitalRegister from "./pages/hospital_register/HospitalRegister";
import ChatUI from "./pages/ai/Ai";
import AboutUs from "./pages/about/AbouUs";
import Hospital from "./pages/hospitals/Hospital";
import Doctors from "./pages/doctors/Doctors";
import DoctorRegister from "./pages/doctor_register/AddDoctors";
import ConfirmAppointment from "./pages/confirm_appointment/ConfirmAppointment";
import ProtectedRoute from "./routes/ProtectedRoute";
import ScheduleForm from "./pages/schedule/Schedule";
import AppointmentSuccess from "./pages/appointment_success/appointment_success";
import ReportDetails from "./pages/report_details/ReportDetail";
import ProfileDetail from "./pages/profile/Profile";
import { AvatarProvider } from "./hooks/AvtarContex";
import AdminPanelLayout from "./pages/Admin/AdminLayout";
import AdminProtectedRoute from "./routes/AdminProtectedRoute";
import DoctorPanelLayout from "./pages/DoctorAdmin/DoctorLayout";
import DoctorProtectedRoute from "./routes/DoctorProtectedRoute";


function App() {
  return (
    <AvatarProvider>
      <Router>
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
