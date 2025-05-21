import React, { useState } from "react";
const env = import.meta.env;

function App() {
    const [url, setUrl] = useState("");
    const [loading, setLoading] = useState(false);

    const handleDownload = async () => {
        if (!url) {
            alert("Please enter a YouTube shorts URL");
            return;
        }

        setLoading(true);

        try {
            const response = await fetch(`${env.VITE_BACKEND_URL}/download?url=${encodeURIComponent(url)}`);
            if (!response.ok) throw new Error("Failed to download");

            // Create a blob from the response
            const blob = await response.blob();
            const downloadUrl = window.URL.createObjectURL(blob);

            // Create an anchor link and trigger download
            const a = document.createElement("a");
            a.href = downloadUrl;
            a.download = "video.mp4";
            document.body.appendChild(a);
            a.click();
            a.remove();
        } catch (error) {
            alert("Error downloading video");
            console.log(error)
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-4 items-center justify-center flex flex-col gap-4 max-md:flex-wrap" style={{ textAlign: "center", marginTop: "50px" }}>
            <h2 className="heading text-3xl font-bold">YouTube Shorts Downloader</h2>
            <div className="items-center justify-center w-full flex gap-2 max-md:flex-col">
            <input
            className="rounded-md min-h-12 w-96 p-2"
                type="text"
                placeholder="Enter YouTube URL"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
            />
            <button onClick={handleDownload} disabled={loading} className="h-12 text-center focus-visible:after:bg-blue-700 hover:bg-blue-500 font-bold text-white px-4 rounded-lg bg-blue-700">
                {loading ? "Downloading..." : "Download"}
            </button>
            </div>
            {loading && <span className="text-green-500  animate-pulse">Please wait some time while downloading...</span>}
        </div>
    );
}

export default App;
