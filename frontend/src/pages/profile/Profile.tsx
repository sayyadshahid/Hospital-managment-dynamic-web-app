import React, { useEffect, useState } from "react";
import { Box, Typography, Avatar, Button, IconButton, TextField, Divider } from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import EditIcon from "@mui/icons-material/Edit";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import PersonOutlineRoundedIcon from "@mui/icons-material/PersonOutlineRounded";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
import NavBar from "../../components/header";
import { useAvatar } from "../../hooks/AvtarContex";
import API from "../../components/configs/API";
import { useNavigate } from "react-router-dom";

/* ─── Design Tokens ─────────────────────────────────────────────── */
const tokens = {
  purple: "#7C3AED",
  purpleMid: "#6D28D9",
  purpleLight: "#EDE9FE",
  violet: "#8B5CF6",
  indigo: "#4F46E5",
  teal: "#0D9488",
  neutral: "#6B7280",
  neutralDark: "#1F1635",
  surface: "#FFFFFF",
  borderPurple: "#DDD6FE",
};

interface UserDetails {
  fullname: string;
  email: string;
  phone_no: string;
  role: string;
}

/* NOTE: placeholder values — wire up to real endpoints later
   (appointments count, user.created_at, etc.) */
const MOCK_STATS = {
  appointmentsBooked: 8,
  memberSince: "Jan 2025",
};

/* ─── Editable Info Row ──────────────────────────────────────────── */
const EditableRow = ({
  Icon, label, value, fieldKey, editingKey, onEditStart, onSave, onCancel, draft, setDraft, last,
}: {
  Icon: React.ElementType; label: string; value: string; fieldKey: string;
  editingKey: string | null;
  onEditStart: (key: string, currentVal: string) => void;
  onSave: (key: string) => void;
  onCancel: () => void;
  draft: string;
  setDraft: (v: string) => void;
  last?: boolean;
}) => {
  const isEditing = editingKey === fieldKey;
  return (
    <Box sx={{
      display: "flex", alignItems: "center", gap: 1.5,
      py: 1.5, borderBottom: last ? "none" : `1px solid ${tokens.borderPurple}`,
    }}>
      <Icon sx={{ fontSize: 18, color: tokens.neutral, width: 22 }} />
      <Box sx={{ textAlign: "left", overflow: "hidden", flex: 1 }}>
        <Typography sx={{ fontFamily: "Inter", fontSize: 11, color: tokens.neutral, lineHeight: 1.4 }}>
          {label}
        </Typography>
        {isEditing ? (
          <TextField
            autoFocus
            size="small"
            variant="standard"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            sx={{
              "& .MuiInput-input": { fontFamily: "Inter", fontSize: 14, fontWeight: 600, color: tokens.neutralDark, py: 0 },
              "& .MuiInput-underline:before": { borderColor: tokens.borderPurple },
              "& .MuiInput-underline:after": { borderColor: tokens.purple },
            }}
          />
        ) : (
          <Typography sx={{
            fontFamily: "Inter", fontSize: 14, fontWeight: 600, color: tokens.neutralDark,
            overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
          }}>
            {value || "—"}
          </Typography>
        )}
      </Box>
      {isEditing ? (
        <Box sx={{ display: "flex", gap: 0.3 }}>
          <IconButton size="small" onClick={() => onSave(fieldKey)} sx={{ color: tokens.teal }}>
            <CheckIcon sx={{ fontSize: 17 }} />
          </IconButton>
          <IconButton size="small" onClick={onCancel} sx={{ color: tokens.neutral }}>
            <CloseIcon sx={{ fontSize: 17 }} />
          </IconButton>
        </Box>
      ) : (
        <IconButton size="small" onClick={() => onEditStart(fieldKey, value)} sx={{ color: tokens.neutral, "&:hover": { color: tokens.purple } }}>
          <EditIcon sx={{ fontSize: 15 }} />
        </IconButton>
      )}
    </Box>
  );
};

export default function ProfileDetail() {
  const { avatar, setAvatar } = useAvatar();
  const [user, setUser] = useState({ avatar: "" });
  const [userDetail, setuserDetail] = useState<UserDetails>({
    fullname: "", email: "", phone_no: "", role: "",
  });
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [draft, setDraft] = useState("");
  const navigate = useNavigate();
  const userId = JSON.parse(localStorage.getItem("user") || "{}").id;

  useEffect(() => {
    const fetchUserdata = async () => {
      try {
        const res = await API.get(`/users/${userId}`);
        setuserDetail(res.data.user);
      } catch (err) {
        console.log(err);
      }
    };
    fetchUserdata();
  }, []);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const avatarData = reader.result as string;
        setUser((prev) => ({ ...prev, avatar: avatarData }));
        setAvatar(avatarData);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    navigate("/");
    window.location.reload();
  };

  const handleEditStart = (key: string, currentVal: string) => {
    setEditingKey(key);
    setDraft(currentVal);
  };

  const handleSave = async (key: string) => {
    // TODO: wire up to PATCH /users/{id}
    setuserDetail((prev) => ({ ...prev, [key]: draft }));
    setEditingKey(null);
  };

  const handleCancel = () => setEditingKey(null);

  return (
    <Box>
      <NavBar />
      <Box sx={{
        minHeight: "calc(100vh - 64px)",
        background: "linear-gradient(135deg, #F3EEFF 0%, #FAF8FF 60%, #EEF2FF 100%)",
        display: "flex", alignItems: "center", justifyContent: "center",
        p: 2, py: 6,
      }}>
        <Box sx={{
          maxWidth: 420, width: "100%",
          p: 4, borderRadius: "20px",
          bgcolor: tokens.surface,
          border: `1px solid ${tokens.borderPurple}`,
          boxShadow: "0 12px 40px rgba(124,58,237,0.12)",
          textAlign: "center",
        }}>

          {/* Avatar */}
          <Box sx={{ position: "relative", display: "inline-block", mb: 1 }}>
            <Box sx={{
              p: "4px", borderRadius: "50%",
              background: `linear-gradient(135deg, ${tokens.purple}, ${tokens.indigo})`,
            }}>
              <Avatar
                src={user.avatar || avatar || "/default-avatar.png"}
                sx={{ width: 92, height: 92, border: `3px solid ${tokens.surface}` }}
              />
            </Box>
            <label htmlFor="upload-photo">
              <input
                type="file" id="upload-photo" accept="image/*"
                style={{ display: "none" }} onChange={handleImageChange}
              />
              <IconButton
                component="span"
                sx={{
                  position: "absolute", bottom: 0, right: 0,
                  bgcolor: tokens.purple, color: "#fff",
                  width: 30, height: 30,
                  border: `2.5px solid ${tokens.surface}`,
                  "&:hover": { bgcolor: tokens.purpleMid },
                }}
              >
                <PhotoCamera sx={{ fontSize: 15 }} />
              </IconButton>
            </label>
          </Box>

          <Typography sx={{
            fontFamily: "Plus Jakarta Sans, sans-serif",
            fontWeight: 800, fontSize: 20, color: tokens.neutralDark, mt: 1,
          }}>
            {userDetail.fullname || "Loading..."}
          </Typography>

          {userDetail.role && (
            <Box sx={{
              display: "inline-block", px: 1.5, py: 0.3, borderRadius: "20px",
              bgcolor: tokens.purpleLight, color: tokens.purple,
              fontFamily: "Inter", fontWeight: 600, fontSize: 11,
              textTransform: "capitalize", mt: 1,
            }}>
              {userDetail.role}
            </Box>
          )}

          {/* Slim stat strip */}
          <Box sx={{
            display: "flex", justifyContent: "center", gap: 4,
            mt: 2.5, mb: 1,
          }}>
            <Box>
              <Typography sx={{ fontFamily: "Plus Jakarta Sans", fontWeight: 800, fontSize: 17, color: tokens.purple }}>
                {MOCK_STATS.appointmentsBooked}
              </Typography>
              <Typography sx={{ fontFamily: "Inter", fontSize: 11, color: tokens.neutral }}>
                Appointments
              </Typography>
            </Box>
            <Box sx={{ width: "1px", bgcolor: tokens.borderPurple }} />
            <Box>
              <Typography sx={{ fontFamily: "Plus Jakarta Sans", fontWeight: 800, fontSize: 17, color: tokens.purple }}>
                {MOCK_STATS.memberSince}
              </Typography>
              <Typography sx={{ fontFamily: "Inter", fontSize: 11, color: tokens.neutral }}>
                Member Since
              </Typography>
            </Box>
          </Box>

          <Divider sx={{ my: 2.5, borderColor: tokens.borderPurple }} />

          {/* Editable Info — flat list, no nested box */}
          <Box sx={{ textAlign: "left" }}>
            <EditableRow
              Icon={PersonOutlineRoundedIcon} label="Full Name" value={userDetail.fullname} fieldKey="fullname"
              editingKey={editingKey} onEditStart={handleEditStart} onSave={handleSave} onCancel={handleCancel}
              draft={draft} setDraft={setDraft}
            />
            <EditableRow
              Icon={EmailOutlinedIcon} label="Email" value={userDetail.email} fieldKey="email"
              editingKey={editingKey} onEditStart={handleEditStart} onSave={handleSave} onCancel={handleCancel}
              draft={draft} setDraft={setDraft}
            />
            <EditableRow
              Icon={PhoneOutlinedIcon} label="Phone" value={userDetail.phone_no} fieldKey="phone_no" last
              editingKey={editingKey} onEditStart={handleEditStart} onSave={handleSave} onCancel={handleCancel}
              draft={draft} setDraft={setDraft}
            />
          </Box>

          <Button
            fullWidth
            variant="outlined"
            startIcon={<LogoutIcon sx={{ fontSize: 18 }} />}
            onClick={handleLogout}
            sx={{
              borderRadius: "10px", textTransform: "none",
              fontFamily: "Inter", fontWeight: 600, fontSize: 14,
              borderColor: "#FCA5A5", color: "#DC2626", py: 1.2, mt: 3,
              "&:hover": { bgcolor: "#FEF2F2", borderColor: "#DC2626" },
            }}
          >
            Logout
          </Button>
        </Box>
      </Box>
    </Box>
  );
}