const express = require("express");
const fs = require("fs");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());

// POST endpoint to receive and save data from the form
app.post("/index", (req, res) => {
  const details = req.body;

  fs.readFile("dataset.json", "utf8", (err, data) => {
    let dataset = [];
    if (!err && data) {
      dataset = JSON.parse(data); // fixed 'results' typo
    }

    dataset.push(details);

    fs.writeFile("dataset.json", JSON.stringify(dataset, null, 2), (err) => {
      if (err) {
        res.status(500).send("❌ Failed to save data.");
      } else {
        res.send("✅ Data saved successfully!");
      }
    });
  });
});

// GET endpoint to return stored data
app.get("/index", (req, res) => {
  fs.readFile("dataset.json", "utf8", (err, data) => {
    if (err) {
      res.status(500).send("❌ Error reading data.");
    } else {
      const dataset = JSON.parse(data);
      res.json(dataset);
    }
  });
});

// Start the server
app.listen(3000, () => {
  console.log(`🚀 Server running at http://localhost:3000`);
});
