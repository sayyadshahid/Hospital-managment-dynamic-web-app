import React from "react";
import {
  Box,
  Typography,
  Button,
  useTheme,
  useMediaQuery,
} from "@mui/material";

const HospitalRegisterLanding = () => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <Box
      sx={{
        backgroundColor: "#fff",
        py: { xs: 6, md: 10 },
        px: { xs: 2, md: 12 },
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        justifyContent: "center",
        alignItems: "center",
        textAlign: { xs: "center", md: "left" },
        gap: 6,
      }}
    >
      {/* Text Section */}
      <Box
        sx={{
          flex: 1,
          width: { xs: "100%", md: "50%" },
        }}
      >
        <Typography
          sx={{
            fontSize: { xs: 28, sm: 32, md: 40 },
            fontWeight: 800,
            letterSpacing: 1.2,
            backgroundImage: "linear-gradient(to top left, #E7EBDF, #e6544a)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            fontFamily: "Poppins",
            mb: 2,
          }}
        >
          List Your Hospital with Us
        </Typography>

        <Typography
          sx={{
            fontSize: { xs: 16, md: 18 },
            color: "#666",
            mb: 2,
            lineHeight: 1.6,
          }}
        >
          Want to manage doctors and appointments online? Get your hospital
          listed on our platform and reach thousands of patients across the
          country.
        </Typography>

        <Typography
          sx={{
            fontSize: { xs: 16, md: 18 },
            color: "#d32f2f",
            fontWeight: 600,
            mb: 3,
          }}
        >
          Please send your hospital details to:{" "}
          <Typography component="span" sx={{ color: "#000" }}>
            support@jacsto.com
          </Typography>
        </Typography>

        <Button
          variant="contained"
          sx={{
            bgcolor: "red",
            color: "#fff",
            fontWeight: 600,
            borderRadius: 2,
            px: 3,
            py: 1,
            "&:hover": {
              bgcolor: "#c62828",
              transform: "scale(1.05)",
              transition: "0.3s ease",
            },
          }}
          href="mailto:support@jacsto.com"
        >
          Send Details via Email
        </Button>
      </Box>

      {/* Image Section */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          justifyContent: { xs: "center", md: "end" },
          width: { xs: "100%", md: "50%" },
          mt: { xs: 4, md: 0 }, // Add margin top for smaller screens to separate image from text
        }}
      >
        <Box
          component="img"
          src="./hospital.png"
          alt="Hospital Register"
          sx={{
            width: "100%",
            maxWidth: 320,
            borderRadius: 2,
          }}
        />
      </Box>
    </Box>
  );
};

export default HospitalRegisterLanding;
