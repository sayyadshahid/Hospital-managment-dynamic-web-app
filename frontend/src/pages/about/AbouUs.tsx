import React from "react";
import {
  Box,
  Typography,
  Button,
  Link,
  TextField,
  Container,
} from "@mui/material";
import NavBar from "../../components/header";
// Team data
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

export default function AboutUs() {
  return (
    <Box
      sx={{
        fontFamily: '"Public Sans", "Noto Sans", sans-serif',
        bgcolor: "#f9fafb",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Header */}

      <NavBar />
      {/* Main Content */}
      <Container
        maxWidth="md"
        sx={{ flexGrow: 1, py: 5, px: { xs: 2, md: 10 } }}
      >
        {/* About Section */}
        <Box sx={{ mb: 3, px: 2 }}>
          <Typography
            variant="h3"
            sx={{
              fontWeight: 700,
              fontSize: { xs: "2rem", md: "2.25rem" },
              letterSpacing: "-0.015em",
              color: "#101618",
              minWidth: 288,
              lineHeight: 1.1,
            }}
          >
            About HealthAI
          </Typography>
        </Box>
        <Typography
          variant="body1"
          sx={{
            color: "#101618",
            fontWeight: 400,
            mb: 3,
            px: 2,
            lineHeight: 1.5,
          }}
        >
          HealthAI is a cutting-edge platform designed to revolutionize hospital
          management through the integration of advanced AI models. Our mission
          is to empower healthcare providers with the tools they need to enhance
          efficiency, improve patient outcomes, and streamline operations. We
          believe in the power of technology to transform healthcare, making it
          more accessible, affordable, and effective for everyone.
        </Typography>

        {/* Mission Section */}
        <Typography
          variant="h5"
          sx={{
            fontWeight: 700,
            fontSize: "1.375rem",
            letterSpacing: "-0.015em",
            color: "#101618",
            pt: 5,
            pb: 1,
            px: 2,
          }}
        >
          Our Mission
        </Typography>
        <Typography
          variant="body1"
          sx={{
            color: "#101618",
            fontWeight: 400,
            mb: 3,
            px: 2,
            lineHeight: 1.5,
          }}
        >
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
        <Typography
          variant="h5"
          sx={{
            fontWeight: 700,
            fontSize: "1.375rem",
            letterSpacing: "-0.015em",
            color: "#101618",
            pt: 5,
            pb: 1,
            px: 2,
          }}
        >
          Meet the Team
        </Typography>
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 3,
            px: 2,
            pb: 3,
            justifyContent: { xs: "center", md: "flex-start" },
          }}
        >
          {teamMembers.map(({ name, role, img }) => (
            <Box
              key={name}
              sx={{
                flex: "1 1 158px",
                maxWidth: {
                  xs: "100%",
                  sm: "calc(50% - 12px)",
                  md: "calc(33.333% - 16px)",
                },
                minWidth: 158,
                display: "flex",
                flexDirection: "column",
                gap: 1,
                textAlign: "center",
                pb: 3,
                alignItems: "center",
              }}
            >
              <Box
                sx={{
                  width: "100%",
                  maxWidth: 158,
                  aspectRatio: "1",
                  borderRadius: "50%",
                  overflow: "hidden",
                  backgroundImage: `url(${img})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  mb: 1.5,
                }}
              />
              <Typography
                variant="body1"
                sx={{ fontWeight: 500, color: "#101618" }}
              >
                {name}
              </Typography>
              <Typography variant="body2" sx={{ color: "#5c7e8a" }}>
                {role}
              </Typography>
            </Box>
          ))}
        </Box>

        {/* Contact Us Section */}
        <Typography
          variant="h5"
          sx={{
            fontWeight: 700,
            fontSize: "1.375rem",
            letterSpacing: "-0.015em",
            color: "#101618",
            pt: 5,
            pb: 1,
            px: 2,
          }}
        >
          Contact Us
        </Typography>
        <Typography
          variant="body1"
          sx={{
            color: "#101618",
            fontWeight: 400,
            mb: 3,
            px: 2,
            lineHeight: 1.5,
          }}
        >
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
            display: "flex",
            flexWrap: "wrap",
            gap: 2,
            maxWidth: 480,
            px: 2,
            py: 1,
            alignItems: "flex-end",
          }}
        >
          <TextField
            fullWidth
            placeholder="Your Email"
            variant="outlined"
            size="medium"
            sx={{
              bgcolor: "#f9fafb",
              borderRadius: 2,
              "& .MuiOutlinedInput-root": {
                height: 56,
                paddingRight: 0,
              },
              "& input": {
                color: "#101618",
                padding: "15px",
              },
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: "#d4dfe2",
              },
              "&:hover .MuiOutlinedInput-notchedOutline": {
                borderColor: "#d4dfe2",
              },
              "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                borderColor: "#d4dfe2",
              },
              "& input::placeholder": {
                color: "#5c7e8a",
              },
            }}
          />
          <Button
            type="submit"
            variant="contained"
            sx={{
              minWidth: 84,
              maxWidth: 480,
              bgcolor: "#b2d8e5",
              color: "#101618",
              fontWeight: 700,
              fontSize: "0.875rem",
              textTransform: "none",
              borderRadius: "9999px",
              height: 40,
              px: 4,
              whiteSpace: "nowrap",
              boxShadow: "none",
              "&:hover": { bgcolor: "#a0c9d9", boxShadow: "none" },
            }}
          >
            Submit
          </Button>
        </Box>
      </Container>

      {/* Footer */}
      <Box
        component="footer"
        sx={{
          bgcolor: "background.paper",
          py: 10,
          px: 5,
          textAlign: "center",
          mt: "auto",
        }}
      >
        <Box
          sx={{
            maxWidth: 960,
            mx: "auto",
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            justifyContent: { sm: "space-around" },
            gap: 3,
            flexWrap: "wrap",
            alignItems: "center",
          }}
        >
          <Link
            href="#"
            underline="none"
            sx={{
              color: "#5c7e8a",
              fontSize: "1rem",
              fontWeight: 400,
              minWidth: 160,
              "&:hover": { textDecoration: "underline" },
            }}
          >
            Privacy Policy
          </Link>
          <Link
            href="#"
            underline="none"
            sx={{
              color: "#5c7e8a",
              fontSize: "1rem",
              fontWeight: 400,
              minWidth: 160,
              "&:hover": { textDecoration: "underline" },
            }}
          >
            Terms of Service
          </Link>
        </Box>
        <Typography variant="body2" sx={{ color: "#5c7e8a", mt: 4 }}>
          ©2024 HealthAI. All rights reserved.
        </Typography>
      </Box>
    </Box>
  );
}
