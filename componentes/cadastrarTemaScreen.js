import { useState, useEffect } from 'react';
import { View, TextInput, Alert, Text, TouchableOpacity, Image, FlatList, StyleSheet,} from 'react-native';

import { getTemas, addTema, updateTema, deleteTema } from '../services/dbTemas';

import iconDelete from '../assets/delete.png';
import iconEdit from '../assets/edit.png';

export default function CadastrarTemaScreen() {
  const [nomeTema, setNomeTema] = useState('');
  const [temas, setTemas] = useState([]);
  const [editandoId, setEditandoId] = useState(null);
  const [nomeEditado, setNomeEditado] = useState('');

  useEffect(() => {
    carregarTemas();
  }, []);

  async function carregarTemas() {
    try {
      const dados = await getTemas();
      setTemas(dados);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível carregar os temas');
    }
  }

  const salvarTema = async () => {
    if (!nomeTema.trim()) {
      Alert.alert('Erro', 'Digite o nome do tema');
      return;
    }

    const sucesso = await addTema(nomeTema);
    if (sucesso) {
      Alert.alert('Sucesso', 'Tema salvo com sucesso!');
      setNomeTema('');
      carregarTemas();
    } else {
      Alert.alert('Erro', 'Erro ao salvar tema');
    }
  };

  const removerElemento = async (id) => {
    const sucesso = await deleteTema(id);
    if (sucesso) {
      Alert.alert('Sucesso', 'Tema removido');
      carregarTemas();
    } else {
      Alert.alert('Erro', 'Erro ao remover tema');
    }
  };

  const iniciarEdicao = (id, nome) => {
    setEditandoId(id);
    setNomeEditado(nome);
  };

  const salvarEdicao = async () => {
    if (!nomeEditado.trim()) {
      Alert.alert('Erro', 'Digite o nome do tema');
      return;
    }

    const sucesso = await updateTema(editandoId, nomeEditado);
    if (sucesso) {
      Alert.alert('Sucesso', 'Tema atualizado');
      setEditandoId(null);
      setNomeEditado('');
      carregarTemas();
    } else {
      Alert.alert('Erro', 'Erro ao atualizar tema');
    }
  };

  const cancelarEdicao = () => {
    setEditandoId(null);
    setNomeEditado('');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cadastro de Temas</Text>

      <TextInput
        placeholder="Nome do Tema"
        value={nomeTema}
        onChangeText={setNomeTema}
        style={styles.input}
        placeholderTextColor="#555"
      />

      <TouchableOpacity style={styles.button} onPress={salvarTema}>
        <Text style={styles.buttonText}>Salvar Tema</Text>
      </TouchableOpacity>

      <FlatList
        data={temas}
        keyExtractor={(item) => item.id.toString()}
        style={{ marginTop: 20 }}
        renderItem={({ item }) => (
          <View style={styles.temaItem}>
            {editandoId === item.id ? (
              <>
                <TextInput
                  value={nomeEditado}
                  onChangeText={setNomeEditado}
                  style={styles.inputEdit}
                  placeholder="Editar nome"
                  placeholderTextColor="#555"
                />
                <TouchableOpacity onPress={salvarEdicao} style={styles.editBtn}>
                  <Text style={styles.editBtnText}>Salvar</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={cancelarEdicao} style={[styles.editBtn, { backgroundColor: '#ccc' }]}>
                  <Text style={styles.editBtnText}>Cancelar</Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <Text style={styles.temaText}>{item.nome}</Text>
                <TouchableOpacity onPress={() => iniciarEdicao(item.id, item.nome)}>
                  <Image source={iconEdit} style={styles.icon} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => removerElemento(item.id)}>
                  <Image source={iconDelete} style={styles.icon} />
                </TouchableOpacity>
              </>
            )}
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FADBD8',
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#5D6D7E',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#FFF',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#F5B7B1',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#4A4A4A',
    fontSize: 16,
    fontWeight: '600',
  },
  temaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FDEDEC',
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  temaText: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  icon: {
    width: 20,
    height: 20,
    marginHorizontal: 8,
  },
  inputEdit: {
    flex: 1,
    backgroundColor: '#FFF',
    borderRadius: 6,
    padding: 10,
    fontSize: 15,
    borderColor: '#ccc',
    borderWidth: 1,
  },
  editBtn: {
    backgroundColor: '#AED6F1',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 6,
    marginLeft: 5,
  },
  editBtnText: {
    color: '#1A5276',
    fontWeight: '600',
  },
});
