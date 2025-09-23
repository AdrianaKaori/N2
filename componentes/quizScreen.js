import { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity} from 'react-native';
import db from '../database/db';

export default function QuizScreen({ route, navigation }) {
  const { temaId, quantidade } = route.params;

  const [perguntas, setPerguntas] = useState([]);
  const [indiceAtual, setIndiceAtual] = useState(0);
  const [respostas, setRespostas] = useState([]);
  const [alternativas, setAlternativas] = useState([]);

  useEffect(() => {
    // Buscar perguntas aleatórias do tema
    db.transaction(tx => {
      tx.executeSql(
        `SELECT perguntas.id, perguntas.pergunta, perguntas.resposta_correta
         FROM perguntas WHERE tema_id = ? ORDER BY RANDOM() LIMIT ?`,
        [temaId, quantidade],
        (_, { rows }) => {
          const arr = rows._array;
          setPerguntas(arr);
          if (arr.length > 0) {
            carregarAlternativas(arr[0].id);
          }
        }
      );
    });
  }, []);

  const carregarAlternativas = (perguntaId) => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT alternativa, numero FROM alternativas WHERE pergunta_id = ? ORDER BY numero ASC',
        [perguntaId],
        (_, { rows }) => {
          setAlternativas(rows._array);
        }
      );
    });
  };

  const responder = (numeroEscolhido) => {
    const novaResposta = [...respostas];
    novaResposta[indiceAtual] = numeroEscolhido;
    setRespostas(novaResposta);

    if (indiceAtual + 1 < perguntas.length) {
      setIndiceAtual(indiceAtual + 1);
      carregarAlternativas(perguntas[indiceAtual + 1].id);
    } else {
      // Fim do quiz - navegar para resultados
      navigation.navigate('Resultado', {
        perguntas,
        respostas: novaResposta
      });
    }
  };

  if (perguntas.length === 0) {
    return (
      <View style={{ flex:1, justifyContent:'center', alignItems:'center' }}>
        <Text>Carregando perguntas...</Text>
      </View>
    );
  }

  return (
    <View style={{ flex:1, padding: 20 }}>
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
            marginBottom: 10
          }}
        >
          <Text>{alt.alternativa}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}
