import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Home from "./pages/Home";
import Electives from "./pages/Electives";
import CGPA from "./pages/CGPA";
import Placements from "./pages/Placements";
import Departments from "./pages/Departments";
import Events from "./pages/Events";

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/index.html" element={<Home />} />
          <Route path="/electives" element={<Electives />} />
          <Route path="/cgpa" element={<CGPA />} />
          <Route path="/placements" element={<Placements />} />
          <Route path="/departments" element={<Departments />} />
          <Route path="/events" element={<Events />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
