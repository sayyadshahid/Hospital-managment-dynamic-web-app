import React from "react";
import { Box, Button, TextField, Typography } from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import toast from "react-hot-toast";
import API from "../../components/configs/API";
import { useLocation } from "react-router-dom";
import NavBar from "../../components/header";
import Footer from "../../components/footer";
import { json } from "stream/consumers";

const ScheduleForm = () => {
 
  const doctorId = JSON.parse(localStorage.getItem("user") || "{}").id;
  

  const formik = useFormik({
    initialValues: {
      schedule_date: "",
      schedule_time: "",
    },
    validationSchema: Yup.object({
      schedule_date: Yup.date().required("Schedule date is required"),
      schedule_time: Yup.string().required("Schedule time is required"),
    }),
    onSubmit: async (values) => {
      try {
        const res = await API.post(`create_schedule/${doctorId}`, values);
        toast.success(res.data?.msg || "Schedule created successfully!");
        formik.resetForm();
      } catch (error: any) {
        const detail = error?.response?.data?.detail;

        let errorMessage = "Something went wrong!";
        if (Array.isArray(detail)) {
          errorMessage = detail.map((e) => e.msg).join(", ");
        } else if (typeof detail === "string") {
          errorMessage = detail;
        }

        toast.error(errorMessage);
      }
    },
  });

  return (
    <Box sx={{ bgcolor: "#f7f7f7", minHeight: "100vh" }}>
      <NavBar />

      <Box
        sx={{
          minHeight: "calc(100vh - 64px - 64px)",  
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          p: 2,
        }}
      >
        <Box
          component="form"
          onSubmit={formik.handleSubmit}
          sx={{
            width: "100%",
            maxWidth: 500,
            backgroundColor: "#fff",
            p: 4,
            borderRadius: 2,
            boxShadow: 3,
          }}
        >
          <Typography variant="h6" align="center" gutterBottom>
            Create Schedule
          </Typography>

          <TextField
            label="Schedule Date"
            name="schedule_date"
            type="date"
            InputLabelProps={{ shrink: true }}
            fullWidth
            value={formik.values.schedule_date}
            onChange={formik.handleChange}
            error={
              formik.touched.schedule_date &&
              Boolean(formik.errors.schedule_date)
            }
            helperText={
              formik.touched.schedule_date && formik.errors.schedule_date
            }
            sx={{ mb: 2 }}
          />

          <TextField
            label="Schedule Time"
            name="schedule_time"
            type="time"
            InputLabelProps={{ shrink: true }}
            fullWidth
            value={formik.values.schedule_time}
            onChange={formik.handleChange}
            error={
              formik.touched.schedule_time &&
              Boolean(formik.errors.schedule_time)
            }
            helperText={
              formik.touched.schedule_time && formik.errors.schedule_time
            }
            sx={{ mb: 2 }}
          />

          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{ bgcolor: "red", fontWeight: 600 }}
          >
            Create Schedule
          </Button>
        </Box>
      </Box>

      <Footer />
    </Box>
  );
};

export default ScheduleForm;
