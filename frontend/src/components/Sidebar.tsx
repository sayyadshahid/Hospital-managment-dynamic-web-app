import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import useLocalStorage from "../hooks/useLocalhost";

interface SidebarProps {
  menuItems: { label: string; path: string; icon?: string }[];
}

const Sidebar = ({ menuItems }: SidebarProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [_, __, removeUser] = useLocalStorage("user", null);

  const handleLogout = () => {
    removeUser();
    navigate("/login");
  };

  return (
    <div style={{
      width: 240, minHeight: "100vh", background: "#1a1a2e", color: "#fff",
      display: "flex", flexDirection: "column", padding: "20px 0"
    }}>
      <h3 style={{ padding: "0 20px", marginBottom: 30, color: "#fa6039" }}>Hospital Mgmt</h3>
      {menuItems.map((item) => (
        <div
          key={item.path}
          onClick={() => navigate(item.path)}
          style={{
            padding: "12px 20px", cursor: "pointer", display: "flex", alignItems: "center", gap: 10,
            background: location.pathname === item.path ? "#fa6039" : "transparent",
            color: location.pathname === item.path ? "#fff" : "#ccc",
            borderLeft: location.pathname === item.path ? "4px solid #fff" : "4px solid transparent",
          }}
        >
          <span>{item.icon || "•"}</span>
          <span>{item.label}</span>
        </div>
      ))}
      <div style={{ flex: 1 }} />
      <div
        onClick={handleLogout}
        style={{ padding: "12px 20px", cursor: "pointer", color: "#ff6b6b", borderTop: "1px solid #333" }}
      >
        Logout
      </div>
    </div>
  );
};

export default Sidebar;
