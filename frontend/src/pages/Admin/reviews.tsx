import React, { useEffect, useState } from "react";
import {
  Box,
  CircularProgress,
  Typography,
  Paper,
  IconButton,
} from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import API from "../../components/configs/API";
import DeleteIcon from "@mui/icons-material/Delete";

interface Review {
  id: string;
  review: string;
  rating: string;
  user_id: string;
  hospital_id: string;
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
      setReviews((prev) => prev.filter((user) => user.id !== id));
    } catch (error) {
      console.error("Failed to delete hospital:", error);
    }
  };

  const columns: GridColDef[] = [
    { field: "id", headerName: "Review ID", width: 200 },
    { field: "review", headerName: "Review Text", flex: 2 },
    { field: "rating", headerName: "Rating", width: 100 },
    { field: "user_id", headerName: "User ID", width: 200 },
    { field: "hospital_id", headerName: "Hospital ID", width: 200 },
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
      <Typography variant="h5" fontWeight={600} mb={2}>
        Hospital Reviews
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
        ) : reviews.length === 0 ? (
          <Typography variant="body1" align="center" mt={5}>
            No reviews found.
          </Typography>
        ) : (
          <DataGrid
            rows={reviews}
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

export default ReviewTable;
