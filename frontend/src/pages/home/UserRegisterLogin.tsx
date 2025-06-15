import React from "react";
import {
  Box,
  Typography,
  Button,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const CardBox = ({
  title,
  description,
  buttonText,
  navigateTo,
}: {
  title: string;
  description: string;
  buttonText: string;
  navigateTo: string;
}) => {
  const navigate = useNavigate();
  return (
    <Box
      sx={{
        bgcolor: "#fff",
        boxShadow: 3,
        p: 4,
        borderRadius: 3,
        maxWidth: 320,
        textAlign: "center",
        transition: "transform 0.3s ease",
        "&:hover": { transform: "translateY(-10px)" },
      }}
    >
      <Typography
        variant="h6"
        fontWeight={700}
        gutterBottom
        sx={{ fontFamily: "Poppins" }}
      >
        {title}
      </Typography>
      <Typography color="text.secondary" mb={2} sx={{ fontSize: 14 }}>
        {description}
      </Typography>
      <Button
        onClick={() => navigate(navigateTo)}
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
      >
        {buttonText}
      </Button>
    </Box>
  );
};

const RegisterLandingSection = () => {
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Box
      sx={{
        py: 10,
        px: 3,
        bgcolor: "#fefefe",
        textAlign: "center",
      }}
    >
      <Typography
        variant="h4"
        fontWeight={800}
        mb={6}
        sx={{
          fontFamily: "Poppins",
          color: "black",
          backgroundImage: "linear-gradient(to right, #cccccc, #ff0033)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
      >
        Join Us Today
      </Typography>

      <Box
        sx={{
          display: "flex",
          flexDirection: isSmall ? "column" : "row",
          justifyContent: "center",
          alignItems: "center",
          gap: 4,
        }}
      >
        <CardBox
          title="User"
          description="Create your user account to book hospital appointments easily."
          buttonText="Register as User"
          navigateTo="/register"
        />

        <CardBox
          title="Doctor"
          description="Register as a doctor and provide quality healthcare services."
          buttonText="Register as Doctor"
          navigateTo="/register"
        />
      </Box>
    </Box>
  );
};

export default RegisterLandingSection;
