import { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Alert, Picker } from 'react-native';
import { getTemas } from '../services/dbTemas';
import { addPergunta } from '../services/dbPerguntas';
import { addAlternativa } from '../services/dbAlternativas';

export default function CadastrarPerguntaScreen() {
  const [temas, setTemas] = useState([]);
  const [temaSelecionado, setTemaSelecionado] = useState(null);
  const [pergunta, setPergunta] = useState('');
  const [alternativas, setAlternativas] = useState(['', '', '', '']);
  const [respostaCorreta, setRespostaCorreta] = useState(0);

  useEffect(() => {
  async function carregarTemas() {
    const dados = await getTemas();
    setTemas(dados);
  }
  carregarTemas();
}, []);

  const salvarPergunta = async () => {
  if (!temaSelecionado || !pergunta || alternativas.some(a => a.trim() === '')) {
    Alert.alert('Erro', 'Preencha todos os campos');
    return;
  }

  const perguntaId = await addPergunta(pergunta, temaSelecionado, respostaCorreta);
  
  if (perguntaId) {
    for (let i = 0; i < alternativas.length; i++) {
      await addAlternativa(perguntaId, alternativas[i], i);
    }

    Alert.alert('Sucesso', 'Pergunta cadastrada!');
    setPergunta('');
    setAlternativas(['', '', '', '']);
  } else {
    Alert.alert('Erro', 'Erro ao salvar pergunta');
  }
};

  return (
    <View style={{ padding: 20 }}>
      <Text>Tema:</Text>
      <Picker selectedValue={temaSelecionado} onValueChange={(itemValue) => setTemaSelecionado(itemValue)}>
        <Picker.Item label="Selecione um tema" value={null} />
        {temas.map(tema => (
          <Picker.Item key={tema.id} label={tema.nome} value={tema.id} />
        ))}
      </Picker>

      <TextInput
        placeholder="Pergunta"
        value={pergunta}
        onChangeText={setPergunta}
        style={{ borderWidth: 1, marginVertical: 10, padding: 10 }}
      />

      {alternativas.map((alt, i) => (
        <TextInput
          key={i}
          placeholder={`Alternativa ${i + 1}`}
          value={alt}
          onChangeText={text => {
            const newAlts = [...alternativas];
            newAlts[i] = text;
            setAlternativas(newAlts);
          }}
          style={{ borderWidth: 1, marginVertical: 5, padding: 10 }}
        />
      ))}

      <Text>Alternativa correta:</Text>
      <Picker selectedValue={respostaCorreta} onValueChange={(value) => setRespostaCorreta(value)}>
        <Picker.Item label="1" value={0} />
        <Picker.Item label="2" value={1} />
        <Picker.Item label="3" value={2} />
        <Picker.Item label="4" value={3} />
      </Picker>

      <Button title="Salvar Pergunta" onPress={salvarPergunta} />
    </View>
  );
}
