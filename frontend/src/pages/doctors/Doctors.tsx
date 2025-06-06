import {
  Box,
  Button,
  Container,
  Paper,
  Typography,
  CircularProgress,
} from "@mui/material";
import NavBar from "../../components/header";
import Footer from "../../components/footer";
import { useEffect, useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";

interface Doctor {
  id: string;
  name: string;
  degree: string;
  about: string;
  file_name: string;
  file_path: string;
  experties: string;
}

interface Schedule {
  id: string;
  schedule_date: string;
  schedule_time: string;
}

const Doctors = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [expanded, setExpanded] = useState<{ [key: string]: boolean }>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [scheduleLoading, setScheduleLoading] = useState<boolean>(false);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [schedule, setSchedule] = useState<Schedule[]>([]);
  const location = useLocation();
  const hospitalId = location.state?.hospital_id;
  const navigate = useNavigate();

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
        setDoctors(res.data.Doctors);
      } catch (error) {
        console.error(error);
        alert("Failed to fetch doctors.");
      } finally {
        setLoading(false);
      }
    };

    fetchAllDoctors();
  }, [hospitalId]);

  const toggleExpand = (id: string) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
    setSelectedDate(null); // reset selected date when expanding another doctor
  };

  const handleBooking = async (doctorId: string) => {
    toggleExpand(doctorId);
    setSchedule([]);
    setScheduleLoading(true);

    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        alert("You need to log in first!");
        return;
      }

      const res = await axios.get(
        `http://localhost:8000/api/get_all_schedules/${doctorId}`,
        {
          headers: {
            Authorization: token,
          },
        }
      );
      setSchedule(res.data.schedules);
    } catch (error) {
      console.error("Error fetching schedule:", error);
    } finally {
      setScheduleLoading(false);
    }
  };

  const handleDateClick = (date: string) => {
    setSelectedDate(selectedDate === date ? null : date);
  };

  const getUniqueDates = (schedule: Schedule[]) => {
    return Array.from(new Set(schedule.map((s) => s.schedule_date)));
  };

  const handleTimeClick = (doctorId: string, date: string, time: string) => {
    navigate("/confirm-booking", {
      state: {
        doctorId,
        schedule_date: date,
        schedule_time: time,
      },
    });
  };

  return (
    <Box sx={{ bgcolor: "#ffffff", minHeight: "100vh" }}>
      <NavBar />
      <Container sx={{ py: { xs: 2, sm: 4 } }}>
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Paper
            elevation={3}
            sx={{ p: { xs: 2, sm: 4 }, borderRadius: 3, mb: { xs: 3, sm: 4 } }}
          >
            {doctors.length === 0 ? (
              <Typography variant="h6" align="center">
                No doctors available at this hospital.
              </Typography>
            ) : (
              doctors.map((doc) => {
                const isExpanded = expanded[doc.id];
                const availableDates = getUniqueDates(schedule);

                return (
                  <Paper
                    key={doc.id}
                    sx={{
                      mb: 3,
                      bgcolor: "#f1eeee",
                      p: 2,
                      borderRadius: 2,
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: { xs: "column", sm: "row" },
                        alignItems: { xs: "flex-start", sm: "center" },
                        gap: 3,
                        mb: 2,
                      }}
                    >
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
                            objectFit: "cover",
                            borderRadius: 8,
                          }}
                        />
                      </Box>

                      <Box>
                        <Typography sx={{ fontWeight: 600, fontSize: 20 }}>
                          {doc.name}
                        </Typography>
                        <Typography variant="subtitle1" fontWeight={500}>
                          {doc.degree}
                        </Typography>
                        <Typography variant="subtitle2">
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
                            sx={{ mt: 1, textTransform: "none" }}
                          >
                            {isExpanded ? "Show less" : "Show more"}
                          </Button>
                        )}
                      </Box>
                    </Box>

                    <Button
                      onClick={() => handleBooking(doc.id)}
                      sx={{
                        backgroundColor: "#bebaba",
                        color: "white",
                        fontWeight: 700,
                        "&:hover": {
                          backgroundColor: "#ff0000",
                        },
                      }}
                    >
                      {isExpanded ? "Hide Schedule" : "Book Your Appointment"}
                    </Button>

                    {isExpanded && (
                      <Box sx={{ mt: 2 }}>
                        {scheduleLoading ? (
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "center",
                              py: 2,
                            }}
                          >
                            <CircularProgress size={24} />
                          </Box>
                        ) : (
                          <>
                            <Box
                              sx={{
                                display: "flex",
                                flexWrap: "wrap",
                                gap: 2,
                                mt: 2,
                              }}
                            >
                              {availableDates.map((date) => (
                                <Box
                                  key={date}
                                  onClick={() => handleDateClick(date)}
                                  sx={{
                                    p: 1,
                                    border: "1px solid #ddd",
                                    borderRadius: 2,
                                    textAlign: "center",
                                    cursor: "pointer",
                                    bgcolor:
                                      selectedDate === date
                                        ? "#cfe3ff"
                                        : "white",
                                    width: "100%",
                                    maxWidth: "120px",
                                    transition: "background-color 0.3s ease",
                                    "&:hover": {
                                      backgroundColor: "#f1f1f1",
                                    },
                                  }}
                                >
                                  <Typography variant="body2">
                                    {date}
                                  </Typography>
                                </Box>
                              ))}
                            </Box>

                            {selectedDate && (
                              <Box sx={{ mt: 2 }}>
                                {schedule
                                  .filter(
                                    (s) => s.schedule_date === selectedDate
                                  )
                                  .map((s) => (
                                    <Button
                                      key={s.id}
                                      size="small"
                                      sx={{ m: 0.5 }}
                                      variant="outlined"
                                      onClick={() =>
                                        handleTimeClick(
                                          doc.id,
                                          s.schedule_date,
                                          s.schedule_time
                                        )
                                      }
                                    >
                                      {s.schedule_time}
                                    </Button>
                                  ))}
                              </Box>
                            )}
                          </>
                        )}
                      </Box>
                    )}
                  </Paper>
                );
              })
            )}
          </Paper>
        )}
        <Footer />
      </Container>
    </Box>
  );
};

export default Doctors;
