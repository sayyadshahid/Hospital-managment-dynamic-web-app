import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import NavBar from "../../components/header";
import "@fontsource/montserrat";
import WhyChooseUs from "./WhyChooseUs";
import Footer from "../../components/footer";
import Testimonials from "./Testimonials";
import AOS from "aos";
import "aos/dist/aos.css";

const LandingPage = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("md"));

  useEffect(() => {
    AOS.init({ duration: 1500, once: true }); 
  }, []);

  return (
    <Box>
      <Box data-aos="fade-down" data-aos-delay="200">
        <NavBar />
      </Box>

      {/* Hero Section */}
      <Box
        sx={{
          backgroundColor: "#fff",
          minHeight: "90vh",
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          justifyContent: "center",
          alignItems: "center",
          fontFamily: "Montserrat, sans-serif",
          pt: { xs: 4, md: 8 },
          pb: 4,
          px: { xs: 2, md: 10 },
          gap: 6,
        }}
      >
        {/* Left: Text Section */}
        <Box
          data-aos="fade-right"
          sx={{ flex: 1, textAlign: { xs: "center", md: "left" } }}
        >
          <Typography
            sx={{
              transition: "transform 2s ease",
              "&:hover": { transform: "translateX(20px)" },
              fontSize: { xs: 36, sm: 40, md: 48 },
              fontWeight: 800,
              letterSpacing: 1.2,
              backgroundImage: "linear-gradient(to top left, #E7EBDF, #e6544a)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              fontFamily: "Poppins",
              mb: 1,
            }}
          >
            The Jacsto,
          </Typography>

          <Typography
            sx={{
              fontSize: { xs: 20, sm: 24 },
              fontWeight: 400,
              color: "#8a8989",
              mb: 1,
            }}
          >
            This is the largest Hospital Management Website.
          </Typography>

          <Typography
            sx={{
              fontSize: { xs: 20, sm: 24 },
              fontWeight: 400,
              color: "#8a8989",
              mb: 4,
            }}
          >
            Book your good hospital with better treatment.
          </Typography>

          <Box
            sx={{
              display: "flex",
              justifyContent: { xs: "center", md: "flex-start" },
              gap: 2,
              flexWrap: "wrap",
              mb: 4,
            }}
          >
            <Button
              variant="contained"
              onClick={() => navigate("/hospitalList")}
              sx={{
                bgcolor: "red",
                fontWeight: 600,
                borderRadius: 1,
                fontSize: "14px",
                px: 2,
                py: 1,
                "&:hover": {
                  transform: "scale(1.05)",
                  transition: "transform 0.3s ease",
                  backgroundColor: "rgba(255, 0, 0, 0.85)",
                },
              }}
            >
              Book Your Appointment
            </Button>

            <Button
              onClick={() => navigate("/login")}
              sx={{
                bgcolor: "transparent",
                border: "1px solid red",
                fontWeight: 600,
                borderRadius: 1,
                fontSize: "14px",
                px: 2,
                py: 1,
                color: "red",
                width: 180,
                "&:hover": {
                  transform: "scale(1.05)",
                  transition: "transform 0.3s ease",
                  backgroundColor: "rgba(170, 168, 168, 0.85)",
                  color: "white",
                  border: "1px solid #ffffff",
                },
              }}
            >
              Join Us
            </Button>
          </Box>
        </Box>

        {/* Right: Image Section */}
        <Box
          data-aos="fade-left"
          component="img"
          src="./landingpage.jpg"
          alt="hospital"
          sx={{
            width: { xs: "90%", sm: 500, md: 600 },
            height: { xs: 250, sm: 300, md: 380 },
            borderRadius: 2,
          }}
        />
      </Box>

      {/* Why Choose Us Section */}
      <Box data-aos="zoom-in">
        <WhyChooseUs />
      </Box>

      {/* Testimonials Section */}
      <Box data-aos="fade-up" data-aos-delay="200">
        <Testimonials />
      </Box>

      {/* Footer Section */}
      <Footer />
    </Box>
  );
};

export default LandingPage;
