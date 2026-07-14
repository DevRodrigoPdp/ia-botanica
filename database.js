/**
 * Base de datos SQLite para guardar conversaciones
 */

const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Crear/conectar BD
const dbPath = path.join(__dirname, 'pili.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error conectando BD:', err);
  } else {
    console.log('✅ Conectado a SQLite');
    initializeDatabase();
  }
});

// Crear tablas si no existen
function initializeDatabase() {
  db.run(`
    CREATE TABLE IF NOT EXISTS conversations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      session_id TEXT UNIQUE NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      session_id TEXT NOT NULL,
      role TEXT NOT NULL,
      content TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(session_id) REFERENCES conversations(session_id)
    )
  `);

  console.log('✅ Tablas creadas');
}

// Guardar mensaje
function saveMessage(sessionId, role, content) {
  return new Promise((resolve, reject) => {
    db.run(
      `INSERT INTO messages (session_id, role, content) 
       VALUES (?, ?, ?)`,
      [sessionId, role, content],
      (err) => {
        if (err) reject(err);
        else resolve();
      }
    );
  });
}

// Crear nueva sesión
function createSession(sessionId) {
  return new Promise((resolve, reject) => {
    db.run(
      `INSERT OR IGNORE INTO conversations (session_id) VALUES (?)`,
      [sessionId],
      (err) => {
        if (err) reject(err);
        else resolve();
      }
    );
  });
}

// Obtener historial
function getMessages(sessionId) {
  return new Promise((resolve, reject) => {
    db.all(
      `SELECT role, content, created_at FROM messages 
       WHERE session_id = ? 
       ORDER BY created_at ASC`,
      [sessionId],
      (err, rows) => {
        if (err) reject(err);
        else resolve(rows || []);
      }
    );
  });
}

// Obtener todas las sesiones
function getAllSessions() {
  return new Promise((resolve, reject) => {
    db.all(
      `SELECT session_id, created_at, updated_at FROM conversations 
       ORDER BY updated_at DESC`,
      [],
      (err, rows) => {
        if (err) reject(err);
        else resolve(rows || []);
      }
    );
  });
}

module.exports = {
  saveMessage,
  createSession,
  getMessages,
  getAllSessions,
  db
};