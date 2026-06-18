import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Box, Button, TextField, Typography, Paper } from "@mui/material";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";
import useLocalStorage from "../../hooks/useLocalhost";

const LoginForm = () => {
  const [_, setUser] = useLocalStorage("user", null);
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

      // Dummy login — bypasses backend
      const dummyUser = {
        id: "111e8400-e29b-41d4-a716-446655440010",
        role: "admin",
        access_token: "dummy-token-bypassed",
        msg: "Login Successful!",
        fullname: "Alice Williams",
        email: values.email,
      };

      setUser(dummyUser);
      dummyUser.role === "admin"
        ? navigate("/admin")
        : navigate("/", { state: { id: dummyUser.id } });
      toast.success(dummyUser.msg);

      setLoading(false);
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
