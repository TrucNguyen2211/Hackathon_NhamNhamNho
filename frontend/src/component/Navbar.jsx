import React from "react";
import "./Navbar.css";
import AppLogo from "/logo.svg";

import { Link } from "react-router-dom";

export const Navbar = () => {
    return (
        <div className="navbar-outer">
            <div className="navbar">
                <Link to="/">
                    <img src = {AppLogo} alt="logo"/>
                </Link>
                <ul>
                    <li>
                        <Link to="/">Home</Link>
                    </li>
                    <li>
                        <Link to="/">About</Link>
                    </li>
                    <li>
                        <Link to="/chat">Chat</Link>
                    </li>
                    <li>
                        <Link to="/schedule">Schedule</Link>
                    </li>
                    <li>
                        <Link to="/home#calendar-box">Calendar</Link>
                    </li>
                </ul>
                <ul>
                    <li>
                        <Link to="/">Login</Link>
                    </li>
                    <li>
                        <Link to="/">Sign Up</Link>
                    </li>
                </ul>
            </div>
        </div>
    );
};

// export default Navbar;