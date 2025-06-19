import React, { useEffect, useState } from "react";
import { Box, CircularProgress, Typography } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import API from "../../components/configs/API";
import DeleteIcon from "@mui/icons-material/Delete";
import { IconButton } from "@mui/material";


interface Doctor {
  id: string;
  name: string;
  degree: string;
}

interface Props {
  hospitalId: string;
}

const DoctorByHospitalId: React.FC<Props> = ({ hospitalId }) => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllDoctors = async () => {
      try {
        const res = await API.get(`get-all-doctors-by/${hospitalId}`);
        setDoctors(res.data.Doctors || []);
      } catch (error) {
        console.error("Failed to fetch doctors:", error);
      } finally {
        setLoading(false);
      }
    };

    if (hospitalId) {
      fetchAllDoctors();
    }
  }, [hospitalId]);

  const handleDelete = async (id: string) => {
  try {
    await API.delete(`delete-doctor/${id}`);
    setDoctors((prev) => prev.filter((doc) => doc.id !== id));
  } catch (error) {
    console.error("Failed to delete doctor:", error);
  }
};


  const columns: GridColDef[] = [
    { field: "id", headerName: "Doctor ID", width: 180 },
    { field: "name", headerName: "Name", width: 180 },
    { field: "degree", headerName: "Degree", width: 180 },
    {
      field: "actions",
      headerName: "Actions",
      width: 100,
      sortable: false,
      renderCell: (params) => (
        <IconButton color="error" onClick={() => handleDelete(params.row.id)}>
          <DeleteIcon />
        </IconButton>
      ),
    },
  ];

  return (
    
    <Box height={500} width="100%">
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
          pageSizeOptions={[5, 10, 25]}
          sx={{ backgroundColor: "white", borderRadius: 2 }}
        />
      )}
    </Box>
  );
};

export default DoctorByHospitalId;
