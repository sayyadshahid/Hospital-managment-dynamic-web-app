import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Box, Button, TextField, Typography, Paper } from "@mui/material";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import API from "../../components/configs/API";
import { extractErrorMsg } from "../../components/configs/API/errorUtils";
import CircularProgress from "@mui/material/CircularProgress";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const formik = useFormik({
    initialValues: { email: "" },
    validationSchema: Yup.object({
      email: Yup.string().email("Invalid email").required("Email is required"),
    }),
    onSubmit: async (values) => {
      setLoading(true);
      try {
        const res = await API.post("forgot-password", values);
        toast.success(res.data.msg || "OTP sent to your email");
        navigate("/verify-reset-otp", { state: { email: values.email } });
      } catch (error: any) {
        toast.error(extractErrorMsg(error, "Something went wrong"));
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <Box
      height="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      sx={{ paddingLeft: { xs: 2, sm: 3, md: 4 }, paddingRight: { xs: 2, sm: 3, md: 4 } }}
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
              Forgot Password
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Enter your email address and we'll send you an OTP to reset your password.
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

          <Button
            fullWidth
            variant="contained"
            type="submit"
            sx={{
              backgroundColor: "#fa6039",
              borderRadius: 3,
              fontWeight: "bold",
              ":hover": { backgroundColor: "#ec6b4b" },
            }}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : "Send OTP"}
          </Button>

          <Typography sx={{ textAlign: "center", mt: 2, fontSize: 15 }}>
            Remember your password?{" "}
            <span
              onClick={() => navigate("/login")}
              style={{ cursor: "pointer", fontWeight: 700 }}
            >
              Login
            </span>
          </Typography>
        </form>
      </Paper>
    </Box>
  );
};

export default ForgotPassword;
