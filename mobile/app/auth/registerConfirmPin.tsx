// confirm-pin.tsx
import React, { useState } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/hooks/useAuth';
import { router } from 'expo-router';
import { PinInput } from '@/components/ui/PinInput';

export default function ConfirmPIN() {
  const { registerPin } = useAuth();
  const [confirmPin, setConfirmPin] = useState('');
  const [error, setError] = useState('');

  const handleConfirm = () => {
    if (!/^\d{6}$/.test(confirmPin)) {
      setError('PIN must be 6 digits');
      return;
    }
    if (confirmPin !== registerPin) {
      setError('PINs do not match');
      return;
    }

    setError('');
    router.replace('/auth/registerSuccess');
  };

  return (
    <View style={styles.container}>
      <View style={styles.brandContainer}>
        {/* <Text style={styles.logoIcon}>V</Text> */}
        <Image
          source={require('@/assets/images/V.png')} // ganti dengan path sesuai image kamu
          style={styles.logoIcon}
          resizeMode="contain"
        />
        <Text style={styles.logoText}>Vuluz</Text>
      </View>
      <Image
        source={require('@/assets/images/vuluz.png')}
        style={styles.image}
      />
      <Text style={styles.title}>Re-enter PIN</Text>
      <View style={styles.card}>
        <Text style={styles.subtitle}>Re-enter your PIN!</Text>
        <PinInput pin={confirmPin} setPin={setConfirmPin} />
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
});
