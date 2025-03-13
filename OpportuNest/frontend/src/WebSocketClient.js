// WebSocketClient.js

export default class WebSocketClient {
    constructor(url) {
      this.client = new WebSocket(url); // Establish WebSocket connection to the given URL
  
      this.client.onerror = (error) => {
        console.error("WebSocket error:", error);
      };
    }
  
    // Method to run when WebSocket opens
    onOpen(callback) {
      this.client.onopen = callback;
    }
  
    // Method to run when WebSocket receives a message
    onMessage(callback) {
      this.client.onmessage = (e) => {
        callback(e.data);
      };
    }
  
    // Method to run when WebSocket is closed
    onClose(callback) {
      this.client.onclose = callback;
    }
  
    // Method to send a message through WebSocket
    sendMessage(message) {
      if (this.client.readyState === WebSocket.OPEN) {
        this.client.send(message);
      } else {
        console.error("WebSocket is not open.");
      }
    }
  }
  