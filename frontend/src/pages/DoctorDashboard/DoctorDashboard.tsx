import React, { useState, useEffect } from "react";
import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, CircularProgress, Stack, Divider, IconButton, useTheme, useMediaQuery } from "@mui/material";
import API from "../../components/configs/API";
import { extractErrorMsg } from "../../components/configs/API/errorUtils";
import NavBar from "../../components/header";
import ScheduleDialog from "../../components/ui/ScheduleDialog";
import ConfirmDeleteDialog from "../../components/ui/ConfirmDeleteDialog";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import toast from "react-hot-toast";

const DoctorDashboard = () => {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const docId = user.id;
  const [selectedSection, setSelectedSection] = useState("dashboard");
  const [appointments, setAppointments] = useState<any[]>([]);
  const [schedules, setSchedules] = useState<any[]>([]);
  const [scheduleLoading, setScheduleLoading] = useState(false);
  const [scheduleDialogOpen, setScheduleDialogOpen] = useState(false);
  const [scheduleToEdit, setScheduleToEdit] = useState<any | null>(null);
  const [scheduleToDelete, setScheduleToDelete] = useState<any | null>(null);
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
        const data = res.data?.appointments || res.data || [];
        setAppointments(data.map((x: any) => ({ ...x, id: x.id || x.appointment_id })));
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

  const handleApprove = async (id: string) => {
    try {
      await API.put(`update-appointment/${id}`, { is_approved: true });
      toast.success("Appointment approved");
      fetchAppointments();
    } catch (err: any) {
      toast.error(extractErrorMsg(err, "Approval failed"));
    }
  };

  const appointmentStatus = (a: any) => {
    if (a.is_success) return { label: "Booked", color: "#4CAF50" };
    if (a.is_approved) return { label: "Approved", color: "#FF9800" };
    return { label: "Pending", color: "#757575" };
  };

  const fetchSchedules = async () => {
    setScheduleLoading(true);
    try {
      if (!docId) return;
      const res = await API.get(`get_all_schedules/${docId}`).catch(() => ({ data: { schedules: [] } }));
      setSchedules(res.data.schedules || []);
    } catch (err) {
      console.error(err);
    } finally {
      setScheduleLoading(false);
    }
  };

  useEffect(() => { fetchSchedules(); }, []);

  const handleDeleteSchedule = async (id: string) => {
    try {
      await API.delete(`delete_schedule/${id}`);
      toast.success("Schedule deleted");
      fetchSchedules();
    } catch (err: any) {
      toast.error(extractErrorMsg(err, "Delete failed"));
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
            <TableCell>Patient</TableCell><TableCell>Email</TableCell><TableCell>Date</TableCell><TableCell>Time</TableCell><TableCell>Status</TableCell><TableCell>Action</TableCell>
          </TableRow></TableHead>
          <TableBody>
            {appointments.map((a: any) => {
              const st = appointmentStatus(a);
              return (
                <TableRow key={a.id}>
                  <TableCell>{a.name}</TableCell>
                  <TableCell>{a.email}</TableCell>
                  <TableCell>{a.schedule_date}</TableCell>
                  <TableCell>{a.schedule_time}</TableCell>
                  <TableCell><Typography color={st.color} fontWeight={600}>{st.label}</Typography></TableCell>
                  <TableCell>
                    {!a.is_approved && (
                      <Button size="small" sx={{ backgroundColor: "#fa6039", color: "#fff", mr: 1 }} onClick={() => handleApprove(a.id)}>Approve</Button>
                    )}
                    {a.is_approved && !a.is_success && (
                      <Button size="small" sx={{ backgroundColor: "#4CAF50", color: "#fff" }} onClick={() => handleComplete(a.id)}>Complete</Button>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );

  const renderSchedule = () => (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
        <Typography variant="h6">My Schedule</Typography>
        <Button variant="contained" sx={{ backgroundColor: "#fa6039" }} onClick={() => setScheduleDialogOpen(true)}>
          Add Schedule
        </Button>
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead><TableRow>
            <TableCell>Schedule Date</TableCell><TableCell>Schedule Time</TableCell><TableCell>Actions</TableCell>
          </TableRow></TableHead>
          <TableBody>
            {scheduleLoading ? (
              <TableRow><TableCell colSpan={3} align="center"><CircularProgress size={24} /></TableCell></TableRow>
            ) : schedules.length === 0 ? (
              <TableRow><TableCell colSpan={3} align="center">No schedules found.</TableCell></TableRow>
            ) : (
              schedules.map((s: any) => (
                <TableRow key={s.schedule_id || s._id}>
                  <TableCell>{s.schedule_date}</TableCell>
                  <TableCell>{s.schedule_time}</TableCell>
                  <TableCell>
                    <IconButton size="small" color="primary" onClick={() => { setScheduleToEdit(s); setScheduleDialogOpen(true); }}>
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton size="small" color="error" onClick={() => setScheduleToDelete(s)}>
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <ScheduleDialog
        open={scheduleDialogOpen}
        docId={docId}
        schedule={scheduleToEdit}
        onClose={() => { setScheduleDialogOpen(false); setScheduleToEdit(null); }}
        onCreated={fetchSchedules}
      />

      <ConfirmDeleteDialog
        open={!!scheduleToDelete}
        message={`Are you sure you want to delete the schedule on "${scheduleToDelete?.schedule_date || ""}" at "${scheduleToDelete?.schedule_time || ""}"? This action cannot be undone.`}
        onClose={() => setScheduleToDelete(null)}
        onConfirm={() => scheduleToDelete && handleDeleteSchedule(scheduleToDelete.schedule_id)}
      />
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
