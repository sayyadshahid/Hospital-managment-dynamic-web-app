import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Rating,
  Button,
  Card,
  CardContent,
  CardMedia,
  IconButton,
  Menu,
  MenuItem,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import NavBar from "../components/header";
import axios from "axios";

interface Hospital {
  id: string;
  title: string;
  description: string;
  address: string;
  about: string;
  file_path: string;
  rating: number;
}

const HospitalList = () => {
  const navigate = useNavigate();
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [anchorEl, setAnchorEl] = useState<{
    [key: string]: HTMLElement | null;
  }>({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("http://localhost:8000/api/hospitals");
        if (Array.isArray(res.data.Hospitals)) {
          setHospitals(res.data.Hospitals);
        } else {
          console.error(
            "Expected 'Hospitals' to be an array, got:",
            res.data.Hospitals
          );
          setHospitals([]);
        }
      } catch (error) {
        console.error("Error fetching hospitals:", error);
      }
    };

    fetchData();
  }, []);

  const handleDeleteHospital = async (id: string) => {
    try {
      await axios.delete(`http://localhost:8000/api/delete_hospital/${id}`);
      setHospitals((prev) => prev.filter((hospital) => hospital.id !== id));
    } catch (error) {
      console.error("Error deleting hospital:", error);
      alert("Failed to delete the hospital.");
    }
  };

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
              "&:hover": { bgcolor: "darkred" },
            }}
            onClick={() => navigate("/hospitalregister")}
          >
            Add Hospital
          </Button>
        </Box>

        <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
          {hospitals.length === 0 && (
            <Typography>No hospitals found.</Typography>
          )}

          {hospitals.map((hospital) => (
            <Card
              key={hospital.id}
              sx={{
                maxWidth: 345,
                flex: "1 1 300px",
                borderRadius: 2,
                overflow: "hidden",
                position: "relative",
                cursor: "pointer",
              }}
              >
              {/* Three Dots Menu */}
              <Box sx={{ position: "absolute", top: 8, right: 8, zIndex: 1 }}>
                <IconButton
                  aria-label="more"
                  aria-controls={`menu-${hospital.id}`}
                  aria-haspopup="true"
                  onClick={(event) => {
                    event.stopPropagation();
                    setAnchorEl((prev) => ({
                      ...prev,
                      [hospital.id]: event.currentTarget,
                    }));
                  }}
                >
                  <MoreVertIcon />
                </IconButton>
                <Menu
                  id={`menu-${hospital.id}`}
                  anchorEl={anchorEl[hospital.id]}
                  open={Boolean(anchorEl[hospital.id])}
                  onClose={() =>
                    setAnchorEl((prev) => ({
                      ...prev,
                      [hospital.id]: null,
                    }))
                  }
                >
                  <MenuItem
                    onClick={async () => {
                      await handleDeleteHospital(hospital.id);
                      setAnchorEl((prev) => ({
                        ...prev,
                        [hospital.id]: null,
                      }));
                    }}
                  >
                    Delete
                  </MenuItem>
                </Menu>
              </Box>

              <CardMedia
                component="img"
                height="180"
                image={`http://localhost:8000/${hospital.file_path}`}
                alt={hospital.title}
                onClick={() => {
                  console.log("Navigating to hospital ID:", hospital.id);
                  navigate(`/hospital/${hospital.id}`);
                }}
              />
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {hospital.title}
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
