const express = require("express");
const router = express.Router();
const pool = require("../config/db");

router.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM subjects ORDER BY name");
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching subjects:", err);
    res.status(500).json({ error: "Failed to fetch subjects" });
  }
});

module.exports = router;
