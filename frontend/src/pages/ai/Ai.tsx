import React, { useState } from "react";
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  Paper,
  InputBase,
  IconButton,
  CircularProgress,
  Divider,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import API from "../../components/configs/API";
import NavBar from "../../components/header";

type Message = {
  sender: "user" | "ai";
  text: string;
};

export default function ChatUI() {
  const [prompt, setPrompt] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const name = JSON.parse(localStorage.getItem("user") || "{}").fullname;


  const getGeminiResponse = async (promptText: string): Promise<string> => {
    try {
      const res = await API.post("generate", { prompt: promptText });
      return res.data.response;
    } catch (error) {
      console.error("Gemini API Error:", error);
      return "Error generating response.";
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    const userMessage: Message = { sender: "user", text: prompt };
    setMessages((prev) => [...prev, userMessage]);
    setPrompt("");
    setLoading(true);

    const aiResponse = await getGeminiResponse(prompt);
    const aiMessage: Message = { sender: "ai", text: aiResponse };

    setMessages((prev) => [...prev, aiMessage]);
    setLoading(false);
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "#ffffff",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* App Bar */}
      <NavBar />

      {/* Chat Messages */}
      <Box sx={{ flexGrow: 1, overflowY: "auto", px: 2, py: 3 }}>
        {/* Default Message */}
        {messages.length === 0 && !loading && (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
            <Typography variant="h6" sx={{ color: "#888" }}>
              How can I assist you? {name}
            </Typography>
          </Box>
        )}

        {/* Chat Bubbles */}
        {messages.map((msg, idx) => (
          <Box
            key={idx}
            sx={{
              mb: 2,
              display: "flex",
              justifyContent:
                msg.sender === "user" ? "flex-end" : "flex-start",
            }}
          >
            <Paper
              elevation={2}
              sx={{
                p: 2,
                maxWidth: "80%",
                backgroundColor:
                  msg.sender === "user" ? "#ff0000" : "#f5f5f5",
                color: msg.sender === "user" ? "#ffffff" : "#000000",
                borderRadius: 2,
              }}
            >
              <Typography variant="body1" sx={{ whiteSpace: "pre-wrap" }}>
                {msg.text}
              </Typography>
            </Paper>
          </Box>
        ))}

        {/* Loading Indicator */}
        {loading && (
          <Box sx={{ display: "flex", alignItems: "center", pl: 1 }}>
            <CircularProgress size={20} sx={{ color: "#1976d2" }} />
            <Typography sx={{ ml: 2, color: "#1976d2" }}>
              thinking...
            </Typography>
          </Box>
        )}
      </Box>

      <Divider />

      {/* Input Field */}
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          display: "flex",
          alignItems: "center",
          p: 2,
          backgroundColor: "#ffffff",
          position: "sticky",
          bottom: 0,
          zIndex: 10,
        }}
      >
        <Paper
          sx={{
            display: "flex",
            alignItems: "center",
            px: 2,
            py: 1,
            flexGrow: 1,
            backgroundColor: "grey",
            borderRadius: 4,
          }}
        >
          <InputBase
            sx={{ flex: 1, color: "#ffffff" }}
            placeholder="Type your message..."
            multiline
            maxRows={4}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault(); // Prevent newline
                if (!loading && prompt.trim()) {
                  handleSubmit(e as any); // Simulate submit
                }
              }
            }}
          />
          <IconButton
            type="submit"
            sx={{ color: "#ff0000" }}
            disabled={loading}
          >
            <SendIcon />
          </IconButton>
        </Paper>
      </Box>
    </Box>
  );
}
