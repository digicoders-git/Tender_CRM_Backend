const express = require('express');
const router  = express.Router();
const jwt     = require('jsonwebtoken');
const bcrypt  = require('bcryptjs');
const Admin   = require('../models/Admin');

// ── POST /api/auth/register ──────────────────────────────────────────────────
// Create a new admin (protect this in production with a secret header or remove after first use)
router.post('/register', async (req, res) => {
  const { name, email, password, role } = req.body;
  if (!name || !email || !password)
    return res.status(400).json({ error: 'name, email and password are required' });

  const exists = await Admin.findOne({ email });
  if (exists) return res.status(409).json({ error: 'Admin with this email already exists' });

  const hashed = await bcrypt.hash(password, 10);
  const admin  = await Admin.create({ name, email, password: hashed, role: role || 'Tender Manager' });

  res.status(201).json({
    message: 'Admin created successfully',
    admin: { id: admin._id, name: admin.name, email: admin.email, role: admin.role },
  });
});

// ── POST /api/auth/login ─────────────────────────────────────────────────────
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ error: 'Email and password required' });

  const admin = await Admin.findOne({ email });
  if (!admin || !(await bcrypt.compare(password, admin.password)))
    return res.status(401).json({ error: 'Invalid email or password' });

  const token = jwt.sign(
    { id: admin._id, email: admin.email, name: admin.name },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );

  res.json({ token, user: { name: admin.name, email: admin.email, role: admin.role } });
});

// ── GET /api/auth/me ─────────────────────────────────────────────────────────
router.get('/me', async (req, res) => {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ error: 'No token' });
  try {
    const decoded = jwt.verify(auth.split(' ')[1], process.env.JWT_SECRET);
    const admin   = await Admin.findById(decoded.id).select('-password');
    if (!admin) return res.status(404).json({ error: 'Admin not found' });
    res.json({ name: admin.name, email: admin.email, role: admin.role });
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
});

module.exports = router;
