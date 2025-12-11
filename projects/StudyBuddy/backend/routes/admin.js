const express = require("express");
const router = express.Router();
const pool = require("../config/db");
const {
  sendTutorApprovedEmail,
  sendTutorRejectedEmail,
} = require("../utils/email");


router.get("/pending-tutors", async (req, res) => {
    try {
      const tutorsRes = await pool.query(`
        SELECT id, name, email, school_id, bio
        FROM users
        WHERE role = 'tutor' AND status = 'pending'
      `);
  
      const tutors = tutorsRes.rows;
  
      for (let tutor of tutors) {
        const subjectsRes = await pool.query(
          `SELECT s.name
           FROM tutor_subjects ts
           JOIN subjects s ON s.id = ts.subject_id
           WHERE ts.tutor_id = $1`,
          [tutor.id]
        );
        tutor.subjects = subjectsRes.rows.map(r => r.name);
      }
  
      res.json(tutors);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Server error" });
    }
  });
  


router.post("/approve/:id", async (req, res) => {
  const tutorId = req.params.id;

  try {
    const result = await pool.query(
      `UPDATE users
       SET status = 'approved'
       WHERE id = $1
       RETURNING email, name`,
      [tutorId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Tutor not found" });
    }

    const { email, name } = result.rows[0];

    await sendTutorApprovedEmail(email, name);

    res.json({ message: "Tutor approved & email sent" });
  } catch (err) {
    console.error(`Error approving tutor ${tutorId}:`, err);
    res.status(500).json({ error: "Server error" });
  }
});


router.post("/decline/:id", async (req, res) => {
  const tutorId = req.params.id;

  try {
    const result = await pool.query(
      `UPDATE users
       SET status = 'rejected'
       WHERE id = $1
       RETURNING email, name`,
      [tutorId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Tutor not found" });
    }

    const { email, name } = result.rows[0];

    await sendTutorRejectedEmail(email, name);

    res.json({ message: "Tutor rejected & email sent" });
  } catch (err) {
    console.error(`Error declining tutor ${tutorId}:`, err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
