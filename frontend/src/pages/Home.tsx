import React from 'react';
import { useLocation, useNavigate, useParams } from "react-router-dom";
import "./Home.css";
import NavBar from "../components/header";


import { useEffect, useState } from "react";
import axios from "axios";

const LandingPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = location.state || {};
  const [name, setName] = useState<string>("");

  useEffect(() => {
    const fetchName = async () => {
      try {
        const res = await axios.get(`http://localhost:8000/api/users/${id}`);
        setName(res.data.user["fullname"]);
      } catch (error: any) {
        // const errMsg = error?.response?.data?.msg || "Somthing Went Wrong !!";
        // toast.error(errMsg);
        console.log(error);
      } finally {
        console.log("heyyyyyyyyyyyyy");
      }
    };
    fetchName();
  }, []);

  return (
    <>
      <div className="main-p">
        <div className="landingpage">
          <NavBar />
          <div className="container">
            <div className="left">
              <div className="content-left">
                <h1>The Jacsto,</h1>
                <p>This Is A Largest Hospital Management Website,</p>
                <p>
                  To Book Yours Good Hospital With Better Treatment, so what you
                  think <br />{" "}
                  <span style={{ fontWeight: 600, lineHeight: 4 }}>{name}</span>
                </p>
                <button
                  className="left-btn"
                  id="book-host"
                  onClick={() => navigate("/hospitalList")}
                >
                  Book Your Hospital
                </button>
              </div>
            </div>
            <div className="right">
              <div className="img">
                <img src="./hospital.png" alt="hospital" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LandingPage;
