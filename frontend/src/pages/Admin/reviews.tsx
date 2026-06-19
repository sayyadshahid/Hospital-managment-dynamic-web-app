import React, { useEffect, useState } from "react";
import { Box, CircularProgress, Typography, Paper, IconButton } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import DeleteIcon from "@mui/icons-material/Delete";
import API from "../../components/configs/API";
import { tokens, paperSx, headingSx, dataGridSx, deleteIconSx } from "./tableTheme";

interface Review {
  id: string;
  review: string;
  rating: string;
  user_id: string;
  hospital_id: string;
  user: {
    fullname: string;
    email: string;
    role: string;
    phone_no: string;
  };
}

const ReviewTable = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchReviews = async () => {
    try {
      const res = await API.get("get-all-reviews");
      setReviews(res.data.reviews);
    } catch (error) {
      console.error("Failed to fetch reviews:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      await API.delete(`delete-review/${id}`);
      setReviews((prev) => prev.filter((r) => r.id !== id));
    } catch (error) {
      console.error("Failed to delete review:", error);
    }
  };

  const columns: GridColDef[] = [
    { field: "review", headerName: "Review Text", flex: 2 },
    {
      field: "rating",
      headerName: "Rating",
      width: 110,
      renderCell: (params) => (
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.3, color: tokens.amber, fontFamily: "Inter", fontWeight: 600, fontSize: 13 }}>
          ⭐ {params.value}
        </Box>
      ),
    },
    {
      field: "userName",
      headerName: "User Name",
      width: 200,
      renderCell: (params) => <span>{params.row.user?.fullname || "N/A"}</span>,
    },
    { field: "hospital_id", headerName: "Hospital ID", width: 200 },
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
    <Paper elevation={0} sx={paperSx}>
      <Typography sx={{ ...headingSx, mb: 2.5 }}>
        Hospital Reviews
      </Typography>
      <Box height={{ xs: 400, sm: 500, md: 600 }} width="100%">
        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" height="100%">
            <CircularProgress sx={{ color: tokens.purple }} />
          </Box>
        ) : reviews.length === 0 ? (
          <Typography sx={{ fontFamily: "Inter", color: tokens.neutral, textAlign: "center", mt: 5 }}>
            No reviews found.
          </Typography>
        ) : (
          <DataGrid
            rows={reviews}
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

export default ReviewTable;