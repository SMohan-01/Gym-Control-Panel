import React from "react";
import "../styles/Home.css";
import { useNavigate } from "react-router-dom";

const Home = () => {
 const navigate = useNavigate();

  return (
    <div className="header-container">
      <img
        src="/images/Home Picture.jpg"
        alt="Shield Auth"
        className="header-image"
      />

      <h5>
        Hey, Gym Freaks
        <span role="img" aria-label="hi">
          👋
        </span>
      </h5>

      <h1>Welcome To Our Platform, Solid Fitness</h1>

      <p>
        Solid Fitness is your all-in-one platform for managing members, tracking
        progress, scheduling workouts, and powering your fitness business with
        ease.
      </p>

      <button className="get-started-btn" onClick={()=> {navigate("/activities")}}>Manage Members</button>
      <button className="get-started-btn" onClick={()=> {navigate("/dashboard")}}>DashBoard</button>
    </div>
  );
};

export default Home;
