import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useAuth } from '@/hooks/useAuth';
import { validateEmail, validatePassword } from '@/utils/validators';
import { router } from 'expo-router';
import { TextInput } from '@/components/ui/TextInput';
import { Button } from '@/components/ui/Button';
import { StatusBar } from 'expo-status-bar';

export default function LoginScreen() {
  const {
    loginEmail,
    setLoginEmail,
    loginPassword,
    setLoginPassword,
    handleLogin,
    isLoading,
    error,
  } = useAuth();

  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  const validateForm = () => {
    let isValid = true;

    if (!validateEmail(loginEmail)) {
      setEmailError('Please enter a valid email address');
      isValid = false;
    } else {
      setEmailError(null);
    }

    if (!validatePassword(loginPassword)) {
      setPasswordError('Password must be at least 6 characters');
      isValid = false;
    } else {
      setPasswordError(null);
    }

    return isValid;
  };

  const onSubmit = async () => {
    if (validateForm()) {
      await handleLogin();
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
    >
      <StatusBar style="dark" />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Illustration */}
        <Image
          source={require('@/assets/images/vuluz.png')} // ganti dengan path sesuai image kamu
          style={styles.illustration}
          resizeMode="contain"
        />

        {/* Logo + Branding */}
        <View style={styles.brandContainer}>
          {/* <Text style={styles.logoIcon}>V</Text> */}
          <Image
          source={require('@/assets/images/V.png')} // ganti dengan path sesuai image kamu
          style={styles.logoIcon}
          resizeMode="contain"
        />
          <Text style={styles.logoText}>Vuluz</Text>
        </View>

        {/* Form */}
        <View style={styles.form}>
          {error && <Text style={styles.errorText}>{error}</Text>}

          <TextInput
            label=""
            value={loginEmail}
            onChangeText={setLoginEmail}
            placeholder="Email"
            keyboardType="email-address"
            error={emailError ?? undefined}
          />

          <TextInput
            label=""
            value={loginPassword}
            onChangeText={setLoginPassword}
            placeholder="Password"
            secureTextEntry
            error={passwordError ?? undefined}
          />

          <TouchableOpacity style={styles.forgotPassword}>
            <Text style={styles.forgotPasswordText}>Forgot password?</Text>
          </TouchableOpacity>

          <Button title="Sign In" onPress={onSubmit} loading={isLoading} />

          <View style={styles.registerContainer}>
            <Text style={styles.registerText}>Don't have an account? </Text>
            <TouchableOpacity onPress={() => router.push('/auth/register')}>
              <Text style={styles.registerLink}>Sign up</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FC',
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  illustration: {
    width: 300,
    height: 200,
    marginBottom: 32,
  },
  brandContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 32,
  },
  logoIcon: {
    fontSize: 36,
    color: '#7C5DF9',
    fontWeight: 'bold',
    marginRight: 8,
    width: 30,
    height: 40,
  },
  logoText: {
    fontSize: 32,
    fontWeight: '700',
    color: '#000000',
  },
  form: {
    width: '100%',
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 16,
  },
  forgotPasswordText: {
    fontSize: 14,
    color: '#7C5DF9',
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },
  registerText: {
    fontSize: 14,
    color: '#666',
  },
  registerLink: {
    fontSize: 14,
    color: '#7C5DF9',
    fontWeight: '600',
  },
  errorText: {
    color: '#EB5757',
    marginBottom: 16,
    textAlign: 'center',
  },
});
