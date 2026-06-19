import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Box,
  Menu,
  MenuItem,
  Avatar,
  useMediaQuery,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Divider,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import MenuIcon from "@mui/icons-material/Menu";
import { useNavigate } from "react-router-dom";
import { useAvatar } from "../../hooks/AvtarContex";

/* ─── Design Tokens ─────────────────────────────────────────────── */
const tokens = {
  bg: "#FAF8FF",
  purple: "#7C3AED",
  purpleMid: "#6D28D9",
  purpleLight: "#EDE9FE",
  violet: "#8B5CF6",
  violetLight: "#DDD6FE",
  indigo: "#4F46E5",
  neutral: "#6B7280",
  neutralDark: "#1F1635",
  surface: "#FFFFFF",
  borderPurple: "#DDD6FE",
};

const UserNavBar = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { avatar } = useAvatar();
  const role = JSON.parse(localStorage.getItem("user") || "{}").role;

  const baseNavItems = [
    { label: "About", path: "/aboutUs" },
    { label: "Dashboard", path: "/" },
    { label: "Appointments", path: "/report-details" },
  ];

  let navItems = baseNavItems;
  if (role === "admin") {
    navItems = [{ label: "Admin Panel", path: "/admin" }, ...baseNavItems];
  } else if (role === "doctor") {
    navItems = [{ label: "Doctor Panel", path: "/doctor" }, ...baseNavItems];
  }

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => setAnchorEl(null);
  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <Box
      sx={{
        bgcolor: tokens.surface,
        borderBottom: `1px solid ${tokens.borderPurple}`,
        position: "sticky",
        top: 0,
        zIndex: 100,
        boxShadow: "0 2px 16px rgba(124,58,237,0.06)",
      }}
    >
      <Toolbar sx={{ display: "flex", justifyContent: "space-between", px: { xs: 2, md: 4 } }}>

        {/* Logo */}
        <Typography
          onClick={() => navigate("/")}
          sx={{
            fontFamily: "Plus Jakarta Sans, sans-serif",
            fontWeight: 800,
            fontSize: 26,
            cursor: "pointer",
            background: `linear-gradient(135deg, ${tokens.purple}, ${tokens.indigo})`,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
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
                  fontFamily: "Inter, sans-serif",
                  fontWeight: 500,
                  fontSize: 14,
                  color: tokens.neutral,
                  textTransform: "none",
                  borderRadius: "8px",
                  px: 1.8,
                  "&:hover": {
                    bgcolor: tokens.bg,
                    color: "#000",
                  },
                }}
              >
                {item.label}
              </Button>
            ))}

            {/* AI Button */}
            <Button
              variant="contained"
              onClick={() => navigate("/chat")}
              disableElevation
              sx={{
                ml: 1,
                bgcolor: tokens.purple,
                fontFamily: "Inter",
                fontWeight: 600,
                fontSize: 13,
                textTransform: "none",
                borderRadius: "8px",
                px: 2,
                py: 0.8,
                boxShadow: `0 3px 12px ${tokens.purple}33`,
                "&:hover": {
                  bgcolor: tokens.purpleMid,
                  transform: "translateY(-1px)",
                  transition: "all 0.2s ease",
                },
              }}
            >
              ✨ AI
            </Button>

            {/* Avatar + Menu */}
            <IconButton onClick={handleMenuClick} sx={{ ml: 0.5, p: 0.5 }}>
              <Box sx={{
                p: "2px", borderRadius: "50%",
                background: `linear-gradient(135deg, ${tokens.purple}, ${tokens.indigo})`,
              }}>
                <Avatar
                  src={avatar}
                  sx={{ width: 34, height: 34 }}
                />
              </Box>
            </IconButton>

            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              PaperProps={{
                sx: {
                  mt: 1, borderRadius: "12px",
                  border: `1px solid ${tokens.borderPurple}`,
                  boxShadow: "0 8px 24px rgba(124,58,237,0.12)",
                  minWidth: 160,
                },
              }}
            >
              <MenuItem
                onClick={() => { navigate("/profile"); handleMenuClose(); }}
                sx={{ fontFamily: "Inter", fontSize: 14, color: tokens.neutralDark, borderRadius: "8px", mx: 0.5 }}
              >
                👤 &nbsp; Profile
              </MenuItem>
              <Divider sx={{ my: 0.5, borderColor: tokens.borderPurple }} />
              <MenuItem
                onClick={handleLogout}
                sx={{ fontFamily: "Inter", fontSize: 14, color: "#DC2626", borderRadius: "8px", mx: 0.5 }}
              >
                🚪 &nbsp; Logout
              </MenuItem>
            </Menu>
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
                  width: 260,
                  bgcolor: tokens.surface,
                  borderLeft: `1px solid ${tokens.borderPurple}`,
                },
              }}
            >
              {/* Drawer Header */}
              <Box sx={{
                px: 3, py: 2.5,
                borderBottom: `1px solid ${tokens.borderPurple}`,
                display: "flex", alignItems: "center", gap: 1.5,
              }}>
                <Box sx={{
                  p: "2px", borderRadius: "50%",
                  background: `linear-gradient(135deg, ${tokens.purple}, ${tokens.indigo})`,
                }}>
                  <Avatar src={avatar} sx={{ width: 36, height: 36 }} />
                </Box>
                <Typography sx={{
                  fontFamily: "Plus Jakarta Sans", fontWeight: 700,
                  fontSize: 15, color: tokens.neutralDark,
                }}>
                  My Account
                </Typography>
              </Box>

              <List sx={{ px: 1, pt: 1.5 }}>
                {navItems.map((item) => (
                  <ListItem key={item.label} disablePadding sx={{ mb: 0.5 }}>
                    <ListItemButton
                      onClick={() => { navigate(item.path); setDrawerOpen(false); }}
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

                <ListItem disablePadding sx={{ mb: 1 }}>
                  <Button
                    fullWidth variant="contained" disableElevation
                    onClick={() => { navigate("/chat"); setDrawerOpen(false); }}
                    sx={{
                      bgcolor: tokens.purple, fontFamily: "Inter",
                      fontWeight: 600, textTransform: "none",
                      borderRadius: "10px", py: 1,
                      "&:hover": { bgcolor: tokens.purpleMid },
                    }}
                  >
                    ✨ AI
                  </Button>
                </ListItem>

                <ListItem disablePadding>
                  <Button
                    fullWidth variant="outlined" disableElevation
                    onClick={handleLogout}
                    sx={{
                      borderColor: "#FCA5A5", color: "#DC2626",
                      fontFamily: "Inter", fontWeight: 600,
                      textTransform: "none", borderRadius: "10px", py: 1,
                      "&:hover": { bgcolor: "#FEF2F2", borderColor: "#DC2626" },
                    }}
                  >
                    Logout
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

export default UserNavBar;