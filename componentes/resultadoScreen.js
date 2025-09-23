import { View, Text, ScrollView, Button } from 'react-native';

export default function ResultadoScreen({ route, navigation }) {
  const { perguntas, respostas } = route.params;

  let acertos = 0;

  perguntas.forEach((p, i) => {
    if (p.resposta_correta === respostas[i]) {
      acertos++;
    }
  });

  const percentual = ((acertos / perguntas.length) * 100).toFixed(2);

  return (
    <ScrollView style={{ padding: 20 }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold' }}>
        Resultado: {percentual}% de acertos
      </Text>
      {perguntas.map((p, i) => {
        const acertou = p.resposta_correta === respostas[i];
        return (
          <View
            key={p.id}
            style={{
              marginVertical: 10,
              padding: 10,
              borderWidth: 1,
              borderColor: acertou ? 'green' : 'red',
              borderRadius: 8,
              backgroundColor: acertou ? '#d4edda' : '#f8d7da',
            }}
          >
            <Text style={{ fontWeight: 'bold' }}>{p.pergunta}</Text>
            <Text>Sua resposta: {respostas[i] + 1}</Text>
            {!acertou && <Text>Resposta correta: {p.resposta_correta + 1}</Text>}
          </View>
        );
      })}

      <Button title="Voltar ao Início" onPress={() => navigation.popToTop()} />
    </ScrollView>
  );
}
