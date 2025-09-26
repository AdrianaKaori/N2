import { getDbConnection } from './database';

export async function getAlternativas(pergunta_id = null) {
  const db = await getDbConnection();
  let query = 'SELECT * FROM alternativas';
  let params = [];
  if (pergunta_id != null) {  
    query += ' WHERE pergunta_id = ?';
    params = [ pergunta_id ];
  }
  const rows = await db.getAllAsync(query, params);
  await db.closeAsync();
  return rows;
}


export async function addAlternativa(pergunta_id, alternativa, numero) {
  const db = await getDbConnection();
  const result = await db.runAsync(
    'INSERT INTO alternativas (pergunta_id, alternativa, numero) VALUES (?, ?, ?)',
    [pergunta_id, alternativa, numero]
  );  
  await db.closeAsync();
  return result.changes === 1;
}

export async function updateAlternativa(id, alternativa, numero) {
  const db = await getDbConnection();
  const result = await db.runAsync(
    'UPDATE alternativas SET alternativa=?, numero=? WHERE id=?',
    [alternativa, numero, id]
  );
  await db.closeAsync();
  return result.changes === 1;
}

export async function deleteAlternativa(id) {
  const db = await getDbConnection();
  const result = await db.runAsync('DELETE FROM alternativas WHERE id=?', [id]);
  await db.closeAsync();
  return result.changes === 1;
}
