import express from "express";
import cors from "cors";
import jobRecordsRouter from "./routes/jobrecords.mjs"; // Ensure this path is correct
import { WebSocketServer } from "ws"; // Correct way to import WebSocketServer in ES Module

const app = express();
const wss = new WebSocketServer({ noServer: true }); // Initialize WebSocket server

// Middleware for CORS and JSON parsing
app.use(cors());
app.use(express.json()); // Important for handling JSON requests

// ✅ Mount the job records routes correctly
app.use("/jobrecords", jobRecordsRouter); // Job records API mounted at /jobrecords
app.use("/applications", jobRecordsRouter);

// WebSocket connection handling
wss.on("connection", (ws) => {
  console.log("New WebSocket connection");

  // Handle messages from the WebSocket client
  ws.on("message", (message) => {
    console.log("Received message:", message);
    // Respond back to the WebSocket client
    ws.send(`Echo: ${message}`);
  });

});

// Handling upgrade requests for WebSocket
app.server = app.listen(process.env.PORT || 5051, () => {
  console.log(`Server running on port ${process.env.PORT || 5051}`);
});

// Integrating WebSocket with the Express server
app.server.on("upgrade", (request, socket, head) => {
  wss.handleUpgrade(request, socket, head, (ws) => {
    wss.emit("connection", ws, request);
  });
});