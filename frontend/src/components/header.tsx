import React, { useState } from "react";
import {
  AppBar,
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
  useMediaQuery,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useTheme } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";

const NavBar = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [drawerOpen, setDrawerOpen] = useState(false);

  const navItems: { label: string; path: string }[] = [
    { label: "Home", path: "/" },
    { label: "About", path: "/aboutUs" },
    { label: "Login", path: "/login" },
    { label: "Signin", path: "/register" },
  ];

  const handleNavigation = (path: string) => {
    navigate(path);
    setDrawerOpen(false); // Close drawer on selection
  };

  return (
    <Box position="static" sx={{ backgroundColor: "#ffffff", color: "black" }}>
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
            <IconButton edge="end" color="inherit" onClick={() => setDrawerOpen(true)}>
              <MenuIcon />
            </IconButton>
            <Drawer anchor="right" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
              <Box sx={{ width: 250 }} role="presentation">
                <List>
                  {navItems.map((item) => (
                    <ListItem key={item.label} disablePadding>
                      <ListItemButton onClick={() => handleNavigation(item.path)}>
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
                </List>
              </Box>
            </Drawer>
          </>
        ) : (
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            {navItems.map((item) => (
              <Button key={item.label} color="inherit" onClick={() => navigate(item.path)}>
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
          </Box>
        )}
      </Toolbar>
    </Box>
  );
};

export default NavBar;
