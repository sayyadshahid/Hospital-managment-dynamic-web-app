import React from "react";
import { Box, Typography, Button, TextField, Container } from "@mui/material";
import NavBar from "../../components/header";
import Footer from "../../components/footer";

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

const teamMembers = [
  {
    name: "Dr. Amelia Chen",
    role: "CEO & Founder",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCaTdNtWzLZOedCe5V9Opcg6kiCiSuJQ-UmynqVjNpWFv0aOKERtmFGob3YS7QCDPv8QSxgDMcDwdJtWYbij3J2Oaiq3UAXVQtT1cOMTyFlDusxj1-jna1phz32mizuZnrTO3iubXefDIGi5Kz54MB_TLKkDd1HK0tRlwzcVIrdq-xIbRGgUhrBmqj5smaNbcEzig5ZeJi4xpTnAtJ5K87gSq4o1QY2Su-x9hwo_aw5zomzUPWYw_O75aH9GXVERQzAHy6ckflE6Zs",
  },
  {
    name: "Dr. Ethan Ramirez",
    role: "Chief Technology Officer",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuB99oozZgEalxUJmDxJ-LV6eNflF3o2VST5mpZvJ9Vofvsac-ZVL5NGR5IUQI4QUO-F7aHqKWJZIXfILMUWamXivb58Ps4liNYI8U6_lWPrPu_sP1I6CUt0PyAi6XeOzup9GGqozAXXf9HgdA-1TLfUcCTX7M3fSVU9tf0X196GAATry86SXluMjPHOL4YRyF4_RPAl_s7HNiYRfwzPChs1OWQeE0BtM13Uxw1o6fQ1EBUvp6_Sz0tHjB8rd-_0ziMQ6GOMOruqen8",
  },
  {
    name: "Dr. Sophia Lee",
    role: "Head of AI Research",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDPQJnsBkimqJsFHJmvdt5ySUBkFpmaOwZGHB7dfw8ZqCYGKF3XdqY_JV1zTlvKape-5R3-MqsfoBLZTu62x6OZgCWeF_y1c41XycYj-2FmKBYXB82leOhm0ljFNpBeamLInZjjfmPihDSiRaf0fUvf_hDfSL4gRUWzkYHa2sD6nqbzkpTIq2_4HQY0A7T_oMX9wQ3oy2Wb7ioIiVKpYRv-1ixuDyZ-ew8ZknffrbfjUhEDGZCc54Cp4AACox7lrTlOy0O_jeVXUbc",
  },
];

/* ─── Section Eyebrow + Heading helper ──────────────────────────── */
const SectionHeading = ({ eyebrow, title }: { eyebrow: string; title: string }) => (
  <Box sx={{ pt: 6, pb: 2 }}>
    <Typography sx={{
      fontFamily: "Inter, sans-serif", fontSize: 11.5, fontWeight: 600,
      letterSpacing: 1.8, textTransform: "uppercase", color: tokens.violet, mb: 1,
    }}>
      {eyebrow}
    </Typography>
    <Typography sx={{
      fontFamily: "Plus Jakarta Sans, sans-serif", fontWeight: 800,
      fontSize: { xs: 22, md: 28 }, color: tokens.neutralDark,
    }}>
      {title}
    </Typography>
  </Box>
);

export default function AboutUs() {
  return (
    <Box sx={{
      fontFamily: '"Inter", sans-serif',
      bgcolor: tokens.bg,
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
    }}>
      <NavBar />

      {/* Hero */}
      <Box sx={{
        background: "linear-gradient(135deg, #F3EEFF 0%, #FAF8FF 60%, #EEF2FF 100%)",
        py: { xs: 7, md: 9 },
        px: { xs: 3, md: 10 },
        textAlign: "center",
        borderBottom: `1px solid ${tokens.borderPurple}`,
      }}>
        <Typography sx={{
          fontFamily: "Inter, sans-serif", fontSize: 12, fontWeight: 600,
          letterSpacing: 2, textTransform: "uppercase", color: tokens.violet, mb: 1.5,
        }}>
          About Us
        </Typography>
        <Typography sx={{
          fontFamily: "Plus Jakarta Sans, sans-serif", fontWeight: 800,
          fontSize: { xs: 32, md: 46 }, color: tokens.neutralDark,
          lineHeight: 1.15, mb: 2,
        }}>
          About{" "}
          <Box component="span" sx={{
            background: `linear-gradient(135deg, ${tokens.purple}, ${tokens.indigo})`,
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          }}>
            HealthAI.
          </Box>
        </Typography>
        <Typography sx={{
          fontFamily: "Inter, sans-serif", fontSize: { xs: 15, md: 16.5 },
          color: tokens.neutral, maxWidth: 640, mx: "auto", lineHeight: 1.75,
        }}>
          HealthAI is a cutting-edge platform designed to revolutionize hospital
          management through the integration of advanced AI models. Our mission
          is to empower healthcare providers with the tools they need to enhance
          efficiency, improve patient outcomes, and streamline operations.
        </Typography>
      </Box>

      <Container maxWidth="md" sx={{ flexGrow: 1, py: 2, px: { xs: 2, md: 10 } }}>

        {/* Mission Section */}
        <SectionHeading eyebrow="Our Purpose" title="Our Mission" />
        <Typography sx={{
          fontFamily: "Inter, sans-serif", color: tokens.neutral,
          fontWeight: 400, mb: 1, lineHeight: 1.75, fontSize: 15,
        }}>
          Our mission is to bridge the gap between healthcare and artificial
          intelligence, providing hospitals with seamless access to AI-driven
          solutions. We aim to foster a collaborative environment where
          healthcare professionals can leverage AI to make informed decisions,
          optimize resource allocation, and deliver exceptional patient care. By
          integrating our platform, hospitals can unlock new levels of
          efficiency and innovation, ultimately leading to better health
          outcomes for their communities.
        </Typography>

        {/* Meet the Team Section */}
        <SectionHeading eyebrow="The People" title="Meet the Team" />
        <Box sx={{
          display: "flex", flexWrap: "wrap", gap: 3, pb: 3,
          justifyContent: { xs: "center", md: "flex-start" },
        }}>
          {teamMembers.map(({ name, role, img }, i) => {
            const ringColors = [
              [tokens.purple, tokens.violet],
              [tokens.teal, "#5EEAD4"],
              [tokens.indigo, "#A5B4FC"],
            ];
            const [c1, c2] = ringColors[i % ringColors.length];
            return (
              <Box key={name} sx={{
                flex: "1 1 158px",
                maxWidth: { xs: "100%", sm: "calc(50% - 12px)", md: "calc(33.333% - 16px)" },
                minWidth: 158,
                display: "flex", flexDirection: "column", gap: 0.5,
                textAlign: "center", pb: 3, alignItems: "center",
              }}>
                <Box sx={{
                  p: "3px", borderRadius: "50%",
                  background: `linear-gradient(135deg, ${c1}, ${c2})`,
                  mb: 1.5, width: "100%", maxWidth: 158,
                }}>
                  <Box sx={{
                    width: "100%", aspectRatio: "1", borderRadius: "50%",
                    overflow: "hidden",
                    backgroundImage: `url(${img})`,
                    backgroundSize: "cover", backgroundPosition: "center",
                    border: `3px solid ${tokens.surface}`,
                  }} />
                </Box>
                <Typography sx={{
                  fontFamily: "Plus Jakarta Sans, sans-serif",
                  fontWeight: 700, fontSize: 15, color: tokens.neutralDark,
                }}>
                  {name}
                </Typography>
                <Typography sx={{
                  fontFamily: "Inter, sans-serif", fontSize: 13, color: c1,
                  fontWeight: 600,
                }}>
                  {role}
                </Typography>
              </Box>
            );
          })}
        </Box>

        {/* Contact Us Section */}
        <SectionHeading eyebrow="Get In Touch" title="Contact Us" />
        <Typography sx={{
          fontFamily: "Inter, sans-serif", color: tokens.neutral,
          fontWeight: 400, mb: 3, lineHeight: 1.75, fontSize: 15,
        }}>
          We'd love to hear from you! Whether you have questions about our
          platform, need support, or want to explore partnership opportunities,
          please reach out to us. Our team is dedicated to providing exceptional
          service and support to help you achieve your goals.
        </Typography>

        <Box
          component="form"
          noValidate
          autoComplete="off"
          sx={{
            display: "flex", flexWrap: "wrap", gap: 2,
            maxWidth: 480, py: 1, pb: 6, alignItems: "flex-end",
          }}
        >
          <TextField
            fullWidth
            placeholder="Your Email"
            variant="outlined"
            size="medium"
            sx={{
              bgcolor: tokens.surface,
              borderRadius: 2,
              "& .MuiOutlinedInput-root": { height: 52, borderRadius: "10px" },
              "& input": { color: tokens.neutralDark, padding: "15px", fontFamily: "Inter" },
              "& .MuiOutlinedInput-notchedOutline": { borderColor: tokens.borderPurple },
              "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: tokens.violet },
              "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: tokens.purple, borderWidth: "1.5px" },
              "& input::placeholder": { color: tokens.neutral, opacity: 1 },
            }}
          />
          <Button
            type="submit"
            variant="contained"
            disableElevation
            sx={{
              minWidth: 110,
              bgcolor: tokens.purple,
              color: "#fff",
              fontFamily: "Inter",
              fontWeight: 600,
              fontSize: "0.875rem",
              textTransform: "none",
              borderRadius: "10px",
              height: 52,
              px: 3.5,
              whiteSpace: "nowrap",
              boxShadow: `0 4px 14px ${tokens.purple}33`,
              "&:hover": {
                bgcolor: tokens.purpleMid,
                boxShadow: `0 6px 18px ${tokens.purple}44`,
                transform: "translateY(-1px)",
                transition: "all 0.2s ease",
              },
            }}
          >
            Submit
          </Button>
        </Box>
      </Container>

      <Footer />
    </Box>
  );
}