import { openDb } from "./db";

// Create table if not yet existing
export const initializeDb = () => {
  const db = openDb();
  db.serialize(() => {
    // Create the users table
    db.run(`
      CREATE TABLE IF NOT EXISTS leads (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        mobile TEXT NOT NULL,
        postcode TEXT NOT NULL,
        services TEXT NOT NULL
      )
    `);

    db.close((err) => {
      if (err) {
        console.log("Error closing SQLite database:", err.message);
      }
    });
  });
};
