import React from "react";
import { Box, Typography, Button, TextField, MenuItem } from "@mui/material";
import NavBar from "../../components/header";
import Footer from "../../components/footer";
import { useFormik } from "formik";
import * as Yup from "yup";
import toast from "react-hot-toast";
import { useLocation, useNavigate } from "react-router-dom";
import API from "../../components/configs/API";

const ConfirmAppointment = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { doctorId, schedule_date, schedule_time } = location.state || {};

  const formik = useFormik({
    initialValues: {
      id: "",
      name: "",
      phone: "",
      email: "",
      dob: "",
      gender: "",
      address: "",
      reasonForConsultation: "",
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Name is required"),
      phone: Yup.string().required("Phone is required"),
      email: Yup.string().email("Invalid email").required("Email is required"),
      dob: Yup.string().required("Date of birth is required"),
      gender: Yup.string().required("Gender is required"),
      address: Yup.string().required("Address is required"),
      reasonForConsultation: Yup.string().required(
        "Reason for consultation is required"
      ),
    }),
    onSubmit: async (values) => {
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("phone", values.phone);
      formData.append("email", values.email);
      formData.append("dob", values.dob);
      formData.append("gender", values.gender);
      formData.append("address", values.address);
      formData.append("reasonForConsultation", values.reasonForConsultation);
      formData.append("schedule_date", schedule_date);
      formData.append("schedule_time", schedule_time);

      try {
        const res = await API.post(`create_appointment/${doctorId}`, formData);
        const appointmentId = res.data.appointment_id || null;
        
        toast.success(res.data?.msg || "Appointment Confirmed!");
        formik.resetForm();
          navigate("/appointment-successs", { state: { appointmentId } });
      } catch (error: any) {
        const getErrorMessage = (error: any) => {
          const detail = error?.response?.data?.detail;
          if (!detail) return "Appointment booking failed. Please try again.";

          if (typeof detail === "string") return detail;

          if (Array.isArray(detail)) return detail.map((e) => e.msg).join(", ");

          return JSON.stringify(detail);
        };

        toast.error(getErrorMessage(error));
      }
    },
  });

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
            Confirm Appointment
          </Typography>

          <TextField
            label="Appointment Date"
            value={schedule_date || ""}
            fullWidth
            disabled
          />

          <TextField
            label="Time Slot"
            value={schedule_time || ""}
            fullWidth
            disabled
          />

          <TextField
            label="Name"
            name="name"
            onChange={formik.handleChange}
            value={formik.values.name}
            fullWidth
            error={formik.touched.name && Boolean(formik.errors.name)}
            helperText={formik.touched.name && formik.errors.name}
          />

          <TextField
            label="Phone"
            name="phone"
            onChange={formik.handleChange}
            value={formik.values.phone}
            fullWidth
            error={formik.touched.phone && Boolean(formik.errors.phone)}
            helperText={formik.touched.phone && formik.errors.phone}
          />

          <TextField
            label="Email"
            name="email"
            onChange={formik.handleChange}
            value={formik.values.email}
            fullWidth
            error={formik.touched.email && Boolean(formik.errors.email)}
            helperText={formik.touched.email && formik.errors.email}
          />

          <TextField
            label="Date of Birth"
            name="dob"
            type="date"
            InputLabelProps={{ shrink: true }}
            onChange={formik.handleChange}
            value={formik.values.dob}
            fullWidth
            error={formik.touched.dob && Boolean(formik.errors.dob)}
            helperText={formik.touched.dob && formik.errors.dob}
          />

          <TextField
            select
            label="Gender"
            name="gender"
            onChange={formik.handleChange}
            value={formik.values.gender}
            fullWidth
            error={formik.touched.gender && Boolean(formik.errors.gender)}
            helperText={formik.touched.gender && formik.errors.gender}
          >
            <MenuItem value="Male">Male</MenuItem>
            <MenuItem value="Female">Female</MenuItem>
          </TextField>

          <TextField
            label="Address"
            name="address"
            onChange={formik.handleChange}
            value={formik.values.address}
            multiline
            rows={2}
            fullWidth
            error={formik.touched.address && Boolean(formik.errors.address)}
            helperText={formik.touched.address && formik.errors.address}
          />

          <TextField
            label="Reason for Consultation"
            name="reasonForConsultation"
            onChange={formik.handleChange}
            value={formik.values.reasonForConsultation}
            multiline
            rows={2}
            fullWidth
            error={
              formik.touched.reasonForConsultation &&
              Boolean(formik.errors.reasonForConsultation)
            }
            helperText={
              formik.touched.reasonForConsultation &&
              formik.errors.reasonForConsultation
            }
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

export default ConfirmAppointment;
