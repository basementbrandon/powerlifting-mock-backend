import express from "express";
import cors from "cors";

// Import your scraper modules
import { scrapeUSAPL } from "./scraper-usapl.js";
import { scrapePowerliftingAmerica } from "./scraper-powerlifting-america.js";
import { scrapeWRPF } from "./scraper-wrpf.js";
import { scrapeRPS } from "./scraper-rps.js";
import { scrapeUSPA } from "./scraper-uspa.js";
import { scrapePowerliftingUnited } from "./scraper-powerlifting-united.js";

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());

app.get("/api/test", (req, res) => {
  res.json({ message: "✅ All‑federation backend is up!" });
});

app.get("/api/progress-meets", async (req, res) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  const federations = [
    { name: "USAPL", fn: scrapeUSAPL },
    { name: "Powerlifting America", fn: scrapePowerliftingAmerica },
    { name: "WRPF", fn: scrapeWRPF },
    { name: "RPS", fn: scrapeRPS },
    { name: "USPA", fn: scrapeUSPA },
    { name: "Powerlifting United", fn: scrapePowerliftingUnited },
  ];

  let completed = 0;
  const allMeets = [];

  for (const { name, fn } of federations) {
    try {
      // report progress
      completed++;
      const percent = Math.round((completed / federations.length) * 100);
      res.write(`data: ${JSON.stringify({ progress: percent, federation: name })}\n\n`);

      // scrape
      const meets = await fn();
      allMeets.push(...meets);
    } catch (err) {
      // on error, report it but keep going
      res.write(`data: ${JSON.stringify({ error: err.message, federation: name })}\n\n`);
    }
  }

  // send final payload
  res.write(`data: ${JSON.stringify({ complete: true, data: allMeets })}\n\n`);
  res.end();
});

app.listen(PORT, () => {
  console.log(`🚀 Full‑federations backend running on port ${PORT}`);
});
