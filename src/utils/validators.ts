import {ValidationResult} from '../types';
import {ERROR_MESSAGES} from '../constants';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateEmail(email: string): ValidationResult {
  const trimmed = email.trim();
  if (!trimmed) {
    return {isValid: false, error: ERROR_MESSAGES.EMAIL_REQUIRED};
  }
  if (!EMAIL_REGEX.test(trimmed)) {
    return {isValid: false, error: ERROR_MESSAGES.EMAIL_INVALID};
  }
  return {isValid: true, error: ''};
}

export function validatePassword(password: string): ValidationResult {
  if (!password) {
    return {isValid: false, error: ERROR_MESSAGES.PASSWORD_REQUIRED};
  }
  if (password.length < 6) {
    return {isValid: false, error: ERROR_MESSAGES.PASSWORD_SHORT};
  }
  return {isValid: true, error: ''};
}

export function validateConfirmPassword(
  password: string,
  confirmPassword: string,
): ValidationResult {
  if (!confirmPassword) {
    return {isValid: false, error: ERROR_MESSAGES.CONFIRM_PASSWORD_REQUIRED};
  }
  if (password !== confirmPassword) {
    return {isValid: false, error: ERROR_MESSAGES.PASSWORD_MISMATCH};
  }
  return {isValid: true, error: ''};
}

export function validateTitle(title: string): ValidationResult {
  const trimmed = title.trim();
  if (!trimmed) {
    return {isValid: false, error: ERROR_MESSAGES.TITLE_REQUIRED};
  }
  if (trimmed.length < 2) {
    return {isValid: false, error: ERROR_MESSAGES.TITLE_SHORT};
  }
  return {isValid: true, error: ''};
}

export function validateDescription(description: string): ValidationResult {
  if (description.length > 500) {
    return {isValid: false, error: ERROR_MESSAGES.DESCRIPTION_LONG};
  }
  return {isValid: true, error: ''};
}
