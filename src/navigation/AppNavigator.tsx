import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {AppStackParamList} from '../types';
import {TodoListsScreen} from '../screens/TodoListsScreen';
import {TodoDetailsScreen} from '../screens/TodoDetailsScreen';

const Stack = createNativeStackNavigator<AppStackParamList>();

export const AppNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}>
      <Stack.Screen name="TodoLists" component={TodoListsScreen} />
      <Stack.Screen name="TodoDetails" component={TodoDetailsScreen} />
    </Stack.Navigator>
  );
};
