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

/* ─── Design Tokens ─────────────────────────────────────────────── */
const tokens = {
  bg: "#FAF8FF",
  purple: "#7C3AED",
  purpleMid: "#6D28D9",
  purpleLight: "#EDE9FE",
  violet: "#8B5CF6",
  indigo: "#4F46E5",
  teal: "#0D9488",
  tealLight: "#CCFBF1",
  amber: "#D97706",
  amberLight: "#FEF3C7",
  neutral: "#6B7280",
  neutralDark: "#1F1635",
  surface: "#FFFFFF",
  borderPurple: "#DDD6FE",
};

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

const userId = JSON.parse(localStorage.getItem("user") || "{}").id;

/* ─── Detail Row ─────────────────────────────────────────────────── */
const DetailRow = ({ label, value }: { label: string; value: string }) => (
  <Box sx={{
    display: "flex", justifyContent: "space-between",
    py: 1.1, borderBottom: `1px solid ${tokens.borderPurple}`,
  }}>
    <Typography sx={{ fontFamily: "Inter", fontSize: 13.5, color: tokens.neutral }}>
      {label}
    </Typography>
    <Typography sx={{ fontFamily: "Inter", fontSize: 13.5, fontWeight: 600, color: tokens.neutralDark, textAlign: "right" }}>
      {value}
    </Typography>
  </Box>
);

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
        if (data.length > 0) setDetail(data[0]);
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
    <Box sx={{ width: { xs: "82vw", sm: "100%" }, p: 2.5, height: "100%" }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2.5 }}>
        <Typography sx={{
          fontFamily: "Plus Jakarta Sans, sans-serif",
          fontSize: 16, fontWeight: 700, color: tokens.neutralDark,
        }}>
          Your Appointments
        </Typography>
        {isMobile && (
          <IconButton onClick={() => setDrawerOpen(false)} size="small">
            <CloseIcon sx={{ color: tokens.neutral }} />
          </IconButton>
        )}
      </Box>

      {appointments.length > 0 ? (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
          {appointments.map((t, i) => {
            const active = detail?.name === t.name && detail?.schedule_date === t.schedule_date;
            return (
              <Box
                key={i}
                onClick={() => setDetail(t)}
                sx={{
                  display: "flex", gap: 1.2, alignItems: "center",
                  cursor: "pointer", px: 1.5, py: 1.1, borderRadius: "10px",
                  bgcolor: active ? tokens.purpleLight : "transparent",
                  transition: "all 0.18s ease",
                  "&:hover": { bgcolor: active ? tokens.purpleLight : "#F4F2FF" },
                }}
              >
                <Box sx={{
                  width: 26, height: 26, borderRadius: "8px",
                  bgcolor: active ? tokens.purple : "#EDEBF5",
                  color: active ? "#fff" : tokens.neutral,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 12, fontWeight: 700, fontFamily: "Inter", flexShrink: 0,
                }}>
                  {i + 1}
                </Box>
                <Typography sx={{
                  fontFamily: "Inter", fontSize: 14,
                  fontWeight: active ? 700 : 500,
                  color: active ? tokens.purple : tokens.neutralDark,
                  overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                }}>
                  {t.name}
                </Typography>
              </Box>
            );
          })}
        </Box>
      ) : (
        <Typography sx={{ fontFamily: "Inter", fontSize: 13.5, color: tokens.neutral, textAlign: "center", mt: 2 }}>
          No appointment details found.
        </Typography>
      )}
    </Box>
  );

  return (
    <Box>
      <NavBar />
      <Box sx={{ minHeight: "100vh", bgcolor: tokens.bg, px: { xs: 2, md: 4 }, py: 4 }}>

        <Typography sx={{
          textAlign: "center",
          fontFamily: "Plus Jakarta Sans, sans-serif",
          fontSize: { xs: 26, md: 32 }, fontWeight: 800,
          color: tokens.neutralDark, mb: 4,
        }}>
          Report{" "}
          <Box component="span" sx={{
            background: `linear-gradient(135deg, ${tokens.purple}, ${tokens.indigo})`,
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          }}>
            Details
          </Box>
        </Typography>

        <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, gap: 2.5, maxWidth: 1100, mx: "auto" }}>

          {/* Mobile menu button */}
          {isMobile && (
            <Box sx={{ mb: 1 }}>
              <IconButton
                onClick={() => setDrawerOpen(true)}
                sx={{
                  bgcolor: tokens.surface, border: `1px solid ${tokens.borderPurple}`,
                  borderRadius: "10px", color: tokens.purple,
                }}
              >
                <MenuIcon />
              </IconButton>
            </Box>
          )}

          {/* Left Sidebar */}
          {!isMobile && (
            <Box sx={{
              width: { sm: 280 }, flexShrink: 0,
              bgcolor: tokens.surface, borderRadius: "16px",
              border: `1px solid ${tokens.borderPurple}`,
              boxShadow: "0 4px 20px rgba(124,58,237,0.06)",
              height: "fit-content",
            }}>
              {renderSidebarContent()}
            </Box>
          )}

          <Drawer
            anchor="left"
            open={drawerOpen}
            onClose={() => setDrawerOpen(false)}
            PaperProps={{ sx: { bgcolor: tokens.surface } }}
          >
            {renderSidebarContent()}
          </Drawer>

          {/* Right Content */}
          <Box sx={{ flex: 1, display: "flex", justifyContent: "center" }}>
            <Box sx={{
              bgcolor: tokens.surface, p: { xs: 3, md: 4 },
              borderRadius: "16px", maxWidth: 520, textAlign: "center",
              border: `1px solid ${tokens.borderPurple}`,
              boxShadow: "0 4px 24px rgba(124,58,237,0.08)",
              width: "100%", height: "fit-content",
            }}>

              {/* Status Badge */}
              <Box sx={{
                width: 56, height: 56, borderRadius: "50%", mx: "auto", mb: 2,
                bgcolor: detail?.is_success ? tokens.tealLight : tokens.amberLight,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 26,
              }}>
                {detail?.is_success ? "✅" : "⏳"}
              </Box>

              <Typography sx={{
                fontFamily: "Plus Jakarta Sans, sans-serif",
                fontWeight: 800, fontSize: 24,
                color: detail?.is_success ? tokens.teal : tokens.amber,
                mb: 1,
              }}>
                {detail?.is_success ? "Approved" : "Pending"}
              </Typography>

              <Typography sx={{ fontFamily: "Inter", fontSize: 14, color: tokens.neutral, mb: 3, lineHeight: 1.6 }}>
                {detail?.is_success
                  ? "Your appointment has been approved."
                  : "Your appointment request is pending. It will be confirmed after doctor approval."}
              </Typography>

              <Divider sx={{ mb: 3, borderColor: tokens.borderPurple }} />

              {loading && (
                <CircularProgress sx={{ display: "block", margin: "0 auto", mb: 3, color: tokens.purple }} />
              )}
              {error && (
                <Typography sx={{ fontFamily: "Inter", fontSize: 13, color: "#DC2626", mb: 2 }}>
                  {error}
                </Typography>
              )}

              {detail ? (
                <Box sx={{ textAlign: "left", mb: 3 }}>
                  <Typography sx={{
                    fontFamily: "Plus Jakarta Sans, sans-serif",
                    fontWeight: 700, fontSize: 14, color: tokens.neutralDark, mb: 1,
                  }}>
                    Appointment Details
                  </Typography>
                  <DetailRow label="Name" value={detail.name} />
                  <DetailRow label="Phone" value={detail.phone} />
                  <DetailRow label="Email" value={detail.email} />
                  <DetailRow label="Date of Birth" value={detail.dob} />
                  <DetailRow label="Gender" value={detail.gender} />
                  <DetailRow label="Address" value={detail.address} />
                  <DetailRow label="Reason" value={detail.reasonForConsultation} />
                  <DetailRow label="Date" value={detail.schedule_date} />
                  <DetailRow label="Time" value={detail.schedule_time} />
                </Box>
              ) : (
                <Typography sx={{ fontFamily: "Inter", fontSize: 13.5, color: tokens.neutral, textAlign: "center", mt: 2 }}>
                  Please select a user to view appointment details.
                </Typography>
              )}

              <Button
                variant="contained"
                disableElevation
                onClick={() => navigate("/")}
                sx={{
                  bgcolor: tokens.purple,
                  fontFamily: "Inter", fontWeight: 600,
                  borderRadius: "10px", textTransform: "none",
                  px: 3.5, py: 1.2, mt: 1,
                  boxShadow: `0 4px 14px ${tokens.purple}33`,
                  "&:hover": {
                    bgcolor: tokens.purpleMid,
                    transform: "translateY(-1px)",
                    transition: "all 0.2s ease",
                  },
                }}
              >
                Back to Home
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>
      <Footer />
    </Box>
  );
}