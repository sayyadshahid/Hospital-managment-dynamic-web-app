import React from "react";
import { TextField, Button, Typography, Box } from "@mui/material";

interface FormFieldProps {
  id: string;
  label: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<any>) => void;
  error?: string;
  touched?: boolean;
  multiline?: boolean;
  rows?: number;
}

export const FormField = ({ id, label, type = "text", value, onChange, error, touched, multiline, rows }: FormFieldProps) => (
  <Box mb={2}>
    <TextField
      fullWidth
      id={id}
      name={id}
      label={label}
      type={type}
      variant="standard"
      value={value}
      onChange={onChange}
      error={touched && Boolean(error)}
      helperText={touched && error}
      multiline={multiline}
      rows={rows}
    />
  </Box>
);

interface SubmitButtonProps {
  loading: boolean;
  label: string;
}

export const SubmitButton = ({ loading, label }: SubmitButtonProps) => (
  <Button
    fullWidth
    variant="contained"
    type="submit"
    sx={{
      backgroundColor: "#fa6039",
      borderRadius: 3,
      fontWeight: "bold",
      ":hover": { backgroundColor: "#ec6b4b" },
    }}
  >
    {loading ? <Box component="span" sx={{ width: 24, height: 24 }} className="MuiCircularProgress-root" /> : label}
  </Button>
);

interface AuthLinkProps {
  text: string;
  linkText: string;
  onClick: () => void;
}

export const AuthLink = ({ text, linkText, onClick }: AuthLinkProps) => (
  <Typography sx={{ textAlign: "center", mt: 2, fontSize: 15 }}>
    {text}{" "}
    <span onClick={onClick} style={{ cursor: "pointer", fontWeight: 700 }}>
      {linkText}
    </span>
  </Typography>
);

export const PageTitle = ({ title, subtitle }: { title: string; subtitle?: string }) => (
  <Box mb={2}>
    <Typography variant="h6" gutterBottom>{title}</Typography>
    {subtitle && <Typography variant="body2" color="text.secondary">{subtitle}</Typography>}
  </Box>
);
