import React from "react";
import { Box, Typography, Avatar } from "@mui/material";

const testimonials = [
  {
    name: "Emily Johnson",
    feedback: "This platform made booking my hospital appointment so simple and hassle-free!",
    image: "https://randomuser.me/api/portraits/women/44.jpg",
  },
  {
    name: "Michael Smith",
    feedback: "Excellent service and great support from the team. Highly recommend to everyone.",
    image: "https://randomuser.me/api/portraits/men/32.jpg",
  },
  {
    name: "Jessica Williams",
    feedback: "I found the best hospital nearby with just a few clicks. Very user-friendly website.",
    image: "https://randomuser.me/api/portraits/women/65.jpg",
  },
];


const Testimonials = () => {
  return (
    <Box
      sx={{
        backgroundColor: "#fafafa",
        py: 6,
        px: { xs: 2, md: 10 },
        textAlign: "center",
      }}
    >
      <Typography
        variant="h5"
        sx={{
          fontWeight: 700,
          fontSize: { xs: 24, md: 32 },
          mb: 5,
          fontFamily: "Montserrat",
          color: 'grey'
        }}
      >
        What Our Users Say
      </Typography>

      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          gap: 4,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {testimonials.map((user, index) => (
          <Box
            key={index}
            sx={{
              p: 3,
              backgroundColor: "white",
              borderRadius: 2,
              boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
              maxWidth: 300,
            }}
          >
            <Avatar
              src={user.image}
              alt={user.name}
              sx={{ width: 60, height: 60, mb: 2, mx: "auto" }}
            />
            <Typography fontWeight={600}>{user.name}</Typography>
            <Typography variant="body2" color="text.secondary" mt={1}>
              {user.feedback}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default Testimonials;
