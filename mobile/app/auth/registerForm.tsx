import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { TextInput } from '@/components/ui/TextInput';
import { Button } from '@/components/ui/Button';
import { useRouter } from 'expo-router';
import { useAuth } from '@/hooks/useAuth';

export default function RegisterForm() {
  const router = useRouter();
  const {
    registerName,
    setRegisterName,
    registerEmail,
    setRegisterEmail,
    registerPassword,
    setRegisterPassword,
    registerUsername,
    setRegisterUsername,
    registerGender,
    setRegisterGender,
  } = useAuth();

  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isChecked, setIsChecked] = useState(false);

  const validateEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleNext = () => {
    const newErrors: { [key: string]: string } = {};

    if (!registerName) newErrors.name = 'Full name is required';
    if (!registerUsername) newErrors.username = 'Username is required';
    if (!registerEmail) newErrors.email = 'Email is required';
    else if (!validateEmail(registerEmail))
      newErrors.email = 'Email format is invalid';
    if (!registerGender) newErrors.gender = 'Gender is required';
    if (!registerPassword) newErrors.password = 'Password is required';
    if (!confirmPassword) newErrors.confirm = 'Please confirm your password';
    else if (registerPassword !== confirmPassword)
      newErrors.confirm = 'Passwords do not match';
    if (!isChecked)
      newErrors.terms = 'You must agree to the Terms and Conditions';

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      router.push('/auth/createPIN');
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: '#F5F7FF' }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.brandContainer}>
          <Image
            source={require('@/assets/images/V.png')}
            style={styles.logoIcon}
            resizeMode="contain"
          />
          <Text style={styles.logoText}>Vuluz</Text>
        </View>

        <Image
          source={require('@/assets/images/vuluz.png')}
          style={styles.image}
        />
        <Text style={styles.header}>Sign Up</Text>

        <View style={styles.form}>
          <Text style={styles.label}>Full Name*</Text>
          <TextInput
            placeholder="Your Name"
            value={registerName}
            onChangeText={setRegisterName}
          />
          {errors.name && <Text style={styles.error}>{errors.name}</Text>}

          <Text style={styles.label}>Username*</Text>
          <TextInput
            placeholder="username"
            value={registerUsername}
            onChangeText={setRegisterUsername}
          />
          {errors.username && (
            <Text style={styles.error}>{errors.username}</Text>
          )}

          <Text style={styles.label}>Email Address*</Text>
          <TextInput
            placeholder="youremail@mail.com"
            value={registerEmail}
            onChangeText={setRegisterEmail}
            keyboardType="email-address"
          />
          {errors.email && <Text style={styles.error}>{errors.email}</Text>}

          <Text style={styles.label}>Gender*</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={registerGender}
              onValueChange={(itemValue) => setRegisterGender(itemValue)}
              style={styles.picker}
            >
              <Picker.Item label="Select gender" value="" />
              <Picker.Item label="Male" value="MALE" />
              <Picker.Item label="Female" value="FEMALE" />
            </Picker>
          </View>

          {errors.gender && <Text style={styles.error}>{errors.gender}</Text>}

          <Text style={styles.label}>Password*</Text>
          <TextInput
            placeholder="********"
            value={registerPassword}
            onChangeText={setRegisterPassword}
            secureTextEntry
          />
          <Text style={styles.hint}>
            At least 8 characters, including a number
          </Text>
          {errors.password && (
            <Text style={styles.error}>{errors.password}</Text>
          )}

          <Text style={styles.label}>Confirm Password*</Text>
          <TextInput
            placeholder="********"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
          />
          {errors.confirm && <Text style={styles.error}>{errors.confirm}</Text>}

          <TouchableOpacity
            style={styles.checkboxContainer}
            onPress={() => setIsChecked((prev) => !prev)}
          >
            <View style={[styles.checkbox, isChecked && styles.checkedBox]} />
            <Text style={styles.checkboxText}>
              I agree to the{' '}
              <Text style={{ color: '#7C5DF9' }}>Terms and Conditions</Text>
            </Text>
          </TouchableOpacity>
          {errors.terms && <Text style={styles.error}>{errors.terms}</Text>}

          <Button
            title="Create Account"
            onPress={handleNext}
            style={styles.button}
          />

          <Text style={styles.bottomText}>
            Already have an account?{' '}
            <Text
              style={styles.link}
              onPress={() => router.push('/auth/login')}
            >
              Sign In
            </Text>
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingTop: 40,
    paddingBottom: 60,
    backgroundColor: '#F5F7FF',
  },
  brandContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 32,
  },
  logoIcon: {
    width: 30,
    height: 40,
    marginRight: 8,
  },
  logoText: {
    fontSize: 32,
    fontWeight: '700',
    color: '#000000',
  },
  image: {
    width: 250,
    height: 160,
    resizeMode: 'contain',
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    marginVertical: 20,
  },
  form: {
    width: '85%',
  },
  label: {
    marginTop: 12,
    marginBottom: 4,
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  error: {
    color: '#EB5757',
    fontSize: 12,
    marginBottom: 6,
  },
  hint: {
    fontSize: 11,
    color: '#888',
    marginTop: 2,
    marginBottom: 2,
  },
  button: {
    marginTop: 16,
  },
  bottomText: {
    marginTop: 24,
    textAlign: 'center',
    fontSize: 12,
  },
  link: {
    fontWeight: 'bold',
  },
  checkboxContainer: {
    flexDirection: 'row',
    marginTop: 12,
    alignItems: 'center',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: '#aaa',
    marginRight: 8,
    backgroundColor: '#fff',
  },
  checkedBox: {
    backgroundColor: '#7C5DF9',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 28,
    height: 48,
    justifyContent: 'center',
    marginBottom: 4,
  },
  picker: {
    height: 48,
    paddingHorizontal: 12,
    color: '#333',
  },
  checkboxText: {
    fontSize: 12,
  },
});
