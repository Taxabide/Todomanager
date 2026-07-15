import AsyncStorage from '@react-native-async-storage/async-storage';
import {TodoList} from '../types';
import {STORAGE_KEYS} from '../constants';
import {getStorageErrorMessage} from '../helpers/errorHandler';

function getUserKey(userId: string): string {
  return `${STORAGE_KEYS.TODO_LISTS}${userId}`;
}

export async function loadTodoLists(userId: string): Promise<TodoList[]> {
  try {
    const key = getUserKey(userId);
    const data = await AsyncStorage.getItem(key);
    if (data) {
      return JSON.parse(data) as TodoList[];
    }
    return [];
  } catch (error) {
    throw new Error(getStorageErrorMessage(error));
  }
}

export async function saveTodoLists(
  userId: string,
  lists: TodoList[],
): Promise<void> {
  try {
    const key = getUserKey(userId);
    await AsyncStorage.setItem(key, JSON.stringify(lists));
  } catch (error) {
    throw new Error(getStorageErrorMessage(error));
  }
}

export async function clearUserData(userId: string): Promise<void> {
  try {
    const key = getUserKey(userId);
    await AsyncStorage.removeItem(key);
  } catch (error) {
    throw new Error(getStorageErrorMessage(error));
  }
}
