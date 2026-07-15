import auth, {FirebaseAuthTypes} from '@react-native-firebase/auth';
import {User} from '../types';
import {getFirebaseErrorMessage} from '../helpers/errorHandler';

function mapFirebaseUser(firebaseUser: FirebaseAuthTypes.User | null): User | null {
  if (!firebaseUser) {
    return null;
  }
  return {
    uid: firebaseUser.uid,
    email: firebaseUser.email,
    displayName: firebaseUser.displayName,
  };
}

export async function signIn(
  email: string,
  password: string,
): Promise<User> {
  try {
    const credential = await auth().signInWithEmailAndPassword(
      email.trim(),
      password,
    );
    const user = mapFirebaseUser(credential.user);
    if (!user) {
      throw new Error('Failed to sign in.');
    }
    return user;
  } catch (error) {
    throw new Error(getFirebaseErrorMessage(error));
  }
}

export async function signUp(
  email: string,
  password: string,
): Promise<User> {
  try {
    const credential = await auth().createUserWithEmailAndPassword(
      email.trim(),
      password,
    );
    const user = mapFirebaseUser(credential.user);
    if (!user) {
      throw new Error('Failed to create account.');
    }
    return user;
  } catch (error) {
    throw new Error(getFirebaseErrorMessage(error));
  }
}

export async function signOutUser(): Promise<void> {
  try {
    await auth().signOut();
  } catch (error) {
    throw new Error(getFirebaseErrorMessage(error));
  }
}

export async function resetPassword(email: string): Promise<void> {
  try {
    await auth().sendPasswordResetEmail(email.trim());
  } catch (error) {
    throw new Error(getFirebaseErrorMessage(error));
  }
}

export function onAuthStateChanged(
  callback: (user: User | null) => void,
): () => void {
  return auth().onAuthStateChanged(firebaseUser => {
    callback(mapFirebaseUser(firebaseUser));
  });
}

export function getCurrentUser(): User | null {
  return mapFirebaseUser(auth().currentUser);
}
