import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Typography,
  useMediaQuery,
  useTheme,
  Chip,
} from "@mui/material";
import NavBar from "../../components/header";
import WhyChooseUs from "./WhyChooseUs";
import Footer from "../../components/footer";
import Testimonials from "./Testimonials";
import AOS from "aos";
import "aos/dist/aos.css";
import UserRegisterLanding from "./UserRegisterLogin";
import HospitalRegisterLanding from "./HospitalRegisterLanding";

/* ─── Design Tokens ─────────────────────────────────────────────── */
const tokens = {
  bg: "#FAF8FF",
  heroBg: "linear-gradient(135deg, #F3EEFF 0%, #FAF8FF 60%, #EEF2FF 100%)",
  purple: "#7C3AED",
  purpleMid: "#6D28D9",
  purpleLight: "#EDE9FE",
  purplePale: "#F5F3FF",
  violet: "#8B5CF6",
  violetLight: "#DDD6FE",
  indigo: "#4F46E5",
  indigoLight: "#E0E7FF",
  neutral: "#6B7280",
  neutralDark: "#1F1635",
  surface: "#FFFFFF",
  border: "#E5E7EB",
  borderPurple: "#DDD6FE",
};

/* ─── Global styles + animations ────────────────────────────────── */
const globalStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&family=Inter:wght@400;500;600&display=swap');

  @keyframes pulseRing {
    0%   { transform: scale(1);    opacity: 0.4; }
    70%  { transform: scale(1.2);  opacity: 0;   }
    100% { transform: scale(1.2);  opacity: 0;   }
  }
  @keyframes floatCard {
    0%, 100% { transform: translateY(0px); }
    50%       { transform: translateY(-9px); }
  }

  body { background: ${tokens.bg}; }

  .pulse-wrap { position: relative; display: inline-flex; }
  .pulse-wrap::before,
  .pulse-wrap::after {
    content: '';
    position: absolute;
    inset: -8px;
    border-radius: 10px;
    background: #7C3AED;
    opacity: 0;
    animation: pulseRing 2.2s cubic-bezier(0.215, 0.61, 0.355, 1) infinite;
    z-index: 0;
  }
  .pulse-wrap::after { animation-delay: 0.85s; }
  .pulse-wrap > * { position: relative; z-index: 1; }

  .float-card { animation: floatCard 5s ease-in-out infinite; }
`;

/* ─── Stat Badge ─────────────────────────────────────────────────── */
const StatBadge = ({ value, label, color }: { value: string | number; label: string; color?: string }) => (
  <Box sx={{
    display: "flex", flexDirection: "column", alignItems: "center",
    px: 2.5, py: 1.5, borderRadius: "12px", bgcolor: tokens.surface,
    border: `1px solid ${tokens.borderPurple}`,
    boxShadow: "0 2px 12px rgba(124,58,237,0.08)", minWidth: 90,
  }}>
    <Typography sx={{ fontFamily: "Plus Jakarta Sans", fontWeight: 800, fontSize: 22, color: color || tokens.purple, lineHeight: 1 }}>
      {value}
    </Typography>
    <Typography sx={{ fontFamily: "Inter", fontSize: 11, color: tokens.neutral, mt: 0.4, textAlign: "center" }}>
      {label}
    </Typography>
  </Box>
);

/* ─── Main Component ─────────────────────────────────────────────── */
const LandingPage = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const token = JSON.parse(localStorage.getItem("user") || "{}").access_token;

  useEffect(() => {
    AOS.init({ duration: 1200, once: true, easing: "ease-out-cubic" });
  }, []);

  return (
    <Box sx={{ bgcolor: tokens.bg, fontFamily: "Inter, sans-serif" }}>
      <style>{globalStyles}</style>

      {/* NavBar */}
      <Box data-aos="fade-down" data-aos-delay="100">
        <NavBar />
      </Box>

      {/* Hero */}
      <Box sx={{
        background: tokens.heroBg,
        minHeight: "92vh",
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        justifyContent: "center",
        alignItems: "center",
        pt: { xs: 6, md: 10 },
        pb: { xs: 8, md: 6 },
        px: { xs: 3, md: 10 },
        gap: { xs: 5, md: 8 },
        position: "relative",
        overflow: "hidden",
      }}>
        {/* Blob decorations */}
        <Box sx={{
          position: "absolute", width: 480, height: 480, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(124,58,237,0.08) 0%, transparent 70%)",
          top: -100, right: -100, pointerEvents: "none"
        }} />
        <Box sx={{
          position: "absolute", width: 320, height: 320, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(79,70,229,0.06) 0%, transparent 70%)",
          bottom: 0, left: -80, pointerEvents: "none"
        }} />

        {/* Left: Text */}
        <Box data-aos="fade-right" data-aos-delay="200"
          sx={{ flex: 1, textAlign: { xs: "center", md: "left" }, zIndex: 1 }}>

          <Chip label="🏥  Trusted Hospital Network" size="small" sx={{
            mb: 2.5, bgcolor: tokens.purpleLight, color: tokens.purple,
            fontFamily: "Inter", fontWeight: 600, fontSize: 12, px: 1,
            border: `1px solid ${tokens.violet}33`,
          }} />

          <Typography component="h1" sx={{
            fontFamily: "Plus Jakarta Sans",
            fontWeight: 800,
            fontSize: { xs: 36, sm: 44, md: 54 },
            lineHeight: 1.12,
            color: tokens.neutralDark,
            mb: 0.5,
          }}>
            Healthcare,{" "}
            <Box component="span" sx={{
              background: `linear-gradient(135deg, ${tokens.purple}, ${tokens.indigo})`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}>
              simplified.
            </Box>
          </Typography>

          <Typography sx={{
            fontFamily: "Inter", fontSize: { xs: 15, sm: 17 },
            color: tokens.neutral, fontWeight: 400, mt: 2, mb: 1,
            maxWidth: 440, mx: { xs: "auto", md: 0 }, lineHeight: 1.7,
          }}>
            Find the best hospitals, book appointments, and manage your health —
            all in one place. Jacsto connects you to the care you deserve.
          </Typography>

          {/* CTAs */}
          <Box sx={{
            display: "flex", justifyContent: { xs: "center", md: "flex-start" },
            gap: 2, flexWrap: "wrap", mt: 4, mb: 5,
          }}>
            <div className="pulse-wrap">
              <Button variant="contained" onClick={() => navigate("/hospitalList")} disableElevation sx={{
                bgcolor: tokens.purple, fontFamily: "Inter", fontWeight: 600,
                borderRadius: "8px", fontSize: "14px", px: 3, py: 1.4,
                textTransform: "none", letterSpacing: 0.3,
                boxShadow: `0 4px 18px ${tokens.purple}40`,
                "&:hover": {
                  bgcolor: tokens.purpleMid,
                  boxShadow: `0 6px 24px ${tokens.purple}55`,
                  transform: "translateY(-1px)",
                  transition: "all 0.2s ease",
                },
              }}>
                Book an Appointment
              </Button>
            </div>

            <Button onClick={() => navigate("/login")} variant="outlined" disableElevation sx={{
              borderColor: tokens.violet, color: tokens.violet,
              fontFamily: "Inter", fontWeight: 600, borderRadius: "8px",
              fontSize: "14px", px: 3, py: 1.4, textTransform: "none",
              "&:hover": {
                bgcolor: tokens.violetLight, borderColor: tokens.violet,
                transform: "translateY(-1px)", transition: "all 0.2s ease",
              },
            }}>
              Join Us
            </Button>
          </Box>

          {/* Stats */}
          <Box sx={{ display: "flex", gap: 2, justifyContent: { xs: "center", md: "flex-start" }, flexWrap: "wrap" }}>
            <StatBadge value="500+" label="Hospitals" color={tokens.purple} />
            <StatBadge value="1M+" label="Patients Served" color={tokens.indigo} />
            <StatBadge value="4.9★" label="Avg Rating" color="#F59E0B" />
          </Box>
        </Box>

        {/* Right: Image */}
        <Box data-aos="fade-left" data-aos-delay="300" className="float-card"
          sx={{ zIndex: 1, position: "relative", flexShrink: 0 }}>

          <Box sx={{
            position: "absolute", inset: -14, borderRadius: "28px",
            background: `linear-gradient(135deg, ${tokens.purpleLight}, ${tokens.indigoLight})`,
            zIndex: 0,
          }} />

          <Box component="img" src="./landingpage.jpg" alt="Hospital care illustration" sx={{
            position: "relative", zIndex: 1,
            width: { xs: "88%", sm: 440, md: 520 },
            height: { xs: 240, sm: 310, md: 380 },
            borderRadius: "20px", objectFit: "cover",
            boxShadow: "0 20px 60px rgba(124,58,237,0.18)",
            display: "block", mx: { xs: "auto", md: 0 },
          }} />

          {/* Floating badge */}
          <Box sx={{
            position: "absolute",
            bottom: { xs: -16, md: -20 },
            left: { xs: "50%", md: 20 },
            transform: { xs: "translateX(-50%)", md: "none" },
            zIndex: 2, bgcolor: tokens.surface,
            border: `1px solid ${tokens.borderPurple}`,
            borderRadius: "12px", px: 2, py: 1.2,
            display: "flex", alignItems: "center", gap: 1,
            boxShadow: "0 4px 20px rgba(124,58,237,0.1)",
            whiteSpace: "nowrap",
          }}>
            <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: "#22C55E", boxShadow: "0 0 0 3px #BBF7D0" }} />
            <Typography sx={{ fontFamily: "Inter", fontSize: 13, fontWeight: 600, color: tokens.neutralDark }}>
              Doctors available now
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Why Choose Us */}
      <Box data-aos="fade-up" sx={{ bgcolor: tokens.surface, borderTop: `1px solid ${tokens.border}` }}>
        <WhyChooseUs />
      </Box>

      {/* Testimonials */}
      <Box data-aos="fade-up" data-aos-delay="100" sx={{ bgcolor: tokens.purplePale }}>
        <Testimonials />
      </Box>

      {/* Register Sections */}
      {!token && (
        <>
          <Box data-aos="fade-up" data-aos-delay="100" sx={{ bgcolor: tokens.purpleLight }}>
            <UserRegisterLanding />
          </Box>
          <Box data-aos="fade-up" data-aos-delay="100" sx={{ bgcolor: tokens.indigoLight }}>
            <HospitalRegisterLanding />
          </Box>
        </>
      )}

      <Footer />
    </Box>
  );
};

export default LandingPage;