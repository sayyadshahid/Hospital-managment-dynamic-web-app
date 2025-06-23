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

const RegisterForm = () => {
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      fullname: "",
      email: "",
      phone_no: "",
      password: "",
      confirm_password: "",
      role: ""
    },
    validationSchema: Yup.object({
      fullname: Yup.string().required("Full name is required"),
      email: Yup.string().email("Invalid email").required("Email is required"),
      phone_no: Yup.string().required("Phone number is required"),
      password: Yup.string()
        .min(6, "Minimum 6 characters")
        .required("Password is required"),
      confirm_password: Yup.string()
        .oneOf([Yup.ref("password")], "Passwords must match")
        .required("Confirm your password"),
       
    }),
    onSubmit: async (values) => {
      const payload = {
        fullname: values.fullname,
        email: values.email,
        phone_no: values.phone_no,
        password: values.password,
        confirm_password: values.confirm_password,
        role: 'user'
      };

      try {
        const res = await axios.post(
          "http://localhost:8000/api/signup",
          payload
        );

        toast.success(
          res.data.msg || "Registration successful! Please Login Again"
        );
        navigate("/login");
      } catch (error: any) {
        const errMsg =
          error?.response?.data?.msg ||
          "Registration failed. Please try again.";
        toast.error(errMsg);
      }
    },
  });

  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #ffffff 0%, #c9c5c5 )",
        borderRadius: 5,
        padding: 2,
      }}
    >
      <Paper
        elevation={4}
        sx={{
          padding: 5,
          width: "100%",
          maxWidth: 400,
          borderRadius: 4,
          backgroundColor: "#ffffff",
        }}
      >
        <form onSubmit={formik.handleSubmit}>
          <Box mb={3} textAlign="center">
            <Typography variant="h5" fontWeight="bold" color={'grey'}>
              Sign Up
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Create your account below
            </Typography>
          </Box>

          <Box mb={2}>
            <TextField
              fullWidth
              id="fullname"
              name="fullname"
              label="Full Name"
              variant="outlined"
              size="small"
              value={formik.values.fullname}
              onChange={formik.handleChange}
              error={formik.touched.fullname && Boolean(formik.errors.fullname)}
              helperText={formik.touched.fullname && formik.errors.fullname}
            />
          </Box>

          <Box mb={2}>
            <TextField
              fullWidth
              id="phone_no"
              name="phone_no"
              label="Phone Number"
              variant="outlined"
              size="small"
              value={formik.values.phone_no}
              onChange={formik.handleChange}
              error={formik.touched.phone_no && Boolean(formik.errors.phone_no)}
              helperText={formik.touched.phone_no && formik.errors.phone_no}
            />
          </Box>

          <Box mb={2}>
            <TextField
              fullWidth
              id="email"
              name="email"
              label="Email"
              variant="outlined"
              size="small"
              type="email"
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
              variant="outlined"
              size="small"
              type="password"
              value={formik.values.password}
              onChange={formik.handleChange}
              error={formik.touched.password && Boolean(formik.errors.password)}
              helperText={formik.touched.password && formik.errors.password}
            />
          </Box>

          <Box mb={2}>
            <TextField
              fullWidth
              id="confirm_password"
              name="confirm_password"
              label="Confirm Password"
              variant="outlined"
              size="small"
              type="password"
              value={formik.values.confirm_password}
              onChange={formik.handleChange}
              error={
                formik.touched.confirm_password &&
                Boolean(formik.errors.confirm_password)
              }
              helperText={
                formik.touched.confirm_password &&
                formik.errors.confirm_password
              }
            />
          </Box>

          

          <Button
            fullWidth
            variant="contained"
            type="submit"
            sx={{
              backgroundColor: "#fa6039",
              borderRadius: 2,
              fontWeight: "bold",
              textTransform: "none",
              fontSize: "1rem",
              py: 1.2,
              ":hover": {
                backgroundColor: "#ec6b4b",
              },
            }}
          >
            Create Account
          </Button>

          <Typography
            sx={{
              textAlign: "center",
              mt: 3,
              fontSize: 14,
              color: "textSecondary",
            }}
          >
            Already have an account?{" "}
            <Box
              component="span"
              onClick={() => navigate("/login")}
              sx={{ cursor: "pointer", fontWeight: 600, color: "#000000" }}
            >
              Login
            </Box>
          </Typography>
        </form>
      </Paper>
    </Box>
  );
};

export default RegisterForm;
