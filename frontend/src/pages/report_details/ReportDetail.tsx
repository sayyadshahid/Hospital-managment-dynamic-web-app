import {
  Box,
  Button,
  Typography,
  Divider,
  CircularProgress,
  Drawer,
  IconButton,
  useMediaQuery,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import NavBar from "../../components/header";
import Footer from "../../components/footer";
import { useEffect, useState } from "react";
import API from "../../components/configs/API";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@mui/material/styles";

interface AppointmentDetail {
  name: string;
  phone: string;
  email: string;
  dob: string;
  gender: string;
  address: string;
  reasonForConsultation: string;
  schedule_date: string;
  schedule_time: string;
  status: string;
  is_success: boolean;
}

const userId = localStorage.getItem("user_id");

export default function ReportDetails() {
  const [appointments, setAppointments] = useState<AppointmentDetail[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [detail, setDetail] = useState<AppointmentDetail | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        setLoading(true);
        const res = await API.get(`/get-all-appointments-by-userid/${userId}`);
        const data = res.data.appointments || [];
        setAppointments(data);
        if (data.length > 0) {
          setDetail(data[0]);
        }
      } catch (err: any) {
        setError("Failed to fetch appointment details.");
      } finally {
        setLoading(false);
      }
    };
    fetchAppointments();
  }, []);

  useEffect(() => {
    if (isMobile) setDrawerOpen(false);
  }, [detail]);

  const renderSidebarContent = () => (
    <Box
      sx={{
        width: { xs: "80vw", sm: "100%" },
        backgroundColor: "transparent",
        p: 2,
        height: "100%",
      }}
    >
      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <Typography
          sx={{ fontSize: 20, fontWeight: 600, mb: 2, textAlign: "center", flexGrow: 1 }}
        >
          User's Names
        </Typography>
        {isMobile && (
          <IconButton onClick={() => setDrawerOpen(false)}>
            <CloseIcon />
          </IconButton>
        )}
      </Box>

      {appointments.length > 0 ? (
        appointments.map((t, i) => (
          <Box
            key={i}
            sx={{
              display: "flex",
              gap: 1,
              alignItems: "center",
              cursor: "pointer",
              backgroundColor:
                detail?.name === t.name ? "#ccc" : "transparent",
              p: 1,
              borderRadius: 1,
              "&:hover": {
                backgroundColor: "#ddd",
              },
            }}
            onClick={() => setDetail(t)}
          >
            <Typography>{i + 1}.</Typography>
            <Typography>{t.name}</Typography>
          </Box>
        ))
      ) : (
        <Typography sx={{ color: "#888", textAlign: "center", mt: 2 }}>
          No appointment details found.
        </Typography>
      )}
    </Box>
  );

  return (
    <Box>
      <NavBar />
      <Box sx={{ minHeight: "100vh", backgroundColor: "#f5f5f5", px: 2 }}>
        <Typography
          sx={{ textAlign: "center", fontSize: 30, fontWeight: 700, mb: 4 }}
        >
          Report Details
        </Typography>

        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            gap: 2,
          }}
        >
          {/* Mobile menu button */}
          {isMobile && (
            <Box sx={{ mb: 2 }}>
              <IconButton onClick={() => setDrawerOpen(true)}>
                <MenuIcon />
              </IconButton>
            </Box>
          )}

          {/* Left Sidebar */}
          {!isMobile && (
            <Box
              sx={{
                width: { sm: "25%" },
                backgroundColor: "#e4e4e4",
                p: 2,
                borderRadius: 2,
                boxShadow: 2,
              }}
            >
              {renderSidebarContent()}
            </Box>
          )}

          
          <Drawer
            anchor="left"
            open={drawerOpen}
            onClose={() => setDrawerOpen(false)}
          >
            {renderSidebarContent()}
          </Drawer>

          {/* Right Content - Appointment Details */}
          <Box sx={{ flex: 1 }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                minHeight: "80vh",
                backgroundColor: "#f5f5f5",
                px: 2,
              }}
            >
              <Box
                sx={{
                  backgroundColor: "white",
                  p: 4,
                  borderRadius: 2,
                  maxWidth: 500,
                  textAlign: "center",
                  boxShadow: 3,
                  width: "100%",
                }}
              >
                <Box
                  component="img"
                  src={
                    detail?.is_success
                      ? "./approved-icon.svg"
                      : "./pending-icon.svg"
                  }
                  alt="Status Icon"
                  sx={{ width: 30, mb: 1 }}
                />
                <Typography
                  variant="h4"
                  gutterBottom
                  sx={{ fontWeight: "bold" }}
                >
                  {detail?.is_success ? "Approved" : "Pending"}
                </Typography>

                <Typography variant="body1" sx={{ color: "#555", mb: 3 }}>
                  {detail?.is_success
                    ? "Your appointment has been approved."
                    : "Your appointment request is pending. It will be confirmed after doctor approval."}
                </Typography>

                <Divider sx={{ mb: 3 }} />

                {loading && (
                  <CircularProgress
                    sx={{ display: "block", margin: "0 auto", mb: 3 }}
                  />
                )}
                {error && (
                  <Typography variant="body2" color="error" sx={{ mb: 2 }}>
                    {error}
                  </Typography>
                )}

                {detail ? (
                  <Box sx={{ textAlign: "left", mb: 3 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                      Appointment Details
                    </Typography>
                    <Typography sx={{ lineHeight: 2 }}>
                      <strong>Name:</strong> {detail.name}
                    </Typography>
                    <Typography sx={{ lineHeight: 2 }}>
                      <strong>Phone:</strong> {detail.phone}
                    </Typography>
                    <Typography sx={{ lineHeight: 2 }}>
                      <strong>Email:</strong> {detail.email}
                    </Typography>
                    <Typography sx={{ lineHeight: 2 }}>
                      <strong>Date of Birth:</strong> {detail.dob}
                    </Typography>
                    <Typography sx={{ lineHeight: 2 }}>
                      <strong>Gender:</strong> {detail.gender}
                    </Typography>
                    <Typography sx={{ lineHeight: 2 }}>
                      <strong>Address:</strong> {detail.address}
                    </Typography>
                    <Typography sx={{ lineHeight: 2 }}>
                      <strong>Reason:</strong> {detail.reasonForConsultation}
                    </Typography>
                    <Typography sx={{ lineHeight: 2 }}>
                      <strong>Date:</strong> {detail.schedule_date}
                    </Typography>
                    <Typography sx={{ lineHeight: 2 }}>
                      <strong>Time:</strong> {detail.schedule_time}
                    </Typography>
                  </Box>
                ) : (
                  <Typography sx={{ color: "#999", textAlign: "center", mt: 2 }}>
                    Please select a user to view appointment details.
                  </Typography>
                )}

                <Button
                  variant="contained"
                  sx={{
                    bgcolor: "red",
                    borderRadius: "20px",
                    fontWeight: "bold",
                    textTransform: "none",
                    mt: 3,
                  }}
                  onClick={() => navigate("/")}
                >
                  Back to Home
                </Button>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
      <Footer />
    </Box>
  );
}
