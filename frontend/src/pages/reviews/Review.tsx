import React, { useState } from "react";
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

const reviews = [
  {
    name: "Sophia H.",
    rating: 5,
    comment:
      "I had such a wonderful experience at City General Hospital. The staff was caring and attentive, and the facilities were top-notch. I highly recommend their services!",
    date: "2 days ago",
  },
  {
    name: "Ethan L.",
    rating: 4,
    comment:
      "The team at City General Hospital cared so much for my mother. The doctors were knowledgeable, and the nurses were compassionate. Thank you so much!",
    date: "1 week ago",
  },
  {
    name: "Olivia K.",
    rating: 5,
    comment:
      "City General Hospital exceeded my expectations. The staff was friendly and professional, and the treatment I received was excellent. Highly recommend this center.",
    date: "3 weeks ago",
  },
];

export const PatientReviews = () => {
  // const [reviewText, setReviewText] = useState("");

  const formik = useFormik({
    initialValues: {
      review: "",
    },
    validationSchema: Yup.object({
      review: Yup.string().required("review is required"),
    }),
    onSubmit: async (values, { resetForm }) => {
      const token = localStorage.getItem("access_token");
      if (!token) {
        toast.error("Please log in first.");
        return;
      }

      const payload = {
        review: values.review,
      };

      try {
        const res = await axios.post(
          "http://localhost:8000/api/review",
          payload,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: token,
            },
          }
        );

        toast.success(res.data.msg || "Review Successful!");
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
          <Button variant="contained" color="primary" type="submit">
            Submit Review
          </Button>
        </Box>
      </form>
      {reviews.map((review, idx) => (
        <Card key={idx} variant="outlined" sx={{ bgcolor: "#fafbfc" }}>
          <CardHeader
            avatar={
              <Avatar sx={{ bgcolor: "#e0e7ef" }}>
                <PersonIcon color="primary" />
              </Avatar>
            }
            title={
              <Typography fontWeight={600} variant="body1">
                {review.name}
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
                  {review.date}
                </Typography>
              </Box>
            }
          />
          <CardContent sx={{ pt: 0 }}>
            <Typography color="text.secondary">{review.comment}</Typography>
          </CardContent>
        </Card>
      ))}
    </Stack>
  );
};
function resetForm() {
  throw new Error("Function not implemented.");
}
