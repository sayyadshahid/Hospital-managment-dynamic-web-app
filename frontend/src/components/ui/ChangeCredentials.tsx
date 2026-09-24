import React, { useState } from "react";
import { Box, Button, Paper, TextField, Typography, Divider } from "@mui/material";
import LockResetIcon from "@mui/icons-material/LockReset";
import API from "../../components/configs/API";
import { extractErrorMsg } from "../../components/configs/API/errorUtils";
import toast from "react-hot-toast";

const ChangeCredentials = () => {
  const [form, setForm] = useState({ current_password: "", new_password: "", confirm_password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<{ [key: string]: string }>({});

  const setField = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setError((prev) => ({ ...prev, [key]: "" }));
  };

  const handleSave = async () => {
    const nextError: { [key: string]: string } = {};
    if (form.current_password.length < 8) nextError.current_password = "Current password must be at least 8 characters";
    if (form.new_password.length < 8) nextError.new_password = "New password must be at least 8 characters";
    if (form.confirm_password !== form.new_password) nextError.confirm_password = "Passwords do not match";
    if (Object.keys(nextError).length) {
      setError(nextError);
      return;
    }
    setLoading(true);
    try {
      await API.put("change-credentials", {
        current_password: form.current_password,
        new_password: form.new_password,
        confirm_password: form.confirm_password,
      });
      toast.success("Credentials changed successfully");
      setForm({ current_password: "", new_password: "", confirm_password: "" });
    } catch (err: any) {
      toast.error(extractErrorMsg(err, "Failed to change credentials"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper sx={{ p: 3, maxWidth: 480 }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
        <LockResetIcon color="primary" />
        <Typography variant="h6">Change Credentials</Typography>
      </Box>
      <Divider sx={{ mb: 2 }} />
      <Typography color="text.secondary" fontSize={14} mb={2}>
        Update the password used to access this dashboard. You will need to login again after changing it.
      </Typography>
      <TextField
        fullWidth margin="dense" label="Current Password" type="password" autoComplete="current-password"
        value={form.current_password}
        onChange={(e) => setField("current_password", e.target.value)}
        error={Boolean(error.current_password)} helperText={error.current_password || ""}
      />
      <TextField
        fullWidth margin="dense" label="New Password" type="password" autoComplete="new-password"
        value={form.new_password}
        onChange={(e) => setField("new_password", e.target.value)}
        error={Boolean(error.new_password)} helperText={error.new_password || ""}
      />
      <TextField
        fullWidth margin="dense" label="Confirm New Password" type="password" autoComplete="new-password"
        value={form.confirm_password}
        onChange={(e) => setField("confirm_password", e.target.value)}
        error={Boolean(error.confirm_password)} helperText={error.confirm_password || ""}
      />
      <Button
        fullWidth variant="contained" sx={{ mt: 2, backgroundColor: "#fa6039" }}
        onClick={handleSave} disabled={loading}
      >
        {loading ? "Updating..." : "Update Credentials"}
      </Button>
    </Paper>
  );
};

export default ChangeCredentials;