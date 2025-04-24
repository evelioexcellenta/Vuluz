import React, { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TouchableOpacity, 
  ScrollView, 
  KeyboardAvoidingView,
  Platform,
  Image,
} from 'react-native';
import { Link } from 'expo-router';
import Input from '@/components/common/Input';
import Button from '@/components/common/Button';
import { useAuth } from '@/hooks/useAuth';
import { validateEmail } from '@/utils/validators';
import { useTheme } from '@/hooks/useTheme';

export default function LoginScreen() {
  const { login, isLoading, error, clearError } = useAuth();
  const { isDark } = useTheme();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({
    email: '',
    password: '',
  });
  
  const validateForm = (): boolean => {
    let isValid = true;
    const newErrors = {
      email: '',
      password: '',
    };
    
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
    }
    
    setErrors(newErrors);
    return isValid;
  };
  
  const handleLogin = async () => {
    if (!validateForm()) return;
    
    clearError();
    await login(email, password);
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
        <View style={styles.logoContainer}>
          <Image
            source={{ uri: 'https://images.pexels.com/photos/6289065/pexels-photo-6289065.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2' }}
            style={styles.logoBackground}
          />
          <View style={styles.logoOverlay}>
            <Text style={styles.logoText}>WalletPro</Text>
          </View>
        </View>
        
        <View style={styles.formContainer}>
          <Text style={[
            styles.heading,
            isDark ? styles.headingDark : styles.headingLight,
          ]}>
            Welcome Back
          </Text>
          
          <Text style={[
            styles.subheading,
            isDark ? styles.subheadingDark : styles.subheadingLight,
          ]}>
            Log in to access your wallet
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
                if (errors.email) setErrors({ ...errors, email: '' });
              }}
              keyboardType="email-address"
              autoCapitalize="none"
              error={errors.email}
            />
            
            <Input
              label="Password"
              placeholder="Your password"
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                if (errors.password) setErrors({ ...errors, password: '' });
              }}
              secureTextEntry
              error={errors.password}
            />
            
            <Link href="/forgot-password" asChild>
              <TouchableOpacity style={styles.forgotPasswordContainer}>
                <Text style={[
                  styles.forgotPasswordText,
                  isDark ? styles.linkDark : styles.linkLight,
                ]}>
                  Forgot password?
                </Text>
              </TouchableOpacity>
            </Link>
          </View>
          
          <Button
            title="Login"
            onPress={handleLogin}
            loading={isLoading}
            style={styles.loginButton}
          />
          
          <View style={styles.signupContainer}>
            <Text style={[
              styles.signupText,
              isDark ? styles.textDark : styles.textLight,
            ]}>
              Don't have an account?
            </Text>
            <Link href="/register" asChild>
              <TouchableOpacity>
                <Text style={[
                  styles.signupLink,
                  isDark ? styles.linkDark : styles.linkLight,
                ]}>
                  Sign up
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
  },
  logoContainer: {
    height: 240,
    position: 'relative',
  },
  logoBackground: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  logoOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoText: {
    fontSize: 32,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 1,
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
  forgotPasswordContainer: {
    alignSelf: 'flex-end',
    marginTop: 4,
    marginBottom: 16,
  },
  forgotPasswordText: {
    fontSize: 14,
    fontWeight: '500',
  },
  loginButton: {
    marginBottom: 24,
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
  signupText: {
    fontSize: 14,
    marginRight: 4,
  },
  signupLink: {
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