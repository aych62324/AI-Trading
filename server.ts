import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import dotenv from "dotenv";
import axios from "axios";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.post("/api/search", async (req, res) => {
    const { ticker } = req.body;

    try {
      // 1. Search for sentiment via Tavily
      const tavilyResponse = await axios.post("https://api.tavily.com/search", {
        api_key: process.env.TAVILY_API_KEY,
        query: `latest twitter sentiment and news for ${ticker} stock`,
        search_depth: "advanced",
        include_domains: ["twitter.com", "x.com", "reuters.com", "bloomberg.com"]
      });

      const context = tavilyResponse.data.results.map((r: any) => `${r.title}: ${r.content}`).join("\n");
      res.json({ context });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to fetch sentiment data" });
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
