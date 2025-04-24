import { MD3LightTheme, MD3DarkTheme } from 'react-native-paper';

// Custom colors
const colors = {
  primary: {
    light: '#0066FF',
    dark: '#52A9FF'
  },
  secondary: {
    light: '#7A5AF8',
    dark: '#9D8FFC'
  },
  accent: {
    light: '#00BA88',
    dark: '#34EAB9'
  },
  success: {
    light: '#22C55E',
    dark: '#4ADE80'
  },
  warning: {
    light: '#F59E0B',
    dark: '#FBBF24'
  },
  error: {
    light: '#EF4444',
    dark: '#F87171'
  },
  background: {
    light: '#F8FAFC',
    dark: '#121212'
  },
  surface: {
    light: '#FFFFFF',
    dark: '#1E1E1E'
  },
  text: {
    light: '#1E293B',
    dark: '#E2E8F0'
  },
  secondaryText: {
    light: '#64748B',
    dark: '#94A3B8'
  },
  border: {
    light: '#E2E8F0',
    dark: '#334155'
  }
};

export const lightTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: colors.primary.light,
    onPrimary: '#FFFFFF',
    primaryContainer: '#E0EDFF',
    secondary: colors.secondary.light,
    onSecondary: '#FFFFFF',
    secondaryContainer: '#F1EEFF',
    tertiary: colors.accent.light,
    onTertiary: '#FFFFFF',
    tertiaryContainer: '#E0FFF7',
    surface: colors.surface.light,
    onSurface: colors.text.light,
    surfaceVariant: '#F1F5F9',
    onSurfaceVariant: colors.secondaryText.light,
    background: colors.background.light,
    onBackground: colors.text.light,
    error: colors.error.light,
    onError: '#FFFFFF',
    errorContainer: '#FFECEC',
    outline: colors.border.light,
  },
};

export const darkTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: colors.primary.dark,
    onPrimary: '#000000',
    primaryContainer: '#00448C',
    secondary: colors.secondary.dark,
    onSecondary: '#000000',
    secondaryContainer: '#4F3BBB',
    tertiary: colors.accent.dark,
    onTertiary: '#000000',
    tertiaryContainer: '#00785A',
    surface: colors.surface.dark,
    onSurface: colors.text.dark,
    surfaceVariant: '#0F172A',
    onSurfaceVariant: colors.secondaryText.dark,
    background: colors.background.dark,
    onBackground: colors.text.dark,
    error: colors.error.dark,
    onError: '#000000',
    errorContainer: '#7F1D1D',
    outline: colors.border.dark,
  },
};