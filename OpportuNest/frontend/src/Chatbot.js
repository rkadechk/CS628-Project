import React, { useState } from "react";
import './styles.css';
import { Link } from "react-router-dom";
import ChatIcon from './chatbot.png'; // Import your chatbot icon

const Chatbot = () => {
    const [messages, setMessages] = useState([
        { text: "Hello! Enter a keyword to search for jobs by description.", sender: "bot" },
    ]);
    const [input, setInput] = useState("");
    const [isChatOpen, setIsChatOpen] = useState(false); // State to control chatbot visibility

    // Function to call the backend and search jobs by description (keyword)
    const searchJobsByDescription = async (keyword) => {
        try {
            const response = await fetch(`http://localhost:5051/jobrecords/description/${keyword}`, {
                method: "GET",
                headers: { "Content-Type": "application/json" },
            });

            const data = await response.json();

            // Ensure the response has the correct structure (data.data)
            if (data.success && data.data && data.data.length > 0) {
                return data.data.map((job) => ({
                    id: job._id, // Include the job ID
                    jobTitle: job.jobTitle,
                    companyName: job.companyName,
                    jobDescription: job.jobDescription, // Preserve the original description
                }));
            } else {
                return [];
            }
        } catch (error) {
            console.error("Error searching jobs by description:", error);
            return [];
        }
    };

    // Handles sending messages and searching for jobs
    const handleSend = async () => {
        if (!input.trim()) return;

        const userMessage = { text: input, sender: "user" };
        setMessages((prev) => [...prev, userMessage]);

        // Search jobs by the keyword entered by the user
        const jobs = await searchJobsByDescription(input);

        console.log("Jobs:", jobs);  // Log the jobs to see what we're getting

        if (jobs.length > 0) {
            // Create a list of job descriptions with links to apply
            const jobMessages = jobs.map((job) => (
                <div key={job.id} className="search-result">
                    <h3>{job.jobTitle} at {job.companyName}</h3>
                    <pre className="job-description">{job.jobDescription}</pre>
                    {job.id && (
                        <Link to={`/apply-job/${job.id}`} style={{ color: 'blue' }}>
                            Apply Now
                        </Link>
                    )}
                </div>
            ));

            const botMessage = { text: jobMessages, sender: "bot" };
            setMessages((prev) => [...prev, botMessage]);
        } else {
            const botMessage = { text: "No jobs found.", sender: "bot" };
            setMessages((prev) => [...prev, botMessage]);
        }

        setInput(""); // Clear input field
    };

    // Toggle chatbot visibility
    const toggleChat = () => {
        setIsChatOpen(!isChatOpen);
    };

    return (
        <div className="chatbot-container">
            {/* Chatbot toggle button */}
            <button className="chatbot-toggle" onClick={toggleChat}>
                <img src={ChatIcon} alt="Chat" width="40" height="40" /> {/* Use your chatbot icon */}
            </button>

            {/* Chatbot window */}
            {isChatOpen && (
                <div className="chat-container">
                    <div className="chat-box">
                        {messages.map((msg, index) => (
                            <div key={index} className={`message ${msg.sender}`}>
                                {msg.text}
                            </div>
                        ))}
                    </div>
                    <div className="input-box">
                        <input
                            type="text"
                            placeholder="Enter job description keyword"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={(e) => e.key === "Enter" && handleSend()}
                        />
                        <button onClick={handleSend}>Send</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Chatbot;