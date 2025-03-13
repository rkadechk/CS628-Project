import React from "react";
import { Link } from "react-router-dom";
import "./styles.css";
import logo from "./logo.png"; // Add your logo file
import Chatbot from "./Chatbot";  // Import the Chatbot component

function Home() {
    return (
        <div className="main-body">
            <div className="home-container">
                <img src={logo} alt="OpportuNest Logo" />
                <h1>Welcome to OpportuNest</h1>
                <p>Your go-to platform for local part-time and gig opportunities.</p>
                <div className="home-buttons">
                    <Link to="/jobs">
                        <button className="btn browse-jobs">Browse Jobs</button>
                    </Link>
                    <Link to="/post-job">
                        <button className="btn post-job">Post a Job</button>
                    </Link>
                </div>
            </div>
            <footer className="footer">
                <p>&copy; 2023 OpportuNest. All rights reserved.</p>
                <p>
                    <a href="/about">About</a> | <a href="/contact">Contact</a> | <a href="/privacy">Privacy Policy</a>
                </p>
            </footer>

            {/* Add Chatbot component here */}
            <Chatbot />
        </div>
    );
}

export default Home;
