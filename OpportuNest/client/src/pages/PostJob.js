import React, { useState } from "react";
import axios from "axios";

function PostJob() {
    const [jobTitle, setJobTitle] = useState("");
    const [jobDescription, setJobDescription] = useState("");
    const [message, setMessage] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!jobTitle || !jobDescription) {
            setMessage("Please fill in all fields.");
            return;
        }

        axios
            .post("http://localhost:5000/api/jobs", {
                title: jobTitle,
                description: jobDescription,
            })
            .then((response) => {
                setMessage("Job posted successfully!");
                setJobTitle("");
                setJobDescription("");
            })
            .catch((error) => {
                console.log(error);
                setMessage("Error posting job.");
            });
    };

    return (
        <div className="container">
            <h1 className="header">Post a Job</h1>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Job Title"
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                />
                <textarea
                    placeholder="Job Description"
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                />
                <button type="submit" className="btn btn-success">
                    Post Job
                </button>
            </form>
            {message && <p className="mt-3">{message}</p>}
        </div>
    );
}

export default PostJob;
