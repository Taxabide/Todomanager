import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {TodoState, TodoList, Todo} from '../types';

const initialState: TodoState = {
  lists: [],
  isLoading: false,
  error: null,
};

const todoSlice = createSlice({
  name: 'todo',
  initialState,
  reducers: {
    setLists(state, action: PayloadAction<TodoList[]>) {
      state.lists = action.payload;
      state.isLoading = false;
      state.error = null;
    },
    addList(state, action: PayloadAction<TodoList>) {
      state.lists.unshift(action.payload);
    },
    updateList(
      state,
      action: PayloadAction<{id: string; title: string}>,
    ) {
      const list = state.lists.find(l => l.id === action.payload.id);
      if (list) {
        list.title = action.payload.title;
        list.updatedAt = new Date().toISOString();
      }
    },
    deleteList(state, action: PayloadAction<string>) {
      state.lists = state.lists.filter(l => l.id !== action.payload);
    },
    addTodo(
      state,
      action: PayloadAction<{listId: string; todo: Todo}>,
    ) {
      const list = state.lists.find(l => l.id === action.payload.listId);
      if (list) {
        list.todos.unshift(action.payload.todo);
        list.updatedAt = new Date().toISOString();
      }
    },
    updateTodo(
      state,
      action: PayloadAction<{listId: string; todo: Todo}>,
    ) {
      const list = state.lists.find(l => l.id === action.payload.listId);
      if (list) {
        const index = list.todos.findIndex(
          t => t.id === action.payload.todo.id,
        );
        if (index !== -1) {
          list.todos[index] = action.payload.todo;
          list.updatedAt = new Date().toISOString();
        }
      }
    },
    deleteTodo(
      state,
      action: PayloadAction<{listId: string; todoId: string}>,
    ) {
      const list = state.lists.find(l => l.id === action.payload.listId);
      if (list) {
        list.todos = list.todos.filter(
          t => t.id !== action.payload.todoId,
        );
        list.updatedAt = new Date().toISOString();
      }
    },
    toggleTodo(
      state,
      action: PayloadAction<{listId: string; todoId: string}>,
    ) {
      const list = state.lists.find(l => l.id === action.payload.listId);
      if (list) {
        const todo = list.todos.find(t => t.id === action.payload.todoId);
        if (todo) {
          todo.completed = !todo.completed;
          todo.updatedAt = new Date().toISOString();
          list.updatedAt = new Date().toISOString();
        }
      }
    },
    setTodoLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
    },
    setTodoError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
      state.isLoading = false;
    },
    clearTodos(state) {
      state.lists = [];
      state.isLoading = false;
      state.error = null;
    },
  },
});

export const {
  setLists,
  addList,
  updateList,
  deleteList,
  addTodo,
  updateTodo,
  deleteTodo,
  toggleTodo,
  setTodoLoading,
  setTodoError,
  clearTodos,
} = todoSlice.actions;
export default todoSlice.reducer;
