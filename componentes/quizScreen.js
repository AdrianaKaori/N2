import { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { getDbConnection } from '../services/database';

export default function QuizScreen({ route, navigation }) {
  // Recebe os parâmetros passados pela navegação: o tema selecionado e a quantidade de perguntas
  const { temaId, quantidade } = route.params;
  // Armazena a lista de perguntas carregadas do banco
  const [perguntas, setPerguntas] = useState([]);
  // Índice da pergunta atual no quiz
  const [indiceAtual, setIndiceAtual] = useState(0);
  // Armazena as respostas selecionadas pelo usuário (por número da alternativa)
  const [respostas, setRespostas] = useState([]);
  // Armazena as alternativas da pergunta atual
  const [alternativas, setAlternativas] = useState([]);

  useEffect(() => {
    carregarPerguntas(); // Carrega as perguntas quando o componente monta
  }, []);

  const carregarPerguntas = async () => {
    try {
      const db = await getDbConnection();

      // Busca aleatória das perguntas do tema escolhido, limitando pela quantidade definida
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
        setPerguntas(result);// Armazena as perguntas no estado
        await carregarAlternativas(result[0].id);// Carrega as alternativas da primeira pergunta
      } else {
        setPerguntas([]);// Nenhuma pergunta encontrada
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
      setAlternativas(result || []);// Armazena as alternativas no estado
    } catch (error) {
      console.error('Erro ao carregar alternativas:', error);
    }
  };

  const responder = async (numeroEscolhido) => {
    const novaResposta = [...respostas];// Copia o array de respostas anteriores
    novaResposta[indiceAtual] = numeroEscolhido; // Salva a resposta da pergunta atual
    setRespostas(novaResposta);// Atualiza o estado

    // Se houver mais perguntas, avança para a próxima
    if (indiceAtual + 1 < perguntas.length) {
      const proximoIndice = indiceAtual + 1;
      setIndiceAtual(proximoIndice);// Avança o índice da pergunta
      await carregarAlternativas(perguntas[proximoIndice].id);// Carrega alternativas da nova pergunta
    } else {
      // Fim do quiz
      // Se for a última pergunta, navega para a tela de resultado
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
});
