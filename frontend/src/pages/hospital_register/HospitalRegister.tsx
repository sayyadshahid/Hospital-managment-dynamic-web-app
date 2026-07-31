import React, { useState, ChangeEvent } from "react";
import { Box, Typography, Button, TextField, Rating } from "@mui/material";
import NavBar from "../../components/header";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import API from "../../components/configs/API";
import { extractErrorMsg } from "../../components/configs/API/errorUtils";

const HospitalRegister = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      title: "",
      description: "",
      address: "",
      about: "",
      rating: 0,
      admin_name: "",
      admin_email: "",
      admin_phone: "",
      admin_password: "",
      confirm_admin_password: "",
    },
    validationSchema: Yup.object({
      title: Yup.string().required("Title is required"),
      description: Yup.string().required("Description is required"),
      address: Yup.string().required("Address is required"),
      about: Yup.string().required("about field is required"),
      admin_name: Yup.string().required("Admin name is required"),
      admin_email: Yup.string().email("Invalid email").required("Admin email is required"),
      admin_phone: Yup.string().min(10, "Phone must be at least 10 digits").required("Admin phone is required"),
      admin_password: Yup.string().min(8, "Minimum 8 characters").required("Admin password is required"),
      confirm_admin_password: Yup.string()
        .oneOf([Yup.ref("admin_password")], "Passwords must match")
        .required("Confirm password is required"),
    }),
    onSubmit: async (values) => {
      const formData = new FormData();
      formData.append("title", values.title);
      formData.append("description", values.description);
      formData.append("address", values.address);
      formData.append("about", values.about);
      formData.append("admin_name", values.admin_name);
      formData.append("admin_email", values.admin_email);
      formData.append("admin_phone", values.admin_phone);
      formData.append("admin_password", values.admin_password);
      if (file) formData.append("file", file);
      formData.append("is_active", "true");

      try {
        const res = await API.post(
          "register-hospital/",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        toast.success(res.data?.msg || "Registered Successfully!");
        navigate(`/hospitalList`);
      } catch (error: any) {
        toast.error(extractErrorMsg(error, "Hospital Registration Failed. Please try again."));
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
            label="Title"
            name="title"
            onChange={formik.handleChange}
            value={formik.values.title}
            fullWidth
            error={formik.touched.title && Boolean(formik.errors.title)}
            helperText={formik.touched.title && formik.errors.title}
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
            label="Description"
            name="description"
            onChange={formik.handleChange}
            value={formik.values.description}
            multiline
            rows={2}
            fullWidth
            error={
              formik.touched.description && Boolean(formik.errors.description)
            }
            helperText={formik.touched.description && formik.errors.description}
          />

          <TextField
            label="Address"
            name="address"
            onChange={formik.handleChange}
            value={formik.values.address}
            fullWidth
            error={formik.touched.address && Boolean(formik.errors.address)}
            helperText={formik.touched.address && formik.errors.address}
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

          <Typography variant="subtitle1" sx={{ mt: 1, fontWeight: 600 }}>
            Hospital Admin Details
          </Typography>

          <TextField
            label="Admin Name"
            name="admin_name"
            onChange={formik.handleChange}
            value={formik.values.admin_name}
            fullWidth
            error={formik.touched.admin_name && Boolean(formik.errors.admin_name)}
            helperText={formik.touched.admin_name && formik.errors.admin_name}
          />

          <TextField
            label="Admin Email"
            name="admin_email"
            type="email"
            onChange={formik.handleChange}
            value={formik.values.admin_email}
            fullWidth
            error={formik.touched.admin_email && Boolean(formik.errors.admin_email)}
            helperText={formik.touched.admin_email && formik.errors.admin_email}
          />

          <TextField
            label="Admin Phone"
            name="admin_phone"
            onChange={formik.handleChange}
            value={formik.values.admin_phone}
            fullWidth
            error={formik.touched.admin_phone && Boolean(formik.errors.admin_phone)}
            helperText={formik.touched.admin_phone && formik.errors.admin_phone}
          />

          <TextField
            label="Admin Password"
            name="admin_password"
            type="password"
            onChange={formik.handleChange}
            value={formik.values.admin_password}
            fullWidth
            error={formik.touched.admin_password && Boolean(formik.errors.admin_password)}
            helperText={formik.touched.admin_password && formik.errors.admin_password}
          />

          <TextField
            label="Confirm Admin Password"
            name="confirm_admin_password"
            type="password"
            onChange={formik.handleChange}
            value={formik.values.confirm_admin_password}
            fullWidth
            error={formik.touched.confirm_admin_password && Boolean(formik.errors.confirm_admin_password)}
            helperText={formik.touched.confirm_admin_password && formik.errors.confirm_admin_password}
          />

          <Rating
            name="rating"
            value={formik.values.rating}
            onChange={(event, newValue) => {
              formik.setFieldValue("rating", newValue || 0);
            }}
          />

          <Button
            type="submit"
            variant="contained"
            sx={{ bgcolor: "red", color: "white", fontWeight: 600 }}
          >
            Add Hospital
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default HospitalRegister;
