import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Checkbox,
  FormControlLabel,
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
      role: false, // Checkbox, interpreted as doctor if true
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
      role: Yup.boolean(),
    }),
    onSubmit: async (values) => {
      const payload = { 
        fullname: values.fullname,
        email: values.email,
        phone_no: values.phone_no,
        password: values.password,
        confirm_password: values.confirm_password,
        role: values.role ? "doctor" : "user",
      };

      try {
        const res = await axios.post("http://localhost:8000/api/signup", payload);
        console.log("User registered:", res.data);
        toast.success(res.data.msg || "Registration successful! Please Login Again");
        navigate("/login");
      } catch (error: any) {
        const errMsg =
          error?.response?.data?.msg || "Registration failed. Please try again.";
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
            <Typography variant="h6">Create Account</Typography>
          </Box>

          <Box mb={2}>
            <TextField
              fullWidth
              id="fullname"
              name="fullname"
              label="Full Name"
              variant="standard"
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
              variant="standard"
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
              variant="standard"
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
              variant="standard"
              type="password"
              value={formik.values.password}
              onChange={formik.handleChange}
              error={formik.touched.password && Boolean(formik.errors.password)}
              helperText={formik.touched.password && formik.errors.password}
            />
          </Box>

          <Box mb={3}>
            <TextField
              fullWidth
              id="confirm_password"
              name="confirm_password"
              label="Confirm Password"
              variant="standard"
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

          <Box mb={2}>
            <FormControlLabel
              control={
                <Checkbox
                  id="role"
                  name="role"
                  checked={formik.values.role}
                  onChange={(e) =>
                    formik.setFieldValue("role", e.target.checked)
                  }
                />
              }
              label="I'm a Doctor"
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
            Create Account
          </Button>
        </form>
      </Paper>
    </Box>
  );
};

export default RegisterForm;
