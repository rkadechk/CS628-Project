import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Jobs from "./pages/Jobs";
import PostJob from "./pages/PostJob";
import './styles.css'; // Import the styles
import 'bootstrap/dist/css/bootstrap.min.css';



function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/jobs" element={<Jobs />} />
                <Route path="/post-job" element={<PostJob />} />
            </Routes>
        </Router>
    );
}

export default App;
