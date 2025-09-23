import { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from './componentes/homeScreen';
import CadastrarTemaScreen from './componentes/cadastrarTemaScreen';
import CadastrarPerguntaScreen from './componentes/cadastrarPeguntasScreen';
import IniciarQuizScreen from './componentes/iniciarQuizScreen';
import QuizScreen from './componentes/quizScreen';
import ResultadoScreen from './componentes/resultadoScreen';

import { initDB } from './services/database';

const Stack = createNativeStackNavigator();

export default function App() {
  useEffect(() => {
    initDB();
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Início">
        <Stack.Screen name="Início" component={HomeScreen} />
        <Stack.Screen name="CadastrarTema" component={CadastrarTemaScreen} />
        <Stack.Screen name="CadastrarPergunta" component={CadastrarPerguntaScreen} />
        <Stack.Screen name="IniciarQuiz" component={IniciarQuizScreen} />
        <Stack.Screen name="Quiz" component={QuizScreen} />
        <Stack.Screen name="Resultado" component={ResultadoScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

