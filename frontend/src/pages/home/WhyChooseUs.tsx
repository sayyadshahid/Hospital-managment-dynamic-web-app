import React from "react";
import { Box, Typography } from "@mui/material";
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";
import VerifiedRoundedIcon from "@mui/icons-material/VerifiedRounded";
import LockRoundedIcon from "@mui/icons-material/LockRounded";
import BoltRoundedIcon from "@mui/icons-material/BoltRounded";

const tokens = {
  purple: "#7C3AED",
  purpleLight: "#EDE9FE",
  violet: "#8B5CF6",
  indigo: "#4F46E5",
  neutral: "#6B7280",
  neutralDark: "#1F1635",
  surface: "#FFFFFF",
  borderPurple: "#DDD6FE",
};

const features = [
  {
    Icon: AccessTimeRoundedIcon,
    title: "24/7 Availability",
    body: "Book hospitals and consult with doctors anytime, from anywhere in the world.",
    accent: "#7C3AED",
    accentBg: "#EDE9FE",
    hoverBorder: "#7C3AED",
    hoverShadow: "rgba(124,58,237,0.18)",
  },
  {
    Icon: VerifiedRoundedIcon,
    title: "Verified Hospitals",
    body: "Every hospital listed is thoroughly verified for quality, safety, and trust.",
    accent: "#0D9488",
    accentBg: "#CCFBF1",
    hoverBorder: "#0D9488",
    hoverShadow: "rgba(13,148,136,0.18)",
  },
  {
    Icon: LockRoundedIcon,
    title: "Secure Booking",
    body: "Your data and appointments are protected with enterprise-grade security.",
    accent: "#D97706",
    accentBg: "#FEF3C7",
    hoverBorder: "#D97706",
    hoverShadow: "rgba(217,119,6,0.18)",
  },
  {
    Icon: BoltRoundedIcon,
    title: "Instant Confirmation",
    body: "Get real-time booking confirmation and reminders without any delay.",
    accent: "#DB2777",
    accentBg: "#FCE7F3",
    hoverBorder: "#DB2777",
    hoverShadow: "rgba(219,39,119,0.18)",
  },
];

const WhyChooseUs = () => {
  return (
    <Box sx={{ py: { xs: 7, md: 10 }, px: { xs: 3, md: 10 }, bgcolor: tokens.surface, textAlign: "center" }}>

      <Typography sx={{
        fontFamily: "Inter, sans-serif", fontSize: 12, fontWeight: 600,
        letterSpacing: 2, textTransform: "uppercase", color: tokens.violet, mb: 1.5,
      }}>
        Why Jacsto
      </Typography>

      <Typography component="h2" sx={{
        fontFamily: "Plus Jakarta Sans, sans-serif", fontWeight: 800,
        fontSize: { xs: 26, md: 38 }, color: tokens.neutralDark, lineHeight: 1.2, mb: 1.5,
      }}>
        Everything you need,{" "}
        <Box component="span" sx={{
          background: `linear-gradient(135deg, ${tokens.purple}, ${tokens.indigo})`,
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
        }}>
          in one place.
        </Box>
      </Typography>

      <Typography sx={{
        fontFamily: "Inter, sans-serif", fontSize: { xs: 14, md: 16 },
        color: tokens.neutral, maxWidth: 520, mx: "auto", mb: 6, lineHeight: 1.7,
      }}>
        Jacsto is built around you — making hospital discovery, booking, and care management effortless.
      </Typography>

      <Box sx={{
        display: "grid",
        gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", lg: "repeat(4, 1fr)" },
        gap: 3, maxWidth: 1100, mx: "auto",
      }}>
        {features.map(({ Icon, title, body, accent, accentBg, hoverBorder, hoverShadow }) => (
          <Box key={title} sx={{
            p: 3.5, bgcolor: tokens.surface,
            border: `1px solid ${tokens.borderPurple}`,
            borderRadius: "16px", textAlign: "left", cursor: "default",
            transition: "all 0.25s ease",
            "&:hover": {
              borderColor: hoverBorder,
              boxShadow: `0 8px 32px ${hoverShadow}`,
              transform: "translateY(-4px)",
            },
          }}>
            <Box sx={{
              width: 48, height: 48, borderRadius: "12px", bgcolor: accentBg,
              display: "flex", alignItems: "center", justifyContent: "center",
              mb: 2.5,
            }}>
              <Icon sx={{ fontSize: 22, color: accent }} />
            </Box>

            <Typography sx={{
              fontFamily: "Plus Jakarta Sans, sans-serif", fontWeight: 700,
              fontSize: 16, color: tokens.neutralDark, mb: 1,
            }}>
              {title}
            </Typography>

            <Typography sx={{
              fontFamily: "Inter, sans-serif", fontSize: 14,
              color: tokens.neutral, lineHeight: 1.65,
            }}>
              {body}
            </Typography>

            <Box sx={{ mt: 2.5, height: 3, width: 32, borderRadius: 4, bgcolor: accent, opacity: 0.55 }} />
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default WhyChooseUs;