
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');
const { sendAdminTutorApprovalEmail } = require("../utils/email");


// Handle registration
router.post('/register', async (req, res) => {
  const { name, email, password, school_id, role, bio, subjects } = req.body;

  if (!name || !email || !password || !school_id || !role) {
    return res.status(400).json({ error: 'Please provide all required fields' });
  }

  if (!['student', 'tutor'].includes(role)) {
    return res.status(400).json({ error: 'Invalid role' });
  }

  try {
    const userExists = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (userExists.rows.length > 0) {
      return res.status(400).json({ error: 'User with this email already exists' });
    }

    const password_hash = await bcrypt.hash(password, 10);

    const status = role === 'tutor' ? 'pending' : 'approved';

    const newUser = await pool.query(
      `INSERT INTO users (name, email, password_hash, school_id, role, bio, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING id, name, email, school_id, role, bio, status`,
      [name, email, password_hash, school_id, role, bio || null, status]
    );

    const user = newUser.rows[0];


    if (role === "tutor" && Array.isArray(subjects)) {
      const insertPromises = subjects.map(subjectId =>
        pool.query(
          `INSERT INTO tutor_subjects (tutor_id, subject_id)
           VALUES ($1, $2)`,
          [user.id, subjectId]
        )
      );
      await Promise.all(insertPromises);
    }
    
    
    if (role === 'tutor') {
      try {
        await sendAdminTutorApprovalEmail(user, subjects);
      } catch (err) {
        console.error("Email failed:", err);
      }
    }

    res.status(201).json({
      message: role === 'tutor'
        ? 'Tutor registered and pending admin approval'
        : 'Student registered successfully',
      user
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});


// Handle login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Please provide email and password' });
  }

  try {
    const userResult = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (userResult.rows.length === 0) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    const user = userResult.rows[0];
    const validPassword = await bcrypt.compare(password, user.password_hash);

    if (!validPassword) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    if (user.role === 'tutor' && user.status === 'pending') {
      return res.status(403).json({
        error: 'Your tutor account is pending approval from an administrator.'
      });
    }

    if (user.role === 'tutor' && user.status === 'rejected') {
      return res.status(403).json({
        error: 'Your tutor application was declined.'
      });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role, school_id: user.school_id },
      process.env.JWT_SECRET || 'secret_key',
      { expiresIn: '2h' }
    );

    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        school_id: user.school_id,
        status: user.status,
        bio: user.bio
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
