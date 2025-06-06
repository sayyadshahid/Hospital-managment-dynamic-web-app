import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
} from "@mui/material";
import toast from "react-hot-toast";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const LoginForm = () => {
  const navigate = useNavigate();

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
      try {
        const res = await axios.post("http://localhost:8000/api/login", values);

        const { id, role, access_token, msg } = res.data;

        localStorage.setItem("user_id", id);
        localStorage.setItem("access_token", access_token);
        localStorage.setItem("user_role", role);

        navigate("/", { state: { id } });
        toast.success(msg || "Login Successful!");
      } catch (error: any) {
        const errMsg =
          error?.response?.data?.detail || "Login failed. Please try again.";
        toast.error(errMsg);
      } finally {
        console.log("Form submission attempt completed.");
      }
    },
  });

  return (
    <Box
      height="100vh"
      width="100vw"
      display="flex"
      alignItems="center"
      justifyContent="center"
      sx={{ paddingLeft: 2 }}
    >
      <Paper
        elevation={3}
        sx={{
          padding: 4,
          width: 300,
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
            Login
          </Button>
        </form>
      </Paper>
    </Box>
  );
};

export default LoginForm;
