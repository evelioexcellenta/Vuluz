import React, { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TouchableOpacity, 
  ScrollView, 
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import Input from '@/components/common/Input';
import Button from '@/components/common/Button';
import { useAuth } from '@/hooks/useAuth';
import { validateEmail } from '@/utils/validators';
import { useTheme } from '@/hooks/useTheme';
import { ArrowLeft } from 'lucide-react-native';

export default function ForgotPasswordScreen() {
  const { resetPassword, isLoading, error, clearError } = useAuth();
  const { isDark } = useTheme();
  
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  
  const validateForm = (): boolean => {
    if (!email) {
      setEmailError('Email is required');
      return false;
    } 
    
    if (!validateEmail(email)) {
      setEmailError('Please enter a valid email');
      return false;
    }
    
    return true;
  };
  
  const handleResetPassword = async () => {
    if (!validateForm()) return;
    
    clearError();
    try {
      await resetPassword(email);
      Alert.alert(
        'Reset Email Sent',
        'Check your email for instructions to reset your password.',
        [{ text: 'OK', onPress: () => router.replace('/') }]
      );
    } catch (error) {
      // Error is already handled in the context
    }
  };
  
  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
    >
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          isDark ? styles.containerDark : styles.containerLight,
        ]}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={() => router.back()}
          >
            <ArrowLeft size={24} color={isDark ? '#E2E8F0' : '#1E293B'} />
          </TouchableOpacity>
          <Text style={[
            styles.headerTitle,
            isDark ? styles.headerTitleDark : styles.headerTitleLight,
          ]}>
            Reset Password
          </Text>
        </View>
        
        <View style={styles.formContainer}>
          <Text style={[
            styles.heading,
            isDark ? styles.headingDark : styles.headingLight,
          ]}>
            Forgot Password?
          </Text>
          
          <Text style={[
            styles.subheading,
            isDark ? styles.subheadingDark : styles.subheadingLight,
          ]}>
            Enter your email address and we'll send you instructions to reset your password.
          </Text>
          
          {error && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}
          
          <View style={styles.inputsContainer}>
            <Input
              label="Email"
              placeholder="your@email.com"
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                if (emailError) setEmailError('');
              }}
              keyboardType="email-address"
              autoCapitalize="none"
              error={emailError}
            />
          </View>
          
          <Button
            title="Send Reset Instructions"
            onPress={handleResetPassword}
            loading={isLoading}
            style={styles.resetButton}
          />
          
          <TouchableOpacity 
            style={styles.backToLoginButton}
            onPress={() => router.replace('/')}
          >
            <Text style={[
              styles.backToLoginText,
              isDark ? styles.linkDark : styles.linkLight,
            ]}>
              Back to Login
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  containerLight: {
    backgroundColor: '#F8FAFC',
  },
  containerDark: {
    backgroundColor: '#121212',
  },
  scrollContent: {
    flexGrow: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 8,
  },
  headerTitleLight: {
    color: '#1E293B',
  },
  headerTitleDark: {
    color: '#E2E8F0',
  },
  formContainer: {
    flex: 1,
    padding: 24,
  },
  heading: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 8,
  },
  headingLight: {
    color: '#1E293B',
  },
  headingDark: {
    color: '#E2E8F0',
  },
  subheading: {
    fontSize: 16,
    marginBottom: 32,
    lineHeight: 22,
  },
  subheadingLight: {
    color: '#64748B',
  },
  subheadingDark: {
    color: '#94A3B8',
  },
  errorContainer: {
    backgroundColor: '#FEE2E2',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  errorText: {
    color: '#B91C1C',
    fontSize: 14,
  },
  inputsContainer: {
    marginBottom: 24,
  },
  resetButton: {
    marginBottom: 24,
  },
  backToLoginButton: {
    alignSelf: 'center',
    padding: 12,
  },
  backToLoginText: {
    fontSize: 16,
    fontWeight: '500',
  },
  linkLight: {
    color: '#0066FF',
  },
  linkDark: {
    color: '#52A9FF',
  },
});