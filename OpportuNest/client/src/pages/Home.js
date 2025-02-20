import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Home() {
    const [searchTerm, setSearchTerm] = useState("");
    const navigate = useNavigate();

    const handleSearch = () => {
        navigate(`/jobs?search=${encodeURIComponent(searchTerm)}`);
    };

    return (
        <div className="main-body">
            <div className="header-container">
                <h1>Welcome to OpportuNest</h1>
                <p>Your go-to platform for local part-time and gig opportunities.</p>
                <div className="search-container">
                    <input
                        type="text"
                        className="search-bar"
                        placeholder="Search jobs..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>
            <div className="text-center">
                <button className="btn" onClick={handleSearch}>Browse Jobs</button>
                <Link to="/post-job">
                    <button className="btn ml-3">Post a Job</button>
                </Link>
            </div>
        </div>
    );
}

export default Home;
