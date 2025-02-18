import React, { useState, useEffect } from "react";
import axios from "axios";

function Jobs() {
    const [jobs, setJobs] = useState([]);

    useEffect(() => {
        axios
            .get("http://localhost:5000/api/jobs")
            .then((response) => setJobs(response.data))
            .catch((error) => console.log(error));
    }, []);

    return (
        <div className="container">
            <h1 className="header">Available Jobs</h1>
            <div className="list-group">
                {jobs.map((job) => (
                    <div key={job._id} className="list-group-item">
                        <h5>{job.title}</h5>
                        <p>{job.description}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Jobs;
