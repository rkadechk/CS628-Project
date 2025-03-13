import React from "react";
import ReactDOM from "react-dom/client"; // Use ReactDOM.createRoot
import { BrowserRouter } from "react-router-dom"; // Import BrowserRouter here
import App from "./App";
import "./styles.css";

// Use createRoot instead of ReactDOM.render
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <BrowserRouter> {/* Wrap App with BrowserRouter here */}
        <App />
    </BrowserRouter>
);