import React from "react";
import GuestNavBar from "./navbars/GuestNav";
import UserNavBar from "./navbars/UserNav";

const NavBar = () => {
  const token = localStorage.getItem("access_token");

  return token ? <UserNavBar /> : <GuestNavBar />;
};

export default NavBar;
