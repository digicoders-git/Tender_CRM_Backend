const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const ADMIN = {
  email: 'admin@gmail.com',
  // bcrypt hash of 'admin123'
  password: bcrypt.hashSync('admin123', 10),
  name: 'Admin',
  role: 'Tender Manager',
};

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ error: 'Email and password required' });

  if (email !== ADMIN.email || !bcrypt.compareSync(password, ADMIN.password))
    return res.status(401).json({ error: 'Invalid email or password' });

  const token = jwt.sign({ email: ADMIN.email, name: ADMIN.name }, process.env.JWT_SECRET, { expiresIn: '7d' });
  res.json({ token, user: { name: ADMIN.name, email: ADMIN.email, role: ADMIN.role } });
});

router.get('/me', (req, res) => {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ error: 'No token' });
  try {
    const user = jwt.verify(auth.split(' ')[1], process.env.JWT_SECRET);
    res.json({ name: user.name, email: user.email, role: 'Tender Manager' });
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
});

module.exports = router;
