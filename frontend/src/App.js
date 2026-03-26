import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Admin from "./pages/Admin";
import { dummyNotices } from "./data/notices";
import "./styles/global.css";

export default function App() {
  const [notices, setNotices] = useState(dummyNotices);

  const handleAdd = (notice) => {
    setNotices((prev) => [notice, ...prev]);
  };

  const handleDelete = (id) => {
    setNotices((prev) => prev.filter((n) => n.id !== id));
  };

  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/admin"
          element={
            <Admin
              notices={notices}
              onAdd={handleAdd}
              onDelete={handleDelete}
            />
          }
        />
      </Routes>
    </BrowserRouter>
  );
}