import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";

function Jobs() {
    const [jobs, setJobs] = useState([]);
    const [filteredJobs, setFilteredJobs] = useState([]);
    const location = useLocation();

    useEffect(() => {
        axios
            //.get("http://localhost:5000/api/jobs")
            .get("https://super-duper-fiesta-r47vwrj5xwwxc5rx-5000.app.github.dev/api/jobs")
            .then((response) => {
                setJobs(response.data);
                setFilteredJobs(response.data);
            })
            .catch((error) => console.log(error));
    }, []);

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const searchQuery = queryParams.get("search")?.toLowerCase() || "";

        if (searchQuery) {
            const filtered = jobs.filter((job) =>
                job.title.toLowerCase().includes(searchQuery) ||
                job.description.toLowerCase().includes(searchQuery)
            );
            setFilteredJobs(filtered);
        } else {
            setFilteredJobs(jobs);
        }
    }, [location.search, jobs]);

    return (
        <div className="container">
            <h1 className="header">Available Jobs</h1>
            <div className="list-group">
                {filteredJobs.length > 0 ? (
                    filteredJobs.map((job) => (
                        <div key={job._id} className="list-group-item">
                            <h5>{job.title}</h5>
                            <p>{job.description}</p>
                        </div>
                    ))
                ) : (
                    <p>No jobs matching your search criteria.</p>
                )}
            </div>
        </div>
    );
}

export default Jobs;

