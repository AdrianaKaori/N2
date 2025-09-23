import { getDbConnection } from './database';

export async function getTemas() {
  const db = await getDbConnection();
  const rows = await db.getAllAsync('SELECT * FROM temas');
  await db.closeAsync();
  return rows;
}

export async function addTema(nome) {
  const db = await getDbConnection();
  const result = await db.runAsync('INSERT INTO temas (nome) VALUES (?)', [nome]);
  await db.closeAsync();
  return result.changes === 1;
}

export async function updateTema(id, nome) {
  const db = await getDbConnection();
  const result = await db.runAsync('UPDATE temas SET nome=? WHERE id=?', [nome, id]);
  await db.closeAsync();
  return result.changes === 1;
}

export async function deleteTema(id) {
  const db = await getDbConnection();
  const result = await db.runAsync('DELETE FROM temas WHERE id=?', [id]);
  await db.closeAsync();
  return result.changes === 1;
}
