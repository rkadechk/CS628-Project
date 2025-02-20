import React, { useState } from "react";
import axios from "axios";

const PostJob = () => {
    const [jobTitle, setJobTitle] = useState("");
    const [jobDescription, setJobDescription] = useState("");
    const [message, setMessage] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!jobTitle || !jobDescription) {
            setMessage("Please fill in all fields.");
            return;
        }

        try {
            const response = await axios.post("https://super-duper-fiesta-r47vwrj5xwwxc5rx-5000.app.github.dev/api/jobs", {
                title: jobTitle,
                description: jobDescription,
            });

            if (response.status === 201) {
                setMessage("Job posted successfully!");
                setJobTitle("");
                setJobDescription("");
            }
        } catch (error) {
            console.error("Error posting job:", error);
            setMessage("Error posting job.");
        }
    };

    return (
        <div>
            <h2>Post a Job</h2>
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
                <button type="submit">Post Job</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
};

export default PostJob;

