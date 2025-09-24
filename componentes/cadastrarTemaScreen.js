import { useState, useEffect } from 'react';
import { View, TextInput, Button, Alert, Text, TouchableOpacity, Image, FlatList } from 'react-native';
import { getTemas, addTema, updateTema, deleteTema } from '../services/dbTemas';

import iconDelete from '../assets/delete.png'; 
import iconEdit from '../assets/edit.png';

export default function CadastrarTemaScreen() {
  const [nomeTema, setNomeTema] = useState('');
  const [temas, setTemas] = useState([]);
  const [editandoId, setEditandoId] = useState(null);
  const [nomeEditado, setNomeEditado] = useState('');

  // Carrega temas do banco ao montar componente
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

  // Salvar tema novo
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

  // Remover tema pelo id
  const removerElemento = async (id) => {
    const sucesso = await deleteTema(id);
    if (sucesso) {
      Alert.alert('Sucesso', 'Tema removido');
      carregarTemas();
    } else {
      Alert.alert('Erro', 'Erro ao remover tema');
    }
  };

  // Começar a editar: seta id e nome do tema no input
  const iniciarEdicao = (id, nome) => {
    setEditandoId(id);
    setNomeEditado(nome);
  };

  // Salvar edição do tema
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

  // Cancelar edição
  const cancelarEdicao = () => {
    setEditandoId(null);
    setNomeEditado('');
  };

  return (
    <View style={{ padding: 20, flex: 1 }}>
      <TextInput
        placeholder="Nome do Tema"
        value={nomeTema}
        onChangeText={setNomeTema}
        style={{ borderWidth: 1, padding: 10, marginBottom: 10 }}
      />

      <Button title="Salvar Tema" onPress={salvarTema} />

      <FlatList
        data={temas}
        keyExtractor={(item) => item.id.toString()}
        style={{ marginTop: 20 }}
        renderItem={({ item }) => (
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
            {editandoId === item.id ? (
              <>
                <TextInput
                  value={nomeEditado}
                  onChangeText={setNomeEditado}
                  style={{ borderWidth: 1, flex: 1, padding: 5 }}
                />
                <Button title="Salvar" onPress={salvarEdicao} />
                <Button title="Cancelar" onPress={cancelarEdicao} />
              </>
            ) : (
              <>
                <Text style={{ flex: 1 }}>{item.nome}</Text>
                <TouchableOpacity onPress={() => iniciarEdicao(item.id, item.nome)}>
                  <Image source={iconEdit} style={{ width: 20, height: 20, marginRight: 10 }} />
                </TouchableOpacity>

                <TouchableOpacity onPress={() => removerElemento(item.id)}>
                  <Image source={iconDelete} style={{ width: 20, height: 20 }} />
                </TouchableOpacity>
              </>
            )}
          </View>
        )}
      />
    </View>
  );
}
