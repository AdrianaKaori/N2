import { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from './N2/componentes/HomeScreen';
import CadastrarTemaScreen from './N2/componentes/CadastrarTemaScreen';
import CadastrarPerguntaScreen from './N2/componentes/CadastrarPerguntaScreen';
import IniciarQuizScreen from './N2/componentes/IniciarQuizScreen';
import QuizScreen from './N2/componentes/QuizScreen';
import ResultadoScreen from './N2/componentes/ResultadoScreen';

import { initDB } from './N2/services/database';

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

