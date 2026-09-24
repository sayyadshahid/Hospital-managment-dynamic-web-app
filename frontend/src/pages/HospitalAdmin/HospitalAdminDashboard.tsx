import React, { useState, useEffect } from "react";
import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Dialog, DialogTitle, DialogContent, TextField, CircularProgress, Stack, Divider, useTheme, useMediaQuery, IconButton } from "@mui/material";
import API from "../../components/configs/API";
import { extractErrorMsg } from "../../components/configs/API/errorUtils";
import NavBar from "../../components/header";
import ChangeCredentials from "../../components/ui/ChangeCredentials";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import toast from "react-hot-toast";

const HospitalAdminDashboard = () => {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const hospitalId = user.hospital_id;
  const [selectedSection, setSelectedSection] = useState("dashboard");
  const [doctors, setDoctors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [formData, setFormData] = useState({ fullname: "", experties: "", degree: "", about: "", email: "", phone_no: "", password: "", confirm_password: "", is_active: "true" });
  const [file, setFile] = useState<File | null>(null);
  const [hospital, setHospital] = useState<any | null>(null);
  const [hospitalForm, setHospitalForm] = useState<any>({ title: "", description: "", address: "", about: "" });
  const [hospitalImage, setHospitalImage] = useState<File | null>(null);
  const [hospitalSaving, setHospitalSaving] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const sections = [
    { key: "dashboard", label: "Dashboard" },
    { key: "doctors", label: "My Doctors" },
    { key: "hospital", label: "My Hospital" },
    { key: "credentials", label: "Change Credentials" },
  ];

  const fetchData = async () => {
    setLoading(true);
    try {
      if (hospitalId) {
        const dRes = await API.get(`get-all-doctors-by/${hospitalId}`).catch(() => ({ data: { Doctors: [] } }));
        setDoctors(dRes.data.Doctors || []);
        const hRes = await API.get(`hospital_id/${hospitalId}`).catch(() => ({ data: { hospital: null } }));
        const h = hRes.data.hospital;
        setHospital(h);
        setHospitalForm({
          title: h?.title || "",
          description: h?.description || "",
          address: h?.address || "",
          about: h?.about || "",
        });
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

  const handleSaveHospital = async () => {
    setHospitalSaving(true);
    try {
      const fd = new FormData();
      fd.append("title", hospitalForm.title);
      fd.append("description", hospitalForm.description);
      fd.append("address", hospitalForm.address);
      fd.append("about", hospitalForm.about);
      if (hospitalImage) fd.append("file", hospitalImage);
      const res = await API.put(`update-hospital/${hospitalId}`, fd, { headers: { "Content-Type": "multipart/form-data" } });
      toast.success(res.data.msg || "Hospital updated successfully");
      setHospital(res.data.hospital);
      setHospitalImage(null);
      fetchData();
    } catch (err: any) {
      toast.error(extractErrorMsg(err, "Failed to update hospital"));
    } finally {
      setHospitalSaving(false);
    }
  };

  const renderDashboard = () => (
    <Box sx={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 3 }}>
      {[
        { label: "My Doctors", value: doctors.length, color: "#fa6039" },
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

  const renderHospital = () => (
    <Box sx={{ maxWidth: 720 }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
        <EditIcon color="primary" />
        <Typography variant="h6">My Hospital Details</Typography>
      </Box>
      <Paper sx={{ p: 3, mb: 2 }}>
        <Box
          sx={{
            width: "100%",
            height: { xs: 180, sm: 240 },
            mb: 2,
            borderRadius: 2,
            overflow: "hidden",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#f1eeee",
          }}
        >
          <img
            src={
              hospitalImage
                ? URL.createObjectURL(hospitalImage)
                : `${process.env.REACT_APP_FILE_BASE_URL}/${hospital?.file_path || ""}`
            }
            alt="Hospital"
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </Box>
        <label htmlFor="hospital-photo">
          <input
            type="file"
            id="hospital-photo"
            accept="image/*"
            style={{ display: "none" }}
            onChange={(e) => setHospitalImage(e.target.files?.[0] || null)}
          />
          <Button variant="outlined" component="span" startIcon={<PhotoCamera />} sx={{ mb: 2, textTransform: "none" }}>
            Change Photo
          </Button>
        </label>
        <Stack spacing={2}>
          <TextField label="Hospital Name" value={hospitalForm.title} onChange={(e) => setHospitalForm({ ...hospitalForm, title: e.target.value })} />
          <TextField label="Short Description" value={hospitalForm.description} onChange={(e) => setHospitalForm({ ...hospitalForm, description: e.target.value })} />
          <TextField label="Address" value={hospitalForm.address} onChange={(e) => setHospitalForm({ ...hospitalForm, address: e.target.value })} />
          <TextField label="About" value={hospitalForm.about} onChange={(e) => setHospitalForm({ ...hospitalForm, about: e.target.value })} multiline minRows={4} />
        </Stack>
        <Button
          fullWidth variant="contained" startIcon={<SaveIcon />} sx={{ mt: 3, backgroundColor: "#fa6039" }}
          onClick={handleSaveHospital} disabled={hospitalSaving}
        >
          {hospitalSaving ? "Saving..." : "Save Hospital Details"}
        </Button>
        <Typography variant="caption" color="text.secondary" display="block" mt={1}>
          Changes you save here will be reflected immediately across the whole website (hospital listing &amp; hospital detail pages).
        </Typography>
      </Paper>
    </Box>
  );

  const renderCredentials = () => <ChangeCredentials />;

  const renderContent = () => {
    switch (selectedSection) {
      case "dashboard": return renderDashboard();
      case "doctors": return renderDoctors();
      case "hospital": return renderHospital();
      case "credentials": return renderCredentials();
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