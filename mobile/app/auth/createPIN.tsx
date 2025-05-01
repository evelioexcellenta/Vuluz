// CreatePIN.tsx
import React, { useState } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/hooks/useAuth';
import { router } from 'expo-router';
import { PinInput } from '@/components/ui/PinInput';

export default function CreatePIN() {
  const { registerPin, setRegisterPin } = useAuth();
  const [error, setError] = useState('');
  const [localPin, setLocalPin] = useState('');

  const handleConfirm = () => {
  if (!/^\d{6}$/.test(localPin)) {
    setError('PIN must be 6 digits');
    return;
  }
  setError('');
  setRegisterPin(localPin); // simpan ke global state
  setTimeout(() => {
    router.push('/auth/registerConfirmPin'); // beri jeda agar state tersimpan
  }, 100); 
};

  return (
    <View style={styles.container}>
      <Image source={require('@/assets/images/V.png')} style={styles.logo} />
      <Image source={require('@/assets/images/vuluz.png')} style={styles.image} />
      <Text style={styles.title}>Create PIN</Text>
      <View style={styles.card}>
        <Text style={styles.subtitle}>Create your PIN!</Text>
        <PinInput pin={localPin} setPin={setLocalPin} />
        {error && <Text style={styles.error}>{error}</Text>}
        <Button title="Confirm" onPress={handleConfirm} style={styles.button} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#F4F6FD',
    paddingTop: 48,
  },
  logo: {
    width: 32,
    height: 32,
    resizeMode: 'contain',
    position: 'absolute',
    top: 48,
    left: 24,
  },
  image: {
    width: 240,
    height: 160,
    resizeMode: 'contain',
    marginBottom: 32,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    marginBottom: 16,
  },
  card: {
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#333',
    marginBottom: 12,
  },
  error: {
    color: '#EB5757',
    marginTop: 8,
  },
  button: {
    marginTop: 24,
    width: '100%',
  },
});
