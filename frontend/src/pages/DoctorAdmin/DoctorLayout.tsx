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
import AppointmentTable from "./appointments";

const DoctorPanelLayout = () => {
  const [selectedSection, setSelectedSection] = useState("appointment");
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const renderContent = () => {
    switch (selectedSection) {
      case "appointment":
        return <AppointmentTable />;
      default:
        return (
          <Box textAlign="center" mt={5}>
            <Typography variant="h6" color="text.secondary">
              Section not found
            </Typography>
          </Box>
        );
    }
  };

  const sections = [
    { key: "appointment", label: "Appointment" },
    // Add more sections as needed
  ];

  return (
    <>
      <NavBar />
      <Box
        display="flex"
        flexDirection={isMobile ? "column" : "row"}
        height="100vh"
      >
        {/* Sidebar */}
        <Box
          width={isMobile ? "100%" : "20%"}
          bgcolor="#f5f5f5"
          p={2}
          borderRight={isMobile ? "none" : "1px solid #ddd"}
          sx={!isMobile ? { position: "sticky", top: 0, height: "100vh" } : {}}
        >
          <Typography variant="h6" mb={2} fontWeight="bold">
            Doctor Panel
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
                    selectedSection === section.key
                      ? "#e0e0e0"
                      : "transparent",
                  fontWeight:
                    selectedSection === section.key ? "bold" : "normal",
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

export default DoctorPanelLayout;
