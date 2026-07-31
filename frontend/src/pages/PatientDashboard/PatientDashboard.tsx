import React, { useState, useEffect } from "react";
import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, CircularProgress } from "@mui/material";
import API from "../../components/configs/API";
import Sidebar from "../../components/Sidebar";

const menuItems = [
  { label: "Dashboard", path: "/patient", icon: "📊" },
  { label: "My Appointments", path: "/patient/appointments", icon: "📅" },
  { label: "Profile", path: "/profile", icon: "👤" },
];

const PatientDashboard = () => {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeView, setActiveView] = useState("dashboard");

  useEffect(() => {
    const path = window.location.pathname;
    if (path.includes("appointments")) setActiveView("appointments");
    else setActiveView("dashboard");
  }, []);

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      if (user.id) {
        const res = await API.get(`get-all-appointments-by-userid/${user.id}`).catch(() => ({ data: [] }));
        setAppointments(res.data || []);
      }
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchAppointments(); }, []);

  const navigateTo = (path: string) => {
    window.history.pushState({}, "", path);
    setActiveView(path.split("/").pop() || "dashboard");
  };

  const renderDashboard = () => (
    <Box>
      <Typography variant="h5" mb={3}>Welcome, {user.fullname || "Patient"}</Typography>
      <Box sx={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 3 }}>
        <Paper sx={{ p: 3, textAlign: "center", borderTop: "4px solid #fa6039" }}>
          <Typography variant="h4">{appointments.length}</Typography>
          <Typography color="text.secondary">My Appointments</Typography>
        </Paper>
        <Paper sx={{ p: 3, textAlign: "center", borderTop: "4px solid #4CAF50" }}>
          <Typography variant="h4">{appointments.filter((a: any) => a.is_success).length}</Typography>
          <Typography color="text.secondary">Completed</Typography>
        </Paper>
      </Box>
      <Paper sx={{ p: 3, mt: 3, textAlign: "center", background: "#fff3e0" }}>
        <Typography variant="h6">Book a New Appointment</Typography>
        <Typography variant="body2" color="text.secondary">Visit the Hospitals page to find a doctor and book your appointment.</Typography>
      </Paper>
    </Box>
  );

  return (
    <Box sx={{ display: "flex" }}>
      <Sidebar menuItems={menuItems} />
      <Box sx={{ flex: 1, p: 4, background: "#f5f5f5", minHeight: "100vh" }}>
        {loading ? <CircularProgress /> : (
          <>
            {activeView === "dashboard" && renderDashboard()}
            {activeView === "appointments" && (
              <Box>
                <Typography variant="h6" mb={2}>My Appointments</Typography>
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead><TableRow>
                      <TableCell>Doctor</TableCell><TableCell>Date</TableCell><TableCell>Time</TableCell><TableCell>Payment</TableCell><TableCell>Status</TableCell>
                    </TableRow></TableHead>
                    <TableBody>
                      {appointments.map((a: any) => (
                        <TableRow key={a.id}>
                          <TableCell>{a.docId}</TableCell>
                          <TableCell>{a.schedule_date}</TableCell>
                          <TableCell>{a.schedule_time}</TableCell>
                          <TableCell>{a.payment_status || "Pending"}</TableCell>
                          <TableCell>{a.is_success ? "Completed" : "Pending"}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            )}
          </>
        )}
      </Box>
    </Box>
  );
};

export default PatientDashboard;
