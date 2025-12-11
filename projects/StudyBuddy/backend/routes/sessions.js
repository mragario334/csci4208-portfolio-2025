const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const authenticateToken = require('../middleware/auth');

const checkRole = (role) => (req, res, next) => {
  if (req.user.role !== role) {
    return res.status(403).json({ error: `Access denied: ${role}s only` });
  }
  next();
};

router.get('/pending/count', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const userRole = req.user.role;

    if (userRole !== 'tutor')
      return res.json({ count: 0 });

    const result = await pool.query(
      `SELECT COUNT(*) 
       FROM sessions 
       WHERE tutor_id = $1 AND status = 'pending'`,
      [userId]
    );

    res.json({ count: Number(result.rows[0].count) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});


router.post('/', authenticateToken, checkRole('student'), async (req, res) => {
  const studentId = req.user.id;
  const { tutor_id, subject_id, scheduled_at, notes } = req.body;

  if (!tutor_id || !subject_id || !scheduled_at) {
    return res.status(400).json({ error: 'Please provide all required fields' });
  }

  try {
    const tutorResult = await pool.query(
      'SELECT * FROM users WHERE id = $1 AND role = $2',
      [tutor_id, 'tutor']
    );
    if (tutorResult.rows.length === 0) {
      return res.status(404).json({ error: 'Tutor not found' });
    }
    const tutor = tutorResult.rows[0];

    console.log('Student school:', req.user.school_id, 'Tutor school:', tutor.school_id);

    if (Number(req.user.school_id) !== Number(tutor.school_id)) {
      return res.status(400).json({ error: 'Cannot book tutor from another school' });
    }

    const tutorSubjectResult = await pool.query(
      'SELECT * FROM tutor_subjects WHERE tutor_id = $1 AND subject_id = $2',
      [tutor_id, subject_id]
    );
    if (tutorSubjectResult.rows.length === 0) {
      return res.status(400).json({ error: 'Tutor does not teach this subject' });
    }

    const subjectNameResult = await pool.query(
      'SELECT name FROM subjects WHERE id = $1',
      [subject_id]
    );
    const subjectName = subjectNameResult.rows[0]?.name || null;

    // Insert session
    const result = await pool.query(
      `INSERT INTO sessions (student_id, tutor_id, subject_id, subject, scheduled_at, notes)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [studentId, tutor_id, subject_id, subjectName, scheduled_at, notes || null]
    );

    res.status(201).json({ session: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/', authenticateToken, async (req, res) => {
  const userId = req.user.id;
  const userRole = req.user.role;

  try {
    const result = await pool.query(
      `SELECT s.*, 
              student.id AS student_id, student.name AS student_name,
              tutor.id AS tutor_id, tutor.name AS tutor_name
       FROM sessions s
       JOIN users student ON s.student_id = student.id
       JOIN users tutor ON s.tutor_id = tutor.id
       WHERE s.student_id = $1 OR s.tutor_id = $1
       ORDER BY s.scheduled_at DESC`,
      [userId]
    );

    const sessionsWithOtherUser = result.rows.map(s => ({
      id: s.id,
      subject: s.subject,
      scheduled_at: s.scheduled_at,
      status: s.status,
      notes: s.notes,
      student_name: s.student_name,
      tutor_name: s.tutor_name,
      other_user: userRole === 'tutor' ? s.student_name : s.tutor_name
    }));

    res.json({ sessions: sessionsWithOtherUser });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});



router.patch('/:id/status', authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const validStatuses = ["scheduled", "completed", "cancelled", "denied"];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ error: 'Invalid status' });
  }

  try {
    // Get session
    const sessionResult = await pool.query(
      'SELECT * FROM sessions WHERE id = $1',
      [id]
    );

    if (sessionResult.rows.length === 0) {
      return res.status(404).json({ error: 'Session not found' });
    }

    const session = sessionResult.rows[0];

    // Permission check
    const isTutor = req.user.role === "tutor";
    const isStudent = req.user.role === "student";

    // Must be owner of session
    if (isTutor && session.tutor_id !== req.user.id) {
      return res.status(403).json({ error: 'Tutor cannot modify this session' });
    }
    if (isStudent && session.student_id !== req.user.id) {
      return res.status(403).json({ error: 'Student cannot modify this session' });
    }

    // 🔥 STATUS TRANSITION RULES

    // TUTOR RULES
    if (isTutor) {

      // Approve → scheduled
      if (status === "scheduled") {
        if (session.status !== "pending") {
          return res.status(403).json({ error: "Can only schedule pending requests" });
        }
      }

      // Deny → denied
      if (status === "denied") {
        if (session.status !== "pending") {
          return res.status(403).json({ error: "Can only deny pending requests" });
        }
      }

      // Complete → completed
      if (status === "completed") {
        if (session.status !== "scheduled") {
          return res.status(403).json({ error: "Can only complete scheduled sessions" });
        }
      }

      // Tutor can also cancel (optional but useful)
      if (status === "cancelled") {
        if (!["pending", "scheduled"].includes(session.status)) {
          return res.status(403).json({ error: "Can only cancel pending or scheduled sessions" });
        }
      }
    }

    // STUDENT RULES
    if (isStudent) {
      if (status !== "cancelled") {
        return res.status(403).json({ error: "Students may only cancel sessions" });
      }

      // Students can cancel:
      // - pending
      // - scheduled
      if (!["pending", "scheduled"].includes(session.status)) {
        return res.status(403).json({ error: "Cannot cancel this session" });
      }
    }

    // Update session
    const updated = await pool.query(
      'UPDATE sessions SET status = $1 WHERE id = $2 RETURNING *',
      [status, id]
    );

    res.json({ session: updated.rows[0] });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});


module.exports = router;
