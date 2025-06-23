import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Container,
  Divider,
  Paper,
  Typography,
} from "@mui/material";
import NavBar from "../../components/header";
import axios from "axios";
import { useParams } from "react-router-dom";
import { PatientReviews } from "../reviews/Review";
import Footer from "../../components/footer";
import { useNavigate } from "react-router-dom";
import API from "../../components/configs/API";

interface Hospital {
  id: string;
  title: string;
  description: string;
  address: string;
  about: string;
  file_path: string;
}

const Hospital = () => {
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const { id } = useParams();
  const navigate = useNavigate();
 

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await API.get(`hospital_id/${id}`);
        setHospitals([res.data.hospital]);
      } catch (error) {
        console.error("Error fetching hospitals:", error);
      }
    };

    fetchData();
  }, [id]);

  return (
    <Box sx={{ bgcolor: "#ffffff", minHeight: "100vh" }}>
      <NavBar />
      <Container sx={{ py: { xs: 2, sm: 4 } }}>
        {hospitals.map((hospital) => (
          <Paper
            key={hospital.id}
            elevation={3}
            sx={{
              p: { xs: 2, sm: 3 },
              borderRadius: 3,
              mb: { xs: 3, sm: 4 },
            }}
          >
            {/* Hospital Image */}
            <Box
              component="img"
              src={`http://localhost:8000/${hospital.file_path}`}
              alt={hospital.title}
              sx={{
                width: "100%",
                height: {
                  xs: 200,
                  sm: 300,
                  md: 400,
                  lg: 520,
                },
                objectFit: "cover",
                borderRadius: 2,
                mb: 3,
              }}
            />

            {/* Hospital Title and Description */}
            <Typography
              variant="h5"
              fontWeight={600}
              gutterBottom
              sx={{ fontSize: { xs: "1.25rem", sm: "1.5rem" } }}
            >
              {hospital.title}
            </Typography>
            <Typography
              color="text.secondary"
              sx={{ mb: 2, fontSize: { xs: "0.95rem", sm: "1rem" } }}
            >
              {hospital.description}
            </Typography>

            {/* Address Section */}
            <Typography
              variant="subtitle1"
              fontWeight={600}
              sx={{ mt: 2, fontSize: { xs: "1rem", sm: "1.1rem" } }}
            >
              Address
            </Typography>
            <Typography
              color="text.secondary"
              sx={{ mb: 2, fontSize: { xs: "0.95rem", sm: "1rem" } }}
            >
              {hospital.address}
            </Typography>

            {/* About Us Section */}
            <Typography
              variant="subtitle1"
              fontWeight={600}
              sx={{ mt: 2, fontSize: { xs: "1rem", sm: "1.1rem" } }}
            >
              About Us
            </Typography>
            <Typography
              color="text.secondary"
              sx={{ mb: 3, fontSize: { xs: "0.95rem", sm: "1rem" } }}
            >
              {hospital.about}
            </Typography>

            {/* Book Appointment Button */}
            <Box
              textAlign={{ xs: "center", sm: "right" }}
              sx={{
                mt: 4,
                display: "flex",
                gap: 3,

                justifyContent: "flex-end",
              }}
            >
              <Button
                variant="contained"
                sx={{ bgcolor: "red", fontWeight: 700 }}
                size="large"
                onClick={() =>
                  navigate("/doctors", { state: { hospital_id: hospital.id } })
                }
              >
                Book an Appointment
              </Button>

              
            </Box>

        
            <PatientReviews />
          </Paper>
        ))}

        {/* Footer */}
        <Footer />
      </Container>
    </Box>
  );
};

export default Hospital;
