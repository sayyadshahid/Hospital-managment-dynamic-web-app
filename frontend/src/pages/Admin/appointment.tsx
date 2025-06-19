import React, { useEffect, useState } from "react";
import {
  Box,
  Checkbox,
  CircularProgress,
  Typography,
  Paper,
} from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import API from "../../components/configs/API";

interface Appointment {
  appointment_id: string;
  name: string;
  email: string;
  degree: string;
  docId: string;
  is_success: boolean;
}

const AppointmentTable = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAppointments = async () => {
    try {
      const res = await API.get("get-all-appointments");
      setAppointments(res.data.appointments);
    } catch (error) {
      console.error("Failed to fetch appointments:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleSuccessToggle = async (appointment: Appointment) => {
    try {
      const updated = { ...appointment, is_success: !appointment.is_success };

      await API.put(`update-appointment/${appointment.appointment_id}`, {
        is_success: updated.is_success,
      });

      setAppointments((prev) =>
        prev.map((a) =>
          a.appointment_id === appointment.appointment_id ? updated : a
        )
      );
    } catch (error) {
      console.error("Failed to update appointment:", error);
    }
  };

  const columns: GridColDef[] = [
    { field: "appointment_id", headerName: "Appointment ID", width: 200 },
    { field: "name", headerName: "Patient Name", flex: 1 },
    { field: "email", headerName: "Email", flex: 1 },
    { field: "docId", headerName: "Doctor ID", width: 200 },
    {
      field: "is_success",
      headerName: "Success",
      width: 130,
      renderCell: (params) => (
        <Checkbox
          checked={params.value}
          onChange={() => handleSuccessToggle(params.row)}
        />
      ),
    },
  ];

  return (
    <Paper
      elevation={3}
      sx={{
        p: 3,
        m: 2,
        borderRadius: 3,
        backgroundColor: "#f9f9f9",
      }}
    >
      <Typography variant="h5" fontWeight={600} mb={2}>
        Appointment Records
      </Typography>

      <Box height={{ xs: 400, sm: 500, md: 600 }} width="100%">
        {loading ? (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            height="100%"
          >
            <CircularProgress />
          </Box>
        ) : appointments.length === 0 ? (
          <Typography variant="body1" align="center" mt={5}>
            No appointments found.
          </Typography>
        ) : (
          <DataGrid
            rows={appointments}
            columns={columns}
            getRowId={(row) => row.appointment_id}
            initialState={{
              pagination: {
                paginationModel: { pageSize: 10, page: 0 },
              },
            }}
            pageSizeOptions={[10, 25, 50, 100]}
            sx={{
              backgroundColor: "white",
              borderRadius: 2,
            }}
          />
        )}
      </Box>
    </Paper>
  );
};

export default AppointmentTable;
