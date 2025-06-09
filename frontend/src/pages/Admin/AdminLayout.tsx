import React, { useState } from "react";
import { Box, Typography, Stack } from "@mui/material";
import NavBar from "../../components/header";
import UserTable from "./user";
import DoctorTable from "./doctor";
import HospitalTable from "./hospitals";
import ReviewTable from "./reviews";

const AdminPanelLayout = () => {
  const [selectedSection, setSelectedSection] = useState("users");

  return (
    <>
      <NavBar />
      <Box display="flex" height="100vh">
        {/* Sidebar */}
        <Box width="20%" bgcolor="#f0f0f0" p={2}>
          <Stack spacing={2}>
            {["users", "doctors", "hospitals", 'reviews'].map((section) => (
              <Typography
                key={section}
                onClick={() => setSelectedSection(section)}
                sx={{
                  p: 1,
                  borderRadius: 1,
                  cursor: "pointer",
                  bgcolor:
                    selectedSection === section ? "#cacaca" : "transparent",
                  color: selectedSection === section ? "black" : "gray",
                  fontWeight: selectedSection === section ? "bold" : "normal",
                  "&:hover": {
                    bgcolor: "white",
                  },
                }}
              >
                {section.charAt(0).toUpperCase() + section.slice(1)}
              </Typography>
            ))}
          </Stack>
        </Box>

        {/* Content Area */}
        <Box width="80%" p={2}>
          {selectedSection === "hospitals" && <HospitalTable />}
          {selectedSection === "users" && <UserTable />}
          {selectedSection === "doctors" && <DoctorTable />}
          {selectedSection === "reviews" && <ReviewTable />}

        </Box>
      </Box>
    </>
  );
};

export default AdminPanelLayout;
