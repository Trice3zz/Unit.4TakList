import express from 'express';
import db from '../db/client.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const router = express.Router();

router.post('/register', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ error: 'Missing username or password' });

  try {
    const hashed = await bcrypt.hash(password, 12);
    const { rows } = await db.query(`INSERT INTO users (username, password) VALUES ($1, $2) RETURNING *`, [username, hashed]);

    const token = jwt.sign({ id: rows[0].id, username: rows[0].username }, process.env.JWT_SECRET);
    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ error: 'Missing username or password' });

  try {
    const { rows } = await db.query(`SELECT * FROM users WHERE username = $1`, [username]);
    const user = rows[0];
    if (!user || !(await bcrypt.compare(password, user.password))) return res.status(401).json({ error: "Invalid credentials" });

    const token = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET);
    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
