const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        await mongoose.connect(
            "mongodb+srv://kadechkarreemaramch:IIGA0dgGuVvLwTsH@cs628project.vy3nr.mongodb.net/",
            { useNewUrlParser: true, useUnifiedTopology: true }
        );
        console.log("MongoDB Connected...");
    } catch (err) {
        console.error(err.message);
        process.exit(1);
    }
};

module.exports = connectDB;

