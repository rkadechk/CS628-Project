import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./home";
import Jobs from "./Jobs";
import PostJob from "./PostJob";
import ApplyJob from "./ApplyJob";
import UpdateJob from "./UpdateJob";
import JobSearch from "./JobSearch";  // New JobSearch component for job search by description
import WebSocketComponent from "./WebSocketComponent";  // Import WebSocketComponent
import "./styles.css"; // Ensure this file exists in the correct path

function App() {
    // Optional: Define a function to handle job applications
    const handleApply = (id) => {
        console.log(`User applied for job ID: ${id}`);
        // Add logic here (e.g., update state, show success message)
    };

    return (
        <div className="app-container"> {/* Optional wrapper for styling */}
            <WebSocketComponent /> {/* WebSocket component added here */}
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/jobs" element={<Jobs />} />
                <Route path="/post-job" element={<PostJob />} />
                <Route path="/apply-job/:id" element={<ApplyJob onApply={handleApply} />} />
                <Route path="/update-job/:id" element={<UpdateJob />} />
                <Route path="/job-search/:keyword" element={<JobSearch />} />  {/* New route for job search */}
            </Routes>
        </div>
    );
}

export default App;
