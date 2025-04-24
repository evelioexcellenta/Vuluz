import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { AuthProvider } from '@/contexts/AuthContext';
import { WalletProvider } from '@/contexts/WalletContext';
import { FavoritesProvider } from '@/contexts/FavoritesContext';
import { PaperProvider } from 'react-native-paper';
import { lightTheme, darkTheme } from '@/utils/theme';
import { useTheme } from '@/hooks/useTheme';

export default function RootLayout() {
  useFrameworkReady();

  return (
    <ThemeProvider>
      <RootLayoutWithTheme />
    </ThemeProvider>
  );
}

function RootLayoutWithTheme() {
  const { theme, isDark } = useTheme();
  
  return (
    <PaperProvider theme={isDark ? darkTheme : lightTheme}>
      <AuthProvider>
        <WalletProvider>
          <FavoritesProvider>
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen name="(auth)" options={{ headerShown: false }} />
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen name="+not-found" />
            </Stack>
            <StatusBar style={isDark ? 'light' : 'dark'} />
          </FavoritesProvider>
        </WalletProvider>
      </AuthProvider>
    </PaperProvider>
  );
}