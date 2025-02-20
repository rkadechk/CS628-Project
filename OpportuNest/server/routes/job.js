const express = require("express");
const router = express.Router();
const Job = require("../models/Job");

// Route to handle job posting
router.post("/", async (req, res) => {
    try {
        console.log(req.body);
        const { title, description } = req.body;

        // Validate input fields
        if (!title || !description) {
            return res.status(400).json({ message: "All fields are required." });
        }

        const newJob = new Job({ title, description });
        await newJob.save();

        res.status(201).json({ message: "Job posted successfully!", job: newJob });
    } catch (error) {
        console.log(error);
        console.error("Error while posting job:", error);
        res.status(500).json({ message: "Error posting job." });
    }
});

module.exports = router;
