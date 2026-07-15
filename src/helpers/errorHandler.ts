import {ERROR_MESSAGES} from '../constants';

export function getFirebaseErrorMessage(error: unknown): string {
  if (error && typeof error === 'object' && 'code' in error) {
    const code = (error as {code: string}).code;
    return (
      ERROR_MESSAGES.FIREBASE[code] || ERROR_MESSAGES.GENERIC
    );
  }
  if (error instanceof Error) {
    return error.message;
  }
  return ERROR_MESSAGES.GENERIC;
}

export function getStorageErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    if (error.message.includes('quota')) {
      return 'Storage is full. Please delete some data.';
    }
    return `Storage error: ${error.message}`;
  }
  return 'Failed to access local storage.';
}

export function getNetworkErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    if (
      error.message.includes('network') ||
      error.message.includes('Network')
    ) {
      return ERROR_MESSAGES.NETWORK;
    }
    return error.message;
  }
  return ERROR_MESSAGES.NETWORK;
}

export function handleError(error: unknown, context?: string): string {
  const prefix = context ? `[${context}] ` : '';

  if (error && typeof error === 'object' && 'code' in error) {
    const code = (error as {code: string}).code;
    if (code.startsWith('auth/')) {
      return prefix + getFirebaseErrorMessage(error);
    }
  }

  if (error instanceof Error) {
    if (
      error.message.includes('AsyncStorage') ||
      error.message.includes('storage')
    ) {
      return prefix + getStorageErrorMessage(error);
    }
    if (
      error.message.includes('network') ||
      error.message.includes('Network')
    ) {
      return prefix + getNetworkErrorMessage(error);
    }
    return prefix + error.message;
  }

  return prefix + ERROR_MESSAGES.GENERIC;
}
