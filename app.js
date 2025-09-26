// app.js
const express = require("express");
const mongoose = require("mongoose");

const app = express();
app.use(express.json());

// ===== Local State =====
let localTasks = [];

// ===== MongoDB Setup (optional) =====
mongoose
  .connect("mongodb://127.0.0.1:27017/phase3demo", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(() => console.log("⚠️ MongoDB not running, using local state only"));

const TaskSchema = new mongoose.Schema({
  title: String,
  completed: Boolean,
});
const Task = mongoose.model("Task", TaskSchema);

// ===== Routes =====
app.get("/", (req, res) => {
  res.send("Phase 3 MVP is running 🚀");
});

// Get all tasks (checks DB first, then local)
app.get("/tasks", async (req, res) => {
  try {
    const tasks = await Task.find();
    res.json(tasks);
  } catch {
    res.json(localTasks);
  }
});

// Add a new task
app.post("/tasks", async (req, res) => {
  const newTask = { title: req.body.title, completed: false };

  try {
    const task = new Task(newTask);
    await task.save();
    res.status(201).json(task);
  } catch {
    localTasks.push(newTask);
    res.status(201).json(newTask);
  }
});

// ===== Server =====
const PORT = 3000;
app.listen(PORT, () => console.log(`✅ Server running on http://localhost:${PORT}`));

module.exports = app; // for testing if needed
