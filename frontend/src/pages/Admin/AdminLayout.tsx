import React, { useState } from "react";
import {
  Box,
  Typography,
  Stack,
  Divider,
  useTheme,
  useMediaQuery,
  Paper,
} from "@mui/material";
import NavBar from "../../components/header";
import UserTable from "./user";
import DoctorTable from "./doctor";
import HospitalTable from "./hospitals";
import ReviewTable from "./reviews";
import AppointmentTable from "./appointment";

const AdminPanelLayout = () => {
  const [selectedSection, setSelectedSection] = useState("users");
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const renderContent = () => {
    switch (selectedSection) {
      case "hospitals":
        return <HospitalTable />;
      case "users":
        return <UserTable />;
      case "doctors":
        return <DoctorTable />;
      case "reviews":
        return <ReviewTable />;
      case "appointments":
        return <AppointmentTable />;
      default:
        return <Typography>Section not found</Typography>;
    }
  };

  const sections = [
    { key: "users", label: "Users" },
    { key: "doctors", label: "Doctors" },
    { key: "hospitals", label: "Hospitals" },
    { key: "reviews", label: "Reviews" },
    { key: "appointments", label: "Appointments" },
  ];

  return (
    <>
      <NavBar />
      <Box display="flex" flexDirection={isMobile ? "column" : "row"} height="100vh">
        {/* Sidebar */}
        <Box
          width={isMobile ? "100%" : "20%"}
          bgcolor="#f5f5f5"
          p={2}
          borderRight={isMobile ? "none" : "1px solid #ddd"}
        >
          <Typography variant="h6" mb={2} fontWeight="bold">
            Admin Panel
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Stack spacing={1}>
            {sections.map((section) => (
              <Paper
                key={section.key}
                elevation={selectedSection === section.key ? 3 : 0}
                sx={{
                  p: 1,
                  cursor: "pointer",
                  backgroundColor:
                    selectedSection === section.key ? "#e0e0e0" : "transparent",
                  fontWeight: selectedSection === section.key ? "bold" : "normal",
                  "&:hover": {
                    backgroundColor: "#eeeeee",
                  },
                }}
                onClick={() => setSelectedSection(section.key)}
              >
                {section.label}
              </Paper>
            ))}
          </Stack>
        </Box>

        {/* Content */}
        <Box
          width={isMobile ? "100%" : "80%"}
          p={2}
          overflow="auto"
          sx={{ backgroundColor: "#fafafa" }}
        >
          {renderContent()}
        </Box>
      </Box>
    </>
  );
};

export default AdminPanelLayout;
