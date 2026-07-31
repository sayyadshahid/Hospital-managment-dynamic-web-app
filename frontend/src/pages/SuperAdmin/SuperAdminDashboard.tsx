import React, { useState, useEffect } from "react";
import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Dialog, DialogTitle, DialogContent, TextField, CircularProgress } from "@mui/material";
import API from "../../components/configs/API";
import { extractErrorMsg } from "../../components/configs/API/errorUtils";
import Sidebar from "../../components/Sidebar";
import toast from "react-hot-toast";

const menuItems = [
  { label: "Dashboard", path: "/super-admin", icon: "📊" },
  { label: "Hospitals", path: "/super-admin/hospitals", icon: "🏥" },
  { label: "Doctors", path: "/super-admin/doctors", icon: "👨‍⚕️" },
  { label: "Users", path: "/super-admin/users", icon: "👥" },
];

const SuperAdminDashboard = () => {
  const [activeView, setActiveView] = useState("dashboard");
  const [hospitals, setHospitals] = useState<any[]>([]);
  const [doctors, setDoctors] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [formData, setFormData] = useState({ title: "", description: "", address: "", about: "", admin_name: "", admin_email: "", admin_phone: "", admin_password: "" });
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    const path = window.location.pathname;
    if (path.includes("hospitals")) setActiveView("hospitals");
    else if (path.includes("doctors")) setActiveView("doctors");
    else if (path.includes("users")) setActiveView("users");
    else setActiveView("dashboard");
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [hRes, dRes, uRes] = await Promise.all([
        API.get("hospitals").catch(() => ({ data: { Hospitals: [] } })),
        API.get("get-all-doctors").catch(() => ({ data: { Doctors: [] } })),
        API.get("get-all-users").catch(() => ({ data: { users: [] } })),
      ]);
      setHospitals(hRes.data.Hospitals || []);
      setDoctors(dRes.data.Doctors || []);
      setUsers(uRes.data.users || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleCreateHospital = async () => {
    try {
      const fd = new FormData();
      Object.entries(formData).forEach(([k, v]) => fd.append(k, v));
      if (file) fd.append("file", file);
      fd.append("is_active", "true");
      await API.post("register-hospital/", fd, { headers: { "Content-Type": "multipart/form-data" } });
      toast.success("Hospital created with admin account");
      setOpenDialog(false);
      fetchData();
    } catch (err: any) {
      toast.error(extractErrorMsg(err, "Failed to create hospital"));
    }
  };

  const handleDeleteHospital = async (id: string) => {
    try {
      await API.delete(`delete_hospital/${id}`);
      toast.success("Hospital deleted");
      fetchData();
    } catch (err: any) {
      toast.error(extractErrorMsg(err, "Delete failed"));
    }
  };

  const navigateTo = (path: string) => {
    window.history.pushState({}, "", path);
    const p = path.split("/").pop() || "dashboard";
    setActiveView(p);
  };

  const renderDashboard = () => (
    <Box sx={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 3 }}>
      {[
        { label: "Total Hospitals", value: hospitals.length, color: "#fa6039" },
        { label: "Total Doctors", value: doctors.length, color: "#4CAF50" },
        { label: "Total Users", value: users.length, color: "#2196F3" },
      ].map((item) => (
        <Paper key={item.label} sx={{ p: 3, textAlign: "center", borderTop: `4px solid ${item.color}` }}>
          <Typography variant="h4">{item.value}</Typography>
          <Typography color="text.secondary">{item.label}</Typography>
        </Paper>
      ))}
    </Box>
  );

  const renderHospitals = () => (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
        <Typography variant="h6">Hospitals</Typography>
        <Button variant="contained" sx={{ backgroundColor: "#fa6039" }} onClick={() => setOpenDialog(true)}>+ Add Hospital</Button>
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead><TableRow>
            <TableCell>Name</TableCell><TableCell>Address</TableCell><TableCell>Admin Email</TableCell><TableCell>Actions</TableCell>
          </TableRow></TableHead>
          <TableBody>
            {hospitals.map((h: any) => (
              <TableRow key={h.id}>
                <TableCell>{h.title}</TableCell>
                <TableCell>{h.address}</TableCell>
                <TableCell>{h.admin_email || "-"}</TableCell>
                <TableCell>
                  <Button size="small" color="error" onClick={() => handleDeleteHospital(h.id)}>Delete</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Register New Hospital</DialogTitle>
        <DialogContent>
          {["title", "description", "address", "about", "admin_name", "admin_email", "admin_phone", "admin_password"].map((field) => (
            <TextField key={field} fullWidth margin="dense" label={field.replace("_", " ").toUpperCase()} type={field.includes("password") ? "password" : "text"}
              value={(formData as any)[field]} onChange={(e) => setFormData({ ...formData, [field]: e.target.value })} />
          ))}
          <input type="file" onChange={(e) => setFile(e.target.files?.[0] || null)} style={{ marginTop: 16 }} />
          <Button fullWidth variant="contained" sx={{ mt: 2, backgroundColor: "#fa6039" }} onClick={handleCreateHospital}>Create Hospital</Button>
        </DialogContent>
      </Dialog>
    </Box>
  );

  const renderDoctors = () => (
    <Box>
      <Typography variant="h6" mb={2}>All Doctors</Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead><TableRow>
            <TableCell>Name</TableCell><TableCell>Email</TableCell><TableCell>Specialty</TableCell><TableCell>Hospital ID</TableCell>
          </TableRow></TableHead>
          <TableBody>
            {doctors.map((d: any) => (
              <TableRow key={d.id}>
                <TableCell>{d.fullname}</TableCell><TableCell>{d.email}</TableCell>
                <TableCell>{d.experties}</TableCell><TableCell>{d.hospital_id}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );

  const renderUsers = () => (
    <Box>
      <Typography variant="h6" mb={2}>All Users</Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead><TableRow>
            <TableCell>Name</TableCell><TableCell>Email</TableCell><TableCell>Role</TableCell>
          </TableRow></TableHead>
          <TableBody>
            {users.filter((u: any) => u.role !== "super_admin" && u.role !== "doctor").map((u: any) => (
              <TableRow key={u.id}>
                <TableCell>{u.fullname}</TableCell><TableCell>{u.email}</TableCell><TableCell>{u.role}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );

  return (
    <Box sx={{ display: "flex" }}>
      <Sidebar menuItems={menuItems} />
      <Box sx={{ flex: 1, p: 4, background: "#f5f5f5", minHeight: "100vh" }}>
        {loading ? <CircularProgress /> : (
          <>
            {activeView === "dashboard" && renderDashboard()}
            {activeView === "hospitals" && renderHospitals()}
            {activeView === "doctors" && renderDoctors()}
            {activeView === "users" && renderUsers()}
          </>
        )}
      </Box>
    </Box>
  );
};

export default SuperAdminDashboard;
