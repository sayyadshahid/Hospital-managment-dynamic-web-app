import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  IconButton,
  Typography,
  Paper,
} from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate } from "react-router-dom";
import API from "../../components/configs/API";

interface User {
  id: string;
  title: string;
  email: string;
  phone_no: string;
  role: string;
}

const HospitalTable = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchUsers = async () => {
    try {
      const res = await API.get("hospitals");
      setUsers(res.data.Hospitals);
    } catch (error) {
      console.error("Failed to fetch hospitals:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await API.delete(`delete_hospital/${id}`);
      setUsers((prev) => prev.filter((user) => user.id !== id));
    } catch (error) {
      console.error("Failed to delete hospital:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const columns: GridColDef[] = [
    { field: "id", headerName: "Hospital ID", width: 220 },
    { field: "title", headerName: "Hospital Name", flex: 1 },
    {
      field: "actions",
      headerName: "Actions",
      width: 120,
      sortable: false,
      renderCell: (params) => (
        <IconButton color="error" onClick={() => handleDelete(params.row.id)}>
          <DeleteIcon />
        </IconButton>
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
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Typography variant="h5" fontWeight={600}>
          Hospital Management
        </Typography>
        <Button
          variant="contained"
          sx={{ fontWeight: 600, color: "#ffffff", bgcolor: "red" }}
          onClick={() => navigate("/hospitalregister")}
        >
          Add Hospital
        </Button>
      </Box>

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
        ) : users.length === 0 ? (
          <Typography variant="body1" align="center" mt={5}>
            No hospitals found.
          </Typography>
        ) : (
          <DataGrid
            rows={users}
            columns={columns}
            getRowId={(row) => row.id}
            initialState={{
              pagination: {
                paginationModel: { pageSize: 10, page: 0 },
              },
            }}
            pageSizeOptions={[10, 20, 50, 100]}
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

export default HospitalTable;
