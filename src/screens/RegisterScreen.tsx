import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {AuthStackParamList} from '../types';
import {useAuth} from '../hooks/useAuth';
import {Input} from '../components/Input';
import {Button} from '../components/Button';
import {Header} from '../components/Header';
import {Colors, Spacing, Typography} from '../theme';
import {
  validateEmail,
  validatePassword,
  validateConfirmPassword,
} from '../utils/validators';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

type Props = NativeStackScreenProps<AuthStackParamList, 'Register'>;

export const RegisterScreen: React.FC<Props> = ({navigation}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});

  const {register, isLoading, error, dismissError} = useAuth();

  useEffect(() => {
    return () => dismissError();
  }, [dismissError]);

  const handleRegister = async () => {
    const emailValidation = validateEmail(email);
    const passwordValidation = validatePassword(password);
    const confirmValidation = validateConfirmPassword(password, confirmPassword);

    if (
      !emailValidation.isValid ||
      !passwordValidation.isValid ||
      !confirmValidation.isValid
    ) {
      setErrors({
        email: emailValidation.error,
        password: passwordValidation.error,
        confirmPassword: confirmValidation.error,
      });
      return;
    }

    setErrors({});
    await register(email, password);
  };

  return (
    <View style={styles.container}>
      <Header
        title=""
        onBack={() => navigation.goBack()}
        transparent
      />
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled">
          
          <View style={styles.headerContainer}>
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>Sign up to get started</Text>
          </View>

          {error ? (
            <View style={styles.errorContainer}>
              <Icon name="alert-circle-outline" size={20} color={Colors.danger} />
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : null}

          <View style={styles.formContainer}>
            <Input
              label="Email"
              placeholder="Enter your email"
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                if (errors.email) setErrors({...errors, email: undefined});
              }}
              error={errors.email}
              leftIcon="email-outline"
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <Input
              label="Password"
              placeholder="Create a password"
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                if (errors.password) setErrors({...errors, password: undefined});
              }}
              error={errors.password}
              leftIcon="lock-outline"
              isPassword
            />

            <Input
              label="Confirm Password"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChangeText={(text) => {
                setConfirmPassword(text);
                if (errors.confirmPassword) {
                  setErrors({...errors, confirmPassword: undefined});
                }
              }}
              error={errors.confirmPassword}
              leftIcon="lock-check-outline"
              isPassword
            />

            <Button
              title="Sign Up"
              onPress={handleRegister}
              loading={isLoading}
              style={styles.registerButton}
              size="lg"
            />
          </View>

          <View style={styles.footerContainer}>
            <Text style={styles.footerText}>Already have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={styles.loginText}>Sign In</Text>
            </TouchableOpacity>
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: Spacing.xl,
  },
  headerContainer: {
    marginBottom: Spacing.xxxl,
    marginTop: Spacing.lg,
  },
  title: {
    ...Typography.h1,
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  subtitle: {
    ...Typography.body,
    color: Colors.textSecondary,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.dangerLight,
    padding: Spacing.md,
    borderRadius: 8,
    marginBottom: Spacing.xl,
    gap: Spacing.sm,
  },
  errorText: {
    ...Typography.bodySm,
    color: Colors.danger,
    flex: 1,
  },
  formContainer: {
    marginBottom: Spacing.xxl,
  },
  registerButton: {
    marginTop: Spacing.xl,
  },
  footerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 'auto',
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.xl,
  },
  footerText: {
    ...Typography.body,
    color: Colors.textSecondary,
  },
  loginText: {
    ...Typography.body,
    color: Colors.primary,
    fontWeight: '600',
  },
});
