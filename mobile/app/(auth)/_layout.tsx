import React, { useEffect } from 'react';
import { Stack } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '@/hooks/useAuth';
import { router } from 'expo-router';

export default function AuthLayout() {
  const { isAuthenticated, isLoading } = useAuth();
  
  // If authenticated, redirect to main app
  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      router.replace('/(tabs)');
    }
  }, [isAuthenticated, isLoading]);
  
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Stack>
        <Stack.Screen
          name="index"
          options={{
            title: 'Login',
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="register"
          options={{
            title: 'Sign Up',
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="forgot-password"
          options={{
            title: 'Forgot Password',
            headerShown: false,
          }}
        />
      </Stack>
    </SafeAreaView>
  );
}