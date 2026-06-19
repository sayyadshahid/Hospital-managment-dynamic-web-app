import React, { useEffect, useState } from "react";
import { Box, Checkbox, CircularProgress, Typography, Paper } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import API from "../../components/configs/API";
import { tokens, paperSx, headingSx, dataGridSx } from "./tableTheme";

interface Appointment {
  id: string;
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
      await API.put(`update-appointment/${appointment.id}`, { is_success: updated.is_success });
      setAppointments((prev) => prev.map((a) => (a.id === appointment.id ? updated : a)));
    } catch (error) {
      console.error("Failed to update appointment:", error);
    }
  };

  const columns: GridColDef[] = [
    { field: "id", headerName: "Appointment ID", width: 200 },
    { field: "name", headerName: "Patient Name", flex: 1 },
    { field: "email", headerName: "Email", flex: 1 },
    { field: "docId", headerName: "Doctor ID", width: 200 },
    {
      field: "is_success",
      headerName: "Status",
      width: 160,
      renderCell: (params) => (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Checkbox
            checked={params.value}
            onChange={() => handleSuccessToggle(params.row)}
            sx={{
              color: tokens.borderPurple,
              "&.Mui-checked": { color: tokens.teal },
            }}
          />
          <Box sx={{
            px: 1.2, py: 0.3, borderRadius: "20px",
            bgcolor: params.value ? tokens.tealLight : tokens.amberLight,
            color: params.value ? tokens.teal : tokens.amber,
            fontFamily: "Inter", fontWeight: 600, fontSize: 11.5,
          }}>
            {params.value ? "Confirmed" : "Pending"}
          </Box>
        </Box>
      ),
    },
  ];

  return (
    <Paper elevation={0} sx={paperSx}>
      <Typography sx={{ ...headingSx, mb: 2.5 }}>
        Appointment Records
      </Typography>
      <Box height={{ xs: 400, sm: 500, md: 600 }} width="100%">
        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" height="100%">
            <CircularProgress sx={{ color: tokens.purple }} />
          </Box>
        ) : appointments.length === 0 ? (
          <Typography sx={{ fontFamily: "Inter", color: tokens.neutral, textAlign: "center", mt: 5 }}>
            No appointments found.
          </Typography>
        ) : (
          <DataGrid
            rows={appointments}
            columns={columns}
            getRowId={(row) => row.id}
            initialState={{ pagination: { paginationModel: { pageSize: 10, page: 0 } } }}
            pageSizeOptions={[10, 25, 50, 100]}
            sx={dataGridSx}
          />
        )}
      </Box>
    </Paper>
  );
};

export default AppointmentTable;