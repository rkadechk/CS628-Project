import express from "express";
import { ObjectId } from "mongodb";
import multer from "multer";  // To handle file uploads
import { client } from "../db/conn.mjs"; // Use the named export
import axios from "axios"; // To interact with Ollama
import path from "path";

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./uploads");  // Directory where resumes will be stored
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));  // Append timestamp to file name
    },
});

const upload = multer({ storage: storage });

// 📌 POST a New Job
router.post("/", async (req, res) => {
    try {
        const { jobTitle, companyName, jobDescription } = req.body;

        if (!jobTitle || !companyName || !jobDescription) {
            return res.status(400).json({ success: false, error: "All fields are required" });
        }

        const db = client.db("JobFinder"); // Replace with your actual DB name
        const collection = db.collection("jobrecords"); // Ensure this collection exists
        const newJob = { jobTitle, companyName, jobDescription };

        const result = await collection.insertOne(newJob);
        res.status(201).json({ success: true, data: result });
    } catch (error) {
        console.error("Error adding job:", error);
        res.status(500).json({ success: false, error: "Failed to add job" });
    }
});

// 📌 GET all Jobs
router.get("/", async (req, res) => {
    try {
        const db = client.db("JobFinder"); // Replace with your actual DB name
        const collection = db.collection("jobrecords");
        const results = await collection.find({}).toArray();
        res.status(200).json({ success: true, data: results });
    } catch (error) {
        console.error("Error fetching jobs:", error);
        res.status(500).json({ success: false, error: "Failed to fetch jobs" });
    }
});

// 📌 GET a Job by ID
router.get("/:id", async (req, res) => {
    try {
        const db = client.db("JobFinder"); // Replace with your actual DB name
        const collection = db.collection("jobrecords");
        const query = { _id: new ObjectId(req.params.id) };

        const result = await collection.findOne(query);
        if (!result) {
            return res.status(404).json({ success: false, error: "Job not found" });
        }

        res.status(200).json({ success: true, data: result });
    } catch (error) {
        console.error("Error fetching job:", error);
        res.status(500).json({ success: false, error: "Failed to fetch job" });
    }
});

// 📌 GET Jobs by Keyword in Description
router.get("/description/:keyword", async (req, res) => {
    try {
        const keyword = req.params.keyword;

        if (!keyword) {
            return res.status(400).json({ success: false, error: "Keyword is required" });
        }

        const db = client.db("JobFinder"); // Replace with your actual DB name
        const collection = db.collection("jobrecords");

        // Search for jobs where the jobDescription contains the keyword
        const results = await collection.find({
            jobDescription: { $regex: keyword, $options: 'i' }  // Case-insensitive search
        }).toArray();

        if (results.length > 0) {
            res.status(200).json({ success: true, data: results });
        } else {
            res.status(404).json({ success: false, message: "No jobs found for the given keyword" });
        }
    } catch (error) {
        console.error("Error fetching jobs by keyword:", error);
        res.status(500).json({ success: false, error: "Failed to fetch jobs" });
    }
});

// 📌 PUT to Update a Job by ID
router.put("/:id", async (req, res) => {
    try {
        const { jobTitle, companyName, jobDescription } = req.body;
        const { id } = req.params;

        if (!jobTitle || !companyName || !jobDescription) {
            return res.status(400).json({ success: false, error: "All fields are required" });
        }

        const db = client.db("JobFinder");
        const collection = db.collection("jobrecords");

        const updatedJob = {
            jobTitle,
            companyName,
            jobDescription,
        };

        const result = await collection.updateOne(
            { _id: new ObjectId(id) }, // Match job by ID
            { $set: updatedJob }        // Update the job record
        );

        if (result.modifiedCount === 0) {
            return res.status(404).json({ success: false, error: "Job not found or no changes made" });
        }

        res.status(200).json({ success: true, data: updatedJob });
    } catch (error) {
        console.error("Error updating job:", error);
        res.status(500).json({ success: false, error: "Failed to update job" });
    }
});

// 📌 DELETE a Job by ID
router.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const db = client.db("JobFinder");
        const collection = db.collection("jobrecords");

        const result = await collection.deleteOne({ _id: new ObjectId(id) });

        if (result.deletedCount === 0) {
            return res.status(404).json({ success: false, error: "Job not found" });
        }

        res.status(200).json({ success: true, message: "Job deleted successfully" });
    } catch (error) {
        console.error("Error deleting job:", error);
        res.status(500).json({ success: false, error: "Failed to delete job" });
    }
});



// 📌 POST search jobs by skills and recommend with Ollama
router.post("/search-by-description", async (req, res) => {
    const { skills } = req.body;

    try {
        // Validate that skills is an array and properly formatted
        if (!skills || !Array.isArray(skills)) {
            return res.status(400).json({ message: "'skills' must be an array." });
        }

        const cleanedSkills = skills.map(skill => skill.trim()).join(" ");  // Combine skills into a single string

        console.log("Cleaned Skills:", cleanedSkills); // Log cleaned skills

        // Perform MongoDB search using the cleaned skills
        const db = client.db("JobFinder");
        const collection = db.collection("jobrecords");

        const jobs = await collection.find({
            $text: { $search: cleanedSkills }  // MongoDB's full-text search on jobDescription
        }).toArray();

        console.log("Retrieved Jobs:", jobs); // Log retrieved jobs to check if search is working

        if (jobs.length === 0) {
            return res.status(404).json({ message: "No jobs found with the provided skills" });
        }

        // Create a formatted string for Ollama, clearly structured
        const jobDescriptions = jobs.map(job => `${job.jobTitle} at ${job.companyName}: ${job.jobDescription}`).join("\n");

        console.log("Job Descriptions Sent to Ollama:", jobDescriptions); // Log job descriptions

        // Send the job descriptions to Ollama
        const ollamaResponse = await axios.post("http://localhost:11434/api/generate", {
            prompt: `Given the following job descriptions, recommend suitable positions for someone skilled in ${cleanedSkills}: \n${jobDescriptions}`,
            max_tokens: 100,
            model: "gemma2:2b",
        }, {
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const ollamaData = ollamaResponse.data.text || "No suitable jobs found based on Ollama's analysis.";

        console.log("Ollama Response:", ollamaData); // Log Ollama's response

        res.json({
            message: ollamaData,
        });
    } catch (error) {
        console.error("Error searching jobs:", error);
        res.status(500).json({ message: "Error processing the job search request" });
    }
});
// Serve static files from the "uploads" directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
router.use("/uploads", express.static(path.join(__dirname, "uploads")));

// 📌 POST a New Job Application
router.post("/applications", upload.single("resume"), async (req, res) => {
    try {
        const { name, email, phone, address, jobId } = req.body;
        const resume = req.file; // Access the uploaded file

        // Validate required fields
        if (!name || !email || !phone || !address || !jobId || !resume) {
            return res.status(400).json({ success: false, error: "All fields are required, including the resume file." });
        }

        const db = client.db("JobFinder");
        const collection = db.collection("applications"); // Create a new collection for applications

        // Save the application data to the database
        const newApplication = {
            name,
            email,
            phone,
            address,
            jobId: new ObjectId(jobId), // Convert jobId to ObjectId
            resumePath: resume.path, // Save the file path to the database
            createdAt: new Date(),
        };

        const result = await collection.insertOne(newApplication);

        res.status(201).json({ success: true, data: result });
    } catch (error) {
        console.error("Error submitting application:", error);
        res.status(500).json({ success: false, error: "Failed to submit application" });
    }
});

export default router;
