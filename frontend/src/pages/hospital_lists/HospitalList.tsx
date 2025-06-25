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
  InputBase,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import NavBar from "../../components/header";
import Footer from "../../components/footer";
import { keyframes } from "@emotion/react";
import API from "../../components/configs/API";

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
  const [searchQuery, setSearchQuery] = useState<string>("");

  const role = JSON.parse(localStorage.getItem("user") || "{}").role;

  const isDoctor = role === "doctor";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await API.get("hospitals");
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
          <Box sx={{ display: "flex", gap: "10px" }}>
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

        {/* Search Bar */}
        <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              border: "1px solid #ccc",
              borderRadius: 2,
              px: 2,
              py: 1,
              width: "100%",
              maxWidth: "400px",
            }}
          >
            <SearchIcon sx={{ mr: 1 }} />
            <InputBase
              placeholder="Search hospitals by name"
              fullWidth
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
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
            hospitals
              .filter((hospital) =>
                hospital.title.toLowerCase().includes(searchQuery.toLowerCase())
              )
              .map((hospital) => (
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
                  <CardMedia
                    component="img"
                    height="180"
                    image={`${process.env.REACT_APP_FILE_BASE_URL}/${hospital.file_path}`}
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
