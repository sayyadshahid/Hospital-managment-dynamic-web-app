import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Box, Button, TextField, Typography, Paper, CircularProgress } from "@mui/material";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import API from "../../components/configs/API";
import { extractErrorMsg } from "../../components/configs/API/errorUtils";
import useLocalStorage from "../../hooks/useLocalhost";

const roleRoutes: Record<string, string> = {
  super_admin: "/super-admin",
  hospital_admin: "/hospital-admin",
  doctor: "/doctor",
  patient: "/patient",
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
        const { id, role, access_token, fullname, email, hospital_id } = res.data;

        setUser({ id, role, access_token, fullname, email, hospital_id });
        toast.success("Login Successful!");

        const route = roleRoutes[role] || "/";
        navigate(route, { state: { id } });
      } catch (error: any) {
        toast.error(extractErrorMsg(error, "Login failed"));
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <Box height="100vh" display="flex" alignItems="center" justifyContent="center" sx={{ px: { xs: 2, sm: 3, md: 4 } }}>
      <Paper elevation={3} sx={{ p: { xs: 3, sm: 4, md: 5 }, width: { xs: "100%", sm: 350, md: 400 }, borderRadius: 2 }}>
        <form onSubmit={formik.handleSubmit}>
          <Box mb={2}><Typography variant="h6" gutterBottom>Login</Typography></Box>
          <Box mb={2}>
            <TextField fullWidth id="email" name="email" label="Email" type="email" variant="standard"
              value={formik.values.email} onChange={formik.handleChange}
              error={formik.touched.email && Boolean(formik.errors.email)}
              helperText={formik.touched.email && formik.errors.email} />
          </Box>
          <Box mb={2}>
            <TextField fullWidth id="password" name="password" label="Password" type="password" variant="standard"
              value={formik.values.password} onChange={formik.handleChange}
              error={formik.touched.password && Boolean(formik.errors.password)}
              helperText={formik.touched.password && formik.errors.password} />
          </Box>
          <Button fullWidth variant="contained" type="submit" sx={{ backgroundColor: "#fa6039", borderRadius: 3, fontWeight: "bold", ":hover": { backgroundColor: "#ec6b4b" } }}>
            {loading ? <CircularProgress size={24} color="inherit" /> : "Login"}
          </Button>
          <Typography sx={{ textAlign: "right", mt: 1, fontSize: 14 }}>
            <span onClick={() => navigate("/forgot-password")} style={{ cursor: "pointer", fontWeight: 600, color: "#fa6039" }}>Forgot Password?</span>
          </Typography>
          <Typography sx={{ textAlign: "center", mt: 2, fontSize: 15 }}>
            Don't have an account?{" "}
            <span onClick={() => navigate("/register")} style={{ cursor: "pointer", fontWeight: 700 }}>Register</span>
          </Typography>
        </form>
      </Paper>
    </Box>
  );
};

export default LoginForm;
