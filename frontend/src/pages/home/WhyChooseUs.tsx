import React from "react";
import { Box, Typography } from "@mui/material";

const WhyChooseUs = () => {
  return (
    <Box
      sx={{
        py: 6,
        px: { xs: 2, md: 10 },
        backgroundColor: "#f9f9f9",
        textAlign: "center",
      }}
    >
      <Typography
        variant="h5"
        sx={{
          fontWeight: 700,
          mb: 4,
          fontSize: { xs: 24, md: 32 },
          fontFamily: "Montserrat",
          color: 'grey'
        }}
      >
        Why Choose Us?
      </Typography>

      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          justifyContent: "space-around",
          gap: 4,
        }}
      >
        {/* Card 1 */}
        <Box
          sx={{
            p: 3,
            backgroundColor: "white",
            borderRadius: 2,
            boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
            maxWidth: 300,
            mx: "auto",
          }}
        >
          <Typography variant="h6" fontWeight={600} gutterBottom>
            24/7 Availability
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Book hospitals and consult with doctors anytime, from anywhere.
          </Typography>
        </Box>

        {/* Card 2 */}
        <Box
          sx={{
            p: 3,
            backgroundColor: "white",
            borderRadius: 2,
            boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
            maxWidth: 300,
            mx: "auto",
          }}
        >
          <Typography variant="h6" fontWeight={600} gutterBottom>
            Verified Hospitals
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Every hospital listed is verified for quality and trust.
          </Typography>
        </Box>

        {/* Card 3 */}
        <Box
          sx={{
            p: 3,
            backgroundColor: "white",
            borderRadius: 2,
            boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
            maxWidth: 300,
            mx: "auto",
          }}
        >
          <Typography variant="h6" fontWeight={600} gutterBottom>
            Secure Booking
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Your data and appointments are protected with top security.
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default WhyChooseUs;
