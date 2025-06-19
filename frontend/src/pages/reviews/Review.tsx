import React, { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardContent,
  Avatar,
  Rating,
  Typography,
  Stack,
  TextField,
  Button,
  Box,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import toast from "react-hot-toast";
import axios from "axios";
import * as Yup from "yup";
import { useFormik } from "formik";
import { useLocation } from "react-router-dom";
import API from "../../components/configs/API";

interface User {
  fullname: string;
}

interface Feed {
  id: string;
  user: User;
  review: string;
  rating: number;
}

export const PatientReviews = () => {
  const location = useLocation();
  const hospitalId = location.state?.id;

  const [reviews, setReviews] = useState<Feed[]>([]);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await API.get(`get-all-reviews-by/${hospitalId}`, {
          headers: {
            "Content-Type": "application/json",
          },
        });
        setReviews(response.data.reviews);
      } catch (error: any) {
        const errMsg = error?.response?.data?.msg || "Failed to fetch reviews.";
        console.error(errMsg);
      }
    };

    fetchReviews();
  }, [hospitalId]);

  const formik = useFormik({
    initialValues: {
      review: "",
      rating: 3,
    },
    validationSchema: Yup.object({
      review: Yup.string().required("Review is required"),
      rating: Yup.number().required("Rating is required").min(1).max(5),
    }),
    onSubmit: async (values, { resetForm }) => {
      try {
        const response = await API.post(`review/${hospitalId}`, values, {
          headers: {
            "Content-Type": "application/json",
          },
        });

        toast.success(response.data.msg || "Review submitted successfully!");
        resetForm();

        // Fetch updated reviews
        const updated = await API.get(`get-all-reviews-by/${hospitalId}`);
        setReviews(updated.data.reviews);
      } catch (error: any) {
        const errMsg = error?.response?.data?.msg || "Failed to submit review.";
        toast.error(errMsg);
      }
    },
  });

  return (
    <Stack spacing={3} sx={{ mt: 4 }}>
      <Typography variant="h6" fontWeight={600}>
        Patient Reviews
      </Typography>

      {/* Review Form */}
      <form onSubmit={formik.handleSubmit}>
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle2" fontWeight={500} sx={{ mb: 0.5 }}>
            Your Rating
          </Typography>
          <Rating
            name="rating"
            value={formik.values.rating}
            onChange={(_, newValue) =>
              formik.setFieldValue("rating", newValue ?? 3)
            }
          />
        </Box>

        <TextField
          name="review"
          value={formik.values.review}
          onChange={formik.handleChange}
          variant="outlined"
          placeholder="Write your review here"
          fullWidth
          multiline
          rows={3}
          sx={{ mb: 2 }}
        />

        <Box
          sx={{
            display: "flex",
            justifyContent: isMobile ? "center" : "flex-end",
          }}
        >
          <Button
            variant="contained"
            type="submit"
            disabled={!formik.values.review.trim()}
            sx={{
              backgroundColor: "red",
              px: 4,
              fontWeight: 600,
              "&:hover": { backgroundColor: "darkred" },
            }}
          >
            Submit Review
          </Button>
        </Box>
      </form>

      {/* Review List */}
      {reviews.length === 0 ? (
        <Typography color="text.secondary">
          No reviews yet. Be the first to leave one!
        </Typography>
      ) : (
        reviews.map((review) => (
          <Card
            key={review.id}
            variant="outlined"
            sx={{ bgcolor: "#fafbfc", borderRadius: 2 }}
          >
            <CardHeader
              avatar={
                <Avatar sx={{ bgcolor: "#e0e7ef" }}>
                  <PersonIcon color="primary" />
                </Avatar>
              }
              title={
                <Typography fontWeight={600} variant="body1">
                  {review.user.fullname}
                </Typography>
              }
              subheader={
                <Box display="flex" alignItems="center">
                  <Rating value={review.rating} readOnly size="small" />
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ ml: 1 }}
                  >
                    1 week ago
                  </Typography>
                </Box>
              }
            />
            <CardContent sx={{ pt: 0 }}>
              <Typography color="text.secondary">{review.review}</Typography>
            </CardContent>
          </Card>
        ))
      )}
    </Stack>
  );
};
