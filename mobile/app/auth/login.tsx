import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useAuth } from '@/hooks/useAuth';
import { validateEmail, validatePassword } from '@/utils/validators';
import { router } from 'expo-router';
import { TextInput } from '@/components/ui/TextInput';
import { Button } from '@/components/ui/Button';
import { StatusBar } from 'expo-status-bar';

export default function LoginScreen() {
  const { loginEmail, setLoginEmail, loginPassword, setLoginPassword, handleLogin, isLoading, error } = useAuth();
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
        <View style={styles.header}>
          <Text style={styles.title}>Welcome Back!</Text>
          <Text style={styles.subtitle}>Sign in to continue to your account</Text>
        </View>
        
        <View style={styles.form}>
          {error && <Text style={styles.errorText}>{error}</Text>}
          
          <TextInput
            label="Email"
            value={loginEmail}
            onChangeText={setLoginEmail}
            placeholder="Enter your email"
            keyboardType="email-address"
            error={emailError ?? undefined}
          />
          
          <TextInput
            label="Password"
            value={loginPassword}
            onChangeText={setLoginPassword}
            placeholder="Enter your password"
            secureTextEntry
            error={passwordError ?? undefined}
          />
          
          <TouchableOpacity style={styles.forgotPassword}>
            <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
          </TouchableOpacity>
          
          <Button
            title="Sign In"
            onPress={onSubmit}
            loading={isLoading}
            style={styles.button}
          />
          
          <View style={styles.registerContainer}>
            <Text style={styles.registerText}>Don't have an account? </Text>
            <TouchableOpacity onPress={() => router.push('/auth/register')}>
              <Text style={styles.registerLink}>Sign Up</Text>
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
    backgroundColor: '#FFFFFF',
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 24,
    justifyContent: 'center',
  },
  header: {
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 8,
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  form: {
    width: '100%',
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 24,
  },
  forgotPasswordText: {
    fontSize: 14,
    color: '#7C5DF9',
  },
  button: {
    marginBottom: 16,
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