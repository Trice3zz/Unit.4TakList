import express from 'express';
import usersRouter from './routes/users.js';
import tasksRouter from './routes/tasks.js';
import cors from 'cors';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/users', usersRouter);
app.use('/tasks', tasksRouter);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});

export default app;
