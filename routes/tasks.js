import express from 'express';
import db from '../db/client.js';
import { requireUser } from '../middleware/auth.js';

const router = express.Router();
router.use(requireUser);

router.get('/', async (req, res) => {
  const { rows } = await db.query(`SELECT * FROM tasks WHERE user_id = $1`, [req.user.id]);
  res.json(rows);
});

router.post('/', async (req, res) => {
  const { title, done } = req.body;
  if (title === undefined || done === undefined) return res.status(400).json({ error: "Missing title or done" });

  const { rows } = await db.query(
    `INSERT INTO tasks (title, done, user_id) VALUES ($1, $2, $3) RETURNING *`,
    [title, done, req.user.id]
  );
  res.json(rows[0]);
});

router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { title, done } = req.body;
  if (title === undefined || done === undefined) return res.status(400).json({ error: "Missing title or done" });

  const { rows: [task] } = await db.query(`SELECT * FROM tasks WHERE id = $1`, [id]);
  if (!task) return res.status(404).json({ error: "Task not found" });
  if (task.user_id !== req.user.id) return res.status(403).json({ error: "Forbidden" });

  const { rows } = await db.query(
    `UPDATE tasks SET title = $1, done = $2 WHERE id = $3 RETURNING *`,
    [title, done, id]
  );
  res.json(rows[0]);
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  const { rows: [task] } = await db.query(`SELECT * FROM tasks WHERE id = $1`, [id]);
  if (!task) return res.status(404).json({ error: "Task not found" });
  if (task.user_id !== req.user.id) return res.status(403).json({ error: "Forbidden" });

  await db.query(`DELETE FROM tasks WHERE id = $1`, [id]);
  res.json({ message: "Task deleted" });
});

export default router;
