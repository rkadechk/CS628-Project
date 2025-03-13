// src/WebSocketComponent.js
import React, { useEffect, useState } from "react";
import WebSocketClient from "./WebSocketClient"; // Import the WebSocketClient class

function WebSocketComponent() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    // Initialize WebSocket client to connect to the server
    const wsClient = new WebSocketClient("ws://localhost:5051/ws");

    // Handle WebSocket open event
    wsClient.onOpen(() => {
      console.log("WebSocket connected!");
      
    });

    // Handle incoming WebSocket messages
    wsClient.onMessage((data) => {
      console.log("Received from WebSocket:", data);
      setMessage(data); // Update state with the message from WebSocket
    });

    // Handle WebSocket close event
    wsClient.onClose(() => {
      console.log("WebSocket closed");
    });

    return () => {
      // Clean up WebSocket connection on component unmount
      if (wsClient.client.readyState === WebSocket.OPEN) {
        wsClient.client.close();
      }
    };
  }, []); // Empty dependency array ensures this runs once when the component mounts

  return (
    <div>
      {message && <p>{message}</p>}
    </div>
  );
}

export default WebSocketComponent;