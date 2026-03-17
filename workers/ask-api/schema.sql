CREATE TABLE IF NOT EXISTS questions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  question TEXT NOT NULL,
  answer TEXT,
  created_at TEXT NOT NULL,
  answered_at TEXT
);
