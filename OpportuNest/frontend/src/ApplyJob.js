import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./styles.css";
import Header from "./Header"; // Import the Header component

function ApplyJob({ onApply }) {
    const { id } = useParams();
    const navigate = useNavigate();
    const [application, setApplication] = useState({
        name: "",
        email: "",
        phone: "",
        address: "",
        resume: null,
    });

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Check if all required fields are filled
        if (!application.name.trim() || !application.email.trim() || !application.phone.trim() || !application.address.trim() || !application.resume) {
            alert("Please fill out all fields and upload a resume.");
            return;
        }

        // Prepare the FormData
        const formData = new FormData();
        formData.append("name", application.name);
        formData.append("email", application.email);
        formData.append("phone", application.phone);
        formData.append("address", application.address);
        formData.append("resume", application.resume);
        formData.append("jobId", id);

        try {
            // Send the application data to the server
            const response = await fetch("http://localhost:5051/jobrecords", {
                method: "POST",
                body: formData, // Automatically sets the correct Content-Type
            });

            if (response.ok) {
                alert("Application submitted successfully!");
                onApply(id); // Update the appliedJobs state
                navigate("/jobs"); // Redirect to the jobs list page
            } else {
                const errorText = await response.text(); // Read the response as text
                console.error("Server response:", errorText);
                alert(`Failed to submit application: ${response.status} ${response.statusText}`);
            }
        } catch (error) {
            console.error("Error submitting application:", error);
            alert("An error occurred. Please try again.");
        }
    };

    return (
        <div className="main-body">
            <Header /> {/* Use the Header component */}
            <h1>Apply for Job</h1>
            <form onSubmit={handleSubmit} className="apply-form">
                <div className="form-group">
                    <label htmlFor="name">Full Name</label>
                    <input
                        type="text"
                        id="name"
                        placeholder="Enter your full name"
                        value={application.name}
                        onChange={(e) => setApplication({ ...application, name: e.target.value })}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        id="email"
                        placeholder="Enter your email"
                        value={application.email}
                        onChange={(e) => setApplication({ ...application, email: e.target.value })}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="phone">Phone Number</label>
                    <input
                        type="tel"
                        id="phone"
                        placeholder="Enter your phone number"
                        value={application.phone}
                        onChange={(e) => setApplication({ ...application, phone: e.target.value })}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="address">Address</label>
                    <input
                        type="text"
                        id="address"
                        placeholder="Enter your address"
                        value={application.address}
                        onChange={(e) => setApplication({ ...application, address: e.target.value })}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="resume">Upload Resume</label>
                    <input
                        type="file"
                        id="resume"
                        onChange={(e) => setApplication({ ...application, resume: e.target.files[0] })}
                        required
                    />
                </div>
                <button type="submit" className="btn submit-btn">Submit Application</button>
            </form>
        </div>
    );
}

export default ApplyJob;