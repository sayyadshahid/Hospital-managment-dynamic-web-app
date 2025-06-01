import { AppBar, Toolbar, Typography, Box, Divider } from "@mui/material";

const Footer = () => {
  return (
    <Box sx={{ textAlign: "center", mt: 4, color: "text.secondary" }}>
      <Divider sx={{ mb: 2 }} />
      <Typography variant="body2">
        ©2025 Health. All rights reserved.
      </Typography>
      <Box sx={{ mt: 1, display: "flex", justifyContent: "center", gap: 3 }}>
        <Typography variant="body2" sx={{ cursor: "pointer" }}>
          Contact
        </Typography>
        <Typography variant="body2" sx={{ cursor: "pointer" }}>
          Privacy Policy
        </Typography>
        <Typography variant="body2" sx={{ cursor: "pointer" }}>
          Terms of Service
        </Typography>
      </Box>
    </Box>
  );
};


export default Footer;