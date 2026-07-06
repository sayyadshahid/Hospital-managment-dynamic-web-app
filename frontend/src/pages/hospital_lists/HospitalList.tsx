import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box, Typography, Rating, Button, Card,
  CardContent, CardMedia, InputBase,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import SortRoundedIcon from "@mui/icons-material/SortRounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import NavBar from "../../components/header";
import Footer from "../../components/footer";
import { keyframes } from "@emotion/react";
import API from "../../components/configs/API";

/* ─── Design Tokens ─────────────────────────────────────────────── */
const tokens = {
  bg: "#FAF8FF",
  purple: "#7C3AED",
  purpleMid: "#6D28D9",
  purpleLight: "#EDE9FE",
  violet: "#8B5CF6",
  indigo: "#4F46E5",
  neutral: "#6B7280",
  neutralDark: "#1F1635",
  surface: "#FFFFFF",
  borderPurple: "#DDD6FE",
};

interface Hospital {
  id: string;
  title: string;
  description: string;
  address: string;
  about: string;
  file_path: string;
  rating: number;
}

/* ─── Shimmer ────────────────────────────────────────────────────── */
const shimmer = keyframes`
  0%   { background-position: -400px 0; }
  100% { background-position:  400px 0; }
`;

const shimmerBox = {
  background: `linear-gradient(90deg, #EDE9FE 25%, #DDD6FE 50%, #EDE9FE 75%)`,
  backgroundSize: "400% 100%",
  animation: `${shimmer} 1.5s infinite`,
  borderRadius: "8px",
};

/* ─── Skeleton Card ──────────────────────────────────────────────── */
const SkeletonCard = () => (
  <Card sx={{
    flex: "1 1 300px", maxWidth: 345, borderRadius: "16px",
    border: `1px solid ${tokens.borderPurple}`,
    boxShadow: "none", p: 2, bgcolor: tokens.surface,
  }}>
    <Box sx={{ height: 180, ...shimmerBox, mb: 2 }} />
    <Box sx={{ height: 18, width: "65%", ...shimmerBox, mb: 1.2 }} />
    <Box sx={{ height: 14, width: "40%", ...shimmerBox, mb: 1 }} />
    <Box sx={{ height: 14, width: "80%", ...shimmerBox }} />
  </Card>
);

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
        setHospitals(Array.isArray(res.data.Hospitals) ? res.data.Hospitals : []);
      } catch (error) {
        console.error("Error fetching hospitals:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filtered = hospitals.filter((h) =>
    h.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Box sx={{ bgcolor: tokens.bg, minHeight: "100vh" }}>
      <NavBar />

      <Box sx={{ px: { xs: 3, md: 6 }, py: 4 }}>

        {/* Page Header */}
        <Box sx={{
          display: "flex", justifyContent: "space-between",
          alignItems: "center", mb: 3, flexWrap: "wrap", gap: 2,
        }}>
          <Box>
            <Typography sx={{
              fontFamily: "Plus Jakarta Sans, sans-serif",
              fontWeight: 800, fontSize: { xs: 22, md: 28 },
              color: tokens.neutralDark,
            }}>
              Find a Hospital
            </Typography>
            <Typography sx={{ fontFamily: "Inter", fontSize: 14, color: tokens.neutral, mt: 0.3 }}>
              {loading ? "Loading..." : `${filtered.length} hospital${filtered.length !== 1 ? "s" : ""} available`}
            </Typography>
          </Box>

          <Box sx={{ display: "flex", gap: 1.5 }}>
            <Button
              disableElevation
              startIcon={<SortRoundedIcon />}
              sx={{
                border: `1px solid ${tokens.borderPurple}`,
                color: tokens.neutral, bgcolor: tokens.surface,
                fontFamily: "Inter", fontWeight: 600, fontSize: 13,
                textTransform: "none", borderRadius: "10px", px: 2,
                "&:hover": { borderColor: tokens.neutralDark, color: "#000" },
              }}
            >
              Sort
            </Button>
            {isDoctor && (
              <Button
                variant="contained" disableElevation
                startIcon={<AddRoundedIcon />}
                onClick={() => navigate("/hospitalregister")}
                sx={{
                  bgcolor: tokens.purple, fontFamily: "Inter",
                  fontWeight: 600, fontSize: 13, textTransform: "none",
                  borderRadius: "10px", px: 2,
                  boxShadow: `0 4px 14px ${tokens.purple}33`,
                  "&:hover": { bgcolor: tokens.purpleLight, color:"#000" },
                }}
              >
                Add Hospital
              </Button>
            )}
          </Box>
        </Box>

        {/* Search Bar */}
        <Box sx={{ mb: 4 }}>
          <Box sx={{
            display: "flex", alignItems: "center",
            border: `1.5px solid ${tokens.borderPurple}`,
            borderRadius: "12px", px: 2, py: 1,
            bgcolor: tokens.surface, maxWidth: 460,
            transition: "all 0.2s ease",
            "&:focus-within": {
              borderColor: "#000",
            },
          }}>
            <SearchIcon sx={{ color: tokens.neutral, mr: 1, fontSize: 20 }} />
            <InputBase
              placeholder="Search hospitals by name..."
              fullWidth
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              sx={{ fontFamily: "Inter", fontSize: 14, color: tokens.neutralDark }}
            />
          </Box>
        </Box>

        {/* Cards Grid */}
        <Box sx={{ display: "flex", gap: 2.5, flexWrap: "wrap" }}>
          {loading ? (
            Array.from({ length: 9 }).map((_, i) => <SkeletonCard key={i} />)
          ) : filtered.length === 0 ? (
            <Box sx={{ width: "100%", textAlign: "center", py: 10 }}>
              <Typography sx={{ fontFamily: "Inter", fontSize: 15, color: tokens.neutral }}>
                No hospitals found matching "{searchQuery}".
              </Typography>
            </Box>
          ) : (
            filtered.map((hospital) => (
              <Card
                key={hospital.id}
                onClick={() => navigate(`/hospital/${hospital.id}`, { state: { id: hospital.id } })}
                sx={{
                  flex: "1 1 300px", maxWidth: 345,
                  borderRadius: "16px", overflow: "hidden",
                  border: `1px solid ${tokens.borderPurple}`,
                  boxShadow: "none", cursor: "pointer",
                  bgcolor: tokens.surface,
                  transition: "all 0.25s ease",
                  "&:hover": {
                    borderColor: tokens.violet,
                    boxShadow: `0 8px 32px rgba(124,58,237,0.13)`,
                    transform: "translateY(-4px)",
                  },
                }}
              >
                <CardMedia
                  component="img"
                  height="180"
                  image={`${process.env.REACT_APP_FILE_BASE_URL}/${hospital.file_path}`}
                  alt={hospital.title}
                  sx={{ objectFit: "cover" }}
                />
                <CardContent sx={{ p: 2.5 }}>
                  <Typography sx={{
                    fontFamily: "Plus Jakarta Sans, sans-serif",
                    fontWeight: 700, fontSize: 16,
                    color: tokens.neutralDark, mb: 0.8,
                  }}>
                    {hospital.title}
                  </Typography>

                  <Rating
                    value={hospital.rating} precision={0.5} readOnly size="small"
                    sx={{ color: tokens.purple, mb: 1 }}
                  />

                  <Typography sx={{
                    fontFamily: "Inter", fontSize: 13.5,
                    color: tokens.neutral, lineHeight: 1.6, mb: 1.5,
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                  }}>
                    {hospital.description}
                  </Typography>

                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                    <LocationOnOutlinedIcon sx={{ fontSize: 15, color: tokens.violet, flexShrink: 0 }} />
                    <Typography sx={{
                      fontFamily: "Inter", fontSize: 13, color: tokens.neutral,
                      fontWeight: 500, overflow: "hidden",
                      textOverflow: "ellipsis", whiteSpace: "nowrap",
                    }}>
                      {hospital.address}
                    </Typography>
                  </Box>
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