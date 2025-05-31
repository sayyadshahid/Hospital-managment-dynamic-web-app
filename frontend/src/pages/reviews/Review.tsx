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
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import toast from "react-hot-toast";
import axios from "axios";
import * as Yup from "yup";
import { useFormik } from "formik";
import { useLocation } from "react-router-dom";

interface user {
  fullname: string;
}

interface feed {
  id: string;
  user: user;
  review: string;
  rating: number;
}

export const PatientReviews = () => {
  // const [reviewText, setReviewText] = useState("");
  const location = useLocation();
  const hospitalId = location.state?.id;
  const [rev, setRev] = useState<feed[]>([]);

  useEffect(() => {
    const fetchReview = async () => {
      const token = localStorage.getItem("access_token");
      console.log(token, "=======================");

      if (!token) {
        console.log(token, "=======================");
        return;
      }

      try {
        const response = await axios.get(
          `http://localhost:8000/api/get-all-reviews-by/${hospitalId}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: token,
            },
          }
        );

        setRev(response.data.reviews);
      } catch (error: any) {
        const errMsg =
          error?.response?.data?.msg || "Review fetching. failed  ";
        console.log(errMsg);
      }
    };

    fetchReview();
  }, []);

  const formik = useFormik({
    initialValues: {
      review: "",
      rating: "",
    },
    validationSchema: Yup.object({
      review: Yup.string().required("review is required"),
      rating: Yup.number()
        .required("Rating is required")
        .min(1, "Rating must be at least 1")
        .max(5, "Rating can't be more than 5"),
    }),
    onSubmit: async (values, { resetForm }) => {
      const token = localStorage.getItem("access_token");
      if (!token) {
        toast.error("Please log in first.");
        return;
      }

      const payload = {
        review: values.review,
        rating: values.rating,
      };

      try {
        const res = await axios.post(
          `http://localhost:8000/api/review/${hospitalId}`,
          payload,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: token,
            },
          }
        );

        toast.success(res.data.msg || "Your Review Added Successfully!");
        resetForm();
      } catch (error: any) {
        const errMsg =
          error?.response?.data?.msg || "Review failed. Please try again.";
        toast.error(errMsg);
      } finally {
        console.log("Form submission attempt completed.");
      }
    },
  });

  return (
    <Stack spacing={2}>
      <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 1 }}>
        Patient Reviews
      </Typography>

      <form onSubmit={formik.handleSubmit}>
        {/* Rating Input */}
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle2" fontWeight={500} sx={{ mb: 0.5 }}>
            Your Rating
          </Typography>
          <Rating
            name="rating"
            value={
              typeof formik.values.rating === "number"
                ? formik.values.rating
                : Number(formik.values.rating) || 3
            }
            onChange={(event, newValue) => {
              formik.setFieldValue("rating", newValue ?? 0);
            }}
          />
        </Box>

        {/* Review Input */}
        <TextField
          name="review"
          value={formik.values.review}
          onChange={formik.handleChange}
          variant="outlined"
          placeholder="Write your review here"
          fullWidth
          multiline
          rows={2}
          sx={{ mb: 2 }}
        />

        <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 3 }}>
          <Button
            variant="contained"
            type="submit"
            sx={{
              backgroundColor: formik.values.review.trim()
                ? "red"
                : "grey.500",
              color: "#fff",  
              "&:hover": {
                backgroundColor: formik.values.review.trim()
                  ? "#ff0000d5"  
                  : "primary.dark",
              },
            }}
          >
            Submit Review
          </Button>
        </Box>
      </form>

      {rev.map((review) => (
        <Card key={review.id} variant="outlined" sx={{ bgcolor: "#fafbfc" }}>
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
      ))}
    </Stack>
  );
};
function resetForm() {
  throw new Error("Function not implemented.");
}
