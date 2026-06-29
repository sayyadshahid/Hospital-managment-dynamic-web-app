import React, { useState, ChangeEvent } from "react";
import { Box, Typography, Button, TextField, Rating } from "@mui/material";
import LocalHospitalOutlinedIcon from "@mui/icons-material/LocalHospitalOutlined";
import AddPhotoAlternateOutlinedIcon from "@mui/icons-material/AddPhotoAlternateOutlined";
import NavBar from "../../components/header";
import { useFormik } from "formik";
import * as Yup from "yup";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import API from "../../components/configs/API";

/* ─── Design Tokens ─────────────────────────────────────────────── */
const tokens = {
  bg: "#FAF8FF",
  purple: "#7C3AED",
  purpleMid: "#6D28D9",
  purpleLight: "#EDE9FE",
  violet: "#8B5CF6",
  indigo: "#4F46E5",
  neutral: "#6B7280",
  neutralDark: "#1F1635",
  surface: "#FFFFFF",
  borderPurple: "#DDD6FE",
};

/* ─── Shared TextField style ─────────────────────────────────────── */
const fieldSx = {
  "& .MuiOutlinedInput-root": {
    borderRadius: "10px",
    fontFamily: "Inter",
    "& fieldset": { borderColor: tokens.borderPurple },
    "&:hover fieldset": { borderColor: tokens.violet },
    "&.Mui-focused fieldset": { borderColor: tokens.purple, borderWidth: "1.5px" },
  },
  "& .MuiInputLabel-root": {
    fontFamily: "Inter", color: tokens.neutral,
    "&.Mui-focused": { color: tokens.purple },
  },
};

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
    },
    validationSchema: Yup.object({
      title: Yup.string().required("Title is required"),
      description: Yup.string().required("Description is required"),
      address: Yup.string().required("Address is required"),
      about: Yup.string().required("about field is required"),
    }),
    onSubmit: async (values) => {
      const formData = new FormData();
      formData.append("title", values.title);
      formData.append("description", values.description);
      formData.append("address", values.address);
      formData.append("about", values.about);
      formData.append("file", file as File);
      formData.append("is_active", "true");

      try {
        const res = await API.post("register-hospital/", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success(res.data?.msg || "Registered Successfully!");
        navigate(`/hospitalList`);
      } catch (error: any) {
        const errMsg = error?.response?.data?.detail || "Hospital Registration Failed. Please try again.";
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
      <Box sx={{
        display: "flex", alignItems: "center", justifyContent: "center",
        minHeight: "100vh",
        background: "linear-gradient(135deg, #F3EEFF 0%, #FAF8FF 60%, #EEF2FF 100%)",
        p: 2, py: 6,
      }}>
        <Box
          component="form"
          onSubmit={formik.handleSubmit}
          sx={{
            display: "flex", flexDirection: "column", gap: 2.2,
            width: "100%", maxWidth: 440, p: 4,
            bgcolor: tokens.surface, borderRadius: "20px",
            border: `1px solid ${tokens.borderPurple}`,
            boxShadow: "0 12px 40px rgba(124,58,237,0.12)",
          }}
        >
          {/* Header */}
          <Box sx={{ textAlign: "center", mb: 1 }}>
            <Box sx={{
              width: 52, height: 52, borderRadius: "14px", mx: "auto", mb: 1.5,
              bgcolor: tokens.purpleLight, fontSize: 24,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <LocalHospitalOutlinedIcon sx={{ fontSize: 26, color: tokens.purple }} />
            </Box>
            <Typography sx={{
              fontFamily: "Plus Jakarta Sans, sans-serif",
              fontWeight: 800, fontSize: 22, color: tokens.neutralDark,
            }}>
              Add Hospital
            </Typography>
            <Typography sx={{
              fontFamily: "Inter, sans-serif", fontSize: 13.5, color: tokens.neutral, mt: 0.5,
            }}>
              List a hospital on the Jacsto platform
            </Typography>
          </Box>

          <TextField
            label="Title"
            name="title"
            onChange={formik.handleChange}
            value={formik.values.title}
            fullWidth
            sx={fieldSx}
            error={formik.touched.title && Boolean(formik.errors.title)}
            helperText={formik.touched.title && formik.errors.title}
          />

          {/* Image Upload */}
          <Box>
            <Box sx={{
              border: `1.5px dashed ${tokens.borderPurple}`,
              borderRadius: "12px", p: 2, textAlign: "center",
              bgcolor: tokens.purpleLight + "55",
              cursor: "pointer", position: "relative",
            }}>
              <input
                accept="image/*"
                type="file"
                onChange={handleImageChange}
                style={{
                  position: "absolute", inset: 0, opacity: 0, cursor: "pointer", width: "100%", height: "100%",
                }}
              />
              <Typography sx={{ fontFamily: "Inter", fontSize: 13.5, color: tokens.violet, fontWeight: 600 }}>
                <AddPhotoAlternateOutlinedIcon sx={{ fontSize: 18, color: tokens.violet, mr: 0.5 }} />
                {selectedImage ? "Change Hospital Image" : "Upload Hospital Image"}
              </Typography>
            </Box>
            {selectedImage && (
              <Box
                component="img"
                src={selectedImage}
                alt="Preview"
                sx={{
                  width: "100%", maxHeight: 180, objectFit: "cover",
                  borderRadius: "12px", mt: 1.5,
                  border: `1px solid ${tokens.borderPurple}`,
                }}
              />
            )}
          </Box>

          <TextField
            label="Description"
            name="description"
            onChange={formik.handleChange}
            value={formik.values.description}
            multiline rows={2} fullWidth sx={fieldSx}
            error={formik.touched.description && Boolean(formik.errors.description)}
            helperText={formik.touched.description && formik.errors.description}
          />

          <TextField
            label="Address"
            name="address"
            onChange={formik.handleChange}
            value={formik.values.address}
            fullWidth sx={fieldSx}
            error={formik.touched.address && Boolean(formik.errors.address)}
            helperText={formik.touched.address && formik.errors.address}
          />

          <TextField
            label="About"
            name="about"
            onChange={formik.handleChange}
            value={formik.values.about}
            multiline rows={2} fullWidth sx={fieldSx}
            error={formik.touched.about && Boolean(formik.errors.about)}
            helperText={formik.touched.about && formik.errors.about}
          />

          {/* Rating */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Typography sx={{ fontFamily: "Inter", fontSize: 13.5, color: tokens.neutral, fontWeight: 500 }}>
              Initial Rating:
            </Typography>
            <Rating
              name="rating"
              value={formik.values.rating}
              onChange={(event, newValue) => formik.setFieldValue("rating", newValue || 0)}
              sx={{ color: tokens.purple, "& .MuiRating-iconEmpty": { color: tokens.borderPurple } }}
            />
          </Box>

          <Button
            type="submit"
            variant="contained"
            disableElevation
            sx={{
              bgcolor: tokens.purple, color: "#fff",
              fontFamily: "Inter", fontWeight: 600, fontSize: 14.5,
              borderRadius: "10px", textTransform: "none", py: 1.3, mt: 1,
              boxShadow: `0 4px 14px ${tokens.purple}33`,
              "&:hover": {
                bgcolor: tokens.purpleMid,
                transform: "translateY(-1px)",
                transition: "all 0.2s ease",
              },
            }}
          >
            Add Hospital
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default HospitalRegister;