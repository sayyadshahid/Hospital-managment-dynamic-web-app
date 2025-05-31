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
import NavBar from "../../components/header";
import axios from "axios";
import { keyframes } from "@emotion/react";
import Footer from "../../components/footer";

interface Hospital {
  id: string;
  title: string;
  description: string;
  address: string;
  about: string;
  file_path: string;
  rating: number;
}

// Shimmer animation
const shimmer = keyframes`
  0% {
    background-position: -400px 0;
  }
  100% {
    background-position: 400px 0;
  }
`;

const HospitalList = () => {
  const navigate = useNavigate();
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [anchorEl, setAnchorEl] = useState<{
    [key: string]: HTMLElement | null;
  }>({});
  const role = localStorage.getItem("user_role");
  const isDoctor = role === "doctor";
  // const storedData = localStorage.getItem("user_role");
  // const userData = storedData ? JSON.parse(storedData) : null;
  // console.log('==========================doctor====================', userData)

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
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleDeleteHospital = async (id: string) => {
    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        alert("You need to log in first!");
        return;
      }

      await axios.delete(`http://localhost:8000/api/delete_hospital/${id}`, {
        headers: {
          Authorization: token,
        },
      });
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
          <Box
            sx={{
              display: "flex",
              gap: "10px",
            }}
          >
            <Button
              sx={{
                bgcolor: "red",
                fontSize: 14,
                fontWeight: 600,
                color: "white",
                "&:hover": { bgcolor: "darkred" },
              }}
            >
              SORT
            </Button>
            {isDoctor && (
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
            )}
          </Box>
        </Box>

        <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
          {loading ? (
            Array.from({ length: 9 }).map((_, index) => (
              <Card
                key={index}
                sx={{
                  maxWidth: 345,
                  flex: "1 1 300px",
                  borderRadius: 2,
                  p: 2,
                }}
              >
                <Box
                  sx={{
                    height: 180,
                    borderRadius: 2,
                    background: `linear-gradient(90deg, #eeeeee 25%, #dddddd 50%, #eeeeee 75%)`,
                    backgroundSize: "400% 100%",
                    animation: `${shimmer} 1.5s infinite`,
                  }}
                />
                <Box
                  sx={{
                    height: 20,
                    width: "60%",
                    borderRadius: 1,
                    mt: 2,
                    background: `linear-gradient(90deg, #eeeeee 25%, #dddddd 50%, #eeeeee 75%)`,
                    backgroundSize: "400% 100%",
                    animation: `${shimmer} 1.5s infinite`,
                  }}
                />
                <Box
                  sx={{
                    height: 20,
                    width: "40%",
                    borderRadius: 1,
                    mt: 1,
                    background: `linear-gradient(90deg, #eeeeee 25%, #dddddd 50%, #eeeeee 75%)`,
                    backgroundSize: "400% 100%",
                    animation: `${shimmer} 1.5s infinite`,
                  }}
                />
              </Card>
            ))
          ) : hospitals.length === 0 ? (
            <Typography>No hospitals found.</Typography>
          ) : (
            hospitals.map((hospital) => (
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
                    navigate(`/hospital/${hospital.id}`, {
                      state: { id: hospital.id },  
                    });
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
            ))
          )}
        </Box>
      </Box>
      <Footer />
    </Box>
  );
};

export default HospitalList;
