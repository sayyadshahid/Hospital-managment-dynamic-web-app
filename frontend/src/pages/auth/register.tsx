import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Box, Button, TextField, Typography, CircularProgress, Divider } from "@mui/material";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import API from "../../components/configs/API";
import PersonAddOutlinedIcon from "@mui/icons-material/PersonAddOutlined";
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

const RegisterForm = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const formik = useFormik({
    initialValues: { fullname: "", email: "", phone_no: "", password: "", confirm_password: "", role: "" },
    validationSchema: Yup.object({
      fullname: Yup.string().required("Full name is required").trim(),
      email: Yup.string().email("Invalid email").required("Email is required").trim(),
      phone_no: Yup.string().required("Phone number is required").matches(/^[0-9]{10}$/, "Must be exactly 10 digits"),
      password: Yup.string().required("Password is required").min(6, "Minimum 6 characters"),
      confirm_password: Yup.string().required("Confirm your password").oneOf([Yup.ref("password")], "Passwords must match"),
    }),
    onSubmit: async (values) => {
      setLoading(true);
      try {
        const res = await API.post("signup", {
          fullname: values.fullname, email: values.email,
          phone_no: values.phone_no, password: values.password,
          confirm_password: values.confirm_password, role: "user",
        });
        toast.success(res.data.msg || "Registration successful! Please login.");
        navigate("/login");
      } catch (error: any) {
        toast.error(error?.response?.data?.msg || "Registration failed. Please try again.");
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
        width: "100%", maxWidth: 420, p: 3.5,
        bgcolor: tokens.surface, borderRadius: "20px",
        border: `1px solid ${tokens.borderPurple}`,
      }}>
        {/* Header */}
        <Box sx={{ textAlign: "center", mb: 2 }}>
          <Box sx={{
            width: 52, height: 52, borderRadius: "14px", mx: "auto", mb: 1.5,
            bgcolor: tokens.purpleLight,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <PersonAddOutlinedIcon sx={{ fontSize: 24, color: tokens.purple }} />
          </Box>
          <Typography sx={{ fontFamily: "Plus Jakarta Sans", fontWeight: 800, fontSize: 22, color: tokens.neutralDark }}>
            Create an account
          </Typography>
          <Typography sx={{ fontFamily: "Inter", fontSize: 13.5, color: tokens.neutral, mt: 0.5 }}>
            Join Jacsto and start booking today
          </Typography>
        </Box>

        <form onSubmit={formik.handleSubmit}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1.6 }}>
            <TextField
              fullWidth label="Full Name" id="fullname" name="fullname"
              value={formik.values.fullname} onChange={formik.handleChange}
              error={formik.touched.fullname && Boolean(formik.errors.fullname)}
              helperText={formik.touched.fullname && formik.errors.fullname}
              sx={fieldSx}
            />
            <TextField
              fullWidth label="Phone Number" id="phone_no" name="phone_no"
              value={formik.values.phone_no} onChange={formik.handleChange}
              error={formik.touched.phone_no && Boolean(formik.errors.phone_no)}
              helperText={formik.touched.phone_no && formik.errors.phone_no}
              sx={fieldSx}
            />
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
            <TextField
              fullWidth label="Confirm Password" id="confirm_password" name="confirm_password" type="password"
              value={formik.values.confirm_password} onChange={formik.handleChange}
              error={formik.touched.confirm_password && Boolean(formik.errors.confirm_password)}
              helperText={formik.touched.confirm_password && formik.errors.confirm_password}
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
              {loading ? <CircularProgress size={22} color="inherit" /> : "Create Account"}
            </Button>
          </Box>
        </form>

        <Divider sx={{ my: 2, borderColor: tokens.borderPurple }} />

        <Typography sx={{ textAlign: "center", fontFamily: "Inter", fontSize: 14, color: tokens.neutral }}>
          Already have an account?{" "}
          <Box component="span"
            onClick={() => navigate("/login")}
            sx={{ cursor: "pointer", fontWeight: 700, color: tokens.purple, "&:hover": { color: tokens.purpleMid } }}
          >
            Login
          </Box>
        </Typography>
      </Box>
    </Box>
  );
};

export default RegisterForm;