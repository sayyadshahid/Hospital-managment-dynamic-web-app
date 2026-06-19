import React, { useEffect, useState } from "react";
import { Box, CircularProgress, Typography, Paper } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import API from "../../components/configs/API";
import { tokens, paperSx, headingSx, dataGridSx } from "./tableTheme";

interface User {
  id: string;
  fullname: string;
  email: string;
  phone_no: string;
  role: string;
}

const UserTable = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const res = await API.get("get-all-users");
      setUsers(res.data.users);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const columns: GridColDef[] = [
    { field: "id", headerName: "User ID", width: 200 },
    { field: "fullname", headerName: "Name", flex: 1 },
    { field: "email", headerName: "Email", flex: 1 },
    { field: "phone_no", headerName: "Phone", width: 150 },
    {
      field: "role",
      headerName: "Role",
      width: 130,
      renderCell: (params) => (
        <Box sx={{
          px: 1.4, py: 0.4, borderRadius: "20px",
          bgcolor: tokens.purpleLight, color: tokens.purple,
          fontFamily: "Inter", fontWeight: 600, fontSize: 12,
          display: "inline-flex", alignItems: "center",
        }}>
          {params.value}
        </Box>
      ),
    },
  ];

  return (
    <Paper elevation={0} sx={paperSx}>
      <Typography sx={{ ...headingSx, mb: 2.5 }}>
        Users List
      </Typography>
      <Box height={{ xs: 400, sm: 500, md: 600 }} width="100%">
        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" height="100%">
            <CircularProgress sx={{ color: tokens.purple }} />
          </Box>
        ) : users.length === 0 ? (
          <Typography sx={{ fontFamily: "Inter", color: tokens.neutral, textAlign: "center", mt: 5 }}>
            No users found.
          </Typography>
        ) : (
          <DataGrid
            rows={users}
            columns={columns}
            getRowId={(row) => row.id}
            initialState={{ pagination: { paginationModel: { pageSize: 100, page: 0 } } }}
            pageSizeOptions={[10, 25, 50, 100]}
            sx={dataGridSx}
          />
        )}
      </Box>
    </Paper>
  );
};

export default UserTable;