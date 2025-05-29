import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Box,
  Button,
  Typography,
  Container,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import NavBar from "../../components/header";
import "@fontsource/montserrat";

const LandingPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = location.state || {};
  const [name, setName] = useState<string>("");

  const theme = useTheme();
  const isSmDown = useMediaQuery(theme.breakpoints.down("sm"));
  const isMdDown = useMediaQuery(theme.breakpoints.down("md"));

  useEffect(() => {
    const fetchName = async () => {
      try {
        const res = await axios.get(`http://localhost:8000/api/users/${id}`);
        setName(res.data.user["fullname"]);
      } catch (error) {
        console.error("Error fetching name:", error);
      }
    };

    if (id) fetchName();
  }, [id]);

  return (
    <Box>
      <NavBar />
      <Box
        sx={{
          backgroundColor: "#fff",
          minHeight: "95vh",
          display: "flex",
          alignItems: "center",
          fontFamily: "Montserrat, sans-serif",
          pt: 4,
          pb: 6,
        }}
      >
        <Container maxWidth="lg">
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              alignItems: "center",
              justifyContent: "space-between",
              gap: 4,
            }}
          >
            {/* Left Section */}
            <Box sx={{ width: { xs: "100%", md: "50%" } }}>
              <Typography
                variant={isSmDown ? "h4" : "h3"}
                gutterBottom
                sx={{
                  transition: "transform 2s ease",
                  "&:hover": {
                    transform: "translateX(40px)",
                  },
                }}
              >
                The Jacsto,
              </Typography>

              <Typography variant="subtitle1" gutterBottom>
                This is the largest Hospital Management Website.
              </Typography>

              <Typography variant="body1" sx={{ mb: 2 }}>
                Book your good hospital with better treatment.
                <br />
                <Typography
                  component="span"
                  fontWeight={600}
                  sx={{ lineHeight: 2 }}
                >
                  {name}
                </Typography>
              </Typography>

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
                  mt: 2,
                  "&:hover": {
                    transform: "rotate(5deg) scale(1.05)",
                    transition: "transform 0.5s ease",
                    backgroundColor: "rgba(255, 0, 0, 0.85)",
                  },
                }}
              >
                Book Your Appointment
              </Button>
            </Box>

            {/* Right Section */}
            <Box
              sx={{
                width: { xs: "100%", md: "50%" },
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Box
                component="img"
                src="./hospital.png"
                alt="hospital"
                sx={{
                  width: { xs: "80%", sm: 300, md: 350 },
                  maxWidth: "100%",
                  height: "auto",
                }}
              />
            </Box>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default LandingPage;
