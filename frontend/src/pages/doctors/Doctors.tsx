import { Box, Button, Container, Paper, Typography } from "@mui/material";
import NavBar from "../../components/header";
import Footer from "../../components/footer";
import { useEffect, useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";

interface Doctor {
  id: string;
  name: string;
  degree: string;
  about: string;
  file_name: string;
  file_path: string;
  experties: string;
}

const Doctors = () => {
  const [doctor, setDoctor] = useState<Doctor[]>([]);
  const [expanded, setExpanded] = useState<{ [key: string]: boolean }>({});
  const location = useLocation();
  const hospitalId = location.state?.hospital_id;

  useEffect(() => {
    const fetchAllDoctors = async () => {
      try {
        const token = localStorage.getItem("access_token");
        if (!token) {
          alert("You need to log in first!");
          return;
        }

        const res = await axios.get(
          `http://localhost:8000/api/get-all-doctors-by/${hospitalId}`,
          {
            headers: {
              Authorization: token,
            },
          }
        );
        setDoctor(res.data.Doctors);
      } catch (error) {
        console.log(error);
      }
    };

    fetchAllDoctors();
  }, [hospitalId]);

  const toggleExpand = (id: string) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <Box sx={{ bgcolor: "#ffffff", minHeight: "100vh" }}>
      <NavBar />
      <Container sx={{ py: { xs: 2, sm: 4 } }}>
        <Paper
          elevation={3}
          sx={{ p: { xs: 2, sm: 4 }, borderRadius: 3, mb: { xs: 3, sm: 4 } }}
        >
          {doctor.map((doc) => {
            const isExpanded = expanded[doc.id];

            return (
              <Paper
                key={doc.id}
                sx={{
                  display: "flex",
                  flexDirection: { xs: "column", sm: "row" },
                  alignItems: { xs: "flex-start", sm: "center" },
                  gap: 3,
                  p: 2,
                  mb: 3,
                  bgcolor: "#f1eeee",
                  height: "auto",
                  overflow: "hidden",
                  cursor: "pointer",
                }}
              >
                {/* Doctor Image */}
                <Box
                  sx={{
                    width: 150,
                    height: 150,
                    overflow: "hidden",
                    borderRadius: 2,
                    flexShrink: 0,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <img
                    src={`http://localhost:8000/${doc.file_path}`}
                    alt="Doctor"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover", // keeps aspect ratio, crops to fill
                      borderRadius: 8,
                    }}
                  />
                </Box>

                {/* Doctor Details */}
                <Box>
                  <Typography
                    sx={{ fontWeight: 600, fontSize: 20 }}
                    gutterBottom
                  >
                    {doc.name}
                  </Typography>
                  <Typography variant="subtitle1" fontWeight={500}>
                    {doc.degree}
                  </Typography>
                  <Typography variant="subtitle2" gutterBottom>
                    {doc.experties}
                  </Typography>

                  <Typography
                    variant="body1"
                    sx={{
                      textAlign: "justify",
                      display: "-webkit-box",
                      WebkitBoxOrient: "vertical",
                      WebkitLineClamp: isExpanded ? "none" : 3,
                      overflow: "hidden",
                    }}
                  >
                    {doc.about}
                  </Typography>

                  {doc.about.length > 150 && (
                    <Button
                      size="small"
                      onClick={() => toggleExpand(doc.id)}
                      sx={{ mt: 1, textTransform: "none", fontWeight: 500 }}
                    >
                      {isExpanded ? "Show less" : "Show more"}
                    </Button>
                  )}
                </Box>
              </Paper>
            );
          })}
        </Paper>
        <Footer />
      </Container>
    </Box>
  );
};

export default Doctors;
