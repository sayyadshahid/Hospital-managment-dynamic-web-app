// src/components/UserTable.tsx
import React, { useEffect, useState } from "react";
import { Box, CircularProgress } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import axios from "axios";
import API from "../../components/configs/API";

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
      const res = await API.get("get-all-users"); // Change to your FastAPI endpoint
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
    { field: "id", headerName: "ID", width: 200 },
    { field: "fullname", headerName: "Name", width: 180 },
    { field: "email", headerName: "Email", width: 200 },
    { field: "phone_no", headerName: "Phone", width: 150 },
    { field: "role", headerName: "Role", width: 100 },

  ];

  return (
    <Box height={600} width="100%">
      {loading ? (
        <CircularProgress />
      ) : (
        <DataGrid
          rows={users}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: { pageSize: 5, page: 0 },
            },
          }}
          pageSizeOptions={[5, 10]}
        />
      )}
    </Box>
  );
};

export default UserTable;
