const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const jobRoutes = require("./routes/job");

const app = express();
// CORS configuration to allow frontend URL (if using GitHub Codespaces)
const corsOptions = {
    origin: "https://super-duper-fiesta-r47vwrj5xwwxc5rx-3000.app.github.dev", // your frontend URL
    methods: ["GET", "POST"], // specify allowed methods
    allowedHeaders: ["Content-Type"], // specify allowed headers
};

app.use(cors(corsOptions)); // Apply CORS middleware

// Middleware
app.use(express.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect("mongodb+srv://kadechkarreemaramch:IIGA0dgGuVvLwTsH@cs628project.vy3nr.mongodb.net/CS628Project", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log("Connected to MongoDB"))
.catch((error) => console.error("Error connecting to MongoDB:", error));

// Routes
app.use("/api/jobs", jobRoutes);

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))

app.get("/", (req, res) => {
    res.send("Welcome to the API!");
});
