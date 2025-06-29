import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Box, Button, TextField, Typography, Paper } from "@mui/material";
import toast from "react-hot-toast";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import API from "../../components/configs/API";
import CircularProgress from "@mui/material/CircularProgress";

const LoginForm = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string().email("Invalid email").required("Email is required"),
      password: Yup.string()
        .min(6, "Minimum 6 characters")
        .required("Password is required"),
    }),
    onSubmit: async (values) => {
      setLoading(true);  

      try {
        const res = await API.post("login", values);

        const { id, role, access_token, msg, fullname, email } = res.data;

        const user = {
          id,
          role,
          access_token,
          msg,
          fullname,
          email,
        };

        localStorage.setItem("user", JSON.stringify(user));

        role == "admin" ? navigate("/admin") : navigate("/", { state: { id } });
        toast.success(msg || "Login Successful!");
      } catch (error: any) {
        const errMsg =
          error?.response?.data?.detail || "Login failed. Please try again.";
        toast.error(errMsg);
      } finally {
        setLoading(false); // Stop loader
      }
    },
  });

  return (
    <Box
      height="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      sx={{
        paddingLeft: { xs: 2, sm: 3, md: 4 },
        paddingRight: { xs: 2, sm: 3, md: 4 },
      }}
    >
      <Paper
        elevation={3}
        sx={{
          padding: { xs: 3, sm: 4, md: 5 },
          width: { xs: "100%", sm: 350, md: 400 },
          borderRadius: 2,
        }}
      >
        <form onSubmit={formik.handleSubmit}>
          <Box mb={2}>
            <Typography variant="h6" gutterBottom>
              Login
            </Typography>
          </Box>

          <Box mb={2}>
            <TextField
              fullWidth
              id="email"
              name="email"
              label="Email"
              type="email"
              variant="standard"
              value={formik.values.email}
              onChange={formik.handleChange}
              error={formik.touched.email && Boolean(formik.errors.email)}
              helperText={formik.touched.email && formik.errors.email}
            />
          </Box>

          <Box mb={2}>
            <TextField
              fullWidth
              id="password"
              name="password"
              label="Password"
              type="password"
              variant="standard"
              value={formik.values.password}
              onChange={formik.handleChange}
              error={formik.touched.password && Boolean(formik.errors.password)}
              helperText={formik.touched.password && formik.errors.password}
            />
          </Box>

          <Button
            fullWidth
            variant="contained"
            type="submit"
            sx={{
              backgroundColor: "#fa6039",
              borderRadius: 3,
              fontWeight: "bold",
              ":hover": {
                backgroundColor: "#ec6b4b",
              },
            }}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : "Login"}
          </Button>

          <Typography sx={{ textAlign: "center", mt: 2, fontSize: 15 }}>
            Don't have an account?{" "}
            <span
              onClick={() => navigate("/register")}
              style={{ cursor: "pointer", fontWeight: 700 }}
            >
              Register
            </span>
          </Typography>
        </form>
      </Paper>
    </Box>
  );
};

export default LoginForm;
