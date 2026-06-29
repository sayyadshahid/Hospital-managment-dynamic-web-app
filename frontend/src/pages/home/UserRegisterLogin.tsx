import React from "react";
import { Box, Typography, Button, useTheme, useMediaQuery } from "@mui/material";
import PersonOutlineRoundedIcon from "@mui/icons-material/PersonOutlineRounded";
import StethoscopeIcon from "@mui/icons-material/MedicalServicesOutlined";
import { useNavigate } from "react-router-dom";

/* ─── Design Tokens ─────────────────────────────────────────────── */
const tokens = {
  bg: "#FAF8FF",
  purple: "#7C3AED",
  purpleMid: "#6D28D9",
  purpleLight: "#EDE9FE",
  violet: "#8B5CF6",
  violetLight: "#DDD6FE",
  indigo: "#4F46E5",
  indigoLight: "#E0E7FF",
  neutral: "#6B7280",
  neutralDark: "#1F1635",
  surface: "#FFFFFF",
  borderPurple: "#DDD6FE",
};

/* ─── Card ───────────────────────────────────────────────────────── */
const CardBox = ({
  Icon,
  title,
  description,
  buttonText,
  navigateTo,
  hoverBorder,
  hoverShadow,
  btnColor,
  btnHover,
  accentBg,
}: {
  Icon: React.ElementType;
  title: string;
  description: string;
  buttonText: string;
  navigateTo: string;
  hoverBorder: string;
  hoverShadow: string;
  btnColor: string;
  btnHover: string;
  accentBg: string;
}) => {
  const navigate = useNavigate();
  return (
    <Box sx={{
      bgcolor: tokens.surface,
      border: `1px solid ${tokens.borderPurple}`,
      p: 4, borderRadius: "16px",
      maxWidth: 320, width: "100%",
      textAlign: "center",
      transition: "all 0.25s ease",
      "&:hover": {
        borderColor: hoverBorder,
        boxShadow: `0 8px 32px ${hoverShadow}`,
        transform: "translateY(-4px)",
      },
    }}>
      {/* Icon bubble */}
      <Box sx={{
        width: 56, height: 56, borderRadius: "14px",
        bgcolor: accentBg,
        display: "flex", alignItems: "center", justifyContent: "center",
        mx: "auto", mb: 2.5,
      }}>
        <Icon sx={{ fontSize: 26, color: btnColor }} />
      </Box>

      <Typography sx={{
        fontFamily: "Plus Jakarta Sans, sans-serif",
        fontWeight: 700, fontSize: 18,
        color: tokens.neutralDark, mb: 1,
      }}>
        {title}
      </Typography>

      <Typography sx={{
        fontFamily: "Inter, sans-serif",
        fontSize: 14, color: tokens.neutral,
        lineHeight: 1.65, mb: 3,
      }}>
        {description}
      </Typography>

      <Button
        onClick={() => navigate(navigateTo)}
        variant="contained"
        disableElevation
        sx={{
          bgcolor: btnColor,
          fontFamily: "Inter", fontWeight: 600,
          borderRadius: "8px", px: 3, py: 1.2,
          fontSize: 14, textTransform: "none",
          boxShadow: `0 4px 14px ${hoverShadow}`,
          "&:hover": {
            bgcolor: btnHover,
            transform: "translateY(-1px)",
            transition: "all 0.2s ease",
          },
        }}
      >
        {buttonText}
      </Button>
    </Box>
  );
};

/* ─── Section ────────────────────────────────────────────────────── */
const RegisterLandingSection = () => {
  return (
    <Box sx={{
      py: { xs: 7, md: 10 },
      px: { xs: 3, md: 10 },
      bgcolor: tokens.bg,
      textAlign: "center",
    }}>
      {/* Eyebrow */}
      <Typography sx={{
        fontFamily: "Inter, sans-serif", fontSize: 12, fontWeight: 600,
        letterSpacing: 2, textTransform: "uppercase", color: tokens.violet, mb: 1.5,
      }}>
        Get Started
      </Typography>

      {/* Heading */}
      <Typography component="h2" sx={{
        fontFamily: "Plus Jakarta Sans, sans-serif", fontWeight: 800,
        fontSize: { xs: 26, md: 38 }, color: tokens.neutralDark, lineHeight: 1.2, mb: 1.5,
      }}>
        Join{" "}
        <Box component="span" sx={{
          background: `linear-gradient(135deg, ${tokens.purple}, ${tokens.indigo})`,
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
        }}>
          Jacsto today.
        </Box>
      </Typography>

      <Typography sx={{
        fontFamily: "Inter, sans-serif", fontSize: { xs: 14, md: 16 },
        color: tokens.neutral, maxWidth: 460, mx: "auto", mb: 6, lineHeight: 1.7,
      }}>
        Whether you're seeking care or providing it — Jacsto has a place for you.
      </Typography>

      {/* Cards */}
      <Box sx={{
        display: "flex",
        flexDirection: { xs: "column", sm: "row" },
        justifyContent: "center",
        alignItems: "center",
        gap: 3,
      }}>
        <CardBox
          Icon={PersonOutlineRoundedIcon}
          title="Patient"
          description="Create your account to find verified hospitals and book appointments in minutes."
          buttonText="Register as Patient"
          navigateTo="/register"
          hoverBorder="#7C3AED"
          hoverShadow="rgba(124,58,237,0.18)"
          btnColor={tokens.purple}
          btnHover={tokens.purpleMid}
          accentBg={tokens.purpleLight}
        />
        <CardBox
          Icon={StethoscopeIcon}
          title="Doctor"
          description="Register as a doctor and connect with patients who need your expertise."
          buttonText="Register as Doctor"
          navigateTo="/register"
          hoverBorder="#0D9488"
          hoverShadow="rgba(13,148,136,0.18)"
          btnColor="#0D9488"
          btnHover="#0F766E"
          accentBg="#CCFBF1"
        />
      </Box>
    </Box>
  );
};

export default RegisterLandingSection;