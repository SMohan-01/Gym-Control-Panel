import React, { useContext, useState } from "react";
import "../styles/Login.css";
import { AppContext } from "../context/AppContext.js";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { setIsLoggedIn, BACKENDURL, getAdminData } = useContext(AppContext);
  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();
    axios.defaults.withCredentials = true;
    setLoading(true);
    try {
      const loginResponse = await axios.post(BACKENDURL + "/login", {
        emailAddress,
        password,
      });
      if (loginResponse.status === 200) {
        setIsLoggedIn(true);
        localStorage.setItem("Token", loginResponse.data.Token);
        await getAdminData(emailAddress);
        navigate("/");
        toast.success("Login Successfully!");
      } else {
        toast.error("EmailAddress or Password is Incorrect!");
      }
    } catch (error) {
      toast.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h2>LOGIN</h2>
        <form onSubmit={submitHandler}>
          <div className="form-group">
            <label htmlFor="emailAddress" className="form-label">
              Email Address
            </label>
            <input
              type="text"
              name="emailAddress"
              className="form-control"
              onChange={(e) => {
                setEmailAddress(e.target.value);
              }}
              value={emailAddress}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input
              type="password"
              name="password"
              className="form-control"
              onChange={(e) => {
                setPassword(e.target.value);
              }}
              value={password}
              required
            />
          </div>

          <button type="submit" className="login-button" disabled={loading}>
            {loading ? "Loading.." : "LOGIN"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
