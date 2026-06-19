import React, { useEffect, useState } from "react";
import { Box, CircularProgress, Typography, Paper } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import API from "../../components/configs/API";
import { tokens, paperSx, headingSx, dataGridSx } from "./tableTheme";

interface Doctor {
  id: string;
  name: string;
  email: string;
  degree: string;
  hospital_id: string;
}

const DoctorTable = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDoctors = async () => {
    try {
      const res = await API.get("get-all-doctors");
      setDoctors(res.data.Doctors);
    } catch (error) {
      console.error("Failed to fetch doctors:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  const columns: GridColDef[] = [
    { field: "id", headerName: "Doctor ID", width: 200 },
    { field: "fullname", headerName: "Name", width: 180 },
    {
      field: "degree",
      headerName: "Degree",
      width: 180,
      renderCell: (params) => (
        <Box sx={{
          px: 1.4, py: 0.4, borderRadius: "20px",
          bgcolor: tokens.tealLight, color: tokens.teal,
          fontFamily: "Inter", fontWeight: 600, fontSize: 12,
          display: "inline-flex", alignItems: "center",
        }}>
          {params.value}
        </Box>
      ),
    },
    { field: "email", headerName: "Email", width: 200 },
    { field: "phone_no", headerName: "Phone", width: 160 },
  ];

  return (
    <Paper elevation={0} sx={paperSx}>
      <Typography sx={{ ...headingSx, mb: 2.5 }}>
        Doctor List
      </Typography>
      <Box height={{ xs: 400, sm: 500, md: 600 }} width="100%">
        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" height="100%">
            <CircularProgress sx={{ color: tokens.purple }} />
          </Box>
        ) : doctors.length === 0 ? (
          <Typography sx={{ fontFamily: "Inter", color: tokens.neutral, textAlign: "center", mt: 5 }}>
            No doctors found.
          </Typography>
        ) : (
          <DataGrid
            rows={doctors}
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

export default DoctorTable;