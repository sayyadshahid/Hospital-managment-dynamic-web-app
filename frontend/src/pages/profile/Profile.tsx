import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Avatar,
  Button,
  TextField,
  IconButton,
  Stack,
} from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import NavBar from "../../components/header";
import { useAvatar } from "../../hooks/AvtarContex";
import API from "../../components/configs/API";
import { useNavigate } from "react-router-dom";

interface UserDetails {
  fullname: string;
  email: string;
  phone_no: string;
  role: string;
}
export default function ProfileDetail() {
  const { avatar, setAvatar } = useAvatar(); // use context
  const [user, setUser] = useState({
    avatar: "",
  });
 const [userDetail, setuserDetail] = useState<UserDetails>({
  fullname: "",
  email: "",
  phone_no: "",
  role: "",
});
 const navigate = useNavigate();

  const userId = localStorage.getItem("user_id");
  useEffect(() => {
    const fetchUserdata = async () => {
      try {
        const res = await API.get(`/users/${userId}`);
        console.log(res, "====================");
        setuserDetail(res.data.user);
      } catch (err) {
        console.log(err);
      }
    };

    fetchUserdata();
  }, []);
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const avatarData = reader.result as string;
        setUser((prev) => ({
          ...prev,
          avatar: avatarData,
        }));
        setAvatar(avatarData); // update global context
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('access_token')
     navigate("/");
    window.location.reload(); 
  };

  return (
    <Box>
      <NavBar />
      <Box
        sx={{
          maxWidth: 400,
          mx: "auto",
          mt: 5,
          p: 3,
          border: "1px solid #ccc",
          borderRadius: 2,
          boxShadow: 3,
          textAlign: "center",
          backgroundColor: "#fff",
        }}
      >
        <Stack direction="column" spacing={2} alignItems="center">
          <Avatar
            src={user.avatar || "/default-avatar.png"}
            sx={{ width: 100, height: 100 }}
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

          <Typography variant="h6">{userDetail.fullname}</Typography>
          <Typography variant="body1" color="text.secondary">
            {userDetail.email}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {userDetail.phone_no}
          </Typography>

          <Button
            variant="contained"
            color="error"
            startIcon={<LogoutIcon />}
            onClick={handleLogout}
            sx={{ mt: 2, borderRadius: "20px", textTransform: "none" }}
          >
            Logout
          </Button>
        </Stack>
      </Box>
    </Box>
  );
}
