import React, { useState } from "react";
import { Box, Typography, Stack, Divider, useTheme, useMediaQuery } from "@mui/material";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import MedicalServicesOutlinedIcon from "@mui/icons-material/MedicalServicesOutlined";
import LocalHospitalOutlinedIcon from "@mui/icons-material/LocalHospitalOutlined";
import StarOutlineRoundedIcon from "@mui/icons-material/StarOutlineRounded";
import EventNoteOutlinedIcon from "@mui/icons-material/EventNoteOutlined";
import NavBar from "../../components/header";
import UserTable from "./user";
import DoctorTable from "./doctor";
import HospitalTable from "./hospitals";
import ReviewTable from "./reviews";
import AppointmentTable from "./appointment";

/* ─── Design Tokens ─────────────────────────────────────────────── */
const tokens = {
  bg: "#FAF8FF",
  purple: "#7C3AED",
  purpleMid: "#6D28D9",
  purpleLight: "#EDE9FE",
  violet: "#8B5CF6",
  indigo: "#4F46E5",
  neutral: "#6B7280",
  neutralDark: "#1F1635",
  surface: "#FFFFFF",
  borderPurple: "#DDD6FE",
};

const sections = [
  { key: "users", label: "Users", Icon: PeopleAltOutlinedIcon },
  { key: "doctors", label: "Doctors", Icon: MedicalServicesOutlinedIcon },
  { key: "hospitals", label: "Hospitals", Icon: LocalHospitalOutlinedIcon },
  { key: "reviews", label: "Reviews", Icon: StarOutlineRoundedIcon },
  { key: "appointments", label: "Appointments", Icon: EventNoteOutlinedIcon },
];

const AdminPanelLayout = () => {
  const [selectedSection, setSelectedSection] = useState("users");
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const renderContent = () => {
    switch (selectedSection) {
      case "hospitals": return <HospitalTable />;
      case "users": return <UserTable />;
      case "doctors": return <DoctorTable />;
      case "reviews": return <ReviewTable />;
      case "appointments": return <AppointmentTable />;
      default: return <Typography>Section not found</Typography>;
    }
  };

  return (
    <>
      <NavBar />
      <Box display="flex" flexDirection={isMobile ? "column" : "row"} minHeight="100vh" bgcolor={tokens.bg}>

        {/* Sidebar */}
        <Box
          width={isMobile ? "100%" : 260}
          flexShrink={0}
          bgcolor={tokens.surface}
          borderRight={isMobile ? "none" : `1px solid ${tokens.borderPurple}`}
          borderBottom={isMobile ? `1px solid ${tokens.borderPurple}` : "none"}
          p={2.5}
        >
          <Typography sx={{
            fontFamily: "Plus Jakarta Sans, sans-serif",
            fontWeight: 800, fontSize: 19,
            color: tokens.neutralDark, mb: 0.3,
          }}>
            Admin Panel
          </Typography>
          <Typography sx={{
            fontFamily: "Inter, sans-serif", fontSize: 12.5,
            color: tokens.neutral, mb: 2.5,
          }}>
            Manage your platform
          </Typography>

          <Divider sx={{ mb: 2, borderColor: tokens.borderPurple }} />

          <Stack spacing={0.5}>
            {sections.map((section) => {
              const active = selectedSection === section.key;
              const Icon = section.Icon;
              return (
                <Box
                  key={section.key}
                  onClick={() => setSelectedSection(section.key)}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                    px: 1.8,
                    py: 1.2,
                    borderRadius: "10px",
                    cursor: "pointer",
                    bgcolor: active ? tokens.purpleLight : "transparent",
                    transition: "all 0.18s ease",
                    "&:hover": {
                      bgcolor: active ? tokens.purpleLight : "#F4F2FF",
                    },
                  }}
                >
                  <Icon sx={{ fontSize: 19, color: active ? tokens.purple : tokens.neutral }} />
                  <Typography sx={{
                    fontFamily: "Inter, sans-serif",
                    fontSize: 14,
                    fontWeight: active ? 700 : 500,
                    color: active ? tokens.purple : tokens.neutralDark,
                  }}>
                    {section.label}
                  </Typography>
                  {active && (
                    <Box sx={{
                      ml: "auto", width: 6, height: 6,
                      borderRadius: "50%", bgcolor: tokens.purple,
                    }} />
                  )}
                </Box>
              );
            })}
          </Stack>
        </Box>

        {/* Content */}
        <Box
          flex={1}
          p={{ xs: 2.5, md: 3.5 }}
          overflow="auto"
          sx={{ bgcolor: tokens.bg }}
        >
          {renderContent()}
        </Box>
      </Box>
    </>
  );
};

export default AdminPanelLayout;