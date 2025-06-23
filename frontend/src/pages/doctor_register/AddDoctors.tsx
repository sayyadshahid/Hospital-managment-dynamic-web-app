import React, { useState, ChangeEvent } from "react";
import { Box, Typography, Button, TextField, Divider } from "@mui/material";
import NavBar from "../../components/header";
import Footer from "../../components/footer";
import { useFormik } from "formik";
import * as Yup from "yup";
import toast from "react-hot-toast";
import { useLocation, useNavigate } from "react-router-dom";
import API from "../../components/configs/API";
import Grid from "@mui/material/Grid";

const DoctorRegister = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const hospitalId = location.state?.hospital_id;

  const formik = useFormik({
    initialValues: {
      fullname: "",
      degree: "",
      experties: "",
      about: "",
      email: "",
      phone_no: "",
      password: "",
      confirm_password: "",
    },
    validationSchema: Yup.object({
      fullname: Yup.string().required("Full name is required"),
      degree: Yup.string().required("Degree is required"),
      experties: Yup.string().required("Expertise is required"),
      about: Yup.string().required("About is required"),
      email: Yup.string().email("Invalid email").required("Email is required"),
      phone_no: Yup.string()
        .matches(/^\d{10,15}$/, "Phone number must be 10–15 digits")
        .required("Phone number is required"),
      password: Yup.string()
        .min(8, "Password must be at least 8 characters")
        .required("Password is required"),
      confirm_password: Yup.string()
        .oneOf([Yup.ref("password")], "Passwords must match")
        .required("Please confirm password"),
    }),
    onSubmit: async (values) => {
      const formData = new FormData();
      formData.append("fullname", values.fullname);
      formData.append("degree", values.degree);
      formData.append("experties", values.experties);
      formData.append("about", values.about);
      formData.append("email", values.email);
      formData.append("phone_no", values.phone_no);
      formData.append("password", values.password);
      formData.append("confirm_password", values.confirm_password);
      formData.append("is_active", "true");
      formData.append("file", file as File);

      try {
        const res = await API.post(`register-doctor/${hospitalId}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success(res.data?.msg || "Doctor Registered Successfully!");
        formik.resetForm();
        setSelectedImage(null);
        setFile(null);
        // navigate("/doctors");
      } catch (error: any) {
        const errMsg =
          error?.response?.data?.detail ||
          "Doctor Registration Failed. Please try again.";
        toast.error(errMsg);
      }
    },
  });

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setFile(selected);
      const objectUrl = URL.createObjectURL(selected);
      setSelectedImage(objectUrl);
    }
  };

  return (
    <Box>
      <NavBar />
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          backgroundColor: "#f5f5f5",
          p: 2,
        }}
      >
        <Box
          component="form"
          onSubmit={formik.handleSubmit}
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
            width: "100%",
            maxWidth: 500,
            p: 3,
            backgroundColor: "white",
            borderRadius: 2,
            boxShadow: 3,
          }}
        >
          <Typography variant="h6" align="center">
            Doctor Registration
          </Typography>

          {/* ===== Form 1: Doctor Details ===== */}
          <Typography variant="subtitle1" fontWeight={600}>
            Doctor Details
          </Typography>

          <TextField
            label="Full Name"
            name="fullname"
            value={formik.values.fullname}
            onChange={formik.handleChange}
            error={formik.touched.fullname && Boolean(formik.errors.fullname)}
            helperText={formik.touched.fullname && formik.errors.fullname}
            fullWidth
          />

          <TextField
            label="Degree"
            name="degree"
            value={formik.values.degree}
            onChange={formik.handleChange}
            error={formik.touched.degree && Boolean(formik.errors.degree)}
            helperText={formik.touched.degree && formik.errors.degree}
            fullWidth
          />

          <TextField
            label="Expertise"
            name="experties"
            value={formik.values.experties}
            onChange={formik.handleChange}
            error={formik.touched.experties && Boolean(formik.errors.experties)}
            helperText={formik.touched.experties && formik.errors.experties}
            fullWidth
          />

          <TextField
            label="About"
            name="about"
            multiline
            rows={3}
            value={formik.values.about}
            onChange={formik.handleChange}
            error={formik.touched.about && Boolean(formik.errors.about)}
            helperText={formik.touched.about && formik.errors.about}
            fullWidth
          />

          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            style={{ marginTop: 8 }}
          />
          {selectedImage && (
            <img
              src={selectedImage}
              alt="Doctor preview"
              style={{
                width: "100%",
                maxHeight: 180,
                objectFit: "cover",
                marginTop: 8,
              }}
            />
          )}

          <Divider />

          {/* ===== Form 2: Credentials ===== */}
          <Typography variant="subtitle1" fontWeight={600}>
            Login Credentials
          </Typography>

          <TextField
            label="Email"
            name="email"
            value={formik.values.email}
            onChange={formik.handleChange}
            error={formik.touched.email && Boolean(formik.errors.email)}
            helperText={formik.touched.email && formik.errors.email}
            fullWidth
          />

          <TextField
            label="Phone Number"
            name="phone_no"
            value={formik.values.phone_no}
            onChange={formik.handleChange}
            error={formik.touched.phone_no && Boolean(formik.errors.phone_no)}
            helperText={formik.touched.phone_no && formik.errors.phone_no}
            fullWidth
          />

          <Box
            sx={{
              display: "flex",
              gap: 2,
              flexDirection: { xs: "column", sm: "row" },
            }}
          >
            <TextField
              label="Password"
              type="password"
              name="password"
              value={formik.values.password}
              onChange={formik.handleChange}
              error={formik.touched.password && Boolean(formik.errors.password)}
              helperText={formik.touched.password && formik.errors.password}
              fullWidth
            />
            <TextField
              label="Confirm Password"
              type="password"
              name="confirm_password"
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
              fullWidth
            />
          </Box>

          <Button
            type="submit"
            variant="contained"
            sx={{ bgcolor: "red", color: "white", fontWeight: 600, mt: 2 }}
          >
            Submit
          </Button>
        </Box>
      </Box>
      <Footer />
    </Box>
  );
};

export default DoctorRegister;
