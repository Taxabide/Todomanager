export const STORAGE_KEYS = {
  TODO_LISTS: '@todo_lists_',
  AUTH_STATE: '@auth_state',
};

export const ERROR_MESSAGES = {
  GENERIC: 'Something went wrong. Please try again.',
  NETWORK: 'Network error. Please check your connection.',
  EMAIL_REQUIRED: 'Email is required.',
  EMAIL_INVALID: 'Please enter a valid email address.',
  PASSWORD_REQUIRED: 'Password is required.',
  PASSWORD_SHORT: 'Password must be at least 6 characters.',
  PASSWORD_MISMATCH: 'Passwords do not match.',
  CONFIRM_PASSWORD_REQUIRED: 'Please confirm your password.',
  TITLE_REQUIRED: 'Title is required.',
  TITLE_SHORT: 'Title must be at least 2 characters.',
  DESCRIPTION_LONG: 'Description must be under 500 characters.',
  FIREBASE: {
    'auth/email-already-in-use': 'This email is already registered.',
    'auth/invalid-email': 'Please enter a valid email address.',
    'auth/user-not-found': 'No account found with this email.',
    'auth/wrong-password': 'Incorrect password. Please try again.',
    'auth/weak-password': 'Password must be at least 6 characters.',
    'auth/too-many-requests': 'Too many attempts. Please try again later.',
    'auth/network-request-failed': 'Network error. Please check your connection.',
    'auth/invalid-credential': 'Invalid credentials. Please check your email and password.',
    'auth/user-disabled': 'This account has been disabled.',
  } as Record<string, string>,
};

export const PRIORITY_LABELS = {
  none: 'None',
  low: 'Low',
  medium: 'Medium',
  high: 'High',
};

export const FILTER_LABELS = {
  all: 'All',
  completed: 'Done',
  pending: 'Pending',
};

export const SORT_LABELS = {
  newest: 'Newest',
  oldest: 'Oldest',
  priority: 'Priority',
};

export const APP_NAME = 'Todo Manager';
