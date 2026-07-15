import React, {useEffect, useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {useDispatch} from 'react-redux';
import {AuthNavigator} from './AuthNavigator';
import {AppNavigator} from './AppNavigator';
import {SplashScreen} from '../screens/SplashScreen';
import {useAuth} from '../hooks/useAuth';
import {onAuthStateChanged} from '../services/firebase';
import {setUser} from '../redux/authSlice';

export const RootNavigator = () => {
  const [isInitializing, setIsInitializing] = useState(true);
  const {isAuthenticated} = useAuth();
  const dispatch = useDispatch();

  useEffect(() => {
    // Listen for Firebase Auth state changes
    const unsubscribe = onAuthStateChanged((user) => {
      dispatch(setUser(user));
      if (isInitializing) {
        // Add a small delay to show the splash animation
        setTimeout(() => {
          setIsInitializing(false);
        }, 1500);
      }
    });

    return () => unsubscribe();
  }, [dispatch, isInitializing]);

  if (isInitializing) {
    return <SplashScreen />;
  }

  return (
    <NavigationContainer>
      {isAuthenticated ? <AppNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
};
