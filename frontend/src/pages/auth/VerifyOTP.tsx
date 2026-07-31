import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Box, Button, TextField, Typography, Paper } from "@mui/material";
import toast from "react-hot-toast";
import { useNavigate, useLocation } from "react-router-dom";
import API from "../../components/configs/API";
import { extractErrorMsg } from "../../components/configs/API/errorUtils";
import CircularProgress from "@mui/material/CircularProgress";

const VerifyOTP = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || "";
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!email) navigate("/forgot-password");
  }, [email, navigate]);

  const formik = useFormik({
    initialValues: { otp: "" },
    validationSchema: Yup.object({
      otp: Yup.string()
        .length(6, "OTP must be 6 digits")
        .matches(/^\d+$/, "OTP must contain only numbers")
        .required("OTP is required"),
    }),
    onSubmit: async (values) => {
      setLoading(true);
      try {
        const res = await API.post("verify-reset-otp", { email, otp: values.otp });
        toast.success(res.data.msg || "OTP verified");
        navigate("/reset-password", { state: { email, otp: values.otp } });
      } catch (error: any) {
        toast.error(extractErrorMsg(error, "Invalid OTP"));
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
              Verify OTP
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Enter the 6-digit OTP sent to {email}
            </Typography>
          </Box>

          <Box mb={2}>
            <TextField
              fullWidth
              id="otp"
              name="otp"
              label="OTP"
              variant="standard"
              value={formik.values.otp}
              onChange={formik.handleChange}
              error={formik.touched.otp && Boolean(formik.errors.otp)}
              helperText={formik.touched.otp && formik.errors.otp}
              inputProps={{ maxLength: 6 }}
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
            {loading ? <CircularProgress size={24} color="inherit" /> : "Verify OTP"}
          </Button>

          <Typography sx={{ textAlign: "center", mt: 2, fontSize: 15 }}>
            <span
              onClick={() => navigate("/forgot-password")}
              style={{ cursor: "pointer", fontWeight: 700 }}
            >
              Resend OTP
            </span>
          </Typography>
        </form>
      </Paper>
    </Box>
  );
};

export default VerifyOTP;
