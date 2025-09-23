import { getDbConnection } from './database';

export async function getPerguntas() {
  const db = await getDbConnection();
  const rows = await db.getAllAsync('SELECT * FROM perguntas');
  await db.closeAsync();
  return rows;
}

export async function addPergunta(pergunta, tema_id, resposta_correta) {
  const db = await getDbConnection();
  const result = await db.runAsync(
    'INSERT INTO perguntas (pergunta, tema_id, resposta_correta) VALUES (?, ?, ?)',
    [pergunta, tema_id, resposta_correta]
  );
  await db.closeAsync();
  return result.changes === 1;
}

export async function updatePergunta(id, pergunta, tema_id, resposta_correta) {
  const db = await getDbConnection();
  const result = await db.runAsync(
    'UPDATE perguntas SET pergunta=?, tema_id=?, resposta_correta=? WHERE id=?',
    [pergunta, tema_id, resposta_correta, id]
  );
  await db.closeAsync();
  return result.changes === 1;
}

export async function deletePergunta(id) {
  const db = await getDbConnection();
  const result = await db.runAsync('DELETE FROM perguntas WHERE id=?', [id]);
  await db.closeAsync();
  return result.changes === 1;
}
