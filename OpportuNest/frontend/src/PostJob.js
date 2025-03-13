import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./styles.css";
import Header from "./Header";

function PostJob() {
    const [job, setJob] = useState({
        jobTitle: "",
        companyName: "",
        jobDescription: "",
    });

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validation: Ensure all fields are filled
        if (!job.jobTitle.trim() || !job.companyName.trim() || !job.jobDescription.trim()) {
            alert("Please fill out all fields.");
            return;
        }

        try {
            const response = await fetch("http://localhost:5051/jobrecords", { // Updated endpoint
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(job),
            });

            console.log(job); // Log the job object for debugging

            if (response.ok) {
                navigate("/jobs"); // Redirect to Jobs list page
            } else {
                const errorData = await response.json();
                alert(`Failed to post job: ${errorData.message || "Please try again."}`);
            }
        } catch (error) {
            console.error("Error posting job:", error);
            alert("An error occurred. Please try again.");
        }
    };

    return (
        <div className="main-body">
            <Header />
            <h1 style={{ textAlign: "center" }}>Post a Job</h1> {/* Center align heading */}
            <form onSubmit={handleSubmit} className="job-form">
                <div className="form-group">
                    <label htmlFor="jobTitle">Job Title</label>
                    <input
                        type="text"
                        id="jobTitle"
                        placeholder="Enter job title"
                        value={job.jobTitle}
                        onChange={(e) => setJob({ ...job, jobTitle: e.target.value })}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="companyName">Company Name</label>
                    <input
                        type="text"
                        id="companyName"
                        placeholder="Enter company name"
                        value={job.companyName}
                        onChange={(e) => setJob({ ...job, companyName: e.target.value })}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="jobDescription">Job Description</label>
                    <textarea
                        id="jobDescription"
                        placeholder="Enter job description"
                        value={job.jobDescription}
                        onChange={(e) => setJob({ ...job, jobDescription: e.target.value })}
                        required
                    />
                </div>
                <div style={{ textAlign: "center", marginTop: "20px" }}>
                    <button type="submit" className="btn post-job">Post a Job</button>
                </div>
            </form>
        </div>
    );
}

export default PostJob;
