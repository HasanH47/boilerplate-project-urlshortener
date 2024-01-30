require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const urlMappings = {}; // In-memory storage for short and long URL mappings

app.use("/public", express.static(`${process.cwd()}/public`));

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/views/index.html");
});

app.post("/api/shorturl", function (req, res) {
  const { url } = req.body;

  console.log("Received URL:", url);

  // Validate the URL format
  const urlRegex = /^(https?):\/\/(\S+\.)?(\S{2,})\.\S{2,}$/;
  if (!urlRegex.test(url)) {
    console.error("Invalid URL:", url);
    return res.json({ error: "Invalid URL" });
  }

  // Generate a short code (you can use a library for this)
  const shortCode = generateShortCode();

  // Store the mapping
  urlMappings[shortCode] = url;

  console.log("URL Mappings:", urlMappings);

  // Respond with the short code
  res.json({ original_url: url, short_url: shortCode });
});

app.get("/api/shorturl/:shortCode", function (req, res) {
  const { shortCode } = req.params;

  // Check if the short code exists
  if (urlMappings.hasOwnProperty(shortCode)) {
    // Redirect to the original URL
    res.redirect(urlMappings[shortCode]);
  } else {
    res.json({ error: "Short URL not found" });
  }
});

function generateShortCode() {
  return Math.random().toString(36).substring(2, 8);
}

app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});
