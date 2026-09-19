import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Avatar,
  Box,
  Button,
  CircularProgress,
  Collapse,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  Drawer,
  IconButton,
  InputBase,
  List,
  ListItemButton,
  ListItemIcon,
  Menu,
  MenuItem,
  Tooltip,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { keyframes, useTheme } from "@mui/material/styles";

// MUI Icons matching ChatGPT layout & Health AI domain
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import ArrowUpwardRoundedIcon from "@mui/icons-material/ArrowUpwardRounded";
import AutoAwesomeOutlinedIcon from "@mui/icons-material/AutoAwesomeOutlined";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import CloseIcon from "@mui/icons-material/Close";
import ContentCopyOutlinedIcon from "@mui/icons-material/ContentCopyOutlined";
import CreateOutlinedIcon from "@mui/icons-material/CreateOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import HealthAndSafetyOutlinedIcon from "@mui/icons-material/HealthAndSafetyOutlined";
import LocalHospitalOutlinedIcon from "@mui/icons-material/LocalHospitalOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import MedicalServicesOutlinedIcon from "@mui/icons-material/MedicalServicesOutlined";
import MoreHorizOutlinedIcon from "@mui/icons-material/MoreHorizOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import PsychologyOutlinedIcon from "@mui/icons-material/PsychologyOutlined";
import SearchIcon from "@mui/icons-material/Search";
import StarRoundedIcon from "@mui/icons-material/StarRounded";
import ViewSidebarOutlinedIcon from "@mui/icons-material/ViewSidebarOutlined";

import { formatDistanceToNow } from "date-fns";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import API from "../../components/configs/API";
import LightMarkdown from "./LightMarkdown";
import { SUGGESTIONS, Suggestion } from "./suggestions";
import { C, FONT } from "./theme";

type Message = {
  sender: "user" | "ai";
  text: string;
  time: number;
  error?: boolean;
};

type Conversation = {
  conversation_id: string;
  title: string;
  created_at?: string;
  updated_at?: string;
  preview: string;
  message_count: number;
};

const pulse = keyframes`
  0%, 100% { opacity: 0.4; transform: scale(0.95); }
  50% { opacity: 1; transform: scale(1.05); }
`;

const suggestionIcon = (icon: Suggestion["icon"]) => {
  const common = { fontSize: 18 };
  switch (icon) {
    case "doctor":
      return <HealthAndSafetyOutlinedIcon sx={{ ...common, color: C.primary }} />;
    case "calendar":
      return <CalendarMonthOutlinedIcon sx={{ ...common, color: C.primary }} />;
    case "star":
      return <StarRoundedIcon sx={{ ...common, color: C.primary }} />;
    case "treatment":
      return <AutoAwesomeOutlinedIcon sx={{ ...common, color: C.primary }} />;
    case "consultation":
      return <MedicalServicesOutlinedIcon sx={{ ...common, color: C.primary }} />;
    case "services":
      return <LocalHospitalOutlinedIcon sx={{ ...common, color: C.primary }} />;
    default:
      return <AutoAwesomeOutlinedIcon sx={{ ...common, color: C.primary }} />;
  }
};

function AssistantAvatar({ size = 32 }: { size?: number }) {
  return (
    <Avatar
      sx={{
        width: size,
        height: size,
        bgcolor: C.primary,
        boxShadow: "0 2px 6px rgba(220,38,38,0.2)",
      }}
      aria-label="AI Logo"
    >
      <LocalHospitalOutlinedIcon style={{ width: size * 0.58, height: size * 0.58, color: "#fff" }} />
    </Avatar>
  );
}

export default function ChatUI() {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));
  const navigate = useNavigate();

  const [user] = useState<{ fullname?: string; email?: string }>(() =>
    JSON.parse(localStorage.getItem("user") || "{}")
  );

  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);

  // UI state
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileSidebar, setMobileSidebar] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [thinkingMode, setThinkingMode] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Conversation | null>(null);

  // Profile Menu & Logout State
  const [profileMenuAnchor, setProfileMenuAnchor] = useState<null | HTMLElement>(null);
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);

  const endRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const loadConversations = useCallback(async () => {
    try {
      const res = await API.get("ai/history");
      const list = (res.data?.conversations || []) as Conversation[];
      setConversations(
        list.sort((a, b) =>
          String(b.updated_at).localeCompare(String(a.updated_at))
        )
      );
    } catch (error) {
      console.error("Failed to load history:", error);
    }
  }, []);

  useEffect(() => {
    loadConversations();
  }, [loadConversations]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, loading]);

  const openConversation = useCallback(
    async (conversationId: string) => {
      try {
        const res = await API.get(`ai/history/${conversationId}`);
        const loaded = (res.data?.messages || []).map((m: { role: string; content: string }) => ({
          sender: m.role === "user" ? "user" : "ai",
          text: m.content || "",
          time: Date.now(),
        }));
        setMessages(loaded);
        setActiveId(conversationId);
        setMobileSidebar(false);
      } catch (error) {
        console.error("Failed to load conversation:", error);
        toast.error("Could not load conversation.");
      }
    },
    []
  );

  const newChat = useCallback(() => {
    setMessages([]);
    setActiveId(null);
    setMobileSidebar(false);
    setInput("");
    requestAnimationFrame(() => inputRef.current?.focus());
  }, []);

  const confirmDelete = useCallback(async () => {
    if (!deleteTarget) return;
    const targetId = deleteTarget.conversation_id;
    try {
      await API.delete(`ai/history/${targetId}`);
      setConversations((prev) => prev.filter((c) => c.conversation_id !== targetId));
      if (activeId === targetId) newChat();
      toast.success("Conversation deleted");
    } catch (error) {
      console.error("Failed to delete conversation:", error);
      toast.error("Could not delete conversation.");
    } finally {
      setDeleteTarget(null);
    }
  }, [deleteTarget, activeId, newChat]);

  const handleLogoutConfirm = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    toast.success("Logged out successfully");
    setLogoutDialogOpen(false);
    navigate("/login");
  };

  const send = useCallback(
    async (promptOverride?: string) => {
      const prompt = (promptOverride ?? input).trim();
      if (!prompt || loading) return;

      setInput("");
      setMessages((prev) => [
        ...prev,
        { sender: "user", text: prompt, time: Date.now() },
      ]);
      setLoading(true);

      try {
        const res = await API.post("generate", {
          prompt,
          conversation_id: activeId || null,
        });
        const answer = res.data?.response || "";
        const conversationId = res.data?.conversation_id || null;
        if (conversationId) setActiveId(conversationId);
        setMessages((prev) => [
          ...prev,
          { sender: "ai", text: answer, time: Date.now() },
        ]);
        loadConversations();
      } catch (error) {
        console.error("Generate error:", error);
        setMessages((prev) => [
          ...prev,
          {
            sender: "ai",
            text: "Sorry, I couldn't generate a response right now. Please try again.",
            time: Date.now(),
            error: true,
          },
        ]);
      } finally {
        setLoading(false);
      }
    },
    [input, loading, activeId, loadConversations]
  );

  const filteredConversations = useMemo(() => {
    if (!searchQuery.trim()) return conversations;
    const q = searchQuery.toLowerCase();
    return conversations.filter(
      (c) =>
        c.title.toLowerCase().includes(q) ||
        (c.preview && c.preview.toLowerCase().includes(q))
    );
  }, [conversations, searchQuery]);

  const copyText = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  };

  const hasMessages = messages.length > 0;

  // ChatGPT White & Solid Red Sidebar
  const sidebarContent = (
    <Box
      sx={{
        width: 260,
        height: "100%",
        display: "flex",
        flexDirection: "column",
        bgcolor: C.sidebarBg,
        borderRight: `1px solid ${C.border}`,
        userSelect: "none",
        fontFamily: FONT,
      }}
    >
      {/* Top Header: Text Logo (No Icon) + Search Icon + Sidebar Toggle */}
      <Box
        sx={{
          px: 2,
          pt: 1.75,
          pb: 1.25,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Box
          sx={{
            cursor: "pointer",
          }}
          onClick={() => navigate("/")}
        >
          <Typography
            sx={{
              fontWeight: 700,
              fontSize: 17,
              letterSpacing: "-0.02em",
              color: C.text,
              fontFamily: FONT,
            }}
          >
            Jacsto AI
          </Typography>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 0.25 }}>
          <Tooltip title={searchOpen ? "Close search" : "Search history"}>
            <IconButton
              size="small"
              onClick={() => {
                setSearchOpen((prev) => !prev);
                if (searchOpen) setSearchQuery("");
              }}
              sx={{
                color: searchOpen ? C.primary : C.textMuted,
                "&:hover": { bgcolor: C.sidebarHover, color: C.text },
              }}
            >
              <SearchIcon fontSize="small" />
            </IconButton>
          </Tooltip>

          <Tooltip title="Close sidebar">
            <IconButton
              size="small"
              onClick={() => {
                if (isDesktop) setSidebarOpen(false);
                else setMobileSidebar(false);
              }}
              sx={{
                color: C.textMuted,
                "&:hover": { bgcolor: C.sidebarHover, color: C.text },
              }}
            >
              <ViewSidebarOutlinedIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {/* Expandable Search Input Bar */}
      <Collapse in={searchOpen}>
        <Box sx={{ px: 1.5, py: 1 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              bgcolor: C.surface,
              borderRadius: "10px",
              border: `1px solid ${C.primaryBorder}`,
              px: 1,
              py: 0.5,
              boxShadow: "0 1px 4px rgba(220,38,38,0.1)",
            }}
          >
            <SearchIcon sx={{ color: C.primary, fontSize: 18, mr: 0.75 }} />
            <InputBase
              autoFocus
              placeholder="Search chats…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              sx={{
                flexGrow: 1,
                fontSize: 13,
                fontFamily: FONT,
                color: C.text,
                "& input": { p: 0 },
              }}
            />
            <IconButton
              size="small"
              onClick={() => {
                if (searchQuery) setSearchQuery("");
                else setSearchOpen(false);
              }}
              sx={{ p: 0.25, color: C.textMuted, "&:hover": { color: C.primary } }}
              aria-label="Close search"
            >
              <CloseIcon sx={{ fontSize: 16 }} />
            </IconButton>
          </Box>
        </Box>
      </Collapse>

      {/* "+ New Chat" Button */}
      <Box sx={{ px: 1.5, py: 1 }}>
        <Button
          fullWidth
          onClick={newChat}
          startIcon={<CreateOutlinedIcon sx={{ fontSize: 18, color: C.primary }} />}
          sx={{
            justifyContent: "flex-start",
            py: 1,
            px: 1.5,
            borderRadius: "10px",
            bgcolor: C.surface,
            border: `1px solid ${C.border}`,
            color: C.text,
            fontWeight: 600,
            fontSize: 13.5,
            fontFamily: FONT,
            textTransform: "none",
            boxShadow: "0 1px 3px rgba(0,0,0,0.03)",
            transition: "all 0.15s ease",
            "&:hover": {
              bgcolor: C.primaryLight,
              borderColor: C.primaryBorder,
              color: C.primaryDark,
            },
          }}
        >
          New chat
        </Button>
      </Box>

      {/* History Section Header */}
      <Box sx={{ px: 2, pt: 1.5, pb: 0.5 }}>
        <Typography
          sx={{
            fontSize: 11,
            fontWeight: 700,
            color: C.textMuted,
            textTransform: "uppercase",
            letterSpacing: "0.05em",
            fontFamily: FONT,
          }}
        >
          {searchQuery ? "Search Results" : "History"}
        </Typography>
      </Box>

      {/* History List */}
      <Box sx={{ flexGrow: 1, overflowY: "auto", px: 1.25, pb: 1 }}>
        {filteredConversations.length === 0 ? (
          <Box sx={{ px: 1.5, py: 3, textAlign: "center" }}>
            <Typography sx={{ color: C.textMuted, fontSize: 12.5, fontFamily: FONT }}>
              {searchQuery ? "No matching chats found." : "No conversations yet."}
            </Typography>
          </Box>
        ) : (
          <List disablePadding>
            {filteredConversations.map((conv) => {
              const active = conv.conversation_id === activeId;
              return (
                <ListItemButton
                  key={conv.conversation_id}
                  onClick={() => openConversation(conv.conversation_id)}
                  sx={{
                    borderRadius: "8px",
                    mb: 0.25,
                    px: 1.25,
                    py: 0.85,
                    position: "relative",
                    bgcolor: active ? C.primaryLight : "transparent",
                    color: active ? C.primaryDark : C.text,
                    borderLeft: active ? `3px solid ${C.primary}` : "3px solid transparent",
                    "&:hover": {
                      bgcolor: active ? C.primaryLight : C.sidebarHover,
                      "& .delete-btn": { opacity: 1 },
                    },
                  }}
                >
                  <Box sx={{ flexGrow: 1, minWidth: 0, pr: 1 }}>
                    <Typography
                      sx={{
                        fontSize: 13,
                        fontWeight: active ? 600 : 450,
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        fontFamily: FONT,
                      }}
                    >
                      {conv.title}
                    </Typography>
                  </Box>

                  <IconButton
                    className="delete-btn"
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      setDeleteTarget(conv);
                    }}
                    sx={{
                      opacity: active ? 0.9 : 0,
                      transition: "opacity 0.15s ease",
                      p: 0.25,
                      color: C.textMuted,
                      "&:hover": { color: C.primary },
                    }}
                    aria-label={`Delete ${conv.title}`}
                  >
                    <DeleteOutlineOutlinedIcon sx={{ fontSize: 16 }} />
                  </IconButton>
                </ListItemButton>
              );
            })}
          </List>
        )}
      </Box>

      {/* User Profile Section (Solid Red Avatar) */}
      <Divider sx={{ borderColor: C.borderLight }} />
      <Box
        onClick={(e) => setProfileMenuAnchor(e.currentTarget)}
        sx={{
          px: 1.5,
          py: 1.25,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          cursor: "pointer",
          borderRadius: "10px",
          m: 1,
          transition: "background 0.15s ease",
          "&:hover": { bgcolor: C.sidebarHover },
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.25, minWidth: 0 }}>
          <Avatar
            sx={{
              width: 32,
              height: 32,
              bgcolor: C.primary,
              fontSize: 13,
              fontWeight: 700,
              fontFamily: FONT,
            }}
          >
            {user.fullname ? user.fullname.charAt(0).toUpperCase() : "S"}
          </Avatar>
          <Box sx={{ minWidth: 0 }}>
            <Typography
              sx={{
                fontSize: 13,
                fontWeight: 600,
                color: C.text,
                fontFamily: FONT,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {user.fullname ? user.fullname : "Shahid Sayyed"}
            </Typography>
            <Typography
              sx={{
                fontSize: 11,
                color: C.textMuted,
                fontFamily: FONT,
              }}
            >
              Health Account
            </Typography>
          </Box>
        </Box>
        <IconButton size="small" sx={{ color: C.textMuted, p: 0.25 }}>
          <MoreHorizOutlinedIcon sx={{ fontSize: 18 }} />
        </IconButton>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ height: "100vh", display: "flex", bgcolor: C.bg, fontFamily: FONT, overflow: "hidden" }}>
      {/* Desktop Sidebar with collapse animation */}
      {isDesktop ? (
        <Collapse in={sidebarOpen} orientation="horizontal" sx={{ height: "100%" }}>
          {sidebarContent}
        </Collapse>
      ) : (
        <Drawer
          anchor="left"
          open={mobileSidebar}
          onClose={() => setMobileSidebar(false)}
          PaperProps={{ sx: { width: 260 } }}
        >
          {sidebarContent}
        </Drawer>
      )}

      {/* Main Right Section */}
      <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column", minWidth: 0, height: "100%" }}>
        {/* Top Header Bar (No Icon in Pill Badge) */}
        <Box
          sx={{
            height: 52,
            px: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderBottom: `1px solid ${C.borderLight}`,
            bgcolor: C.surface,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            {(!sidebarOpen || !isDesktop) && (
              <IconButton
                size="small"
                onClick={() => {
                  if (isDesktop) setSidebarOpen(true);
                  else setMobileSidebar(true);
                }}
                sx={{ color: C.textMuted, "&:hover": { color: C.text } }}
                aria-label="Open sidebar"
              >
                <ViewSidebarOutlinedIcon fontSize="small" />
              </IconButton>
            )}

            {/* Clean Health AI Badge (No Icon) */}
            <Box
              sx={{
                display: "inline-flex",
                alignItems: "center",
                bgcolor: C.primaryLight,
                border: `1px solid ${C.primaryBorder}`,
                borderRadius: "16px",
                px: 1.5,
                py: 0.4,
              }}
            >
              <Typography
                sx={{
                  fontWeight: 600,
                  fontSize: 12.5,
                  color: C.primaryDark,
                  fontFamily: FONT,
                }}
              >
                Health AI
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Tooltip title="Start new chat">
              <IconButton
                size="small"
                onClick={newChat}
                sx={{ color: C.textMuted, "&:hover": { color: C.primary } }}
              >
                <AddOutlinedIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        {/* Center / Chat Scroll Body */}
        <Box
          sx={{
            flexGrow: 1,
            overflowY: "auto",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            px: { xs: 2, md: 3 },
            py: 2,
          }}
        >
          {!hasMessages && !loading ? (
            /* ChatGPT Landing State */
            <Box
              sx={{
                width: "100%",
                maxWidth: 768,
                my: "auto",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
                py: 4,
              }}
            >
              {/* Main Greeting */}
              <Typography
                sx={{
                  fontSize: { xs: 24, sm: 30, md: 34 },
                  fontWeight: 700,
                  color: C.text,
                  letterSpacing: "-0.03em",
                  fontFamily: FONT,
                  mb: 3,
                }}
              >
                What's on the agenda today?
              </Typography>

              {/* ChatGPT Prominent Center Prompt Box */}
              <Box
                sx={{
                  width: "100%",
                  borderRadius: "24px",
                  bgcolor: C.surface,
                  border: `1px solid ${C.border}`,
                  boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
                  p: 1.5,
                  transition: "border-color 0.2s ease, box-shadow 0.2s ease",
                  "&:focus-within": {
                    borderColor: C.primary,
                    boxShadow: `0 0 0 3px ${C.ring}, 0 4px 20px rgba(0,0,0,0.05)`,
                  },
                }}
              >
                <InputBase
                  inputRef={inputRef}
                  multiline
                  minRows={2}
                  maxRows={6}
                  placeholder="+ Ask anything..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      send();
                    }
                  }}
                  sx={{
                    width: "100%",
                    px: 1.5,
                    py: 0.5,
                    fontSize: 15,
                    fontFamily: FONT,
                    color: C.text,
                    lineHeight: 1.5,
                  }}
                />

                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    mt: 1,
                    pt: 0.5,
                  }}
                >
                  {/* Left: Think pill badge */}
                  <Button
                    size="small"
                    onClick={() => setThinkingMode((prev) => !prev)}
                    startIcon={<PsychologyOutlinedIcon sx={{ fontSize: 16 }} />}
                    sx={{
                      borderRadius: "16px",
                      px: 1.25,
                      py: 0.4,
                      fontSize: 12,
                      fontWeight: 600,
                      fontFamily: FONT,
                      textTransform: "none",
                      bgcolor: thinkingMode ? C.primaryLight : "#f4f4f5",
                      color: thinkingMode ? C.primary : C.textMuted,
                      border: `1px solid ${thinkingMode ? C.primaryBorder : "transparent"}`,
                      "&:hover": {
                        bgcolor: thinkingMode ? C.primaryLight : "#e8e8ed",
                      },
                    }}
                  >
                    Think
                  </Button>

                  {/* Right: Solid Red Send Button */}
                  <IconButton
                    onClick={() => send()}
                    disabled={!input.trim() || loading}
                    sx={{
                      width: 34,
                      height: 34,
                      bgcolor: C.primary,
                      color: "#ffffff",
                      "&:hover": { bgcolor: C.primaryDark },
                      "&:disabled": { bgcolor: "#e5e5e5", color: "#a3a3a3" },
                    }}
                  >
                    <ArrowUpwardRoundedIcon sx={{ fontSize: 18 }} />
                  </IconButton>
                </Box>
              </Box>

              {/* Action Questions from Image 3 */}
              <Box
                sx={{
                  width: "100%",
                  mt: 3.5,
                  display: "grid",
                  gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                  gap: 1.5,
                }}
              >
                {SUGGESTIONS.map((s) => (
                  <Box
                    key={s.id}
                    onClick={() => send(s.label)}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1.5,
                      px: 2,
                      py: 1.4,
                      borderRadius: "14px",
                      bgcolor: C.surface,
                      border: `1px solid ${C.border}`,
                      cursor: "pointer",
                      textAlign: "left",
                      transition: "all 0.15s ease",
                      boxShadow: "0 1px 3px rgba(0,0,0,0.02)",
                      "&:hover": {
                        borderColor: C.primaryBorder,
                        bgcolor: C.primaryLight,
                        transform: "translateY(-1px)",
                        boxShadow: "0 4px 12px rgba(220,38,38,0.08)",
                      },
                    }}
                  >
                    <Box
                      sx={{
                        width: 32,
                        height: 32,
                        borderRadius: "10px",
                        bgcolor: C.primaryLight,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      {suggestionIcon(s.icon)}
                    </Box>
                    <Typography
                      sx={{
                        fontSize: 13.5,
                        fontWeight: 500,
                        color: C.text,
                        fontFamily: FONT,
                        lineHeight: 1.4,
                      }}
                    >
                      {s.label}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Box>
          ) : (
            /* Active Message Thread */
            <Box sx={{ width: "100%", maxWidth: 768, py: 2 }}>
              {messages.map((msg, idx) => {
                const isUser = msg.sender === "user";
                return (
                  <Box
                    key={idx}
                    sx={{
                      display: "flex",
                      mb: 3,
                      gap: 1.75,
                      alignItems: "flex-start",
                      flexDirection: isUser ? "row-reverse" : "row",
                    }}
                  >
                    {!isUser ? (
                      <AssistantAvatar size={30} />
                    ) : (
                      <Avatar
                        sx={{
                          width: 30,
                          height: 30,
                          bgcolor: C.primary,
                          fontSize: 12,
                          fontWeight: 700,
                          fontFamily: FONT,
                        }}
                      >
                        {user.fullname ? user.fullname.charAt(0).toUpperCase() : "U"}
                      </Avatar>
                    )}

                    <Box sx={{ maxWidth: "84%", minWidth: 0 }}>
                      <Box
                        sx={{
                          px: 2.25,
                          py: 1.5,
                          borderRadius: isUser ? "20px 20px 4px 20px" : "4px 20px 20px 20px",
                          bgcolor: isUser ? C.userBubble : C.surface,
                          border: `1px solid ${isUser ? C.border : C.borderLight}`,
                          color: C.text,
                          boxShadow: "0 1px 4px rgba(0,0,0,0.03)",
                        }}
                      >
                        {isUser ? (
                          <Typography
                            sx={{
                              whiteSpace: "pre-wrap",
                              wordBreak: "break-word",
                              lineHeight: 1.6,
                              fontSize: "0.95rem",
                              fontFamily: FONT,
                              color: C.text,
                            }}
                          >
                            {msg.text}
                          </Typography>
                        ) : (
                          <LightMarkdown text={msg.text} />
                        )}
                      </Box>

                      {/* Action row under AI message */}
                      {!isUser && (
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 0.5, px: 0.5 }}>
                          <Typography sx={{ fontSize: 11, color: C.textMuted, fontFamily: FONT }}>
                            {formatDistanceToNow(msg.time, { addSuffix: true })}
                          </Typography>
                          <IconButton
                            size="small"
                            onClick={() => copyText(msg.text)}
                            sx={{ color: C.textMuted, p: 0.25, "&:hover": { color: C.primary } }}
                          >
                            <ContentCopyOutlinedIcon sx={{ fontSize: 14 }} />
                          </IconButton>
                        </Box>
                      )}
                    </Box>
                  </Box>
                );
              })}

              {/* Typing indicator */}
              {loading && (
                <Box sx={{ display: "flex", gap: 1.75, alignItems: "center", mb: 3 }}>
                  <AssistantAvatar size={30} />
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 0.75,
                      px: 2,
                      py: 1.25,
                      borderRadius: "4px 20px 20px 20px",
                      bgcolor: C.surface,
                      border: `1px solid ${C.borderLight}`,
                    }}
                  >
                    {[0, 1, 2].map((i) => (
                      <Box
                        key={i}
                        sx={{
                          width: 6,
                          height: 6,
                          borderRadius: "50%",
                          bgcolor: C.primary,
                          animation: `${pulse} 1.2s infinite ease-in-out`,
                          animationDelay: `${i * 0.2}s`,
                        }}
                      />
                    ))}
                  </Box>
                </Box>
              )}
              <div ref={endRef} />
            </Box>
          )}
        </Box>

        {/* Bottom Input Area when chatting */}
        {hasMessages && (
          <Box
            sx={{
              px: { xs: 2, md: 3 },
              py: 1.5,
              bgcolor: C.surface,
              borderTop: `1px solid ${C.borderLight}`,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Box
              sx={{
                width: "100%",
                maxWidth: 768,
                borderRadius: "24px",
                bgcolor: C.surface,
                border: `1px solid ${C.border}`,
                boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
                p: 1.25,
                transition: "border-color 0.2s ease",
                "&:focus-within": {
                  borderColor: C.primary,
                  boxShadow: `0 0 0 3px ${C.ring}`,
                },
              }}
            >
              <InputBase
                inputRef={inputRef}
                multiline
                maxRows={5}
                placeholder="Ask about doctors, appointments, hospitals…"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    send();
                  }
                }}
                sx={{
                  width: "100%",
                  px: 1.5,
                  py: 0.5,
                  fontSize: 14.5,
                  fontFamily: FONT,
                  color: C.text,
                }}
              />

              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  mt: 0.5,
                }}
              >
                <Button
                  size="small"
                  onClick={() => setThinkingMode((prev) => !prev)}
                  startIcon={<PsychologyOutlinedIcon sx={{ fontSize: 16 }} />}
                  sx={{
                    borderRadius: "16px",
                    px: 1.25,
                    py: 0.3,
                    fontSize: 11.5,
                    fontWeight: 600,
                    fontFamily: FONT,
                    textTransform: "none",
                    bgcolor: thinkingMode ? C.primaryLight : "#f4f4f5",
                    color: thinkingMode ? C.primary : C.textMuted,
                    "&:hover": {
                      bgcolor: thinkingMode ? C.primaryLight : "#e8e8ed",
                    },
                  }}
                >
                  Think
                </Button>

                <IconButton
                  onClick={() => send()}
                  disabled={!input.trim() || loading}
                  sx={{
                    width: 32,
                    height: 32,
                    bgcolor: C.primary,
                    color: "#ffffff",
                    "&:hover": { bgcolor: C.primaryDark },
                    "&:disabled": { bgcolor: "#e5e5e5", color: "#a3a3a3" },
                  }}
                >
                  {loading ? (
                    <CircularProgress size={16} sx={{ color: "#fff" }} />
                  ) : (
                    <ArrowUpwardRoundedIcon sx={{ fontSize: 18 }} />
                  )}
                </IconButton>
              </Box>
            </Box>

            <Typography
              sx={{
                color: C.textMuted,
                fontSize: 11,
                textAlign: "center",
                mt: 0.75,
                fontFamily: FONT,
              }}
            >
              Jacsto AI Health Assistant can make mistakes — please verify important medical and appointment details.
            </Typography>
          </Box>
        )}
      </Box>

      {/* User Profile Popover Menu */}
      <Menu
        anchorEl={profileMenuAnchor}
        open={Boolean(profileMenuAnchor)}
        onClose={() => setProfileMenuAnchor(null)}
        PaperProps={{
          sx: {
            borderRadius: "12px",
            minWidth: 180,
            boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
            mt: -1,
          },
        }}
        anchorOrigin={{ vertical: "top", horizontal: "left" }}
        transformOrigin={{ vertical: "bottom", horizontal: "left" }}
      >
        <MenuItem
          onClick={() => {
            setProfileMenuAnchor(null);
            navigate("/profile");
          }}
          sx={{ fontFamily: FONT, fontSize: 13.5, gap: 1.5, py: 1 }}
        >
          <ListItemIcon sx={{ minWidth: "auto", color: C.textMuted }}>
            <PersonOutlineOutlinedIcon fontSize="small" />
          </ListItemIcon>
          Profile Settings
        </MenuItem>

        <Divider sx={{ my: 0.5 }} />

        <MenuItem
          onClick={() => {
            setProfileMenuAnchor(null);
            setLogoutDialogOpen(true);
          }}
          sx={{ fontFamily: FONT, fontSize: 13.5, gap: 1.5, py: 1, color: C.primary }}
        >
          <ListItemIcon sx={{ minWidth: "auto", color: C.primary }}>
            <LogoutOutlinedIcon fontSize="small" />
          </ListItemIcon>
          Log out
        </MenuItem>
      </Menu>

      {/* Logout Confirmation Dialog */}
      <Dialog
        open={logoutDialogOpen}
        onClose={() => setLogoutDialogOpen(false)}
        PaperProps={{ sx: { borderRadius: "16px", px: 1, py: 0.5, maxWidth: 360 } }}
      >
        <DialogTitle sx={{ fontFamily: FONT, fontWeight: 700, fontSize: 17 }}>
          Log out of Jacsto AI?
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ fontFamily: FONT, fontSize: 14 }}>
            Are you sure you want to log out of your account?
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ pb: 2, px: 3 }}>
          <Button
            onClick={() => setLogoutDialogOpen(false)}
            sx={{ textTransform: "none", fontFamily: FONT, color: C.textMuted }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleLogoutConfirm}
            variant="contained"
            disableElevation
            sx={{
              textTransform: "none",
              fontFamily: FONT,
              fontWeight: 600,
              borderRadius: "10px",
              bgcolor: C.primary,
              "&:hover": { bgcolor: C.primaryDark },
            }}
          >
            Log out
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Conversation Confirmation Dialog */}
      <Dialog
        open={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        PaperProps={{ sx: { borderRadius: "16px", px: 1, py: 0.5 } }}
      >
        <DialogTitle sx={{ fontFamily: FONT, fontWeight: 700, fontSize: 17 }}>
          Delete conversation?
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ fontFamily: FONT, fontSize: 14 }}>
            This will permanently remove “{deleteTarget?.title}” from your chat history.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ pb: 2, px: 3 }}>
          <Button
            onClick={() => setDeleteTarget(null)}
            sx={{ textTransform: "none", fontFamily: FONT, color: C.textMuted }}
          >
            Cancel
          </Button>
          <Button
            onClick={confirmDelete}
            variant="contained"
            disableElevation
            sx={{
              textTransform: "none",
              fontFamily: FONT,
              fontWeight: 600,
              borderRadius: "10px",
              bgcolor: C.primary,
              "&:hover": { bgcolor: C.primaryDark },
            }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}