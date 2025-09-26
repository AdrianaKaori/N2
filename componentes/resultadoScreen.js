import { View, Text, ScrollView, Button, StyleSheet } from 'react-native';

export default function ResultadoScreen({ route, navigation }) {
  const { perguntas = [], respostas = [] } = route.params || {};

  let acertos = 0;

  perguntas.forEach((p, i) => {
    if (p.resposta_correta === respostas[i]) {
      acertos++;
    }
  });

  const percentual = ((acertos / perguntas.length) * 100).toFixed(2);

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.resultTitle}>
          Resultado: {percentual}% de acertos
        </Text>

        {perguntas.map((p, i) => {
          const acertou = p.resposta_correta === respostas[i];
          return (
            <View
              key={p.id || i}
              style={[
                styles.perguntaBox,
                acertou ? styles.acerto : styles.erro
              ]}
            >
              <Text style={styles.perguntaTexto}>{p.pergunta}</Text>
              <Text style={styles.respostaTexto}>
                Sua resposta: {respostas[i] !== undefined ? respostas[i] + 1 : '—'}
              </Text>
              {!acertou && (
                <Text style={styles.respostaTexto}>
                  Resposta correta: {p.resposta_correta + 1}
                </Text>
              )}
            </View>
          );
        })}

        <View style={styles.buttonContainer}>
          <Button title="Voltar ao Início" onPress={() => navigation.popToTop()} />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E8DAEF',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  resultTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#5B2C6F',
    textAlign: 'center',
  },
  perguntaBox: {
    marginBottom: 15,
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
  },
  acerto: {
    borderColor: 'green',
    backgroundColor: '#d4edda',
  },
  erro: {
    borderColor: 'red',
    backgroundColor: '#f8d7da',
  },
  perguntaTexto: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 5,
    color: '#4A235A',
  },
  respostaTexto: {
    fontSize: 14,
    color: '#1C2833',
  },
  buttonContainer: {
    marginTop: 20,
    alignSelf: 'center',
    width: '60%',
  },
});