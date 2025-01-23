import React from "react";
import "./HomeCarousel.css"; // Assuming the CSS is saved in this file
import { Link } from "react-router-dom";

const HomeCarousel = () => {
    const today = new Date();
    const formattedDate = today.toLocaleDateString("en-US", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

  return (
    <div className="carousel">
      <h3>{formattedDate.toUpperCase()}</h3>
      <h1>Felling Unwell?</h1>
    <Link to="/chat">
        <button className="track-button">CHAT NOW</button>
    </Link>
    </div>
  );
};

export default HomeCarousel;
