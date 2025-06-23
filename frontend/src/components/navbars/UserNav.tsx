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
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import MenuIcon from "@mui/icons-material/Menu";
import { useNavigate } from "react-router-dom";
import { useAvatar } from "../../hooks/AvtarContex";

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

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <Box position="static" sx={{ bgcolor: "#ffffff", color: "black" }}>
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        <Typography
          variant="h6"
          component="div"
          sx={{
            fontWeight: "bold",
            fontSize: "30px",
            cursor: "pointer",
          }}
          onClick={() => navigate("/")}
        >
          Jacsto
        </Typography>

        {isMobile ? (
          <>
            <IconButton color="inherit" onClick={() => setDrawerOpen(true)}>
              <MenuIcon />
            </IconButton>
            <Drawer
              anchor="right"
              open={drawerOpen}
              onClose={() => setDrawerOpen(false)}
            >
              <Box sx={{ width: 250 }} role="presentation">
                <List>
                  {navItems.map((item) => (
                    <ListItem key={item.label} disablePadding>
                      <ListItemButton onClick={() => navigate(item.path)}>
                        <ListItemText primary={item.label} />
                      </ListItemButton>
                    </ListItem>
                  ))}
                  <ListItem>
                    <Button
                      variant="contained"
                      sx={{
                        bgcolor: "red",
                        borderRadius: "20px",
                        fontWeight: "bold",
                        textTransform: "none",
                        width: "100%",
                      }}
                      onClick={() => navigate("/chat")}
                    >
                      AI
                    </Button>
                  </ListItem>
                  <ListItem>
                    <Button
                      variant="outlined"
                      color="error"
                      fullWidth
                      onClick={handleLogout}
                    >
                      Logout
                    </Button>
                  </ListItem>
                </List>
              </Box>
            </Drawer>
          </>
        ) : (
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            {navItems.map((item) => (
              <Button
                key={item.label}
                color="inherit"
                onClick={() => navigate(item.path)}
              >
                {item.label}
              </Button>
            ))}

            <Button
              variant="contained"
              sx={{
                bgcolor: "red",
                borderRadius: "20px",
                fontWeight: "bold",
                textTransform: "none",
              }}
              onClick={() => navigate("/chat")}
            >
              AI
            </Button>

            <IconButton onClick={handleMenuClick}>
              <Avatar src={avatar} />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
            >
              <MenuItem onClick={() => navigate("/profile")}>Profile</MenuItem>
              <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </Menu>
          </Box>
        )}
      </Toolbar>
    </Box>
  );
};

export default UserNavBar;
