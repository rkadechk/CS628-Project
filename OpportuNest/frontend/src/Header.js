// Header.js
import React from "react";
import { useNavigate } from "react-router-dom";
import logo from "./logo.png"; // Add your logo file
import "./styles.css";

function Header() {
    const navigate = useNavigate();

    return (
        <header className="header">
            <h1 className="header-title">
                <img src={logo} alt="OpportuNest Logo" />
                OpportuNest
            </h1>
            <button className="btn home-btn" onClick={() => navigate("/")}>Home</button>
        </header>
    );
}

export default Header;