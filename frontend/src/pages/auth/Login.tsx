import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  Box,
  Button,
  TextField,
  Checkbox,
  FormControlLabel,
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
      role: false,
    },
    validationSchema: Yup.object({
      email: Yup.string().email("Invalid email").required("Email is required"),
      password: Yup.string()
        .min(6, "Minimum 6 characters")
        .required("Password is required"),
      role: Yup.boolean(),
    }),
    onSubmit: async (values) => {
      const payload = {
        email: values.email,
        password: values.password,
        role: values.role ? "doctor" : "user",
      };

      try {
        const res = await axios.post(
          "http://localhost:8000/api/login",
          payload
        );
        const userId = res.data.id;
        const user_role = res.data.role;
        const access_token = res.data.access_token;

        localStorage.setItem("user_id", userId);
        localStorage.setItem("access_token", access_token);
        localStorage.setItem("user_role", user_role);

        const userRole = res.data.role || payload.role;
        console.log(userRole);

        navigate("/", { state: { id: userId } });
        toast.success(res.data.msg || "Login Successful!");
      } catch (error: any) {
        const errMsg =
          error?.response?.data?.msg || "Login failed. Please try again.";
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

          <Box mb={2}>
            <FormControlLabel
              control={
                <Checkbox
                  id="role"
                  name="role"
                  checked={formik.values.role}
                  onChange={formik.handleChange}
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
            Login
          </Button>
        </form>
      </Paper>
    </Box>
  );
};

export default LoginForm;
