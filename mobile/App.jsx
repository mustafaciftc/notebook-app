import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'react-native';

import NoteScreen from './src/components/NoteScreen';
import AddNote from './src/components/AddNote';
import EditNote from './src/components/EditNote';
import LoginScreen from './src/components/LoginScreen';
import RegisterScreen from './src/components/RegisterScreen';

const Stack = createNativeStackNavigator();

function App() {
  return (
    <SafeAreaProvider>
      <StatusBar barStyle="light-content" backgroundColor="#007AFF" />
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Login"  
          screenOptions={{
            headerStyle: {
              backgroundColor: '#007AFF',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
              fontSize: 18,
            },
            headerBackTitleVisible: false,
            contentStyle: {
              backgroundColor: '#f5f5f5',
            },
          }}
        >
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="Register"
            component={RegisterScreen}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="Home"
            component={NoteScreen}
            options={{
              title: 'Notlarım',
            }}
          />
          <Stack.Screen
            name="AddNote"
            component={AddNote}
            options={{
              title: 'Yeni Not',
              headerBackTitle: 'Geri',
            }}
          />
          <Stack.Screen
            name="EditNote"
            component={EditNote}
            options={{
              title: 'Notu Düzenle',
              headerBackTitle: 'Geri',
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

export default App;