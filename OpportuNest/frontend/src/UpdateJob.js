import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./styles.css";
import Header from "./Header"; // Import the Header component

function UpdateJob() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [job, setJob] = useState({
        jobTitle: "",
        companyName: "",
        jobDescription: "",
    });

    useEffect(() => {
        const fetchJob = async () => {
            try {
                const response = await fetch(`http://localhost:5051/jobrecords/${id}`);
                console.log("RESPONSE", response);
                if (!response.ok) {
                    throw new Error("Failed to fetch job details");
                }
                const data = await response.json();
                console.log("data", data);
                // Ensure you're accessing the correct structure of the response
                if (data.success && data.data) {
                    setJob(data.data); // Assuming response format is { success: true, data: jobDetails }
                } else {
                    throw new Error("Failed to fetch job details");
                }
            } catch (error) {
                console.error("Error fetching job:", error);
                alert("Failed to fetch job details. Please try again.");
            }
        };

        fetchJob();
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validation: Ensure all fields are filled
        if (!job.jobTitle.trim() || !job.companyName.trim() || !job.jobDescription.trim()) {
            alert("Please fill out all fields.");
            return;
        }
        console.log("id", id);
        try {
            const response = await fetch(`http://localhost:5051/jobrecords/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    jobTitle: job.jobTitle,
                    companyName: job.companyName,
                    jobDescription: job.jobDescription,
                }),
            });

            const data = await response.json();
            if (response.ok) {
                alert("Job updated successfully!");
                navigate("/jobs"); // Redirect to Jobs list page
            } else {
                alert(`Failed to update job: ${data.message || "Please try again."}`);
            }
        } catch (error) {
            console.error("Error updating job:", error);
            alert("An error occurred. Please try again.");
        }
    };

    return (
        <div className="main-body">
            <Header /> {/* Use the Header component */}
            <h1>Update Job</h1>
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
                <button type="submit" className="btn submit-btn">Update Job</button>
            </form>
        </div>
    );
}

export default UpdateJob;
