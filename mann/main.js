import chat from "./sendReq.js";
import connectDB from "./connectDB.js";
import dotenv from "dotenv";
dotenv.config();

connectDB().then(() => {
  chat();
});
