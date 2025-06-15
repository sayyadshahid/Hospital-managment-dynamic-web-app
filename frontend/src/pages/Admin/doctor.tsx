import React, { useEffect, useState } from "react";
import {
  Box,
  CircularProgress,
  Typography,
  Paper,
} from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import API from "../../components/configs/API";

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
    { field: "name", headerName: "Name", flex: 1 },
    { field: "degree", headerName: "Degree", width: 180 },
    { field: "hospital_id", headerName: "Hospital ID", width: 200 },
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
        Doctor List
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
        ) : doctors.length === 0 ? (
          <Typography variant="body1" align="center" mt={5}>
            No doctors found.
          </Typography>
        ) : (
          <DataGrid
            rows={doctors}
            columns={columns}
            getRowId={(row) => row.id}
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

export default DoctorTable;
