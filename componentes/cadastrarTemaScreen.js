import { useState, useEffect } from 'react';
import { View, TextInput, Alert, Text, TouchableOpacity, Image, FlatList, StyleSheet, } from 'react-native';

// Importa funções para manipular os temas no banco de dados
import { getTemas, addTema, updateTema, deleteTema } from '../services/dbTemas';

import iconDelete from '../assets/delete.png';
import iconEdit from '../assets/edit.png';

// Componente principal da tela de cadastro de temas
export default function CadastrarTemaScreen() {
  // Estado para o nome do novo tema a ser criado
  const [nomeTema, setNomeTema] = useState('');
  // Lista de temas carregados do banco
  const [temas, setTemas] = useState([]);
  // Estados para edição de tema
  const [editandoId, setEditandoId] = useState(null);// armazena o ID do tema que está sendo editado
  const [nomeEditado, setNomeEditado] = useState('');// novo nome digitado na edição

  // useEffect roda quando o componente é montado
  useEffect(() => {
    carregarTemas();// carrega a lista de temas
  }, []);

  // Função que busca os temas no banco de dados
  async function carregarTemas() {
    try {
      const dados = await getTemas();// busca temas
      setTemas(dados);// atualiza o estado
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível carregar os temas');
    }
  }

  // Função para salvar um novo tema
  const salvarTema = async () => {
    if (!nomeTema.trim()) {
      Alert.alert('Erro', 'Digite o nome do tema');
      return;
    }

    const sucesso = await addTema(nomeTema);// adiciona no banco
    if (sucesso) {
      Alert.alert('Sucesso', 'Tema salvo com sucesso!');
      setNomeTema('');// limpa o campo
      carregarTemas();// recarrega a lista
    } else {
      Alert.alert('Erro', 'Erro ao salvar tema');
    }
  };

  function confirmaExclusão(id) {

    Alert.alert("Aviso", "Deseja mesmo remover o tema?", [
      { text: "Sim", onPress: () => removerElemento(id, true) },
      { text: "Não", onPress: () => removerElemento(id, false) }
    ]);

  }

  
  // Função para remover um tema
  const removerElemento = async (id, isConfirmed) => {
    if (isConfirmed) {
      const sucesso = await deleteTema(id);
      if (sucesso) {
        Alert.alert('Sucesso', 'Tema removido');
        carregarTemas();// atualiza lista
      } else {
        Alert.alert('Erro', 'Erro ao remover tema');
      }
    } else {
      Alert.alert('Cancelado', 'Tema não removido');
    }
  };

  // Preenche os estados com os dados do tema selecionado para edição
  const iniciarEdicao = (id, nome) => {
    setEditandoId(id);
    setNomeEditado(nome);
  };

  function confirmaEdicao() {

    Alert.alert("Aviso", "Deseja mesmo editar o tema?", [
      { text: "Sim", onPress: () => salvarEdicao(true) },
      { text: "Não", onPress: () => salvarEdicao(false) }
    ]);

  }

  
  // Salva as alterações feitas no tema
  const salvarEdicao = async (isConfirmed) => {
    if (!nomeEditado.trim()) {
      Alert.alert('Erro', 'Digite o nome do tema');
      return;
    }

    if (isConfirmed) {
      const sucesso = await updateTema(editandoId, nomeEditado); // atualiza no banco
      if (sucesso) {
        Alert.alert('Sucesso', 'Tema atualizado');
        setEditandoId(null); // sai do modo edição
        setNomeEditado('');
        carregarTemas(); // recarrega lista
      } else {
        Alert.alert('Erro', 'Erro ao atualizar tema');
      }
    } else {
      Alert.alert('Cancelado', 'Tema não atualizado');
    }
  };

  // Cancela o modo de edição
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
                <TouchableOpacity onPress={confirmaEdicao} style={styles.editBtn}>
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
                <TouchableOpacity onPress={() => confirmaExclusão(item.id)}>
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
