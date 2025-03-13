import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./styles.css";
import Header from "./Header";

function Jobs() {
    const [jobs, setJobs] = useState([]);
    const [appliedJobs, setAppliedJobs] = useState([]);
    const [expandedDescriptions, setExpandedDescriptions] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        fetchJobs();  // Fetch jobs when the component mounts
    }, []);

    const fetchJobs = async () => {
        try {
            const response = await fetch("http://localhost:5051/jobrecords"); // Check if this is the correct endpoint
            if (!response.ok) {
                throw new Error("Failed to fetch jobs");
            }
            const data = await response.json();
            console.log(data);  // Check the structure of the data returned
            setJobs(data.data);  // Ensure you're accessing the correct property from the response
        } catch (error) {
            console.error("Error fetching jobs:", error);
            alert("Failed to fetch jobs. Please try again.");
        }
    };

    const formatDateTime = (timestamp) => {
        if (!timestamp) return "N/A"; // Handle missing timestamps
        const date = new Date(timestamp);
        return isNaN(date.getTime()) ? "Invalid Date" : date.toLocaleString();
    };

    const handleDelete = async (id) => {
        try {
            const response = await fetch(`http://localhost:5051/jobrecords/${id}`, {
                method: "DELETE",
            });
            if (response.ok) {
                fetchJobs();  // Refresh job list after deletion
            } else {
                alert("Failed to delete job. Please try again.");
            }
        } catch (error) {
            console.error("Error deleting job:", error);
        }
    };

    const handleApply = (id) => {
        setAppliedJobs([...appliedJobs, id]);
    };

    const toggleDescription = (id) => {
        setExpandedDescriptions((prev) => ({
            ...prev,
            [id]: !prev[id], // Toggle description visibility
        }));
    };

    return (
        <div className="main-body">
            <Header />
            <h1>Job Listings</h1>
            <div className="jobs-list">
                {jobs.length > 0 ? (
                    jobs.map((job) => {
                        const isExpanded = expandedDescriptions[job._id] || false;
                        return (
                            <div key={job._id} className="job-card">
                                <div className="job-header">
                                    <h2>{job.jobTitle}</h2> {/* Use jobTitle, not jobTile */}
                                    <p><strong>Company:</strong> {job.companyName}</p>
                                    <p>
                                        <strong>Description:</strong>{" "}
                                        <span className="description-container">
                                            <span
                                                className={`description ${isExpanded ? "expanded" : ""}`}
                                                onClick={() => toggleDescription(job._id)}
                                            >
                                                {isExpanded ? job.jobDescription : job.jobDescription.split("\n")[0]}
                                            </span>
                                            <span
                                                className="dropdown-arrow"
                                                onClick={() => toggleDescription(job._id)}
                                            >
                                                {isExpanded ? "▴" : "▾"}
                                            </span>
                                        </span>
                                    </p>
                                    
                                </div>
                                <div className="job-actions">
                                    {appliedJobs.includes(job._id) ? (
                                        <button className="btn applied" disabled>Applied</button>
                                    ) : (
                                        <Link to={`/apply-job/${job._id}`}>
                                            <button className="btn apply" onClick={() => handleApply(job._id)}>Apply Job</button>
                                        </Link>
                                    )}
                                    <button
                                        className="btn update"
                                        onClick={() => navigate(`/update-job/${job._id}`)}
                                    >
                                        Update Job
                                    </button>
                                    <button
                                        className="btn delete"
                                        onClick={() => handleDelete(job._id)}
                                    >
                                        Delete Job
                                    </button>
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <p>No jobs available.</p>
                )}
            </div>
            <Link to="/post-job">
                <button className="btn post-job">Post a Job</button>
            </Link>
        </div>
    );
}

export default Jobs;
