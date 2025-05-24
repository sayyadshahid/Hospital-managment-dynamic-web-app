import { useState, ChangeEvent } from "react";
import {
  Box,
  Typography,
  Button,
  TextField,
  Rating,
} from "@mui/material";
import NavBar from "../components/header";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import toast from "react-hot-toast";

const HospitalRegister = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);

  const formik = useFormik({
    initialValues: {
      title: "",
      image: "",
      description: "",
      address: "",
      rating: 0,
    },
    validationSchema: Yup.object({
      title: Yup.string().required("Title is required"),
      image: Yup.string().required("Image is required"),
      description: Yup.string().required("Description is required"),
      address: Yup.string().required("Address is required"),
    }),
    onSubmit: async (values) => {
      const payload = {
        title: values.title,
        image: values.image,
        description: values.description,
        address: values.address,
        rating: values.rating,
      };

      try {
        const res = await axios.post("/", payload); // Update the API endpoint as needed
        toast.success(res.data.msg || "Registered Successfully!");
      } catch (error: any) {
        const errMsg =
          error?.response?.data?.msg ||
          "Hospital Registration Failed. Please try again.";
        toast.error(errMsg);
      } finally {
        console.log("Form submission attempt completed.");
      }
    },
  });

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFile(file);
      const objectUrl = URL.createObjectURL(file);
      setSelectedImage(objectUrl);
      formik.setFieldValue("image", objectUrl); // Can also use the File object directly if uploading
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
          {formik.touched.image && formik.errors.image && (
            <Typography color="error" variant="caption">
              {formik.errors.image}
            </Typography>
          )}

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
              formik.touched.description &&
              Boolean(formik.errors.description)
            }
            helperText={
              formik.touched.description && formik.errors.description
            }
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
