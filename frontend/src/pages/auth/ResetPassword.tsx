import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Box, Button, TextField, Typography, Paper } from "@mui/material";
import toast from "react-hot-toast";
import { useNavigate, useLocation } from "react-router-dom";
import API from "../../components/configs/API";
import { extractErrorMsg } from "../../components/configs/API/errorUtils";
import CircularProgress from "@mui/material/CircularProgress";

const ResetPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || "";
  const otp = location.state?.otp || "";
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!email || !otp) navigate("/forgot-password");
  }, [email, otp, navigate]);

  const formik = useFormik({
    initialValues: {
      new_password: "",
      confirm_password: "",
    },
    validationSchema: Yup.object({
      new_password: Yup.string()
        .min(8, "Minimum 8 characters")
        .required("New password is required"),
      confirm_password: Yup.string()
        .oneOf([Yup.ref("new_password")], "Passwords do not match")
        .required("Please confirm your password"),
    }),
    onSubmit: async (values) => {
      setLoading(true);
      try {
        const res = await API.post("reset-password", {
          email,
          otp,
          new_password: values.new_password,
          confirm_password: values.confirm_password,
        });
        toast.success(res.data.msg || "Password reset successful");
        navigate("/login");
      } catch (error: any) {
        toast.error(extractErrorMsg(error, "Password reset failed"));
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
              Reset Password
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Enter your new password for {email}
            </Typography>
          </Box>

          <Box mb={2}>
            <TextField
              fullWidth
              id="new_password"
              name="new_password"
              label="New Password"
              type="password"
              variant="standard"
              value={formik.values.new_password}
              onChange={formik.handleChange}
              error={formik.touched.new_password && Boolean(formik.errors.new_password)}
              helperText={formik.touched.new_password && formik.errors.new_password}
            />
          </Box>

          <Box mb={2}>
            <TextField
              fullWidth
              id="confirm_password"
              name="confirm_password"
              label="Confirm Password"
              type="password"
              variant="standard"
              value={formik.values.confirm_password}
              onChange={formik.handleChange}
              error={formik.touched.confirm_password && Boolean(formik.errors.confirm_password)}
              helperText={formik.touched.confirm_password && formik.errors.confirm_password}
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
            {loading ? <CircularProgress size={24} color="inherit" /> : "Reset Password"}
          </Button>
        </form>
      </Paper>
    </Box>
  );
};

export default ResetPassword;
