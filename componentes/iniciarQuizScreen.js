import { useState, useEffect } from 'react';
import { View, Text, Button, Alert, Picker } from 'react-native';

export default function IniciarQuizScreen({ navigation }) {
  const [temas, setTemas] = useState([]);
  const [temaSelecionado, setTemaSelecionado] = useState(null);
  const [quantidade, setQuantidade] = useState('1');
  const [quantidadeDisponivel, setQuantidadeDisponivel] = useState(0);

  async function getTemasComQuantidadePerguntas() {
  const db = await getDbConnection();
  const rows = await db.getAllAsync(`
    SELECT temas.id, temas.nome, COUNT(perguntas.id) as total
    FROM temas
    LEFT JOIN perguntas ON perguntas.tema_id = temas.id
    GROUP BY temas.id
  `);
  await db.closeAsync();
  return rows;
}

useEffect(() => {
  async function carregar() {
    const dados = await getTemasComQuantidadePerguntas();
    setTemas(dados);
  }
  carregar();
}, []);


  const iniciarQuiz = () => {
    const qtd = parseInt(quantidade);
    if (!temaSelecionado) {
      Alert.alert('Erro', 'Selecione um tema');
      return;
    }
    if (isNaN(qtd) || qtd < 1) {
      Alert.alert('Erro', 'Informe uma quantidade válida');
      return;
    }
    if (qtd > quantidadeDisponivel) {
      Alert.alert('Erro', `Não há perguntas suficientes para este tema. Máximo: ${quantidadeDisponivel}`);
      return;
    }

    navigation.navigate('Quiz', { temaId: temaSelecionado, quantidade: qtd });
  };

  return (
    <View style={{ padding: 20 }}>
      <Text>Selecione o Tema:</Text>
      <Picker
        selectedValue={temaSelecionado}
        onValueChange={(itemValue) => setTemaSelecionado(itemValue)}
      >
        <Picker.Item label="Selecione um tema" value={null} />
        {temas.map(tema => (
          <Picker.Item key={tema.id} label={`${tema.nome} (${tema.total || 0} perguntas)`} value={tema.id} />
        ))}
      </Picker>

      <Text>Quantidade de perguntas:</Text>
      <Picker
        selectedValue={quantidade}
        onValueChange={(itemValue) => setQuantidade(itemValue)}
      >
        {[...Array(quantidadeDisponivel).keys()].map(i => (
          <Picker.Item key={i+1} label={`${i+1}`} value={`${i+1}`} />
        ))}
      </Picker>

      <Button title="Iniciar Quiz" onPress={iniciarQuiz} />
    </View>
  );
}
