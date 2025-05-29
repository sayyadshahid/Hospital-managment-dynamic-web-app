import React, { useState } from 'react';
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
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';

const reviews = [
  {
    name: 'Sophia H.',
    rating: 5,
    comment:
      'I had such a wonderful experience at City General Hospital. The staff was caring and attentive, and the facilities were top-notch. I highly recommend their services!',
    date: '2 days ago',
  },
  {
    name: 'Ethan L.',
    rating: 4,
    comment:
      'The team at City General Hospital cared so much for my mother. The doctors were knowledgeable, and the nurses were compassionate. Thank you so much!',
    date: '1 week ago',
  },
  {
    name: 'Olivia K.',
    rating: 5,
    comment:
      'City General Hospital exceeded my expectations. The staff was friendly and professional, and the treatment I received was excellent. Highly recommend this center.',
    date: '3 weeks ago',
  },
];

export const PatientReviews = () => {
  const [reviewText, setReviewText] = useState('');

  const handleSubmitReview = () => {
    // Here you would typically send the review to your backend
    // For demo, we'll just log it and clear the input
    console.log('Review submitted:', reviewText);
    alert('Thank you for your review!');
    setReviewText('');
  };

  return (
    <Stack spacing={2}>
      <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 1 }}>
        Patient Reviews
      </Typography>
      <TextField
        value={reviewText}
        onChange={(e) => setReviewText(e.target.value)}
        variant="outlined"
        placeholder="Write your review here"
        fullWidth
        multiline
        rows={2}
        sx={{ mb: 2 }}
      />
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 3 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmitReview}
          disabled={!reviewText.trim()}
        >
          Submit Review
        </Button>
      </Box>
      {reviews.map((review, idx) => (
        <Card key={idx} variant="outlined" sx={{ bgcolor: '#fafbfc' }}>
          <CardHeader
            avatar={
              <Avatar sx={{ bgcolor: '#e0e7ef' }}>
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
                <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
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
