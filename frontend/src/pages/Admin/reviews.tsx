// src/components/ReviewTable.tsx
import React, { useEffect, useState } from "react";
import { Box, CircularProgress } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import axios from "axios";
import API from "../../components/configs/API";

interface User {
  id: string;
  review: string;
  rating: string;
  user_id: string;
hospital_id: string
}

const ReviewTable = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const res = await API.get("get-all-reviews");  
      setUsers(res.data.reviews);
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
    { field: "review", headerName: "Reviews", width: 300 },
    { field: "rating", headerName: "Rating", width: 100 },
    { field: "user_id", headerName: "User Id", width: 200 },
    { field: "hospital_id", headerName: "Hospital Id", width: 200 },

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

export default ReviewTable;
