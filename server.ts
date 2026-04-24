import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import dotenv from "dotenv";
import axios from "axios";
import { GoogleGenerativeAI } from "@google/genai";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.post("/api/analyze", async (req, res) => {
    const { ticker, price } = req.body;
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    try {
      // 1. Search for sentiment via Tavily
      const tavilyResponse = await axios.post("https://api.tavily.com/search", {
        api_key: process.env.TAVILY_API_KEY,
        query: `latest twitter sentiment and news for ${ticker} stock`,
        search_depth: "advanced",
        include_domains: ["twitter.com", "x.com", "reuters.com", "bloomberg.com"]
      });

      const context = tavilyResponse.data.results.map((r: any) => `${r.title}: ${r.content}`).join("\n");

      // 2. Gemini Decision
      const prompt = `Analyze: ${ticker} at $${price}. Context: ${context}. Respond in JSON: { "decision": "BUY"|"SELL"|"HOLD", "reason": "...", "confidence": 0.8 }`;
      const result = await model.generateContent(prompt);
      const text = result.response.text().replace(/```json|```/g, "").trim();
      
      res.json(JSON.parse(text));
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to analyze sentiment" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
