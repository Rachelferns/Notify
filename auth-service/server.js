const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();
const port = Number(process.env.PORT) || 5002;
const mongoUrl = process.env.MONGO_URL;

if (!mongoUrl) {
  console.error("MONGO_URL is not set");
  process.exit(1);
}

app.use(cors());
app.use(express.json());

mongoose
  .connect(mongoUrl)
  .then(() => console.log("Auth service MongoDB connected"))
  .catch((err) => {
    console.error("Auth service MongoDB connection failed:", err.message);
    process.exit(1);
  });

// simple login
app.post("/login", (req, res) => {
  const { username } = req.body;

  if (username === "admin") {
    return res.json({ role: "admin" });
  }

  res.json({ role: "student" });
});

app.listen(port, "0.0.0.0", () => console.log(`Auth service running on ${port}`));
