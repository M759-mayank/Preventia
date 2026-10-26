import fs from "fs";
import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import apiApp from "./api/index.ts";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Mount backend API routes
  app.use(apiApp);

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    const indexPath = path.join(distPath, "index.html");
    app.use(express.static(distPath, { index: false }));
    app.get("*all", (_req, res) => {
      try {
        let html = fs.readFileSync(indexPath, "utf8");
        const mapsKey =
          process.env.VITE_GOOGLE_MAPS_API_KEY ||
          process.env.GOOGLE_MAPS_API_KEY ||
          "AIzaSyAXGEIQHjxA80u_45FzLWMbk1S3y589WYg";
        const scriptInjection = `<script>window.__GOOGLE_MAPS_API_KEY__ = ${JSON.stringify(mapsKey)};</script></head>`;
        html = html.replace("</head>", scriptInjection);
        res.setHeader("Content-Type", "text/html; charset=utf-8");
        res.send(html);
      } catch {
        res.sendFile(indexPath);
      }
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Preventia server running on http://localhost:${PORT}`);
  });
}

startServer();
