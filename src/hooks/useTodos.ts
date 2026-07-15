import {useCallback} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {RootState, AppDispatch} from '../redux/store';
import {
  setLists,
  addList as addListAction,
  updateList as updateListAction,
  deleteList as deleteListAction,
  addTodo as addTodoAction,
  updateTodo as updateTodoAction,
  deleteTodo as deleteTodoAction,
  toggleTodo as toggleTodoAction,
  setTodoLoading,
  setTodoError,
} from '../redux/todoSlice';
import {TodoList, Todo, Priority} from '../types';
import * as storageService from '../services/storage';
import {generateId} from '../utils/helpers';
import {handleError} from '../helpers/errorHandler';

export function useTodos() {
  const dispatch = useDispatch<AppDispatch>();
  const {lists, isLoading, error} = useSelector(
    (state: RootState) => state.todo,
  );
  const userId = useSelector(
    (state: RootState) => state.auth.user?.uid,
  );

  const persistLists = useCallback(
    async (updatedLists: TodoList[]) => {
      if (!userId) {
        return;
      }
      try {
        await storageService.saveTodoLists(userId, updatedLists);
      } catch (err) {
        dispatch(setTodoError(handleError(err, 'Save')));
      }
    },
    [userId, dispatch],
  );

  const loadLists = useCallback(async () => {
    if (!userId) {
      return;
    }
    try {
      dispatch(setTodoLoading(true));
      const loaded = await storageService.loadTodoLists(userId);
      dispatch(setLists(loaded));
    } catch (err) {
      dispatch(setTodoError(handleError(err, 'Load')));
    }
  }, [userId, dispatch]);

  const addNewList = useCallback(
    async (title: string) => {
      const newList: TodoList = {
        id: generateId(),
        title: title.trim(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        todos: [],
      };
      dispatch(addListAction(newList));
      const updatedLists = [newList, ...lists];
      await persistLists(updatedLists);
    },
    [dispatch, lists, persistLists],
  );

  const editList = useCallback(
    async (id: string, title: string) => {
      dispatch(updateListAction({id, title: title.trim()}));
      const updatedLists = lists.map(l =>
        l.id === id
          ? {...l, title: title.trim(), updatedAt: new Date().toISOString()}
          : l,
      );
      await persistLists(updatedLists);
    },
    [dispatch, lists, persistLists],
  );

  const removeList = useCallback(
    async (id: string) => {
      dispatch(deleteListAction(id));
      const updatedLists = lists.filter(l => l.id !== id);
      await persistLists(updatedLists);
    },
    [dispatch, lists, persistLists],
  );

  const addNewTodo = useCallback(
    async (
      listId: string,
      title: string,
      description: string,
      priority: Priority,
      dueDate: string | null,
    ) => {
      const newTodo: Todo = {
        id: generateId(),
        title: title.trim(),
        description: description.trim(),
        completed: false,
        priority,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        dueDate,
      };
      dispatch(addTodoAction({listId, todo: newTodo}));
      const updatedLists = lists.map(l =>
        l.id === listId
          ? {
              ...l,
              todos: [newTodo, ...l.todos],
              updatedAt: new Date().toISOString(),
            }
          : l,
      );
      await persistLists(updatedLists);
    },
    [dispatch, lists, persistLists],
  );

  const editTodo = useCallback(
    async (listId: string, todo: Todo) => {
      const updated = {...todo, updatedAt: new Date().toISOString()};
      dispatch(updateTodoAction({listId, todo: updated}));
      const updatedLists = lists.map(l =>
        l.id === listId
          ? {
              ...l,
              todos: l.todos.map(t => (t.id === todo.id ? updated : t)),
              updatedAt: new Date().toISOString(),
            }
          : l,
      );
      await persistLists(updatedLists);
    },
    [dispatch, lists, persistLists],
  );

  const removeTodo = useCallback(
    async (listId: string, todoId: string) => {
      dispatch(deleteTodoAction({listId, todoId}));
      const updatedLists = lists.map(l =>
        l.id === listId
          ? {
              ...l,
              todos: l.todos.filter(t => t.id !== todoId),
              updatedAt: new Date().toISOString(),
            }
          : l,
      );
      await persistLists(updatedLists);
    },
    [dispatch, lists, persistLists],
  );

  const toggleTodoComplete = useCallback(
    async (listId: string, todoId: string) => {
      dispatch(toggleTodoAction({listId, todoId}));
      const updatedLists = lists.map(l =>
        l.id === listId
          ? {
              ...l,
              todos: l.todos.map(t =>
                t.id === todoId
                  ? {
                      ...t,
                      completed: !t.completed,
                      updatedAt: new Date().toISOString(),
                    }
                  : t,
              ),
              updatedAt: new Date().toISOString(),
            }
          : l,
      );
      await persistLists(updatedLists);
    },
    [dispatch, lists, persistLists],
  );

  return {
    lists,
    isLoading,
    error,
    loadLists,
    addNewList,
    editList,
    removeList,
    addNewTodo,
    editTodo,
    removeTodo,
    toggleTodoComplete,
  };
}
