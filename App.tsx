import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import HomeScreen from './src/screens/HomeScreen';
import DetailsScreen from './src/screens/DetailsScreen';
import GraphicScreen from './src/screens/GraphicScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Details"
          component={DetailsScreen}
          options={{title: 'DETALLES DEL PROYECTO'}}
        />
        <Stack.Screen
          name="Graphic"
          component={GraphicScreen}
          options={{title: 'GRAFICO', headerShown: true}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
