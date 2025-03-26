import connectDB from "./connectDB.js";
import dotenv from "dotenv";
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import askQuestion from "./sendReq.js";

dotenv.config();
connectDB();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Set up EJS as the view engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Serve static files from public directory
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
// Home route
app.get("/", (req, res) => {
  res.render("index");
});
``;
app.get("/loader.gif", (req, res) => {
  res.sendFile("img/loader.gif");
});
app.post("/askQuestion", async (req, res) => {
  try {
    // console.dir(req.body);
    const userInput = req.body.userInput;
    // console.log("incoming /chat req", userInput);
    if (!userInput) {
      return res.status(400).json({ error: "Invalid request body" });
    }

    const response = await askQuestion(userInput);
    // console.log("response from gemini : ",  response);
    res.json({ response });
  } catch (error) {
    console.error("Error in chat endpoint:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
``;
