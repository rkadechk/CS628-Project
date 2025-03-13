import { MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config();  // Load environment variables

const uri = process.env.MONGO_URI;

if (!uri) {
    throw new Error("MongoDB connection string is undefined. Check your .env file.");
}

const client = new MongoClient(uri);

// Connecting to the database
const connectDB = async () => {
    try {
        await client.connect();
        console.log("Connected to MongoDB");
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
    }
};

// Export the connection and the client object for use in other files
export { connectDB, client };
