import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
} from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import toast from "react-hot-toast";
import API from "../configs/API";

interface ScheduleDialogProps {
  open: boolean;
  docId: string;
  schedule?: any;
  onClose: () => void;
  onCreated: () => void;
}

const to24h = (t?: string) => {
  if (!t) return "";
  const [time, mod] = t.split(" ");
  const [h, m] = time.split(":").map(Number);
  let hour = h;
  if (mod?.toUpperCase() === "PM" && hour !== 12) hour += 12;
  if (mod?.toUpperCase() === "AM" && hour === 12) hour = 0;
  return `${String(hour).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
};

const ScheduleDialog: React.FC<ScheduleDialogProps> = ({
  open,
  docId,
  schedule,
  onClose,
  onCreated,
}) => {
  const isEdit = Boolean(schedule);

  const formik = useFormik({
    initialValues: {
      schedule_date: schedule?.schedule_date || "",
      schedule_time: to24h(schedule?.schedule_time),
    },
    enableReinitialize: true,
    validationSchema: Yup.object({
      schedule_date: Yup.date().required("Schedule date is required"),
      schedule_time: Yup.string().required("Schedule time is required"),
    }),
    onSubmit: async (values, { resetForm }) => {
      try {
        const res = isEdit
          ? await API.put(`update_schedule/${schedule.schedule_id}`, values)
          : await API.post(`create_schedule/${docId}`, values);
        toast.success(res.data?.msg || "Schedule saved successfully!");
        resetForm();
        onCreated();
        onClose();
      } catch (error: any) {
        const detail = error?.response?.data?.detail;
        let errorMessage = "Something went wrong!";
        if (Array.isArray(detail)) {
          errorMessage = detail.map((e: any) => e.msg).join(", ");
        } else if (typeof detail === "string") {
          errorMessage = detail;
        }
        toast.error(errorMessage);
      }
    },
  });

  const handleClose = () => {
    formik.resetForm();
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
      <DialogTitle>{isEdit ? "Edit Schedule" : "Create Schedule"}</DialogTitle>
      <DialogContent>
        <TextField
          label="Schedule Date"
          name="schedule_date"
          type="date"
          InputLabelProps={{ shrink: true }}
          fullWidth
          margin="dense"
          value={formik.values.schedule_date}
          onChange={formik.handleChange}
          error={formik.touched.schedule_date && Boolean(formik.errors.schedule_date)}
          helperText={formik.touched.schedule_date ? (formik.errors.schedule_date as string) : undefined}
        />
        <TextField
          label="Schedule Time"
          name="schedule_time"
          type="time"
          InputLabelProps={{ shrink: true }}
          fullWidth
          margin="dense"
          value={formik.values.schedule_time}
          onChange={formik.handleChange}
          error={formik.touched.schedule_time && Boolean(formik.errors.schedule_time)}
          helperText={formik.touched.schedule_time ? (formik.errors.schedule_time as string) : undefined}
        />
      </DialogContent>
      <DialogActions sx={{ p: 2, pt: 1 }}>
        <Button onClick={handleClose} color="inherit">
          Cancel
        </Button>
        <Button
          onClick={() => formik.handleSubmit()}
          variant="contained"
          sx={{ bgcolor: "#fa6039" }}
        >
          {isEdit ? "Update Schedule" : "Create Schedule"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ScheduleDialog;
