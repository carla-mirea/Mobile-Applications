const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(
  process.env.HOME || process.env.USERPROFILE,
  'Documents/concerts.db'
);

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error connecting to the database:', err.message);
  } else {
    console.log('Connected to SQLite database:', dbPath);
    initializeDatabase();
  }
});

function initializeDatabase() {
  const createConcertTable = `
    CREATE TABLE IF NOT EXISTS concert (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT,
      date TEXT NOT NULL,
      location TEXT NOT NULL,
      performers TEXT NOT NULL
    );
  `;

  db.run(createConcertTable, (err) => {
    if (err) {
      console.error('Error creating concert table:', err.message);
    } else {
      console.log('Concert table ensured.');
    }
  });
}

module.exports = db;
