const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const port = Number(process.env.PORT) || 5001;
const mongoUrl =
  process.env.MONGO_URL ||
  "mongodb+srv://rachelbferns_db_user:qRFbojTJjjbpBK6m@cluster0.mam9vjt.mongodb.net/noticeDB?retryWrites=true&w=majority";

app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  console.log("Notice service received:", req.method, req.originalUrl);
  next();
});

mongoose
  .connect(mongoUrl)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

const NoticeSchema = new mongoose.Schema({
  title: String,
  description: String,
  category: String,
  date: String,
  important: { type: Boolean, default: false },
});

const Notice = mongoose.model("Notice", NoticeSchema);

const getRoleFromRequest = (req) =>
  (req.get("role") || req.get("x-user-role") || "").trim().toLowerCase();

app.get("/notices", async (req, res) => {
  try {
    const notices = await Notice.find().sort({ _id: -1 });
    res.json(notices);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch notices" });
  }
});

app.post("/notices", async (req, res) => {
  const role = getRoleFromRequest(req);
  console.log("ROLE RECEIVED:", role);

  if (role !== "admin") {
    return res.status(403).json({ error: "Unauthorized" });
  }

  try {
    const notice = new Notice(req.body);
    await notice.save();
    res.status(201).json(notice);
  } catch (err) {
    res.status(500).json({ error: "Failed to save" });
  }
});

app.delete("/notices/:id", async (req, res) => {
  const role = getRoleFromRequest(req);
  console.log("ROLE RECEIVED:", role);
  console.log("DELETE ID:", req.params.id);

  if (role !== "admin") {
    return res.status(403).json({ error: "Unauthorized" });
  }

  try {
    const deletedNotice = await Notice.findByIdAndDelete(req.params.id);

    if (!deletedNotice) {
      return res.status(404).json({ error: "Notice not found" });
    }

    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ error: "Delete failed" });
  }
});

app.put("/notices/:id/important", async (req, res) => {
  const role = (req.get("role") || "").trim().toLowerCase();

  console.log("ROLE RECEIVED:", role);

  if (role !== "admin") {
    return res.status(403).json({ error: "Unauthorized" });
  }

  try {
    const notice = await Notice.findById(req.params.id);

    if (!notice) {
      return res.status(404).json({ error: "Not found" });
    }

    // 🔥 toggle important
    notice.important = !notice.important;
    await notice.save();

    res.json(notice);
  } catch (err) {
    res.status(500).json({ error: "Failed to update" });
  }
});

app.put("/notices/:id/important", async (req, res) => {
  const role = getRoleFromRequest(req);
  console.log("ROLE RECEIVED:", role);

  if (role !== "admin") {
    return res.status(403).json({ error: "Unauthorized" });
  }

  try {
    const notice = await Notice.findById(req.params.id);

    if (!notice) {
      return res.status(404).json({ error: "Notice not found" });
    }

    notice.important = !notice.important;
    await notice.save();

    res.json(notice);
  } catch (err) {
    res.status(500).json({ error: "Failed to update importance" });
  }
});

app.listen(port, "0.0.0.0", () => {
  console.log(`Notice service running on ${port}`);
});
