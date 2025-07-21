const express = require("express");
const cors = require("cors");
const ytdlp = require("yt-dlp-exec");
const fs = require("fs");
const path = require("path");
const { v4: uuid } = require("uuid");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/download", async (req, res) => {
    const videoUrl = req.query.url;
    if (!videoUrl) return res.status(400).json({ error: "YouTube URL is required" });

    const tempFilename = `${uuid()}.mp4`;
    const filePath = path.join("/tmp", tempFilename); 

    try {
        await ytdlp(videoUrl, {
            output: filePath,
            format: "mp4",
        });

        res.download(filePath, "video.mp4", (err) => {
            if (err) {
                console.error("Download error:", err);
                res.status(500).json({ error: "Download failed" });
            }

            fs.unlink(filePath, () => {});
        });
    } catch (err) {
        console.error("yt-dlp error:", err);
        res.status(500).json({ error: "Failed to fetch video" });
    }
});

app.listen(5000, () => console.log("Server running on port 5000"));
