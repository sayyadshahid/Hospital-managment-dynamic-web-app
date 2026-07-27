import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Box, Button, TextField, Typography, CircularProgress, Divider } from "@mui/material";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import API from "../../components/configs/API";
import useLocalStorage from "../../hooks/useLocalhost";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";

/* ─── Design Tokens ─────────────────────────────────────────────── */
const tokens = {
  purple: "#7C3AED",
  purpleMid: "#6D28D9",
  purpleLight: "#EDE9FE",
  violet: "#8B5CF6",
  indigo: "#4F46E5",
  neutral: "#6B7280",
  neutralDark: "#1F1635",
  surface: "#FFFFFF",
  borderPurple: "#DDD6FE",
};

const fieldSx = {
  "& .MuiOutlinedInput-root": {
    borderRadius: "10px", fontFamily: "Inter",
    "& fieldset": { borderColor: tokens.borderPurple },
    "&:hover fieldset": { borderColor: tokens.violet },
    "&.Mui-focused fieldset": { borderColor: tokens.purple, borderWidth: "1.5px" },
  },
  "& .MuiInputLabel-root": {
    fontFamily: "Inter", color: tokens.neutral,
    "&.Mui-focused": { color: tokens.purple },
  },
};

const LoginForm = () => {
  const [_, setUser] = useLocalStorage("user", null);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const formik = useFormik({
    initialValues: { email: "", password: "" },
    validationSchema: Yup.object({
      email: Yup.string().email("Invalid email").required("Email is required"),
      password: Yup.string().min(6, "Minimum 6 characters").required("Password is required"),
    }),
    onSubmit: async (values) => {
      setLoading(true);
      try {
        const res = await API.post("login", values);
        const { id, role, access_token, msg, fullname, email } = res.data;
        setUser({ id, role, access_token, msg, fullname, email });
        role === "admin" ? navigate("/admin") : navigate("/", { state: { id } });
        toast.success(msg || "Login Successful!");
      } catch (error: any) {
        toast.error(error?.response?.data?.detail || "Login failed. Please try again.");
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <Box sx={{
      minHeight: "100vh", display: "flex",
      alignItems: "center", justifyContent: "center",
      background: "linear-gradient(135deg, #F3EEFF 0%, #FAF8FF 60%, #EEF2FF 100%)",
      px: 2,
    }}>
      <Box sx={{
        width: "100%", maxWidth: 400, p: 4,
        bgcolor: tokens.surface, borderRadius: "20px",
        border: `1px solid ${tokens.borderPurple}`,
      }}>
        {/* Header */}
        <Box sx={{ textAlign: "center", mb: 3 }}>
          <Box sx={{
            width: 52, height: 52, borderRadius: "14px", mx: "auto", mb: 1.5,
            bgcolor: tokens.purpleLight,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <LockOutlinedIcon sx={{ fontSize: 24, color: tokens.purple }} />
          </Box>
          <Typography sx={{ fontFamily: "Plus Jakarta Sans", fontWeight: 800, fontSize: 22, color: tokens.neutralDark }}>
            Welcome back
          </Typography>
          <Typography sx={{ fontFamily: "Inter", fontSize: 13.5, color: tokens.neutral, mt: 0.5 }}>
            Sign in to your Jacsto account
          </Typography>
        </Box>

        <form onSubmit={formik.handleSubmit}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2.2 }}>
            <TextField
              fullWidth label="Email" id="email" name="email" type="email"
              value={formik.values.email} onChange={formik.handleChange}
              error={formik.touched.email && Boolean(formik.errors.email)}
              helperText={formik.touched.email && formik.errors.email}
              sx={fieldSx}
            />
            <TextField
              fullWidth label="Password" id="password" name="password" type="password"
              value={formik.values.password} onChange={formik.handleChange}
              error={formik.touched.password && Boolean(formik.errors.password)}
              helperText={formik.touched.password && formik.errors.password}
              sx={fieldSx}
            />

            <Button
              fullWidth variant="contained" type="submit" disableElevation
              sx={{
                bgcolor: tokens.purple, fontFamily: "Inter",
                fontWeight: 600, fontSize: 15, textTransform: "none",
                borderRadius: "10px", py: 1.3, mt: 0.5,
                boxShadow: `0 4px 14px ${tokens.purple}33`,
                "&:hover": {
                  bgcolor: tokens.purpleMid,
                  transform: "translateY(-1px)",
                  transition: "all 0.2s ease",
                },
              }}
            >
              {loading ? <CircularProgress size={22} color="inherit" /> : "Login"}
            </Button>
          </Box>
        </form>

        <Divider sx={{ my: 2.5, borderColor: tokens.borderPurple }} />

        <Typography sx={{ textAlign: "center", fontFamily: "Inter", fontSize: 14, color: tokens.neutral }}>
          Don't have an account?{" "}
          <Box component="span"
            onClick={() => navigate("/register")}
            sx={{ cursor: "pointer", fontWeight: 700, color: tokens.purple, "&:hover": { color: tokens.purpleMid } }}
          >
            Register
          </Box>
        </Typography>
      </Box>
    </Box>
  );
};

export default LoginForm;