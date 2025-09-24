// db.js
import * as SQLite from 'expo-sqlite';

// Abrir conexão
export async function getDbConnection() {
  const db = await SQLite.openDatabaseAsync('quiz.db');
  return db;
}

// Inicializar as tabelas
export async function initDB() {
  const db = await getDbConnection();

  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS temas (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL
    );
  `);

  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS perguntas (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      pergunta TEXT NOT NULL,
      tema_id INTEGER,
      resposta_correta INTEGER,
      FOREIGN KEY (tema_id) REFERENCES temas(id)
    );
  `);

  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS alternativas (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      pergunta_id INTEGER,
      alternativa TEXT,
      numero INTEGER,
      FOREIGN KEY (pergunta_id) REFERENCES perguntas(id)
    );
  `);

  await db.closeAsync();
}
