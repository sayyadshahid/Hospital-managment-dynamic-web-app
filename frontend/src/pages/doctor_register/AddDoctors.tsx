import React, { useState, ChangeEvent } from "react";
import { Box, Typography, Button, TextField, Rating } from "@mui/material";
import NavBar from "../../components/header";
import Footer from "../../components/footer";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import toast from "react-hot-toast";
import { useLocation, useNavigate } from "react-router-dom";
import API from "../../components/configs/API";

const DoctorRegister = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const hospitalId = location.state?.hospital_id;
  
  const formik = useFormik({
    initialValues: {
      name: "",
      degree: "",
      experties: "",
      about: "",
    },
    validationSchema: Yup.object({
      name: Yup.string().required("name is required"),
      degree: Yup.string().required("degree is required"),
      experties: Yup.string().required("experties is required"),
      about: Yup.string().required("about field is required"),
    }),
    onSubmit: async (values) => {
     
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("degree", values.degree);
      formData.append("experties", values.experties);
      formData.append("about", values.about);
      formData.append("file", file as File);
      formData.append("is_active", "true");

      try {
        const res = await API.post(
          `register-doctor/${hospitalId}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
             
            },
          }
        );
        toast.success(res.data?.msg || "Registered Successfully!");
        formik.resetForm();
        setSelectedImage(null);
        setFile(null);
        // navigate(`/doctors`);
      } catch (error: any) {
        const errMsg =
          error?.response?.data?.detail ||
          "Hospital Registration Failed. Please try again.";
        toast.error(errMsg);
      } finally {
        console.log("Form submission attempt completed.");
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
            maxWidth: 400,
            p: 3,
            backgroundColor: "white",
            borderRadius: 2,
            boxShadow: 3,
          }}
        >
          <Typography variant="h6" align="center">
            Add Hospital
          </Typography>

          <TextField
            label="Name"
            name="name"
            onChange={formik.handleChange}
            value={formik.values.name}
            fullWidth
            error={formik.touched.name && Boolean(formik.errors.name)}
            helperText={formik.touched.name && formik.errors.name}
          />

          <input
            accept="image/*"
            type="file"
            onChange={handleImageChange}
            style={{ marginTop: "8px" }}
          />
          {selectedImage && (
            <img
              src={selectedImage}
              alt="Preview"
              style={{
                width: "100%",
                maxHeight: 180,
                objectFit: "cover",
                marginTop: "8px",
              }}
            />
          )}

          <TextField
            label="degree"
            name="degree"
            onChange={formik.handleChange}
            value={formik.values.degree}
            multiline
            rows={1}
            fullWidth
          />

          <TextField
            label="Experties"
            name="experties"
            onChange={formik.handleChange}
            value={formik.values.experties}
            fullWidth
            error={formik.touched.experties && Boolean(formik.errors.experties)}
            helperText={formik.touched.experties && formik.errors.experties}
          />

          <TextField
            label="About"
            name="about"
            onChange={formik.handleChange}
            value={formik.values.about}
            multiline
            rows={2}
            fullWidth
            error={formik.touched.about && Boolean(formik.errors.about)}
            helperText={formik.touched.about && formik.errors.about}
          />

          <Button
            type="submit"
            variant="contained"
            sx={{ bgcolor: "red", color: "white", fontWeight: 600 }}
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
