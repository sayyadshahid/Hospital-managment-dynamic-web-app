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
import CloseIcon from "@mui/icons-material/Close";
import API from "../../components/configs/API";
import DoctorByHospitalId from "./get_docs_byId";
import { useNavigate } from "react-router-dom";
import { tokens, paperSx, headingSx, dataGridSx, primaryButtonSx, deleteIconSx } from "./tableTheme";

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
  const [selectedHospitalId, setSelectedHospitalId] = useState<string | null>(null);

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
          size="small"
          onClick={() => handleOpenDialog(params.row.id)}
          sx={{
            borderColor: tokens.violet, color: tokens.violet,
            border: `1px solid ${tokens.violet}`,
            fontFamily: "Inter", fontWeight: 600, fontSize: 12.5,
            borderRadius: "8px", textTransform: "none", px: 1.6,
            "&:hover": { bgcolor: tokens.purpleLight, borderColor: tokens.purple },
          }}
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
        <IconButton sx={deleteIconSx} onClick={() => handleDelete(params.row.id)}>
          <DeleteIcon fontSize="small" />
        </IconButton>
      ),
    },
  ];

  return (
    <>
      <Paper elevation={0} sx={paperSx}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2.5}>
          <Typography sx={headingSx}>
            Hospital Management
          </Typography>
          <Button
            variant="contained"
            disableElevation
            sx={primaryButtonSx}
            onClick={() => (window.location.href = "/hospitalregister")}
          >
            + Add Hospital
          </Button>
        </Box>

        <Box height={{ xs: 400, sm: 500, md: 600 }} width="100%">
          {loading ? (
            <Box display="flex" justifyContent="center" alignItems="center" height="100%">
              <CircularProgress sx={{ color: tokens.purple }} />
            </Box>
          ) : users.length === 0 ? (
            <Typography sx={{ fontFamily: "Inter", color: tokens.neutral, textAlign: "center", mt: 5 }}>
              No hospitals found.
            </Typography>
          ) : (
            <DataGrid
              rows={users}
              columns={columns}
              getRowId={(row) => row.id}
              initialState={{ pagination: { paginationModel: { pageSize: 10, page: 0 } } }}
              pageSizeOptions={[10, 20, 50, 100]}
              sx={dataGridSx}
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
        PaperProps={{ sx: { borderRadius: "16px", border: `1px solid ${tokens.borderPurple}` } }}
      >
        <DialogTitle sx={{ borderBottom: `1px solid ${tokens.borderPurple}`, py: 2 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Typography sx={{ fontFamily: "Plus Jakarta Sans", fontWeight: 700, fontSize: 16, color: tokens.neutralDark }}>
              Hospital Doctors
            </Typography>
            <IconButton onClick={handleCloseDialog} size="small" sx={{ color: tokens.neutral }}>
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          {selectedHospitalId && (
            <>
              <Box display="flex" justifyContent="flex-end" mb={2}>
                <Button
                  variant="contained"
                  disableElevation
                  size="large"
                  sx={primaryButtonSx}
                  onClick={() =>
                    navigate("/doctor-register", { state: { hospital_id: selectedHospitalId } })
                  }
                >
                  + Add Doctor
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