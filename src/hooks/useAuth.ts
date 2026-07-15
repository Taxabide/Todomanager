import {useCallback} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {RootState, AppDispatch} from '../redux/store';
import {
  setUser,
  setAuthLoading,
  setAuthError,
  clearAuth,
  clearAuthError,
} from '../redux/authSlice';
import {clearTodos} from '../redux/todoSlice';
import {resetFilters} from '../redux/uiSlice';
import * as firebaseService from '../services/firebase';
import {handleError} from '../helpers/errorHandler';

export function useAuth() {
  const dispatch = useDispatch<AppDispatch>();
  const {user, isAuthenticated, isLoading, error} = useSelector(
    (state: RootState) => state.auth,
  );

  const login = useCallback(
    async (email: string, password: string) => {
      try {
        dispatch(setAuthLoading(true));
        dispatch(clearAuthError());
        const loggedInUser = await firebaseService.signIn(email, password);
        dispatch(setUser(loggedInUser));
      } catch (err) {
        dispatch(setAuthError(handleError(err, 'Login')));
      } finally {
        dispatch(setAuthLoading(false));
      }
    },
    [dispatch],
  );

  const register = useCallback(
    async (email: string, password: string) => {
      try {
        dispatch(setAuthLoading(true));
        dispatch(clearAuthError());
        const newUser = await firebaseService.signUp(email, password);
        dispatch(setUser(newUser));
      } catch (err) {
        dispatch(setAuthError(handleError(err, 'Register')));
      } finally {
        dispatch(setAuthLoading(false));
      }
    },
    [dispatch],
  );

  const logout = useCallback(async () => {
    try {
      dispatch(setAuthLoading(true));
      await firebaseService.signOutUser();
      dispatch(clearAuth());
      dispatch(clearTodos());
      dispatch(resetFilters());
    } catch (err) {
      dispatch(setAuthError(handleError(err, 'Logout')));
    } finally {
      dispatch(setAuthLoading(false));
    }
  }, [dispatch]);

  const forgotPassword = useCallback(
    async (email: string) => {
      try {
        dispatch(setAuthLoading(true));
        dispatch(clearAuthError());
        await firebaseService.resetPassword(email);
        dispatch(setAuthLoading(false));
        return true;
      } catch (err) {
        dispatch(setAuthError(handleError(err, 'Reset Password')));
        return false;
      }
    },
    [dispatch],
  );

  const dismissError = useCallback(() => {
    dispatch(clearAuthError());
  }, [dispatch]);

  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    register,
    logout,
    forgotPassword,
    dismissError,
  };
}
