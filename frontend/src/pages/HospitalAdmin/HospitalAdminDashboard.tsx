import React, { useState, useEffect } from "react";
import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Dialog, DialogTitle, DialogContent, TextField, CircularProgress, Stack, Divider, useTheme, useMediaQuery } from "@mui/material";
import API from "../../components/configs/API";
import { extractErrorMsg } from "../../components/configs/API/errorUtils";
import NavBar from "../../components/header";
import toast from "react-hot-toast";

const HospitalAdminDashboard = () => {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const hospitalId = user.hospital_id;
  const [selectedSection, setSelectedSection] = useState("dashboard");
  const [doctors, setDoctors] = useState<any[]>([]);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [formData, setFormData] = useState({ fullname: "", experties: "", degree: "", about: "", email: "", phone_no: "", password: "", confirm_password: "", is_active: "true" });
  const [file, setFile] = useState<File | null>(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const sections = [
    { key: "dashboard", label: "Dashboard" },
    { key: "doctors", label: "My Doctors" },
    { key: "appointments", label: "Appointments" },
  ];

  const fetchData = async () => {
    setLoading(true);
    try {
      if (hospitalId) {
        const [dRes, aRes] = await Promise.all([
          API.get(`get-all-doctors-by/${hospitalId}`).catch(() => ({ data: { Doctors: [] } })),
          API.get("get-all-appointments").catch(() => ({ data: [] })),
        ]);
        setDoctors(dRes.data.Doctors || []);
        setAppointments((aRes.data || []).filter((a: any) => doctors.some((d: any) => d.id === a.docId)));
      }
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const handleCreateDoctor = async () => {
    try {
      const fd = new FormData();
      Object.entries(formData).forEach(([k, v]) => fd.append(k, v));
      if (file) fd.append("file", file);
      await API.post(`register-doctor/${hospitalId}`, fd, { headers: { "Content-Type": "multipart/form-data" } });
      toast.success("Doctor registered successfully");
      setOpenDialog(false);
      fetchData();
    } catch (err: any) {
      toast.error(extractErrorMsg(err, "Failed to register doctor"));
    }
  };

  const renderDashboard = () => (
    <Box sx={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 3 }}>
      {[
        { label: "My Doctors", value: doctors.length, color: "#fa6039" },
        { label: "Total Appointments", value: appointments.length, color: "#4CAF50" },
      ].map((item) => (
        <Paper key={item.label} sx={{ p: 3, textAlign: "center", borderTop: `4px solid ${item.color}` }}>
          <Typography variant="h4">{item.value}</Typography>
          <Typography color="text.secondary">{item.label}</Typography>
        </Paper>
      ))}
    </Box>
  );

  const renderDoctors = () => (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
        <Typography variant="h6">My Doctors</Typography>
        <Button variant="contained" sx={{ backgroundColor: "#fa6039" }} onClick={() => setOpenDialog(true)}>+ Add Doctor</Button>
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead><TableRow>
            <TableCell>Name</TableCell><TableCell>Email</TableCell><TableCell>Specialty</TableCell>
          </TableRow></TableHead>
          <TableBody>
            {doctors.map((d: any) => (
              <TableRow key={d.id}>
                <TableCell>{d.fullname}</TableCell><TableCell>{d.email}</TableCell><TableCell>{d.experties}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Register New Doctor</DialogTitle>
        <DialogContent>
          {["fullname", "experties", "degree", "about", "email", "phone_no", "password", "confirm_password"].map((field) => (
            <TextField key={field} fullWidth margin="dense" label={field.replace("_", " ").toUpperCase()}
              type={field.includes("password") ? "password" : "text"}
              value={(formData as any)[field]}
              onChange={(e) => setFormData({ ...formData, [field]: e.target.value })} />
          ))}
          <input type="file" onChange={(e) => setFile(e.target.files?.[0] || null)} style={{ marginTop: 16 }} />
          <Button fullWidth variant="contained" sx={{ mt: 2, backgroundColor: "#fa6039" }} onClick={handleCreateDoctor}>Register Doctor</Button>
        </DialogContent>
      </Dialog>
    </Box>
  );

  const renderAppointments = () => (
    <Box>
      <Typography variant="h6" mb={2}>Hospital Appointments</Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead><TableRow>
            <TableCell>Patient</TableCell><TableCell>Doctor</TableCell><TableCell>Date</TableCell><TableCell>Time</TableCell><TableCell>Status</TableCell>
          </TableRow></TableHead>
          <TableBody>
            {appointments.map((a: any) => (
              <TableRow key={a.id}>
                <TableCell>{a.name}</TableCell>
                <TableCell>{doctors.find((d: any) => d.id === a.docId)?.fullname || a.docId}</TableCell>
                <TableCell>{a.schedule_date}</TableCell>
                <TableCell>{a.schedule_time}</TableCell>
                <TableCell>{a.is_success ? "Completed" : a.payment_status === "paid" ? "Paid" : "Pending"}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );

  const renderContent = () => {
    switch (selectedSection) {
      case "dashboard": return renderDashboard();
      case "doctors": return renderDoctors();
      case "appointments": return renderAppointments();
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
          <Typography variant="h6" mb={2} fontWeight="bold">Hospital Admin</Typography>
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

export default HospitalAdminDashboard;
