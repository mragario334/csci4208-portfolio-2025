const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const authenticateToken = require('../middleware/auth');

router.get('/', authenticateToken, async (req, res) => {
  try {
    const schoolId = req.user.school_id;

    const tutors = await pool.query(
      `SELECT u.id, u.name, u.email, u.bio, u.status,
              json_agg(json_build_object('id', ts.subject_id, 'name', s.name)) AS subjects
       FROM users u
       LEFT JOIN tutor_subjects ts ON ts.tutor_id = u.id
       LEFT JOIN subjects s ON ts.subject_id = s.id
       WHERE u.role = 'tutor' 
         AND u.school_id = $1
         AND u.status = 'approved'
       GROUP BY u.id`,
      [schoolId]
    );

    res.json({ tutors: tutors.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
