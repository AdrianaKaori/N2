import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function HomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={[styles.button, styles.btnTema]} onPress={() => navigation.navigate('CadastrarTema')}>
        <Text style={styles.buttonText}>Cadastrar Tema</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.button, styles.btnPergunta]} onPress={() => navigation.navigate('CadastrarPergunta')}>
        <Text style={styles.buttonText}>Cadastrar Pergunta</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.button, styles.btnQuiz]} onPress={() => navigation.navigate('IniciarQuiz')}>
        <Text style={styles.buttonText}>Iniciar Quiz</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF9F1', 
    padding: 20,
    justifyContent: 'center',
  },
  button: {
    padding: 15,
    borderRadius: 10,
    marginVertical: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#333',
    fontWeight: '600',
    fontSize: 16,
  },
  btnTema: {
    backgroundColor: '#FADBD8', 
  },
  btnPergunta: {
    backgroundColor: '#D5F5E3', 
  },
  btnQuiz: {
    backgroundColor: '#FCF3CF', 
  },
});
