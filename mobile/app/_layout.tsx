import { useEffect } from 'react';
import { Provider } from 'react-native-paper';
import { Redirect, Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { useAuthStore } from '@/store/authStore';
import Toast from 'react-native-toast-message';

export default function RootLayout() {
  useFrameworkReady();
  const { isAuthenticated, user, checkAuth } = useAuthStore();

  // Pre-load data
  useEffect(() => {
    // Load initial data if needed
    checkAuth();
  }, []);

  return (
    <Provider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="auth" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" options={{ title: 'Oops!' }} />
      </Stack>
      <StatusBar style="auto" />
      <Toast />
    </Provider>
  );
}

export function isLoggedInOrRedirect() {
  const { isAuthenticated } = useAuthStore();
  
  if (!isAuthenticated) {
    return <Redirect href="/auth/login" />;
  }
}