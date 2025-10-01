import { useState, useEffect } from 'react';
import { View, Text, Button, Alert, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { getDbConnection } from '../services/database';

export default function IniciarQuizScreen({ navigation }) {
  const [temas, setTemas] = useState([]);
  const [temaSelecionado, setTemaSelecionado] = useState('');
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

  useEffect(() => {
    if (!temaSelecionado) {
      setQuantidadeDisponivel(0);
      setQuantidade('1');
      return;
    }

    const tema = temas.find(t => t.id === temaSelecionado);
    if (tema) {
      const total = tema.total || 0;
      setQuantidadeDisponivel(total);

      if (total === 0) {
        Alert.alert('Aviso', 'Nenhuma pergunta disponível para o tema selecionado.');
      }

      setQuantidade(total > 0 ? '1' : '0');
    }
  }, [temaSelecionado, temas]);

  const iniciarQuiz = () => {
    const qtd = parseInt(quantidade);

    if (!temaSelecionado) {
      Alert.alert('Erro', 'Selecione um tema.');
      return;
    }

    if (isNaN(qtd) || qtd < 1) {
      Alert.alert('Erro', 'Informe uma quantidade válida.');
      return;
    }

    if (quantidadeDisponivel === 0) {
      Alert.alert('Erro', 'Não há perguntas disponíveis para este tema.');
      return;
    }

    if (qtd > quantidadeDisponivel) {
      Alert.alert('Erro', `Não há perguntas suficientes para este tema. Máximo: ${quantidadeDisponivel}`);
      return;
    }

    navigation.navigate('Quiz', {
      temaId: temaSelecionado,
      quantidade: qtd,
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Selecione o Tema:</Text>
      <View style={styles.pickerWrapper}>
        <Picker
          selectedValue={temaSelecionado}
          onValueChange={(itemValue) => setTemaSelecionado(itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="Selecione um tema" value="" />
          {temas.map((tema) => (
            <Picker.Item
              key={tema.id}
              label={`${tema.nome} (${tema.total || 0} perguntas)`}
              value={tema.id}
            />
          ))}
        </Picker>
      </View>

      <Text style={styles.label}>Quantidade de perguntas:</Text>
      <View style={styles.pickerWrapper}>
        <Picker
          selectedValue={quantidade}
          onValueChange={(itemValue) => setQuantidade(itemValue)}
          enabled={quantidadeDisponivel > 0}
          style={styles.picker}
        >
          {quantidadeDisponivel > 0 ? (
            [...Array(quantidadeDisponivel).keys()].map((i) => (
              <Picker.Item key={i + 1} label={`${i + 1}`} value={`${i + 1}`} />
            ))
          ) : (
            <Picker.Item label="Nenhuma pergunta disponível" value="0" />
          )}
        </Picker>
      </View>

      <View style={styles.buttonContainer}>
        <Button title="Iniciar Quiz" onPress={iniciarQuiz} color="#F4D03F" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FCF3CF',
    padding: 20,
    justifyContent: 'flex-start',
  },
  label: {
    fontSize: 16,
    color: '#333',
    marginBottom: 6,
    marginTop: 10,
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: '#aaa',
    borderRadius: 8,
    marginBottom: 16,
    overflow: 'hidden',
    backgroundColor: '#fff',
  },
  picker: {
    height: 50,
    color: '#333',
  },
  buttonContainer: {
    marginTop: 20,
  },
});
