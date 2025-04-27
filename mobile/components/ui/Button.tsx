import React from 'react';
import { StyleSheet, TouchableOpacity, Text, ActivityIndicator, ViewStyle, TextStyle } from 'react-native';

interface ButtonProps {
  title: string;
  onPress: () => void;
  style?: ViewStyle;
  textStyle?: TextStyle;
  disabled?: boolean;
  loading?: boolean;
  variant?: 'primary' | 'secondary' | 'outline';
}

export function Button({
  title,
  onPress,
  style,
  textStyle,
  disabled = false,
  loading = false,
  variant = 'primary',
}: ButtonProps) {
  const getButtonStyle = () => {
    if (disabled) return [styles.button, styles.disabledButton, style];
    
    switch (variant) {
      case 'secondary':
        return [styles.button, styles.secondaryButton, style];
      case 'outline':
        return [styles.button, styles.outlineButton, style];
      default:
        return [styles.button, styles.primaryButton, style];
    }
  };
  
  const getTextStyle = () => {
    if (disabled) return [styles.buttonText, styles.disabledText, textStyle];
    
    switch (variant) {
      case 'outline':
        return [styles.buttonText, styles.outlineText, textStyle];
      default:
        return [styles.buttonText, textStyle];
    }
  };
  
  return (
    <TouchableOpacity
      style={getButtonStyle()}
      onPress={onPress}
      disabled={disabled || loading}
    >
      {loading ? (
        <ActivityIndicator color="#fff" />
      ) : (
        <Text style={getTextStyle()}>{title}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButton: {
    backgroundColor: '#7C5DF9',
  },
  secondaryButton: {
    backgroundColor: '#D6D0FB',
  },
  outlineButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#7C5DF9',
  },
  disabledButton: {
    backgroundColor: '#E8E8E8',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  outlineText: {
    color: '#7C5DF9',
  },
  disabledText: {
    color: '#A0A0A0',
  },
});