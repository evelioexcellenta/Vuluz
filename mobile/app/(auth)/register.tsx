import React, { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TouchableOpacity, 
  ScrollView, 
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Link, router } from 'expo-router';
import Input from '@/components/common/Input';
import Button from '@/components/common/Button';
import { useAuth } from '@/hooks/useAuth';
import { validateEmail, validatePassword } from '@/utils/validators';
import { useTheme } from '@/hooks/useTheme';
import { ArrowLeft } from 'lucide-react-native';

export default function RegisterScreen() {
  const { register, isLoading, error, clearError } = useAuth();
  const { isDark } = useTheme();
  
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  
  const validateForm = (): boolean => {
    let isValid = true;
    const newErrors = {
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
    };
    
    // Validate full name
    if (!fullName.trim()) {
      newErrors.fullName = 'Full name is required';
      isValid = false;
    }
    
    // Validate email
    if (!email) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!validateEmail(email)) {
      newErrors.email = 'Please enter a valid email';
      isValid = false;
    }
    
    // Validate password
    if (!password) {
      newErrors.password = 'Password is required';
      isValid = false;
    } else {
      const passwordValidation = validatePassword(password);
      if (!passwordValidation.isValid) {
        newErrors.password = passwordValidation.message;
        isValid = false;
      }
    }
    
    // Confirm password
    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
      isValid = false;
    }
    
    setErrors(newErrors);
    return isValid;
  };
  
  const handleRegister = async () => {
    if (!validateForm()) return;
    
    clearError();
    await register(email, password, fullName);
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
            Create Account
          </Text>
        </View>
        
        <View style={styles.formContainer}>
          <Text style={[
            styles.heading,
            isDark ? styles.headingDark : styles.headingLight,
          ]}>
            Join WalletPro
          </Text>
          
          <Text style={[
            styles.subheading,
            isDark ? styles.subheadingDark : styles.subheadingLight,
          ]}>
            Create an account to start managing your finances
          </Text>
          
          {error && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}
          
          <View style={styles.inputsContainer}>
            <Input
              label="Full Name"
              placeholder="John Doe"
              value={fullName}
              onChangeText={(text) => {
                setFullName(text);
                if (errors.fullName) setErrors({ ...errors, fullName: '' });
              }}
              autoCapitalize="words"
              error={errors.fullName}
            />
            
            <Input
              label="Email"
              placeholder="your@email.com"
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                if (errors.email) setErrors({ ...errors, email: '' });
              }}
              keyboardType="email-address"
              autoCapitalize="none"
              error={errors.email}
            />
            
            <Input
              label="Password"
              placeholder="Create a password"
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                if (errors.password) setErrors({ ...errors, password: '' });
              }}
              secureTextEntry
              error={errors.password}
            />
            
            <Input
              label="Confirm Password"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChangeText={(text) => {
                setConfirmPassword(text);
                if (errors.confirmPassword) setErrors({ ...errors, confirmPassword: '' });
              }}
              secureTextEntry
              error={errors.confirmPassword}
            />
          </View>
          
          <Button
            title="Create Account"
            onPress={handleRegister}
            loading={isLoading}
            style={styles.registerButton}
          />
          
          <View style={styles.loginContainer}>
            <Text style={[
              styles.loginText,
              isDark ? styles.textDark : styles.textLight,
            ]}>
              Already have an account?
            </Text>
            <Link href="/" asChild>
              <TouchableOpacity>
                <Text style={[
                  styles.loginLink,
                  isDark ? styles.linkDark : styles.linkLight,
                ]}>
                  Log in
                </Text>
              </TouchableOpacity>
            </Link>
          </View>
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
    paddingBottom: 24,
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
  registerButton: {
    marginBottom: 24,
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
  loginText: {
    fontSize: 14,
    marginRight: 4,
  },
  loginLink: {
    fontSize: 14,
    fontWeight: '600',
  },
  linkLight: {
    color: '#0066FF',
  },
  linkDark: {
    color: '#52A9FF',
  },
  textLight: {
    color: '#1E293B',
  },
  textDark: {
    color: '#E2E8F0',
  },
});