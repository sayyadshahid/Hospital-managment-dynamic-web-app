import React from 'react';
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Paper,
  InputBase,
  Button,
  Stack,
  Avatar,
  useTheme,
  ThemeProvider,
  createTheme,
} from '@mui/material';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import SendIcon from '@mui/icons-material/Send';
import BuildIcon from '@mui/icons-material/Build';
import NavBar from '../../components/header';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: '#ffffff',
      paper: '#222',
    },
    primary: {
      main: '#e70d0d',
    },
  },
});

export default function ChatUI() {
  const theme = useTheme();

  return (

    <ThemeProvider theme={darkTheme}>
      <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
        {/* Header */}
        <AppBar position="static" color="transparent" elevation={0}>
        <NavBar/>
           
        </AppBar>

        {/* Main Content */}
        <Box sx={{ p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Paper
            elevation={3}
            sx={{
              
            }}
          >
            <Typography variant="body1">

            </Typography>
          </Paper>
        </Box>

        {/* Input Area */}
        <Box
          sx={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            width: '100%',
            bgcolor: 'background.default',
            py: 2,
            px: { xs: 2, sm: 8 },
          }}
        >
          <Paper
            component="form"
            sx={{
              p: '2px 8px',
              display: 'flex',
              alignItems: 'center',
              borderRadius: 4,
              bgcolor: '#222',
              boxShadow: 3,
              maxWidth: 600,
              mx: 'auto',
            }}
          >
            <InputBase
              sx={{ ml: 1, flex: 1, color: '#fff' }}
              placeholder="Type your message..."
              inputProps={{ 'aria-label': 'type your message' }}
            />
            <Button
              startIcon={<BuildIcon />}
              sx={{ mr: 1, color: '#fff', textTransform: 'none' }}
            >
              Tools
            </Button>
            <IconButton type="submit" sx={{ color: '#90caf9' }} aria-label="send">
              <SendIcon />
            </IconButton>
          </Paper>
        </Box>
      </Box>
    </ThemeProvider>
  );
}
