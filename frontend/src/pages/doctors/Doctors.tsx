import {
  Box,
  Button,
  Container,
  Paper,
  Typography,
  CircularProgress,
  IconButton,
  Menu,
  MenuItem,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import NavBar from "../../components/header";
import Footer from "../../components/footer";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import API from "../../components/configs/API";

interface Doctor {
  id: string;
  fullname: string;
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
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [menuDoctorId, setMenuDoctorId] = useState<string | null>(null);

  const location = useLocation();
  const navigate = useNavigate();
  const hospitalId = location.state?.hospital_id;

  useEffect(() => {
    const fetchAllDoctors = async () => {
      try {
        const res = await API.get(`get-all-doctors-by/${hospitalId}`);
        setDoctors(res.data.Doctors);
      } catch (error) {
        console.error(error);
        console.log(error);
        
      } finally {
        setLoading(false);
      }
    };

    fetchAllDoctors();
  }, [hospitalId]);

  const toggleExpand = (id: string) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
    setSelectedDate(null);
  };

  const handleBooking = async (doctorId: string) => {
    toggleExpand(doctorId);
    setSchedule([]);
    setScheduleLoading(true);

    try {
      const res = await API.get(`get_all_schedules/${doctorId}`);
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
    const today = new Date().toISOString().split("T")[0];  
    const futureDates = schedule
      .filter((s) => s.schedule_date >= today)
      .map((s) => s.schedule_date);

    return Array.from(new Set(futureDates));
  };

  const handleTimeClick = (doctorId: string, date: string, time: string) => {
    navigate("/confirm-appointment", {
      state: {
        doctorId,
        schedule_date: date,
        schedule_time: time,
      },
    });
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      weekday: "short",
      month: "long",
      day: "numeric",
      year: "numeric",
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
                      position: "relative",
                    }}
                  >
                   

                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: { xs: "column", sm: "row" },
                        alignItems: { xs: "flex-start", sm: "center" },
                        gap: { xs: 2, sm: 3 },
                        mb: 2,
                      }}
                    >
                      <Box
                        sx={{
                          width: { xs: "100%", sm: 150 },
                          height: { xs: 200, sm: 150 },
                          overflow: "hidden",
                          borderRadius: 2,
                          flexShrink: 0,
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          mx: "auto",
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

                      <Box sx={{ width: "100%" }}>
                        <Typography
                          sx={{ fontWeight: 600, fontSize: { xs: 18, sm: 20 } }}
                        >
                          {doc.fullname}
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
                            mt: 1,
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
                      fullWidth={true}
                      sx={{
                        mt: 1,
                        backgroundColor: "#bebaba",
                        color: "white",
                        fontWeight: 700,
                        fontSize: { xs: 14, sm: 16 },
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
                                justifyContent: {
                                  xs: "center",
                                  sm: "flex-start",
                                },
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
                                    {formatDate(date)}
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
                                      sx={{
                                        m: 0.5,
                                        fontSize: { xs: 12, sm: 14 },
                                        minWidth: "80px",
                                      }}
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

     c
        <Footer />
      </Container>
    </Box>
  );
};

export default Doctors;
