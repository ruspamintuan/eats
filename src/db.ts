import sqlite3 from "sqlite3";

const mydb = "./mydb.sqlite";

// Open SQLite database connection
export const openDb = () => {
  const db = new sqlite3.Database(mydb, sqlite3.OPEN_READWRITE, (err) => {
    if (err) {
      console.log("Error opening SQLite database:", err.message);
    } else {
      console.log("Connected to SQLite database");
    }
  });
  return db;
};
