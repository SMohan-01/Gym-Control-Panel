import React, { useContext, useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/MenuBar.css";
import { AppContext } from "../context/AppContext";
import { toast } from "react-toastify";
import axios from "axios";

const MenuBar = () => {
  const navigate = useNavigate();
  const [isDropDownOpen, setIsDropDownOpen] = useState(false);
  const dropDownRef = useRef(null);
  const { adminData, BACKENDURL, setIsLoggedIn, setAdminData } =
    useContext(AppContext);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropDownRef.current && !dropDownRef.current.contains(event.target)) {
        setIsDropDownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async (e) => {
    axios.defaults.withCredentials = true;
    try {
      const response = await axios.get(`${BACKENDURL}/logout`);
      if (response.status === 200) {
        localStorage.removeItem("Token");
        setIsLoggedIn(false);
        setAdminData(false);
        navigate("/");
        toast.success("Logout Successfull!");
      } else {
        toast.error("Error While Logout");
      }
    } catch (error) {
      toast.error(error);
    }
  };

  return (
    <nav className="menu-bar">
      <Link to = "/"  className="menu-link">
        <div className="menu-logo">
          <img src="/images/Home Picture.jpg" alt="Logo" />
          <span className="menu-title">SOLID FITNESS</span>
        </div>
      </Link>

      {adminData ? (
        <div className="dropdown-container" ref={dropDownRef}>
          <div
            className="user-avatar"
            onClick={() => setIsDropDownOpen((prev) => !prev)}
          >
            {adminData.name[0].toUpperCase()}
          </div>

          {isDropDownOpen && (
            <div className="dropdown-menu">
              <div
                className="dropdown-item"
                onClick={(e) => {
                  handleLogout();
                }}
              >
                Logout
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="login-container">
          <button
            className="log-button"
            onClick={() => {
              navigate("/login");
            }}
          >
            Login <span className="arrow">→</span>
          </button>
        </div>
      )}
    </nav>
  );
};

export default MenuBar;
