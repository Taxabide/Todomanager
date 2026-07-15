export enum Priority {
  NONE = 'none',
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
}

export interface Todo {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  priority: Priority;
  createdAt: string;
  updatedAt: string;
  dueDate: string | null;
}

export interface TodoList {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  todos: Todo[];
}

export interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface TodoState {
  lists: TodoList[];
  isLoading: boolean;
  error: string | null;
}

export enum FilterMode {
  ALL = 'all',
  COMPLETED = 'completed',
  PENDING = 'pending',
}

export enum SortMode {
  NEWEST = 'newest',
  OLDEST = 'oldest',
  PRIORITY = 'priority',
}

export interface UIState {
  isModalVisible: boolean;
  modalType: ModalType | null;
  searchQuery: string;
  filterMode: FilterMode;
  sortMode: SortMode;
}

export enum ModalType {
  ADD_LIST = 'add_list',
  EDIT_LIST = 'edit_list',
  DELETE_LIST = 'delete_list',
  ADD_TODO = 'add_todo',
  EDIT_TODO = 'edit_todo',
  DELETE_TODO = 'delete_todo',
}

export type RootStackParamList = {
  Splash: undefined;
  Auth: undefined;
  App: undefined;
};

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
};

export type AppStackParamList = {
  TodoLists: undefined;
  TodoDetails: {listId: string; listTitle: string};
};

export interface ValidationResult {
  isValid: boolean;
  error: string;
}
