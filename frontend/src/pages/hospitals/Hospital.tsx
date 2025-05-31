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
        const token = localStorage.getItem("access_token");
        if (!token) {
          alert("You need to log in first!");
          // navigate("/login");
          return;
        }

        const res = await axios.get(
          `http://localhost:8000/api/hospital_id/${id}`,
          {
            headers: {
              Authorization: token,
            },
          }
        );
        setHospitals([res.data.hospital]); // Wrap single object in an array
      } catch (error) {
        console.error("Error fetching hospitals:", error);
      }
    };

    fetchData();
  }, [id]); // Add id to dependency array in case it changes

  return (
    <Box sx={{ bgcolor: "#ffffff", minHeight: "100vh" }}>
      <NavBar />
      <Container sx={{ py: 4 }}>
        {hospitals.map((hospital) => (
          <Paper
            key={hospital.id}
            elevation={3}
            sx={{ p: 3, borderRadius: 3, mb: 4 }}
          >
            {/* Hospital Image */}
            <Box
              component="img"
              src={`http://localhost:8000/${hospital.file_path}`}
              alt={hospital.title}
              sx={{
                width: "100%",
                height: 520,
                objectFit: "cover",
                borderRadius: 2,
                mb: 3,
              }}
            />
            {/* Hospital Title and Description */}
            <Typography variant="h5" fontWeight={600} gutterBottom>
              {hospital.title}
            </Typography>
            <Typography color="text.secondary" sx={{ mb: 2 }}>
              {hospital.description}
            </Typography>
            <Typography variant="subtitle1" fontWeight={600} sx={{ mt: 2 }}>
              Address
            </Typography>
            <Typography color="text.secondary" sx={{ mb: 2 }}>
              {hospital.address}
            </Typography>
            {/* About Us */}
            <Typography variant="subtitle1" fontWeight={600} sx={{ mt: 2 }}>
              About Us
            </Typography>
            <Typography color="text.secondary" sx={{ mb: 3 }}>
              {hospital.about}
            </Typography>
            {/* Book Appointment Button */}
            <Box textAlign="right" sx={{ mt: 4 }}>
              <Button variant="contained" sx={{ bgcolor: "red" }} size="large">
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
function nevigate() {
  throw new Error("Function not implemented.");
}
