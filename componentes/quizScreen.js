import { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { getDbConnection } from '../services/database';

export default function QuizScreen({ route, navigation }) {
  const { temaId, quantidade, tempoJogo } = route.params;

  const [perguntas, setPerguntas] = useState([]);
  const [indiceAtual, setIndiceAtual] = useState(0);
  const [respostas, setRespostas] = useState([]);
  const [alternativas, setAlternativas] = useState([]);
  const [timerCount, setTimerCount] = useState(tempoJogo)

  useEffect(() => {
    let interval = setInterval(() => {
      setTimerCount(lastTimerCount => {
        if (lastTimerCount == 0) {
          navigation.navigate('Resultado', {
            perguntas,
            respostas: ['Tempo Esgotado'],
          });
        } else {
          lastTimerCount <= 1 && clearInterval(interval)
          return lastTimerCount - 1
        }
      })
    }, 1000)

    return () => clearInterval(interval)
  }, []);

  useEffect(() => {
    carregarPerguntas();
  }, []);

  const carregarPerguntas = async () => {
    try {
      const db = await getDbConnection();

      const result = await db.getAllAsync(
        `SELECT perguntas.id, perguntas.pergunta, perguntas.resposta_correta
         FROM perguntas 
         WHERE tema_id = ? 
         ORDER BY RANDOM() 
         LIMIT ?`,
        [temaId, quantidade]
      );

      await db.closeAsync();

      if (result && result.length > 0) {
        setPerguntas(result);
        await carregarAlternativas(result[0].id);
      } else {
        setPerguntas([]);
      }
    } catch (error) {
      console.error('Erro ao carregar perguntas:', error);
    }
  };

  const carregarAlternativas = async (perguntaId) => {
    try {
      const db = await getDbConnection();

      const result = await db.getAllAsync(
        'SELECT alternativa, numero FROM alternativas WHERE pergunta_id = ? ORDER BY numero ASC',
        [perguntaId]
      );

      await db.closeAsync();
      setAlternativas(result || []);
    } catch (error) {
      console.error('Erro ao carregar alternativas:', error);
    }
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
      // Fim do quiz
      navigation.navigate('Resultado', {
        perguntas,
        respostas: novaResposta,
      });
    }
  };

  if (perguntas.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Carregando perguntas...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.timer}>{timerCount}</Text>
      <Text style={styles.questionCount}>
        Pergunta {indiceAtual + 1} de {perguntas.length}
      </Text>
      <Text style={styles.questionText}>
        {perguntas[indiceAtual].pergunta}
      </Text>

      {alternativas.map((alt, i) => (
        <TouchableOpacity
          key={i}
          onPress={() => responder(alt.numero)}
          style={styles.optionButton}
        >
          <Text style={styles.optionText}>{alt.alternativa}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#D6EAF8',
    padding: 20,
    justifyContent: 'flex-start',
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#D6EAF8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#333',
    fontSize: 18,
  },
  questionCount: {
    fontSize: 16,
    color: '#1B4F72',
    marginBottom: 10,
  },
  questionText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#154360',
    marginBottom: 20,
  },
  optionButton: {
    backgroundColor: '#AED6F1',
    padding: 15,
    borderRadius: 10,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#2980B9',
  },
  optionText: {
    color: '#1B2631',
    fontSize: 16,
  },
  timer: {
    alignSelf: 'center',
    color: '#1B2631',
    fontSize: 40,
  },
});
