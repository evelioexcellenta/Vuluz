// register-success.tsx
import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { Button } from '@/components/ui/Button';
import { router } from 'expo-router';

export default function RegisterSuccess() {
  const handleConfirm = () => {
    router.replace('/auth/login');
  };

  return (
    <View style={styles.container}>
      <Image source={require('@/assets/images/V.png')} style={styles.logo} />
      <Image source={require('@/assets/images/vuluz.png')} style={styles.image} />
      <View style={styles.content}>
        <View style={styles.iconWrapper}>
          <Text style={styles.checkIcon}>✓</Text>
        </View>
        <Text style={styles.title}>Registration Successful</Text>
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
  content: {
    alignItems: 'center',
    width: '90%',
    padding: 24,
    backgroundColor: '#fff',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
  },
  iconWrapper: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#4CAF50',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  checkIcon: {
    fontSize: 32,
    color: '#fff',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 24,
  },
  button: {
    width: '100%',
  },
});
