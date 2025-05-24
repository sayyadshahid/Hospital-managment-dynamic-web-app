import { useLocation, useNavigate, useParams } from "react-router-dom";
import "./../pages/Home.css"
 

const NavBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
 
  
  return (
    <>
     
          <div className="nav">
            <div className="logo">
              <h2>Jacsto</h2>
            </div>
            <div className="list">
              <ul>
                <li  onClick={() => navigate("/")}>home</li>
                <li  onClick={() => navigate("#")}>about</li>
                <li onClick={() => navigate("/login")}>Login</li>
                <li onClick={() => navigate("/register")}>Signin</li>
                <li id="sos-btn">
                  <button>SOS</button>
                </li>
              </ul>
            </div>
          </div>
         
         
    </>
  );
};

export default NavBar;
