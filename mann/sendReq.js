import { GoogleGenAI } from "@google/genai";
import Startup from "./models/startupModel.js";
import dotenv from "dotenv";

dotenv.config();
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function getAllStartups() {
  // will get startup info somehow
  try {
    const startups = await Startup.find();
    return startups;
  } catch (error) {
    console.error("Error fetching startups:", error);
    return [];
  }
}

/**
 * Parses startup data into a structured string for LLM processing
 * @param {Object} startup - The startup document from MongoDB
 * @returns {string} Formatted string for Gemini input
 */
function parseStartupForGemini(startup) {
  // Helper function to format funding history
  const formatFundingHistory = (fundingHistory) => {
    if (!fundingHistory || fundingHistory.length === 0)
      return "No funding history available.";

    return fundingHistory
      .map(
        (round, index) =>
          `Funding Round ${index + 1}:
      - Stage: ${round.round || "Unspecified"}
      - Amount Raised: ${
        round.amountRaised
          ? `$${round.amountRaised.toLocaleString()}`
          : "Not disclosed"
      }
      - Investors: ${
        round.investors && round.investors.length > 0
          ? round.investors.join(", ")
          : "No investors listed"
      }`
      )
      .join("\n\n");
  };

  // Construct the comprehensive startup profile
  const startupProfile = `
STARTUP PROFILE

1. Basic Information
-------------------
Title: ${startup.title}
Description: ${startup.description}
Category: ${startup.category}
Bootstrapped: ${startup.isBootstrapped ? "Yes" : "No"}

2. Funding Details
------------------
Funding Goal: ${
    startup.fundingGoal?.amount
      ? `$${startup.fundingGoal.amount.toLocaleString()}`
      : "Not specified"
  }
Valuation: ${
    startup.fundingGoal?.valuation
      ? `$${startup.fundingGoal.valuation.toLocaleString()}`
      : "Not specified"
  }

3. Funding History
------------------
${formatFundingHistory(startup.fundingHistory)}

4. Metadata
-----------
Created: ${
    startup.createdAt ? new Date(startup.createdAt).toLocaleString() : "N/A"
  }
Last Updated: ${
    startup.updatedAt ? new Date(startup.updatedAt).toLocaleString() : "N/A"
  }
`;

  return startupProfile;
}

async function retrieveStartup(startupID) {
  try {
    const startup = await Startup.findById(id);
    if (!startup) {
      return res.status(404).json({ message: "Startup not found" });
    }
    // Use the startup
  } catch (error) {
    console.error("Error finding startup:", error);
    return res.status(500).json({ message: "Server error" });
  }
}

export default async function askQuestion(prompt, startupID) {
  //var startupId = req.body.startupID;
  var startupData = await getAllStartups(); //get all startups from db
  var startup = startupData[0];
  var history_prompt = parseStartupForGemini(startup);
  console.log(prompt);
  var llmHistory = [
    {
      role: "user",
      parts: [
        {
          text: "I will pass some details about a startup, remember it",
        },
      ],
    },
    {
      role: "model",
      parts: [{ text: "ok go ahead and send it to me" }],
    },
    {
      role: "user",
      parts: [{ text: history_prompt }],
    },
    {
      role: "model",
      parts: [
        {
          text: "perfect, you can now ask me anything about it and i will reply correctly",
        },
      ],
    },
  ];
  const chat = ai.chats.create({
    model: "gemini-2.0-flash",
    history: llmHistory,
  });

  const response = await chat.sendMessage({
    message: prompt,
  });
  // console.log("gem response", response.text);
  return response.text;
}
