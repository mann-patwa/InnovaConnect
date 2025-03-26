import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
dotenv.config();

const ai = new GoogleGenAI({ apiKey: "GEMINI_API_KEY" });

async function retrieveStartupData(startupId){
    // will get startup info somehow
}

async function main() {
    var startupData = retrieveStartupData(currentChat.startupID)
    var llmHistory = [role:"user", parts: [{startupData}]]
  const chat = ai.chats.create({
    model: "gemini-2.0-flash",
    history: [
      {
        role: "user",
        parts: [{ text: "Hello" }],
      },
      {
        role: "model",
        parts: [{ text: "Great to meet you. What would you like to know?" }],
      },
    ],
  });

  const stream1 = await chat.sendMessageStream({
    message: "I have 2 dogs in my house.",
  });
  for await (const chunk of stream1) {
    console.log(chunk.text);
    console.log("_".repeat(80));
  }

  const stream2 = await chat.sendMessageStream({
    message: "How many paws are in my house?",
  });
  for await (const chunk of stream2) {
    console.log(chunk.text);
    console.log("_".repeat(80));
  }
}

await main();
