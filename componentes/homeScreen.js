import { View, Button } from 'react-native';

export default function HomeScreen({ navigation }) {
  return (
    <View style={{ padding: 20 }}>
      <Button title="Cadastrar Tema" onPress={() => navigation.navigate('CadastrarTema')} />
      <Button title="Cadastrar Pergunta" onPress={() => navigation.navigate('CadastrarPergunta')} />
      <Button title="Iniciar Quiz" onPress={() => navigation.navigate('IniciarQuiz')} />
    </View>
  );
}
