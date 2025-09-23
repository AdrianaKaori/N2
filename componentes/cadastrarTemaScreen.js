import { useState } from 'react';
import { View, TextInput, Button, Alert } from 'react-native';
import { addTema } from '../services/dbTemas';

export default function CadastrarTemaScreen({ navigation }) {
  const [nomeTema, setNomeTema] = useState('');

  const salvarTema = () => {
    if (!nomeTema.trim()) {
      Alert.alert('Erro', 'Digite o nome do tema');
      return;
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
  } else {
    Alert.alert('Erro', 'Erro ao salvar tema');
  }
};

  return (
    <View style={{ padding: 20 }}>
      <TextInput
        placeholder="Nome do Tema"
        value={nomeTema}
        onChangeText={setNomeTema}
        style={{ borderWidth: 1, padding: 10, marginBottom: 10 }}
      />
      <Button title="Salvar Tema" onPress={salvarTema} />
    </View>
  );
};
}