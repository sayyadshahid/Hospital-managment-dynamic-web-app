import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Avatar,
  Button,
  TextField,
  IconButton,
  Stack,
  Divider,
  CircularProgress,
  Paper,
  Chip,
  Container,
} from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import SaveIcon from "@mui/icons-material/Save";
import NavBar from "../../components/header";
import Footer from "../../components/footer";
import { useAvatar } from "../../hooks/AvtarContex";
import API from "../../components/configs/API";
import { extractErrorMsg } from "../../components/configs/API/errorUtils";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

interface HospitalInfo {
  id?: string;
  title?: string;
  address?: string;
  about?: string;
  description?: string;
  file_path?: string;
}

export default function ProfileDetail() {
  const { avatar, setAvatar } = useAvatar();
  const [userDetail, setUserDetail] = useState<any>({});
  const [hospital, setHospital] = useState<HospitalInfo | null>(null);
  const [profile, setProfile] = useState<any>({
    fullname: "",
    phone_no: "",
    about: "",
    degree: "",
    experties: "",
  });
  const [isDoctor, setIsDoctor] = useState(false);
  const [isHospitalAdmin, setIsHospitalAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const navigate = useNavigate();

  const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
  const userId = storedUser.id;
  const userRole = storedUser.role;

  useEffect(() => {
    const fetchUserdata = async () => {
      try {
        const isDoc = userRole === "doctor";
        setIsDoctor(isDoc);
        setIsHospitalAdmin(userRole === "hospital_admin");
        let data: any = {};
        if (isDoc) {
          const res = await API.get(`/get-doctor-by-id/${userId}`);
          data = res.data.doctor || {};
        } else {
          const res = await API.get(`/users/${userId}`);
          data = res.data.user || {};
        }
        setUserDetail(data);
        setProfile({
          fullname: data.fullname || "",
          phone_no: data.phone_no || "",
          about: data.about || "",
          degree: data.degree || "",
          experties: data.experties || "",
        });
        if (data.file_path) {
          setAvatar(`${process.env.REACT_APP_FILE_BASE_URL}/${data.file_path}`);
        }
        if (userRole === "hospital_admin" && data.hospital_id) {
          const hRes = await API.get(`/hospital_id/${data.hospital_id}`);
          setHospital(hRes.data.hospital || null);
        }
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserdata();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setField = (key: string, value: string) => {
    setProfile((prev: any) => ({ ...prev, [key]: value }));
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selected = event.target.files?.[0];
    if (!selected) return;
    setFile(selected);
    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatar(reader.result as string);
    };
    reader.readAsDataURL(selected);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const fd = new FormData();
      fd.append("fullname", profile.fullname || "");
      fd.append("phone_no", profile.phone_no || "");
      if (profile.about) fd.append("about", profile.about);
      if (isDoctor) {
        if (profile.degree) fd.append("degree", profile.degree);
        if (profile.experties) fd.append("experties", profile.experties);
      }
      if (file) fd.append("file", file);

      let res: any;
      if (isDoctor) {
        res = await API.put(`/update-doctor/${userId}`, fd, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        res = await API.put(`/update-profile`, fd, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }
      const data = res.data.doctor || res.data.user || {};
      setUserDetail(data);
      setProfile((prev: any) => ({ ...prev, ...data }));
      if (data.file_path) {
        setAvatar(`${process.env.REACT_APP_FILE_BASE_URL}/${data.file_path}`);
        setFile(null);
      }
      const stored = JSON.parse(localStorage.getItem("user") || "{}");
      if (data.fullname) {
        stored.fullname = data.fullname;
        localStorage.setItem("user", JSON.stringify(stored));
      }
      toast.success(res.data.msg || "Profile updated successfully");
    } catch (err: any) {
      toast.error(extractErrorMsg(err, "Failed to update profile"));
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user");
    navigate("/");
    window.location.reload();
  };

  const roleLabel =
    userRole === "doctor" ? "Doctor" : userRole === "hospital_admin" ? "Hospital Admin" : "Patient";

  return (
    <Box sx={{ bgcolor: "#ffffff", minHeight: "100vh" }}>
      <NavBar />
      <Container sx={{ py: { xs: 2, sm: 4 } }}>
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, gap: 3 }}>
            {/* Profile card */}
            <Paper
              elevation={3}
              sx={{
                flex: 1,
                maxWidth: { xs: "100%", md: 440 },
                p: 3,
                borderRadius: 3,
                alignSelf: "flex-start",
              }}
            >
              <Stack direction="column" spacing={2} alignItems="center">
                <Avatar
                  src={avatar || `${process.env.REACT_APP_FILE_BASE_URL}/${userDetail.file_path}` || "/default-avatar.png"}
                  sx={{ width: 120, height: 120 }}
                />
                <label htmlFor="upload-photo">
                  <input
                    type="file"
                    id="upload-photo"
                    accept="image/*"
                    style={{ display: "none" }}
                    onChange={handleImageChange}
                  />
                  <IconButton component="span" color="primary">
                    <PhotoCamera />
                  </IconButton>
                </label>

                <Box textAlign="center">
                  <Typography variant="h6">{profile.fullname || userDetail.fullname}</Typography>
                  <Chip
                    label={roleLabel}
                    size="small"
                    sx={{ mt: 1, backgroundColor: "#fa6039", color: "#fff", fontWeight: 600 }}
                  />
                  <Typography variant="body2" color="text.secondary" mt={1}>
                    {userDetail.email}
                  </Typography>
                </Box>

                <Stack
                  direction="row"
                  spacing={1}
                  sx={{ mt: 2, width: "100%", justifyContent: "center" }}
                >
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={<SaveIcon />}
                    sx={{ borderRadius: "20px", textTransform: "none" }}
                    onClick={handleSave}
                    disabled={saving}
                  >
                    {saving ? "Saving..." : "Save Changes"}
                  </Button>
                  <Button
                    variant="contained"
                    color="error"
                    startIcon={<LogoutIcon />}
                    onClick={handleLogout}
                    sx={{ borderRadius: "20px", textTransform: "none" }}
                  >
                    Logout
                  </Button>
                </Stack>
              </Stack>
            </Paper>

            {/* Editable details */}
            <Paper elevation={3} sx={{ flex: 2, p: 3, borderRadius: 3 }}>
              <Typography variant="h6" gutterBottom>
                Personal Details
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 2 }}>
                <TextField
                  label="Full Name"
                  value={profile.fullname}
                  onChange={(e) => setField("fullname", e.target.value)}
                />
                <TextField
                  label="Phone Number"
                  value={profile.phone_no}
                  onChange={(e) => setField("phone_no", e.target.value)}
                />
                {isDoctor && (
                  <>
                    <TextField
                      label="Degree"
                      value={profile.degree}
                      onChange={(e) => setField("degree", e.target.value)}
                    />
                    <TextField
                      label="Area of Expertise"
                      value={profile.experties}
                      onChange={(e) => setField("experties", e.target.value)}
                    />
                  </>
                )}
                <TextField
                  label="About"
                  value={profile.about}
                  onChange={(e) => setField("about", e.target.value)}
                  multiline
                  minRows={4}
                  sx={{ gridColumn: { xs: "auto", sm: "1 / -1" } }}
                />
              </Box>
            </Paper>
          </Box>
        )}

        {/* Hospital details (visible to hospital admin) */}
        {isHospitalAdmin && hospital && (
          <Paper elevation={3} sx={{ mt: 3, p: 3, borderRadius: 3 }}>
            <Typography variant="h6" gutterBottom>
              My Hospital
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, gap: 3 }}>
              {hospital.file_path && (
                <Box
                  component="img"
                  src={`${process.env.REACT_APP_FILE_BASE_URL}/${hospital.file_path}`}
                  alt={hospital.title}
                  sx={{
                    width: { xs: "100%", sm: 280 },
                    height: { xs: 180, sm: 160 },
                    objectFit: "cover",
                    borderRadius: 2,
                    flexShrink: 0,
                  }}
                />
              )}
              <Box width="100%">
                <Typography fontWeight={600}>{hospital.title}</Typography>
                <Typography color="text.secondary">{hospital.description}</Typography>
                <Typography color="text.secondary" mt={1}>
                  {hospital.address}
                </Typography>
                <Typography color="text.secondary" mt={1}>
                  {hospital.about}
                </Typography>
                <Button
                  variant="outlined"
                  sx={{ mt: 2, color: "#fa6039", borderColor: "#fa6039" }}
                  onClick={() => navigate("/hospital-admin")}
                >
                  Manage Hospital
                </Button>
              </Box>
            </Box>
          </Paper>
        )}
        <Footer />
      </Container>
    </Box>
  );
}