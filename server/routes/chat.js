const express = require("express");
const router = express.Router();
const axios = require("axios");
require("dotenv").config();

const API_KEY = process.env.GEMINI_API_KEY;

router.post("/", async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    console.log("User:", message);

    const url = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash-latest:generateContent?key=${API_KEY}`;

    const response = await axios.post(url, {
      contents: [
        {
          parts: [
            {
              text: `You are a car assistant. Help users with car suggestions.\nUser: ${message}`
            }
          ]
        }
      ]
    });

    const reply =
      response.data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "Sorry, no response";

    res.json({ reply });

  } catch (error) {
    console.log("❌ Gemini ERROR:", error.response?.data || error.message);

    res.status(500).json({ error: "Gemini failed" });
  }
});

module.exports = router;