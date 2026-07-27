/* ─── Shared Admin Table Design Tokens & DataGrid sx ────────────────
   Import this in every admin table file to keep styling consistent.
   Usage:
     import { tokens, dataGridSx, paperSx } from "./tableTheme";
------------------------------------------------------------------- */

export const tokens = {
  bg: "#FAF8FF",
  purple: "#7C3AED",
  purpleMid: "#6D28D9",
  purpleLight: "#EDE9FE",
  violet: "#8B5CF6",
  indigo: "#4F46E5",
  teal: "#0D9488",
  tealLight: "#CCFBF1",
  amber: "#D97706",
  amberLight: "#FEF3C7",
  red: "#DC2626",
  redLight: "#FEF2F2",
  neutral: "#6B7280",
  neutralDark: "#1F1635",
  surface: "#FFFFFF",
  borderPurple: "#DDD6FE",
};

export const paperSx = {
  p: { xs: 2.5, md: 3.5 },
  m: 2,
  borderRadius: "16px",
  bgcolor: tokens.surface,
  border: `1px solid ${tokens.borderPurple}`,
  boxShadow: "0 4px 24px rgba(124,58,237,0.06)",
};

export const headingSx = {
  fontFamily: "Plus Jakarta Sans, sans-serif",
  fontWeight: 800,
  fontSize: 20,
  color: tokens.neutralDark,
};

export const dataGridSx = {
  bgcolor: tokens.surface,
  borderRadius: "12px",
  border: `1px solid ${tokens.borderPurple}`,
  fontFamily: "Inter, sans-serif",
  "& .MuiDataGrid-columnHeaders": {
    bgcolor: tokens.purpleLight,
    color: tokens.neutralDark,
    fontWeight: 700,
    fontSize: 13,
    borderBottom: `1px solid ${tokens.borderPurple}`,
  },
  "& .MuiDataGrid-cell": {
    fontSize: 13.5,
    color: tokens.neutralDark,
    borderBottom: `1px solid ${tokens.borderPurple}55`,
  },
  "& .MuiDataGrid-row:hover": {
    bgcolor: "#F8F6FF",
  },
  "& .MuiDataGrid-footerContainer": {
    borderTop: `1px solid ${tokens.borderPurple}`,
    bgcolor: tokens.surface,
  },
  "& .MuiTablePagination-root": {
    color: tokens.neutral,
    fontFamily: "Inter, sans-serif",
  },
  "& .MuiDataGrid-cell:focus, & .MuiDataGrid-cell:focus-within": {
    outline: "none",
  },
  "& .MuiDataGrid-columnHeader:focus, & .MuiDataGrid-columnHeader:focus-within": {
    outline: "none",
  },
};

export const primaryButtonSx = {
  bgcolor: tokens.purple,
  fontFamily: "Inter",
  fontWeight: 600,
  borderRadius: "10px",
  textTransform: "none",
  boxShadow: `0 4px 14px ${tokens.purple}33`,
  "&:hover": {
    bgcolor: tokens.purpleMid,
    transform: "translateY(-1px)",
    transition: "all 0.2s ease",
  },
};

export const outlineButtonSx = {
  borderColor: tokens.violet,
  color: tokens.violet,
  fontFamily: "Inter",
  fontWeight: 600,
  borderRadius: "10px",
  textTransform: "none",
  "&:hover": {
    bgcolor: tokens.purpleLight,
    borderColor: tokens.purple,
  },
};

export const deleteIconSx = {
  color: tokens.red,
  "&:hover": { bgcolor: tokens.redLight },
};