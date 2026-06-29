import React from "react";
import { Box, Typography, Button } from "@mui/material";
import AssignmentOutlinedIcon from "@mui/icons-material/AssignmentOutlined";
import PublicRoundedIcon from "@mui/icons-material/PublicRounded";
import VerifiedUserOutlinedIcon from "@mui/icons-material/VerifiedUserOutlined";

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
  teal: "#0D9488",
  tealLight: "#CCFBF1",
  neutral: "#6B7280",
  neutralDark: "#1F1635",
  surface: "#FFFFFF",
  borderPurple: "#DDD6FE",
};

/* ─── Perk Badge ─────────────────────────────────────────────────── */
const Perk = ({ Icon, text }: { Icon: React.ElementType; text: string }) => (
  <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
    <Box sx={{
      width: 36, height: 36, borderRadius: "10px",
      bgcolor: tokens.tealLight,
      display: "flex", alignItems: "center", justifyContent: "center",
      flexShrink: 0,
    }}>
      <Icon sx={{ fontSize: 18, color: tokens.teal }} />
    </Box>
    <Typography sx={{
      fontFamily: "Inter, sans-serif", fontSize: 14,
      color: tokens.neutral, lineHeight: 1.5,
    }}>
      {text}
    </Typography>
  </Box>
);

/* ─── Component ──────────────────────────────────────────────────── */
const HospitalRegisterLanding = () => {
  return (
    <Box sx={{
      bgcolor: tokens.surface,
      py: { xs: 7, md: 10 },
      px: { xs: 3, md: 12 },
      display: "flex",
      flexDirection: { xs: "column", md: "row" },
      justifyContent: "center",
      alignItems: "center",
      gap: { xs: 5, md: 8 },
      borderTop: `1px solid ${tokens.borderPurple}`,
    }}>

      {/* Left: Text */}
      <Box sx={{ flex: 1, textAlign: { xs: "center", md: "left" } }}>

        {/* Eyebrow */}
        <Typography sx={{
          fontFamily: "Inter, sans-serif", fontSize: 12, fontWeight: 600,
          letterSpacing: 2, textTransform: "uppercase", color: tokens.teal, mb: 1.5,
        }}>
          For Hospitals
        </Typography>

        {/* Heading */}
        <Typography component="h2" sx={{
          fontFamily: "Plus Jakarta Sans, sans-serif", fontWeight: 800,
          fontSize: { xs: 28, md: 40 }, color: tokens.neutralDark,
          lineHeight: 1.15, mb: 2,
        }}>
          List your hospital{" "}
          <Box component="span" sx={{
            background: `linear-gradient(135deg, ${tokens.purple}, ${tokens.indigo})`,
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          }}>
            with us.
          </Box>
        </Typography>

        <Typography sx={{
          fontFamily: "Inter, sans-serif", fontSize: { xs: 15, md: 16 },
          color: tokens.neutral, lineHeight: 1.7, mb: 3.5, maxWidth: 460,
          mx: { xs: "auto", md: 0 },
        }}>
          Manage doctors and appointments online. Get listed on Jacsto and
          reach thousands of patients across the country.
        </Typography>

        {/* Perks */}
        <Box sx={{
          display: "flex", flexDirection: "column", gap: 1.8,
          mb: 4, alignItems: { xs: "center", md: "flex-start" },
        }}>
          <Perk Icon={AssignmentOutlinedIcon} text="Easy online appointment & doctor management" />
          <Perk Icon={PublicRoundedIcon} text="Reach patients nationwide on one platform" />
          <Perk Icon={VerifiedUserOutlinedIcon} text="Secure, verified hospital listing process" />
        </Box>

        {/* Email nudge */}
        <Box sx={{
          display: "inline-flex", alignItems: "center", gap: 1,
          bgcolor: tokens.indigoLight,
          border: `1px solid ${tokens.borderPurple}`,
          borderRadius: "10px", px: 2, py: 1.2, mb: 3,
        }}>
          <Typography sx={{
            fontFamily: "Inter, sans-serif", fontSize: 13,
            color: tokens.indigo, fontWeight: 500,
          }}>
            Send your details to{" "}
            <Box component="span" sx={{ fontWeight: 700, color: tokens.neutralDark }}>
              support@jacsto.com
            </Box>
          </Typography>
        </Box>

        <Box>
          <Button
            variant="contained"
            href="mailto:support@jacsto.com"
            disableElevation
            sx={{
              bgcolor: tokens.teal,
              fontFamily: "Inter", fontWeight: 600,
              borderRadius: "8px", px: 3, py: 1.3,
              fontSize: 14, textTransform: "none",
              boxShadow: "0 4px 14px rgba(13,148,136,0.25)",
              "&:hover": {
                bgcolor: "#0F766E",
                transform: "translateY(-1px)",
                transition: "all 0.2s ease",
              },
            }}
          >
            Send Details via Email
          </Button>
        </Box>
      </Box>

      {/* Right: Image */}
      <Box sx={{
        flex: 1, display: "flex",
        justifyContent: { xs: "center", md: "flex-end" },
        position: "relative",
      }}>
        {/* Decorative ring */}
        <Box sx={{
          position: "absolute", inset: -14, borderRadius: "24px",
          background: `linear-gradient(135deg, ${tokens.tealLight}, ${tokens.indigoLight})`,
          zIndex: 0,
          maxWidth: 348, maxHeight: 348,
          top: "50%", left: { xs: "50%", md: "auto" }, right: { xs: "auto", md: -14 },
          transform: { xs: "translate(-50%, -50%)", md: "translateY(-50%)" },
        }} />
        <Box
          component="img"
          src="./hospital.png"
          alt="List your hospital"
          sx={{
            position: "relative", zIndex: 1,
            width: "100%", maxWidth: 320,
            borderRadius: "16px",
            boxShadow: "0 16px 48px rgba(124,58,237,0.12)",
          }}
        />
      </Box>
    </Box>
  );
};

export default HospitalRegisterLanding;