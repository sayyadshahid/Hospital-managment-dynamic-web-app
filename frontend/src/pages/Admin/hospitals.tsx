import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  IconButton,
  Typography,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
} from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import DeleteIcon from "@mui/icons-material/Delete";
import API from "../../components/configs/API";
import DoctorByHospitalId from "./get_docs_byId"; // doctor popup component
import { useNavigate } from "react-router-dom";

interface Hospital {
  id: string;
  title: string;
  email?: string;
  phone_no?: string;
  role?: string;
}

const HospitalTable = () => {
  const [users, setUsers] = useState<Hospital[]>([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedHospitalId, setSelectedHospitalId] = useState<string | null>(
    null
  );

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

  const handleOpenDialog = (hospitalId: string) => {
    setSelectedHospitalId(hospitalId);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedHospitalId(null);
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
      field: "viewDoctors",
      headerName: "Doctors",
      width: 140,
      sortable: false,
      renderCell: (params) => (
        <Button
          variant="outlined"
          color="primary"
          size="small"
          onClick={() => handleOpenDialog(params.row.id)}
        >
          View
        </Button>
      ),
    },
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
    <>
      <Paper
        elevation={3}
        sx={{ p: 3, m: 2, borderRadius: 3, backgroundColor: "#f9f9f9" }}
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
            onClick={() => (window.location.href = "/hospitalregister")}
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
                pagination: { paginationModel: { pageSize: 10, page: 0 } },
              }}
              pageSizeOptions={[10, 20, 50, 100]}
              sx={{ backgroundColor: "white", borderRadius: 2 }}
            />
          )}
        </Box>
      </Paper>

      {/* Doctor Popup */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>
          <Button
            color="error"
            onClick={handleCloseDialog}
            sx={{ float: "right", fontWeight: 600 }}
          >
            Close
          </Button>
        </DialogTitle>
        <DialogContent>
          {selectedHospitalId && (
            <>
              <Box display="flex" justifyContent="flex-end" mb={2}>
                <Button
                  variant="contained"
                  sx={{ bgcolor: "red", fontWeight: 700 }}
                  size="large"
                  onClick={() =>
                    navigate("/doctor-register", {
                       state: { hospital_id: selectedHospitalId },
                    })
                  }
                >
                  Add Doctor
                </Button>
              </Box>
              <DoctorByHospitalId hospitalId={selectedHospitalId} />
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default HospitalTable;
