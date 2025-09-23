import { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { getDbConnection } from '../services/database';

export default function QuizScreen({ route, navigation }) {
  const { temaId, quantidade } = route.params;

  const [perguntas, setPerguntas] = useState([]);
  const [indiceAtual, setIndiceAtual] = useState(0);
  const [respostas, setRespostas] = useState([]);
  const [alternativas, setAlternativas] = useState([]);

  useEffect(() => {
    carregarPerguntas();
  }, []);

  const carregarPerguntas = async () => {
    const db = await getDbConnection();

    const result = await db.getAllAsync(
      `SELECT perguntas.id, perguntas.pergunta, perguntas.resposta_correta
       FROM perguntas 
       WHERE tema_id = ? 
       ORDER BY RANDOM() 
       LIMIT ?`,
      [temaId, quantidade]
    );

    setPerguntas(result);

    if (result.length > 0) {
      await carregarAlternativas(result[0].id);
    }

    await db.closeAsync();
  };

  const carregarAlternativas = async (perguntaId) => {
    const db = await getDbConnection();

    const result = await db.getAllAsync(
      'SELECT alternativa, numero FROM alternativas WHERE pergunta_id = ? ORDER BY numero ASC',
      [perguntaId]
    );

    setAlternativas(result);

    await db.closeAsync();
  };

  const responder = async (numeroEscolhido) => {
    const novaResposta = [...respostas];
    novaResposta[indiceAtual] = numeroEscolhido;
    setRespostas(novaResposta);

    if (indiceAtual + 1 < perguntas.length) {
      const proximoIndice = indiceAtual + 1;
      setIndiceAtual(proximoIndice);
      await carregarAlternativas(perguntas[proximoIndice].id);
    } else {
      // Fim do quiz - navegar para resultados
      navigation.navigate('Resultado', {
        perguntas,
        respostas: novaResposta,
      });
    }
  };

  if (perguntas.length === 0) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Carregando perguntas...</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 18, marginBottom: 10 }}>
        Pergunta {indiceAtual + 1} de {perguntas.length}
      </Text>
      <Text style={{ fontSize: 20, marginBottom: 20 }}>
        {perguntas[indiceAtual].pergunta}
      </Text>

      {alternativas.map((alt, i) => (
        <TouchableOpacity
          key={i}
          onPress={() => responder(alt.numero)}
          style={{
            padding: 15,
            borderWidth: 1,
            borderColor: '#333',
            borderRadius: 8,
            marginBottom: 10,
          }}
        >
          <Text>{alt.alternativa}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}
