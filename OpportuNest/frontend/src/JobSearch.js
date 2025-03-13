import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import "./styles.css";

function JobSearch() {
  const { keyword } = useParams();  // Get the keyword from the URL
  const [jobs, setJobs] = useState([]);
  const [aiResponse, setAiResponse] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        // Send the keyword to the backend API
        const response = await axios.get(`http://localhost:5051/jobrecords/description${keyword}`);
        setJobs(response.data.jobs);
        setAiResponse(response.data.aiResponse);  // The AI-enhanced response from Ollama
      } catch (error) {
        console.error("Error fetching jobs:", error);
        setAiResponse("There was an error fetching the jobs. Please try again later.");
      }
      setLoading(false);
    };

    fetchJobs();  // Trigger job fetch on component mount
  }, [keyword]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="job-search-container">
      <h2>Jobs related to "{keyword}"</h2>
      <div className="ai-response">
        <h3>AI Insights:</h3>
        <p>{aiResponse}</p>
      </div>
      <div className="job-list">
        {jobs.length > 0 ? (
          jobs.map((job, index) => (
            <div key={index} className="job-item">
              <h4>{job.jobTitle} at {job.companyName}</h4>
              <p>{job.description}</p>
            </div>
          ))
        ) : (
          <p>No jobs found for this skill set.</p>
        )}
      </div>
    </div>
  );
}

export default JobSearch;
