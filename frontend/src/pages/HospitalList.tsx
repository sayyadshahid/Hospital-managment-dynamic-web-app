import React from 'react';
import "./Home.css";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Rating,
  Button,
  Card,
  CardContent,
  CardMedia,
} from "@mui/material";
import NavBar from "../components/header";

// Sample hospital data
const hospitals = [
  {
    id: 1,
    name: "Sunshine Hospital",
    image: "https://via.placeholder.com/345x180",
    rating: 4.5,
    description: "24/7 emergency care and advanced medical services.",
    address: "123 Health Street, Metro City",
  },
  {
    id: 2,
    name: "City Care Clinic",
    image: "./hospital.png",
    rating: 4.0,
    description: "Family-friendly clinic with experienced staff.",
    address: "456 Clinic Avenue, New Town",
  },
  {
    id: 3,
    name: "City Care Clinic",
    image: "./hospital.png",
    rating: 4.0,
    description: "Family-friendly clinic with experienced staff.",
    address: "456 Clinic Avenue, New Town",
  },
  {
    id:4,
    name: "City Care Clinic",
    image: "./hospital.png",
    rating: 4.0,
    description: "Family-friendly clinic with experienced staff.",
    address: "456 Clinic Avenue, New Town",
  },
  {
    id: 5,
    name: "Green Valley Hospital",
    image: "https://via.placeholder.com/345x180",
    rating: 3.5,
    description: "Known for maternity care and pediatric services.",
    address: "789 Wellness Road, Greenfield",
  },
];

const HospitalList = () => {
  const navigate = useNavigate();

  return (
    <Box>
      <NavBar />
      <Box sx={{ p: 3 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
          }}
        >
          <Typography variant="h6">Hospital List</Typography>
          <Button
            sx={{
              bgcolor: "red",
              fontSize: 14,
              fontWeight: 600,
              color: "white",
              "&:hover": {
                bgcolor: "darkred",
              },
            }}
            onClick={() => navigate("/hospitalregister")}
          >
            Add Hospital
          </Button>
        </Box>

        {/* Hospital Cards */}
        <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
          {hospitals.map((hospital) => (
            <Card
              key={hospital.id}
              sx={{
                maxWidth: 345,
                flex: "1 1 300px",
                borderRadius: 2,
                overflow: "hidden",
              }}
            >
              <CardMedia
                component="img"
                height="180"
                image={hospital.image}
                alt={hospital.name}
              />
              <CardContent>
                <Typography gutterBottom variant="h6" component="div">
                  {hospital.name}
                </Typography>
                <Rating value={hospital.rating} precision={0.5} readOnly />
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mt: 1 }}
                >
                  {hospital.description}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mt: 1, fontWeight: 500 }}
                >
                  📍 {hospital.address}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default HospitalList;
