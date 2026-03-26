const express = require("express");
const cors = require("cors");

const app = express();
const port = Number(process.env.PORT) || 5002;
app.use(cors());
app.use(express.json());

// simple login
app.post("/login", (req, res) => {
  const { username } = req.body;

  if (username === "admin") {
    return res.json({ role: "admin" });
  }

  res.json({ role: "student" });
});

app.listen(port, "0.0.0.0", () => console.log(`Auth service running on ${port}`));
