const express = require("express");
const mysql = require("mysql");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MySQL connection
const db = require("./db");

// Test route
app.get("/", (req, res) => {
  res.send("Smart Student Identity Card System Backend Running");
});

// POST attendance
app.post("/mark-attendance", (req, res) => {
  const { rfid, fingerprint } = req.body;

  if (!rfid || !fingerprint) {
    return res.status(400).json({ error: "Missing RFID or Fingerprint data" });
  }

  const sql = "INSERT INTO attendance (rfid, fingerprint, timestamp) VALUES (?, ?, NOW())";
  db.query(sql, [rfid, fingerprint], (err, result) => {
    if (err) {
      console.error("Database insert error:", err);
      return res.status(500).json({ error: "Database error" });
    }
    res.json({ message: "Attendance marked", id: result.insertId });
  });
});

// Start server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
