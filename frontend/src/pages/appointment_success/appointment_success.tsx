import React, { useEffect, useState } from "react";
import { Box, Typography, Button, CircularProgress, Divider } from "@mui/material";
import NavBar from "../../components/header";
import Footer from "../../components/footer";
import { useLocation, useNavigate } from "react-router-dom";
import API from "../../components/configs/API";

const AppointmentSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { appointmentId, paymentId } = location.state || {};
  const [detail, setDetail] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!appointmentId) { setError("No appointment ID found."); return; }
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await API.get(`get-appointment-by/${appointmentId}`);
        setDetail(res.data.details || res.data);
      } catch { setError("Failed to fetch details."); }
      finally { setLoading(false); }
    };
    fetchData();
  }, [appointmentId]);

  return (
    <Box>
      <NavBar />
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "80vh", backgroundColor: "#f5f5f5", px: 2 }}>
        <Box sx={{ backgroundColor: "white", p: 4, borderRadius: 2, maxWidth: 500, textAlign: "center", boxShadow: 3 }}>
          {paymentId ? (
            <>
              <Typography variant="h4" gutterBottom sx={{ fontWeight: "bold", color: "#4CAF50" }}>Payment Successful!</Typography>
              <Typography variant="body1" sx={{ color: "#555", mb: 3 }}>Your appointment has been confirmed. Payment ID: {paymentId}</Typography>
            </>
          ) : (
            <>
              <Typography variant="h4" gutterBottom sx={{ fontWeight: "bold" }}>Appointment Submitted</Typography>
              <Typography variant="body1" sx={{ color: "#555", mb: 3 }}>Your appointment request is waiting for doctor approval. Once approved, you can complete the payment from your appointments tab.</Typography>
            </>
          )}
          <Divider sx={{ mb: 3 }} />
          {loading && <CircularProgress />}
          {error && <Typography color="error" sx={{ mb: 2 }}>{error}</Typography>}
          {detail && (
            <Box sx={{ textAlign: "left", mb: 3 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>Appointment Details</Typography>
              {detail.name && <Typography><strong>Name:</strong> {detail.name}</Typography>}
              {detail.phone && <Typography><strong>Phone:</strong> {detail.phone}</Typography>}
              {detail.email && <Typography><strong>Email:</strong> {detail.email}</Typography>}
              {detail.schedule_date && <Typography><strong>Date:</strong> {detail.schedule_date}</Typography>}
              {detail.schedule_time && <Typography><strong>Time:</strong> {detail.schedule_time}</Typography>}
              {detail.payment_status && <Typography><strong>Payment:</strong> {detail.payment_status}</Typography>}
            </Box>
          )}
          <Button variant="contained" sx={{ bgcolor: "#fa6039", fontWeight: "bold", textTransform: "none" }}
            onClick={() => navigate("/")}>Back to Home</Button>
        </Box>
      </Box>
      <Footer />
    </Box>
  );
};

export default AppointmentSuccess;
