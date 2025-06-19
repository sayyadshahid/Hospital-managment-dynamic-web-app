import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  Divider,
} from "@mui/material";
import NavBar from "../../components/header";
import Footer from "../../components/footer";
import { useLocation, useNavigate } from "react-router-dom";
import API from "../../components/configs/API";

interface Details {
  name: string;
  phone: string;
  email: string;
  dob: string;
  gender: string;
  address: string;
  reasonForConsultation: string;
  schedule_date: string;
  schedule_time: string;
}

const AppointmentSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { appointmentId } = location.state || {};
  const [detail, setDetail] = useState<Details | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!appointmentId) {
      setError("No appointment ID found.");
      return;
    }

    const fetchAppointmentData = async () => {
      try {
        setLoading(true);
        const res = await API.get(`/get-appointment-by/${appointmentId}`);

        setDetail(res.data.details);
      } catch (err) {
        setError("Failed to fetch appointment details.");
      } finally {
        setLoading(false);
      }
    };

    fetchAppointmentData();
  }, [appointmentId]);

  return (
    <Box>
      <NavBar />
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "80vh",
          backgroundColor: "#f5f5f5",
          px: 2,
        }}
      >
        <Box
          sx={{
            backgroundColor: "white",
            p: 4,
            borderRadius: 2,
            maxWidth: 500,
            textAlign: "center",
            boxShadow: 3,
          }}
        >
          <Box
            component="img"
            src="./pending-icon.svg"
            alt="Pending Approval"
            sx={{
              width: 30,
              mb: 1,
            }}
          />
          <Typography variant="h4" gutterBottom sx={{ fontWeight: "bold" }}>
            Pending
          </Typography>
          <Typography variant="body1" sx={{ color: "#555", mb: 3 }}>
            Your appointment request is pending. It will be confirmed after the
            doctor approves it. You’ll be notified once it’s approved. Thanks
            for your patience!
          </Typography>

          <Divider sx={{ mb: 3 }} />

          {loading && <CircularProgress />}

          {error && (
            <Typography variant="body2" color="error" sx={{ mb: 2 }}>
              {error}
            </Typography>
          )}

          {detail && (
            <Box sx={{ textAlign: "left", mb: 3 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                Appointment Details
              </Typography>

              <Typography>
                <strong>Name:</strong> {detail.name}
              </Typography>
              <Typography>
                <strong>Phone:</strong> {detail.phone}
              </Typography>
              <Typography>
                <strong>Email:</strong> {detail.email}
              </Typography>
              <Typography>
                <strong>Date of Birth:</strong> {detail.dob}
              </Typography>
              <Typography>
                <strong>Gender:</strong> {detail.gender}
              </Typography>
              <Typography>
                <strong>Address:</strong> {detail.address}
              </Typography>
              <Typography>
                <strong>Reason for Consultation:</strong>{" "}
                {detail.reasonForConsultation}
              </Typography>
              <Typography>
                <strong>Appointment Date:</strong> {detail.schedule_date}
              </Typography>
              <Typography>
                <strong>Appointment Time:</strong> {detail.schedule_time}
              </Typography>
            </Box>
          )}

          <Button
            variant="contained"
            sx={{
              bgcolor: "red",
              borderRadius: "20px",
              fontWeight: "bold",
              textTransform: "none",
            }}
            onClick={() => navigate("/")}
          >
            Back to Home
          </Button>
        </Box>
      </Box>
      <Footer />
    </Box>
  );
};

export default AppointmentSuccess;
