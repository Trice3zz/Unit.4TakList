import db from "#db/client";

import { createTask } from "#db/queries/tasks";
import { createUser } from "#db/queries/users";

await db.connect();
await seed();
await db.end();
console.log("🌱 Database seeded.");

const seed = async () => {
  await db.query(`DELETE FROM tasks;`);
  await db.query(`DELETE FROM users;`);

  const { rows: [user] } = await db.query(
    `INSERT INTO users (username, password) VALUES ($1, $2) RETURNING *;`,
    ['admin', '$2b$12$A5LPgemv1sHLVXidHacy6O2mkgOHx8chh81HJ68UgNXZt0FMXWSXm'] // hashed "password123"
  );

  await db.query(`
    INSERT INTO tasks (title, done, user_id)
    VALUES 
      ('Do laundry', false, $1),
      ('Write blog post', true, $1),
      ('Grocery shopping', false, $1)
  `, [user.id]);

  console.log("Database seeded");
};

seed().finally(() => db.end());
