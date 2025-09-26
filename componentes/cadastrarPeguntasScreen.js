import { useState, useEffect } from 'react';
import { View, Text, TextInput, Alert, FlatList, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';

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
    carregaDados();
  }, []);

  async function carregaDados() {
    await carregarTemas();
    await carregarPerguntas();    
  }


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

    console.log("antes de inserir alternativassss")
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
    console.error(error);
    Alert.alert('Erro', error.message);
  }
}


  async function iniciarEdicao(pergunta) {
    setEditandoId(pergunta.id);
    setTemaEditado(pergunta.tema_id);
    setPerguntaEditada(pergunta.pergunta);
    setRespostaCorretaEditada(pergunta.resposta_correta);

    let vetor = pergunta.alternativas.map(a => a.alternativa);

    console.log(vetor);

    setAlternativasEditadas(vetor);
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
    <View style={styles.container}>
      <Text style={styles.title}>
        {editandoId ? 'Editar Pergunta' : 'Cadastrar Pergunta'}
      </Text>

      <Text style={styles.label}>Tema:</Text>
      <View style={styles.pickerWrapper}>
        <Picker
          selectedValue={editandoId ? temaEditado : temaSelecionado}
          onValueChange={(itemValue) =>
            editandoId ? setTemaEditado(itemValue) : setTemaSelecionado(itemValue)
          }
          style={styles.picker}
          dropdownIconColor="#4A6351"
        >
          <Picker.Item label="Selecione um tema" value={null} />
          {temas.map((tema) => (
            <Picker.Item key={tema.id} label={tema.nome} value={tema.id} />
          ))}
        </Picker>
      </View>

      <TextInput
        placeholder="Pergunta"
        value={editandoId ? perguntaEditada : pergunta}
        onChangeText={(text) => (editandoId ? setPerguntaEditada(text) : setPergunta(text))}
        style={styles.input}
        placeholderTextColor="#7B9E7D"
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
          style={styles.input}
          placeholderTextColor="#7B9E7D"
        />
      ))}

      <Text style={styles.label}>Alternativa correta:</Text>
      <View style={styles.pickerWrapper}>
        <Picker
          selectedValue={editandoId ? respostaCorretaEditada : respostaCorreta}
          onValueChange={(itemValue) =>
            editandoId ? setRespostaCorretaEditada(itemValue) : setRespostaCorreta(itemValue)
          }
          style={styles.picker}
          dropdownIconColor="#4A6351"
        >
          <Picker.Item label="1" value={0} />
          <Picker.Item label="2" value={1} />
          <Picker.Item label="3" value={2} />
          <Picker.Item label="4" value={3} />
        </Picker>
      </View>

      {editandoId ? (
        <View style={styles.buttonsRow}>
          <TouchableOpacity style={[styles.button, styles.saveButton]} onPress={salvarEdicao}>
            <Text style={styles.buttonText}>Salvar Alterações</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={resetEditForm}>
            <Text style={styles.buttonText}>Cancelar</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity style={[styles.button, styles.saveButton]} onPress={salvarPergunta}>
          <Text style={styles.buttonText}>Salvar Pergunta</Text>
        </TouchableOpacity>
      )}

      <Text style={styles.subTitle}>Perguntas Cadastradas:</Text>
      <FlatList
        data={perguntas}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.perguntaItem}>
            <Text style={styles.perguntaText}>{item.pergunta}</Text>
            <TouchableOpacity onPress={() => iniciarEdicao(item)} style={styles.iconBtn}>
              <Image source={iconEdit} style={styles.icon} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => removerPergunta(item.id)} style={styles.iconBtn}>
              <Image source={iconDelete} style={styles.icon} />
            </TouchableOpacity>
          </View>
        )}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#D5F5E3',  
    padding: 20,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 22,
    color: '#2E5137', 
    marginBottom: 15,
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    color: '#3C6E47',
    marginBottom: 5,
    fontWeight: '600',
  },
  input: {
    backgroundColor: '#EFF9F3',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#A3D9B1',
    padding: 12,
    marginBottom: 10,
    fontSize: 16,
    color: '#2E5137',
  },
  pickerWrapper: {
    backgroundColor: '#EFF9F3',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#A3D9B1',
    marginBottom: 15,
  },
  picker: {
    color: '#2E5137',
  },
  button: {
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  saveButton: {
    backgroundColor: '#7BB661', 
  },
  cancelButton: {
    backgroundColor: '#A9A9A9',
  },
  buttonText: {
    color: '#F0F6F0',
    fontSize: 16,
    fontWeight: '600',
  },
  buttonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  subTitle: {
    fontWeight: 'bold',
    fontSize: 20,
    marginTop: 25,
    marginBottom: 10,
    color: '#2E5137',
  },
  perguntaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#BCE5B5',
    borderRadius: 8,
    padding: 10,
    marginBottom: 8,
  },
  perguntaText: {
    flex: 1,
    fontSize: 16,
    color: '#2E5137',
  },
  iconBtn: {
    padding: 5,
    marginLeft: 10,
  },
  icon: {
    width: 22,
    height: 22,
    tintColor: '#2E5137',
  },
});