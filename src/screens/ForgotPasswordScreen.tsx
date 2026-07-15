import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {AuthStackParamList} from '../types';
import {useAuth} from '../hooks/useAuth';
import {Input} from '../components/Input';
import {Button} from '../components/Button';
import {Header} from '../components/Header';
import {Colors, Spacing, Typography} from '../theme';
import {validateEmail} from '../utils/validators';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

type Props = NativeStackScreenProps<AuthStackParamList, 'ForgotPassword'>;

export const ForgotPasswordScreen: React.FC<Props> = ({navigation}) => {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState<string>();
  const [isSuccess, setIsSuccess] = useState(false);

  const {forgotPassword, isLoading, error, dismissError} = useAuth();

  useEffect(() => {
    return () => dismissError();
  }, [dismissError]);

  const handleReset = async () => {
    const emailValidation = validateEmail(email);

    if (!emailValidation.isValid) {
      setEmailError(emailValidation.error);
      return;
    }

    setEmailError(undefined);
    const success = await forgotPassword(email);
    if (success) {
      setIsSuccess(true);
    }
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
          showsVerticalScrollIndicator={false}>
          
          <View style={styles.headerContainer}>
            <Text style={styles.title}>Reset Password</Text>
            <Text style={styles.subtitle}>
              Enter your email address and we'll send you instructions to reset your password.
            </Text>
          </View>

          {error ? (
            <View style={styles.errorContainer}>
              <Icon name="alert-circle-outline" size={20} color={Colors.danger} />
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : null}

          {isSuccess ? (
            <View style={styles.successContainer}>
              <Icon name="check-circle-outline" size={64} color={Colors.success} />
              <Text style={styles.successTitle}>Check your email</Text>
              <Text style={styles.successText}>
                We've sent password reset instructions to {email}
              </Text>
              <Button
                title="Back to Login"
                onPress={() => navigation.navigate('Login')}
                style={styles.backToLoginButton}
              />
            </View>
          ) : (
            <View style={styles.formContainer}>
              <Input
                label="Email"
                placeholder="Enter your email"
                value={email}
                onChangeText={(text) => {
                  setEmail(text);
                  if (emailError) setEmailError(undefined);
                }}
                error={emailError}
                leftIcon="email-outline"
                keyboardType="email-address"
                autoCapitalize="none"
              />

              <Button
                title="Send Reset Link"
                onPress={handleReset}
                loading={isLoading}
                style={styles.resetButton}
                size="lg"
              />
            </View>
          )}

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
    marginBottom: Spacing.sm,
  },
  subtitle: {
    ...Typography.body,
    color: Colors.textSecondary,
    lineHeight: 24,
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
  resetButton: {
    marginTop: Spacing.xl,
  },
  successContainer: {
    alignItems: 'center',
    paddingTop: Spacing.xxl,
  },
  successTitle: {
    ...Typography.h2,
    color: Colors.text,
    marginTop: Spacing.xl,
    marginBottom: Spacing.sm,
  },
  successText: {
    ...Typography.body,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: Spacing.xxxl,
    paddingHorizontal: Spacing.xl,
    lineHeight: 24,
  },
  backToLoginButton: {
    width: '100%',
  },
});
