import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Box, Button, TextField, Typography, Paper, CircularProgress } from "@mui/material";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import API from "../../components/configs/API";
import { extractErrorMsg } from "../../components/configs/API/errorUtils";
import { FormField, PageTitle } from "../../components/ui/FormFields";

const RegisterForm = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);

  const formik = useFormik({
    initialValues: { fullname: "", email: "", phone_no: "", password: "", confirm_password: "", otp: "" },
    validationSchema: step === 1 ? Yup.object({
      fullname: Yup.string().required("Full name is required"),
      email: Yup.string().email("Invalid email").required("Email is required"),
      phone_no: Yup.string().required("Phone number is required").matches(/^[0-9]{10}$/, "Must be 10 digits"),
      password: Yup.string().required("Password is required").min(6, "Minimum 6 characters"),
      confirm_password: Yup.string().required("Confirm your password").oneOf([Yup.ref("password")], "Passwords must match"),
    }) : Yup.object({
      otp: Yup.string().length(6, "OTP must be 6 digits").required("OTP is required"),
    }),
    onSubmit: async (values) => {
      setLoading(true);
      try {
        if (step === 1) {
          const payload = {
            fullname: values.fullname, email: values.email, phone_no: values.phone_no,
            password: values.password, confirm_password: values.confirm_password,
          };
          await API.post("send-signup-otp", payload);
          toast.success("OTP sent to your email");
          setStep(2);
          setOtpSent(true);
        } else {
          await API.post("verify-signup-otp", { email: formik.values.email, otp: values.otp });
          toast.success("Registration verified! Please login.");
          navigate("/login");
        }
      } catch (error: any) {
        toast.error(extractErrorMsg(error, "Failed"));
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <Box sx={{ height: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "linear-gradient(135deg, #ffffff 0%, #c9c5c5)", p: { xs: 2, sm: 3, md: 4 } }}>
      <Paper elevation={4} sx={{ p: { xs: 3, sm: 4, md: 5 }, width: { xs: "100%", sm: 350, md: 400 }, borderRadius: 4 }}>
        <form onSubmit={formik.handleSubmit}>
          <Box mb={3} textAlign="center">
            <Typography variant="h5" fontWeight="bold" color="grey">
              {step === 1 ? "Sign Up" : "Verify OTP"}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              {step === 1 ? "Create your account" : `Enter OTP sent to ${formik.values.email}`}
            </Typography>
          </Box>

          {step === 1 ? (
            <>
              <FormField id="fullname" label="Full Name" value={formik.values.fullname} onChange={formik.handleChange} error={formik.errors.fullname} touched={formik.touched.fullname} />
              <FormField id="phone_no" label="Phone Number" value={formik.values.phone_no} onChange={formik.handleChange} error={formik.errors.phone_no} touched={formik.touched.phone_no} />
              <FormField id="email" label="Email" type="email" value={formik.values.email} onChange={formik.handleChange} error={formik.errors.email} touched={formik.touched.email} />
              <FormField id="password" label="Password" type="password" value={formik.values.password} onChange={formik.handleChange} error={formik.errors.password} touched={formik.touched.password} />
              <FormField id="confirm_password" label="Confirm Password" type="password" value={formik.values.confirm_password} onChange={formik.handleChange} error={formik.errors.confirm_password} touched={formik.touched.confirm_password} />
            </>
          ) : (
            <FormField id="otp" label="Enter OTP" value={formik.values.otp} onChange={formik.handleChange} error={formik.errors.otp} touched={formik.touched.otp} />
          )}

          <Button fullWidth variant="contained" type="submit" sx={{ backgroundColor: "#fa6039", borderRadius: 2, fontWeight: "bold", textTransform: "none", fontSize: "1rem", py: 1.2, ":hover": { backgroundColor: "#ec6b4b" } }}>
            {loading ? <CircularProgress size={24} color="inherit" /> : step === 1 ? "Send OTP" : "Verify & Register"}
          </Button>

          <Typography sx={{ textAlign: "center", mt: 3, fontSize: 14, color: "textSecondary" }}>
            {step === 1 ? (
              <>Already have an account?{" "}<Box component="span" onClick={() => navigate("/login")} sx={{ cursor: "pointer", fontWeight: 600, color: "#000000" }}>Login</Box></>
            ) : (
              <Box component="span" onClick={() => { setStep(1); setOtpSent(false); }} sx={{ cursor: "pointer", fontWeight: 600, color: "#000000" }}>Change Email</Box>
            )}
          </Typography>
        </form>
      </Paper>
    </Box>
  );
};

export default RegisterForm;
