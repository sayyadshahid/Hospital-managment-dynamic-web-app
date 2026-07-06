import React, { useState } from "react";
import {
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
  Divider,
  useMediaQuery,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import AutoAwesomeRoundedIcon from "@mui/icons-material/AutoAwesomeRounded";
import { useTheme } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";

/* ─── Design Tokens ─────────────────────────────────────────────── */
const tokens = {
  purple: "#7C3AED",
  purpleMid: "#6D28D9",
  purpleLight: "#f5f3fd",
  violet: "#8B5CF6",
  indigo: "#4F46E5",
  neutral: "#6B7280",
  neutralDark: "#1F1635",
  surface: "#FFFFFF",
  borderPurple: "#DDD6FE",
};

const navItems = [
  { label: "Home", path: "/" },
  { label: "About", path: "/aboutUs" },
  { label: "Login", path: "/login" },
  { label: "Signup", path: "/register" },
];

const GuestNavBar = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleNavigation = (path: string) => {
    navigate(path);
    setDrawerOpen(false);
  };

  return (
    <Box sx={{
      bgcolor: tokens.surface,
      borderBottom: `1px solid ${tokens.borderPurple}`,
      position: "sticky", top: 0, zIndex: 100,
      boxShadow: "0 2px 16px rgba(124,58,237,0.06)",
    }}>
      <Toolbar sx={{ display: "flex", justifyContent: "space-between", px: { xs: 2, md: 4 } }}>

        {/* Logo */}
        <Typography
          onClick={() => navigate("/")}
          sx={{
            fontFamily: "Plus Jakarta Sans, sans-serif",
            fontWeight: 800, fontSize: 26, cursor: "pointer",
            background: `linear-gradient(135deg, ${tokens.purple}, ${tokens.indigo})`,
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            letterSpacing: -0.5,
          }}
        >
          Jacsto
        </Typography>

        {/* Desktop Nav */}
        {!isMobile && (
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            {navItems.map((item) => (
              <Button
                key={item.label}
                onClick={() => navigate(item.path)}
                sx={{
                  fontFamily: "Inter, sans-serif", fontWeight: 500, fontSize: 14,
                  color: tokens.neutral, textTransform: "none", borderRadius: "8px", px: 1.8,
                  "&:hover": { bgcolor: tokens.purpleLight, color:"#000" },
                }}
              >
                {item.label}
              </Button>
            ))}

            <Button
              variant="contained"
              onClick={() => navigate("/chat")}
              disableElevation
              sx={{
                ml: 1, bgcolor: tokens.purple,
                fontFamily: "Inter", fontWeight: 600, fontSize: 13,
                textTransform: "none", borderRadius: "8px", px: 2, py: 0.8,
                boxShadow: `0 3px 12px ${tokens.purple}33`,
                "&:hover": {
                  bgcolor: tokens.purpleMid,
                  transform: "translateY(-1px)",
                  transition: "all 0.2s ease",
                },
              }}
            >
              <AutoAwesomeRoundedIcon sx={{ fontSize: 15, mr: 0.5 }} /> AI
            </Button>
          </Box>
        )}

        {/* Mobile Hamburger */}
        {isMobile && (
          <>
            <IconButton onClick={() => setDrawerOpen(true)} sx={{ color: tokens.purple }}>
              <MenuIcon />
            </IconButton>

            <Drawer
              anchor="right"
              open={drawerOpen}
              onClose={() => setDrawerOpen(false)}
              PaperProps={{
                sx: {
                  width: 260, bgcolor: tokens.surface,
                  borderLeft: `1px solid ${tokens.borderPurple}`,
                },
              }}
            >
              {/* Drawer Header */}
              <Box sx={{
                px: 3, py: 2.5,
                borderBottom: `1px solid ${tokens.borderPurple}`,
              }}>
                <Typography sx={{
                  fontFamily: "Plus Jakarta Sans, sans-serif", fontWeight: 800, fontSize: 20,
                  background: `linear-gradient(135deg, ${tokens.purple}, ${tokens.indigo})`,
                  WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                }}>
                  Jacsto
                </Typography>
              </Box>

              <List sx={{ px: 1, pt: 1.5 }}>
                {navItems.map((item) => (
                  <ListItem key={item.label} disablePadding sx={{ mb: 0.5 }}>
                    <ListItemButton
                      onClick={() => handleNavigation(item.path)}
                      sx={{
                        borderRadius: "10px",
                        "&:hover": { bgcolor: tokens.purpleLight },
                      }}
                    >
                      <ListItemText
                        primary={item.label}
                        primaryTypographyProps={{
                          fontFamily: "Inter", fontSize: 14,
                          fontWeight: 500, color: tokens.neutralDark,
                        }}
                      />
                    </ListItemButton>
                  </ListItem>
                ))}

                <Divider sx={{ my: 1.5, borderColor: tokens.borderPurple }} />

                <ListItem disablePadding>
                  <Button
                    fullWidth variant="contained" disableElevation
                    onClick={() => handleNavigation("/chat")}
                    sx={{
                      bgcolor: tokens.purple, fontFamily: "Inter",
                      fontWeight: 600, textTransform: "none",
                      borderRadius: "10px", py: 1,
                      "&:hover": { bgcolor: tokens.purpleMid, },
                    }}
                  >
                    <AutoAwesomeRoundedIcon sx={{ fontSize: 15, mr: 0.5 }} /> AI
                  </Button>
                </ListItem>
              </List>
            </Drawer>
          </>
        )}
      </Toolbar>
    </Box>
  );
};

export default GuestNavBar;