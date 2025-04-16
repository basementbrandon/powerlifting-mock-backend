
const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());

app.get("/api/test", (req, res) => {
  res.json({ message: "✅ Backend is alive!" });
});

app.get("/api/progress-meets", (req, res) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  const mockData = [
    {
      name: "Mock Meet USA",
      date: new Date(Date.now() + 3 * 86400000).toISOString(),
      location: "New York, NY",
      federation: "USAPL",
      link: "https://example.com/register",
      logo: "https://usapowerlifting.com/wp-content/uploads/2022/01/USAPL-logo.png"
    },
    {
      name: "Mock Meet West",
      date: new Date(Date.now() + 10 * 86400000).toISOString(),
      location: "Los Angeles, CA",
      federation: "WRPF",
      link: "https://example.com/register2",
      logo: "https://wrpffed.com/wp-content/uploads/2021/05/WRPF-black-red.png"
    }
  ];

  let sent = 0;
  const sendMock = () => {
    if (sent < mockData.length) {
      const percent = Math.round(((sent + 1) / mockData.length) * 100);
      const federation = mockData[sent].federation;
      res.write(`data: ${JSON.stringify({ progress: percent, federation })}\n\n`);
      sent++;
      setTimeout(sendMock, 500);
    } else {
      res.write(`data: ${JSON.stringify({ complete: true, data: mockData })}\n\n`);
      res.end();
    }
  };

  sendMock();
});

app.listen(PORT, () => {
  console.log(`🚀 Mock backend running on port ${PORT}`);
});
