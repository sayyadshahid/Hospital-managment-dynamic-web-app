import React, { useState, useEffect } from "react";
import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, CircularProgress, Stack, Divider, useTheme, useMediaQuery } from "@mui/material";
import API from "../../components/configs/API";
import { extractErrorMsg } from "../../components/configs/API/errorUtils";
import NavBar from "../../components/header";
import toast from "react-hot-toast";

const DoctorDashboard = () => {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const docId = user.id;
  const [selectedSection, setSelectedSection] = useState("dashboard");
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const sections = [
    { key: "dashboard", label: "Dashboard" },
    { key: "appointments", label: "Appointments" },
    { key: "schedule", label: "My Schedule" },
  ];

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      if (docId) {
        const res = await API.get(`get-all-appointments-by-docId/${docId}`).catch(() => ({ data: [] }));
        setAppointments(res.data || []);
      }
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchAppointments(); }, []);

  const handleComplete = async (id: string) => {
    try {
      await API.put(`update-appointment/${id}`, { is_success: true });
      toast.success("Appointment marked completed");
      fetchAppointments();
    } catch (err: any) {
      toast.error(extractErrorMsg(err, "Update failed"));
    }
  };

  const renderDashboard = () => (
    <Box sx={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 3 }}>
      {[
        { label: "Total Appointments", value: appointments.length, color: "#fa6039" },
        { label: "Completed", value: appointments.filter((a: any) => a.is_success).length, color: "#4CAF50" },
        { label: "Pending", value: appointments.filter((a: any) => !a.is_success).length, color: "#FF9800" },
      ].map((item) => (
        <Paper key={item.label} sx={{ p: 3, textAlign: "center", borderTop: `4px solid ${item.color}` }}>
          <Typography variant="h4">{item.value}</Typography>
          <Typography color="text.secondary">{item.label}</Typography>
        </Paper>
      ))}
    </Box>
  );

  const renderAppointments = () => (
    <Box>
      <Typography variant="h6" mb={2}>My Appointments</Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead><TableRow>
            <TableCell>Patient</TableCell><TableCell>Email</TableCell><TableCell>Date</TableCell><TableCell>Time</TableCell><TableCell>Payment</TableCell><TableCell>Status</TableCell><TableCell>Action</TableCell>
          </TableRow></TableHead>
          <TableBody>
            {appointments.map((a: any) => (
              <TableRow key={a.id}>
                <TableCell>{a.name}</TableCell>
                <TableCell>{a.email}</TableCell>
                <TableCell>{a.schedule_date}</TableCell>
                <TableCell>{a.schedule_time}</TableCell>
                <TableCell>{a.payment_status || "Pending"}</TableCell>
                <TableCell>{a.is_success ? "Completed" : "Pending"}</TableCell>
                <TableCell>
                  {!a.is_success && (
                    <Button size="small" sx={{ backgroundColor: "#4CAF50", color: "#fff" }} onClick={() => handleComplete(a.id)}>Complete</Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );

  const renderSchedule = () => (
    <Box>
      <Typography variant="h6" mb={2}>My Schedule</Typography>
      <Button variant="contained" sx={{ backgroundColor: "#fa6039" }} onClick={() => window.location.href = "/schedule-form"}>
        Manage Schedule
      </Button>
    </Box>
  );

  const renderContent = () => {
    switch (selectedSection) {
      case "dashboard": return renderDashboard();
      case "appointments": return renderAppointments();
      case "schedule": return renderSchedule();
      default: return <Typography>Section not found</Typography>;
    }
  };

  return (
    <>
      <NavBar />
      <Box display="flex" flexDirection={isMobile ? "column" : "row"} minHeight="100vh">
        <Box
          width={isMobile ? "100%" : "20%"}
          bgcolor="#f5f5f5"
          p={2}
          borderRight={isMobile ? "none" : "1px solid #ddd"}
        >
          <Typography variant="h6" mb={2} fontWeight="bold">Doctor Panel</Typography>
          <Divider sx={{ mb: 2 }} />
          <Stack spacing={1}>
            {sections.map((section) => (
              <Paper
                key={section.key}
                elevation={selectedSection === section.key ? 3 : 0}
                sx={{
                  p: 1.5,
                  cursor: "pointer",
                  backgroundColor: selectedSection === section.key ? "#e0e0e0" : "transparent",
                  fontWeight: selectedSection === section.key ? "bold" : "normal",
                  "&:hover": { backgroundColor: "#eeeeee" },
                }}
                onClick={() => setSelectedSection(section.key)}
              >
                {section.label}
              </Paper>
            ))}
          </Stack>
        </Box>
        <Box width={isMobile ? "100%" : "80%"} p={2} overflow="auto" sx={{ backgroundColor: "#fafafa" }}>
          {loading ? <CircularProgress /> : renderContent()}
        </Box>
      </Box>
    </>
  );
};

export default DoctorDashboard;
