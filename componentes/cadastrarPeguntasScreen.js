import { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Alert, FlatList, TouchableOpacity, Image } from 'react-native';
import { Picker } from '@react-native-picker/picker'; // npm install @react-native-picker/picker

import { getTemas } from '../services/dbTemas';
import { getPerguntas, addPergunta, updatePergunta, deletePergunta } from '../services/dbPerguntas';
import { getAlternativas, addAlternativa, deleteAlternativa } from '../services/dbAlternativas';

import iconDelete from '../assets/delete.png';
import iconEdit from '../assets/edit.png';

export default function CadastrarPerguntaScreen() {
  const [temas, setTemas] = useState([]);
  const [temaSelecionado, setTemaSelecionado] = useState(null);
  const [pergunta, setPergunta] = useState('');
  const [alternativas, setAlternativas] = useState(['', '', '', '']);
  const [respostaCorreta, setRespostaCorreta] = useState(0);

  const [perguntas, setPerguntas] = useState([]);

  // Para edição:
  const [editandoId, setEditandoId] = useState(null);

  // Estados para edição
  const [temaEditado, setTemaEditado] = useState(null);
  const [perguntaEditada, setPerguntaEditada] = useState('');
  const [alternativasEditadas, setAlternativasEditadas] = useState(['', '', '', '']);
  const [respostaCorretaEditada, setRespostaCorretaEditada] = useState(0);

  useEffect(() => {
    carregarTemas();
    carregarPerguntas();
  }, []);

  async function carregarTemas() {
    try {
      const dados = await getTemas();
      setTemas(dados);
    } catch (error) {
      Alert.alert('Erro', 'Falha ao carregar temas');
    }
  }

  async function carregarPerguntas() {
    try {
      const dados = await getPerguntas();

      // Carrega alternativas para cada pergunta
      const perguntasComAlternativas = await Promise.all(
        dados.map(async (p) => {
          const alt = await getAlternativas(p.id);
          // ordenar alternativas por numero
          alt.sort((a, b) => a.numero - b.numero);
          return { ...p, alternativas: alt };
        })
      );

      setPerguntas(perguntasComAlternativas);
    } catch {
      Alert.alert('Erro', 'Falha ao carregar perguntas');
    }
  }

  const resetForm = () => {
    setTemaSelecionado(null);
    setPergunta('');
    setAlternativas(['', '', '', '']);
    setRespostaCorreta(0);
  };

  const resetEditForm = () => {
    setEditandoId(null);
    setTemaEditado(null);
    setPerguntaEditada('');
    setAlternativasEditadas(['', '', '', '']);
    setRespostaCorretaEditada(0);
  };

  async function salvarPergunta() {
  if (!temaSelecionado || !pergunta.trim() || alternativas.some(a => !a.trim())) {
    Alert.alert('Erro', 'Preencha todos os campos');
    return;
  }

  try {
    const perguntaId = await addPergunta(pergunta, temaSelecionado, respostaCorreta);

    if (!perguntaId) {
      throw new Error('Erro ao inserir pergunta no banco.');
    }

    for (let i = 0; i < alternativas.length; i++) {
      const sucesso = await addAlternativa(perguntaId, alternativas[i], i);
      if (!sucesso) {
        throw new Error(`Erro ao salvar a alternativa ${i + 1}`);
      }
    }

    Alert.alert('Sucesso', 'Pergunta salva!');
    resetForm();
    carregarPerguntas();

  } catch (error) {
    console.error(error); // opcional: para debug
    Alert.alert('Erro', error.message);
  }
}


  async function iniciarEdicao(pergunta) {
    setEditandoId(pergunta.id);
    setTemaEditado(pergunta.tema_id);
    setPerguntaEditada(pergunta.pergunta);
    setRespostaCorretaEditada(pergunta.resposta_correta);
    setAlternativasEditadas(pergunta.alternativas.map(a => a.alternativa));
  }

  async function salvarEdicao() {
    if (!temaEditado || !perguntaEditada.trim() || alternativasEditadas.some(a => !a.trim())) {
      Alert.alert('Erro', 'Preencha todos os campos');
      return;
    }

    const sucesso = await updatePergunta(editandoId, perguntaEditada, temaEditado, respostaCorretaEditada);
    if (sucesso) {
      // Apaga alternativas antigas
      const altAntigas = await getAlternativas(editandoId);
      for (const alt of altAntigas) {
        await deleteAlternativa(alt.id);
      }
      // Adiciona alternativas novas
      for (let i = 0; i < alternativasEditadas.length; i++) {
        await addAlternativa(editandoId, alternativasEditadas[i], i);
      }

      Alert.alert('Sucesso', 'Pergunta atualizada!');
      resetEditForm();
      carregarPerguntas();
    } else {
      Alert.alert('Erro', 'Erro ao atualizar pergunta');
    }
  }

  async function removerPergunta(id) {
    const sucesso = await deletePergunta(id);
    if (sucesso) {
      const alt = await getAlternativas(id);
      for (const a of alt) {
        await deleteAlternativa(a.id);
      }
      Alert.alert('Sucesso', 'Pergunta removida!');
      carregarPerguntas();
    } else {
      Alert.alert('Erro', 'Erro ao remover pergunta');
    }
  }

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontWeight: 'bold', fontSize: 18, marginBottom: 10 }}>
        {editandoId ? 'Editar Pergunta' : 'Cadastrar Pergunta'}
      </Text>

      <Text>Tema:</Text>
      <Picker
        selectedValue={editandoId ? temaEditado : temaSelecionado}
        onValueChange={(itemValue) =>
          editandoId ? setTemaEditado(itemValue) : setTemaSelecionado(itemValue)
        }
        style={{ marginVertical: 10 }}
      >
        <Picker.Item label="Selecione um tema" value={null} />
        {temas.map((tema) => (
          <Picker.Item key={tema.id} label={tema.nome} value={tema.id} />
        ))}
      </Picker>

      <TextInput
        placeholder="Pergunta"
        value={editandoId ? perguntaEditada : pergunta}
        onChangeText={(text) => (editandoId ? setPerguntaEditada(text) : setPergunta(text))}
        style={{ borderWidth: 1, padding: 10, marginBottom: 10 }}
      />

      {(editandoId ? alternativasEditadas : alternativas).map((alt, i) => (
        <TextInput
          key={i}
          placeholder={`Alternativa ${i + 1}`}
          value={alt}
          onChangeText={(text) => {
            if (editandoId) {
              const newAlts = [...alternativasEditadas];
              newAlts[i] = text;
              setAlternativasEditadas(newAlts);
            } else {
              const newAlts = [...alternativas];
              newAlts[i] = text;
              setAlternativas(newAlts);
            }
          }}
          style={{ borderWidth: 1, padding: 10, marginBottom: 5 }}
        />
      ))}

      <Text>Alternativa correta:</Text>
      <Picker
        selectedValue={editandoId ? respostaCorretaEditada : respostaCorreta}
        onValueChange={(itemValue) =>
          editandoId ? setRespostaCorretaEditada(itemValue) : setRespostaCorreta(itemValue)
        }
        style={{ marginBottom: 10 }}
      >
        <Picker.Item label="1" value={0} />
        <Picker.Item label="2" value={1} />
        <Picker.Item label="3" value={2} />
        <Picker.Item label="4" value={3} />
      </Picker>

      {editandoId ? (
        <>
          <Button title="Salvar Alterações" onPress={salvarEdicao} />
          <Button title="Cancelar" onPress={resetEditForm} color="gray" />
        </>
      ) : (
        <Button title="Salvar Pergunta" onPress={salvarPergunta} />
      )}

      <Text style={{ marginTop: 20, fontWeight: 'bold', fontSize: 18 }}>Perguntas Cadastradas:</Text>
      <FlatList
        data={perguntas}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginVertical: 5,
              borderBottomWidth: 1,
              borderColor: '#ccc',
              paddingBottom: 5,
            }}
          >
            <Text style={{ flex: 1 }}>{item.pergunta}</Text>
            <TouchableOpacity onPress={() => iniciarEdicao(item)} style={{ marginRight: 10 }}>
              <Image source={iconEdit} style={{ width: 20, height: 20 }} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => removerPergunta(item.id)}>
              <Image source={iconDelete} style={{ width: 20, height: 20 }} />
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}
