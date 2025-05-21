const express = require("express");
const cors = require("cors");
const ytdlp = require("yt-dlp-exec");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/download", async (req, res) => {
    const videoUrl = req.query.url;
    if (!videoUrl) return res.status(400).json({ error: "YouTube URL is required" });

    res.setHeader("Content-Disposition", "attachment; filename=video.mp4");
    res.setHeader("Content-Type", "video/mp4");

    const ytProcess = ytdlp.exec(videoUrl, {
        output: "-",
        format: "mp4", 
    });

    ytProcess.stdout.pipe(res);
    // ytProcess.stderr.on("data", (data) => console.error(data.toString()));
});

app.listen(5000, () => console.log("Server running on port 5000"));
