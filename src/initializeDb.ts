import { openDb } from "./db";
import { INSERT_LEAD } from "./sqlQueries";

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

    db.get("SELECT COUNT(*) AS count FROM leads WHERE email = 'john@example.com'", (_, row) => {
      type RowType = {
        count: number;
      };
      const rowCount = row as RowType;

      if (rowCount.count === 0) {
        // Insert default john@example.com for unit testing
        db.run(INSERT_LEAD, ["John Doe", "john@example.com", "123456789", "12345", JSON.stringify(["delivery"])], (err) => {
          if (err) {
            console.log("Error inserting default lead:", err.message);
          } else {
            console.log("Inserted default lead");
          }
          db.close((err) => {
            if (err) {
              console.log("Error closing SQLite database:", err.message);
            }
          });
        });
      } else {
        db.close((err) => {
          if (err) {
            console.log("Error closing SQLite database:", err.message);
          }
        });
      }
    });
  });
};
