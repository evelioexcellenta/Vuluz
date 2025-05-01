import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useAuth } from '@/hooks/useAuth';
import {
  validateEmail,
  validatePassword,
  validateName,
} from '@/utils/validators';
import { router } from 'expo-router';
import { TextInput } from '@/components/ui/TextInput';
import { Button } from '@/components/ui/Button';
import { StatusBar } from 'expo-status-bar';
import { Picker } from '@react-native-picker/picker';
import Toast from 'react-native-toast-message';

export default function RegisterScreen() {
  const {
    registerName,
    setRegisterName,
    registerEmail,
    setRegisterEmail,
    registerPassword,
    setRegisterPassword,
    registerUsername,
    setRegisterUsername,
    registerPin,
    setRegisterPin,
    registerGender,
    setRegisterGender,
    handleRegister,
    isLoading,
    error,
  } = useAuth();

  const [nameError, setNameError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [genderError, setGenderError] = useState<string | null>(null);
  const [pinError, setPinError] = useState<string | null>(null);

  const validateForm = () => {
    let isValid = true;

    if (!validateName(registerName)) {
      setNameError('Please enter your name');
      isValid = false;
    } else {
      setNameError(null);
    }

    if (!validateEmail(registerEmail)) {
      setEmailError('Please enter a valid email address');
      isValid = false;
    } else {
      setEmailError(null);
    }

    if (!validatePassword(registerPassword)) {
      setPasswordError('Password must be at least 6 characters');
      isValid = false;
    } else {
      setPasswordError(null);
    }

    if (!registerGender) {
      setGenderError('Please select your gender');
      isValid = false;
    } else {
      setGenderError(null);
    }

    if (!/^\d{6}$/.test(registerPin)) {
      setPinError('PIN must be exactly 6 digits');
      isValid = false;
    } else {
      setPinError(null);
    }

    return isValid;
  };

  const onSubmit = async () => {
    if (validateForm()) {
      const success = await handleRegister();
      if (success) {
        Toast.show({
          type: 'success',
          text1: 'Registration Successful',
          text2: 'Please login to continue',
          position: 'top',
        });
      }
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
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>
            Sign up to get started with your new account
          </Text>
        </View>

        <View style={styles.form}>
          {error && <Text style={styles.errorText}>{error}</Text>}

          <TextInput
            label="Full Name"
            value={registerName}
            onChangeText={setRegisterName}
            placeholder="Enter your full name"
            error={nameError ?? undefined}
          />

          <TextInput
            label="Username"
            value={registerUsername}
            onChangeText={setRegisterUsername}
            placeholder="Enter your username"
          />

          <View style={{ marginTop: 16 }}>
            <Text style={{ marginBottom: 4, fontSize: 16, color: '#666' }}>
              Gender
            </Text>
            <View
              style={{ borderWidth: 1, borderColor: '#ccc', borderRadius: 8 }}
            >
              <Picker
                selectedValue={registerGender}
                onValueChange={(itemValue) => setRegisterGender(itemValue)}
              >
                <Picker.Item label="Select Gender" value="" />
                <Picker.Item label="Male" value="MALE" />
                <Picker.Item label="Female" value="FEMALE" />
              </Picker>
              {genderError && (
                <Text style={{ color: '#EB5757', marginTop: 4 }}>
                  {genderError}
                </Text>
              )}
            </View>
          </View>

          <TextInput
            label="Email"
            value={registerEmail}
            onChangeText={setRegisterEmail}
            placeholder="Enter your email"
            keyboardType="email-address"
            error={emailError ?? undefined}
          />

          <TextInput
            label="Password"
            value={registerPassword}
            onChangeText={setRegisterPassword}
            placeholder="Create a password"
            secureTextEntry
            error={passwordError ?? undefined}
          />

          <TextInput
            label="PIN"
            value={registerPin}
            onChangeText={setRegisterPin}
            placeholder="Create 6-digit PIN"
            keyboardType="numeric"
            secureTextEntry
            error={pinError ?? undefined}
          />

          <Button
            title="Sign Up"
            onPress={onSubmit}
            loading={isLoading}
            style={styles.button}
          />

          <View style={styles.loginContainer}>
            <Text style={styles.loginText}>Already have an account? </Text>
            <TouchableOpacity onPress={() => router.push('/auth/login')}>
              <Text style={styles.loginLink}>Sign In</Text>
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
  button: {
    marginTop: 8,
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },
  loginText: {
    fontSize: 14,
    color: '#666',
  },
  loginLink: {
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
