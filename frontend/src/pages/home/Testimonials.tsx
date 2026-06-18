import React from "react";
import { Box, Typography } from "@mui/material";

/* ─── Design Tokens ─────────────────────────────────────────────── */
const tokens = {
  bg: "#FAF8FF",
  purple: "#7C3AED",
  purpleLight: "#EDE9FE",
  violet: "#8B5CF6",
  indigo: "#4F46E5",
  neutral: "#6B7280",
  neutralDark: "#1F1635",
  surface: "#FFFFFF",
  borderPurple: "#DDD6FE",
};

/* ─── Testimonial Data ───────────────────────────────────────────── */
const testimonials = [
  {
    name: "Emily Johnson",
    role: "Patient",
    feedback: "This platform made booking my hospital appointment so simple and hassle-free!",
    image: "./avtar2.jpg",
    rating: 5,
    hoverBorder: "#7C3AED",
    hoverShadow: "rgba(124,58,237,0.18)",
    avatarRing: "#EDE9FE",
  },
  {
    name: "Michael Smith",
    role: "Caregiver",
    feedback: "Excellent service and great support from the team. Highly recommend to everyone.",
    image: "./avtar1.jpg",
    rating: 5,
    hoverBorder: "#0D9488",
    hoverShadow: "rgba(13,148,136,0.18)",
    avatarRing: "#CCFBF1",
  },
  {
    name: "Jessica Williams",
    role: "Patient",
    feedback: "I found the best hospital nearby with just a few clicks. Very user-friendly website.",
    image: "./avtar3.jpg",
    rating: 5,
    hoverBorder: "#DB2777",
    hoverShadow: "rgba(219,39,119,0.18)",
    avatarRing: "#FCE7F3",
  },
];

/* ─── Star Rating ────────────────────────────────────────────────── */
const Stars = ({ count }: { count: number }) => (
  <Box sx={{ display: "flex", gap: 0.3, mb: 1.5 }}>
    {Array.from({ length: count }).map((_, i) => (
      <Box key={i} component="span" sx={{ color: "#F59E0B", fontSize: 16 }}>★</Box>
    ))}
  </Box>
);

/* ─── Component ──────────────────────────────────────────────────── */
const Testimonials = () => {
  return (
    <Box sx={{
      bgcolor: tokens.bg,
      py: { xs: 7, md: 10 },
      px: { xs: 3, md: 10 },
      textAlign: "center",
    }}>

      {/* Eyebrow */}
      <Typography sx={{
        fontFamily: "Inter, sans-serif", fontSize: 12, fontWeight: 600,
        letterSpacing: 2, textTransform: "uppercase", color: tokens.violet, mb: 1.5,
      }}>
        Testimonials
      </Typography>

      {/* Heading */}
      <Typography component="h2" sx={{
        fontFamily: "Plus Jakarta Sans, sans-serif", fontWeight: 800,
        fontSize: { xs: 26, md: 38 }, color: tokens.neutralDark, lineHeight: 1.2, mb: 1.5,
      }}>
        Loved by{" "}
        <Box component="span" sx={{
          background: `linear-gradient(135deg, ${tokens.purple}, ${tokens.indigo})`,
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
        }}>
          our patients.
        </Box>
      </Typography>

      <Typography sx={{
        fontFamily: "Inter, sans-serif", fontSize: { xs: 14, md: 16 },
        color: tokens.neutral, maxWidth: 480, mx: "auto", mb: 6, lineHeight: 1.7,
      }}>
        Real stories from real people who found the care they needed through Jacsto.
      </Typography>

      {/* Cards */}
      <Box sx={{
        display: "grid",
        gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", md: "repeat(3, 1fr)" },
        gap: 3, maxWidth: 1000, mx: "auto",
      }}>
        {testimonials.map(({ name, role, feedback, image, rating, hoverBorder, hoverShadow, avatarRing }) => (
          <Box key={name} sx={{
            p: 3.5, bgcolor: tokens.surface,
            border: `1px solid ${tokens.borderPurple}`,
            borderRadius: "16px", textAlign: "left",
            transition: "all 0.25s ease",
            "&:hover": {
              borderColor: hoverBorder,
              boxShadow: `0 8px 32px ${hoverShadow}`,
              transform: "translateY(-4px)",
            },
          }}>
            {/* Quote mark */}
            <Typography sx={{
              fontFamily: "Georgia, serif", fontSize: 48,
              color: tokens.purpleLight, lineHeight: 0.8, mb: 1.5,
            }}>
              "
            </Typography>

            <Stars count={rating} />

            {/* Feedback */}
            <Typography sx={{
              fontFamily: "Inter, sans-serif", fontSize: 14,
              color: tokens.neutral, lineHeight: 1.7, mb: 3,
              fontStyle: "italic",
            }}>
              {feedback}
            </Typography>

            {/* User info */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              <Box sx={{
                p: "2px", borderRadius: "50%",
                background: `linear-gradient(135deg, ${hoverBorder}, ${avatarRing})`,
              }}>
                <Box component="img" src={image} alt={name} sx={{ width: 44, height: 44, borderRadius: "50%", objectFit: "cover", display: "block" }} />
              </Box>
              <Box>
                <Typography sx={{
                  fontFamily: "Plus Jakarta Sans, sans-serif",
                  fontWeight: 700, fontSize: 14, color: tokens.neutralDark,
                }}>
                  {name}
                </Typography>
                <Typography sx={{
                  fontFamily: "Inter, sans-serif",
                  fontSize: 12, color: tokens.neutral,
                }}>
                  {role}
                </Typography>
              </Box>
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default Testimonials;