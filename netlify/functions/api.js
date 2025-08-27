import serverless from "serverless-http";
import express from "express";
import cors from "cors";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// -----------------------------
// Your existing routes go here
// -----------------------------
app.get("/hello", (req, res) => {
  res.json({ message: "Hello from Express running on Netlify Functions 🚀" });
});

// Example POST
app.post("/task", (req, res) => {
  const { title } = req.body;
  res.json({ success: true, task: title });
});

// Export as Netlify function
export const handler = serverless(app);
