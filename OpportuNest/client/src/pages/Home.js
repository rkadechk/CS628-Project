import React from "react";
import { Link } from "react-router-dom";

function Home() {
    return (
        <div className="container">
            <div className="header">
                <h1>Welcome to OpportuNest</h1>
                <p>Your go-to platform for local part-time and gig opportunities.</p>
            </div>
            <div className="text-center">
                <Link to="/jobs">
                    <button className="btn btn-primary">Browse Jobs</button>
                </Link>
                <Link to="/post-job">
                    <button className="btn btn-success ml-3">Post a Job</button>
                </Link>
            </div>
        </div>
    );
}

export default Home;
