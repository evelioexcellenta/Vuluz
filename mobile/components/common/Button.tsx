import React from 'react';
import { StyleSheet, TouchableOpacity, Text, ActivityIndicator, View } from 'react-native';
import { useTheme } from '@/hooks/useTheme';

type ButtonType = 'primary' | 'secondary' | 'outline' | 'text' | 'danger';
type ButtonSize = 'small' | 'medium' | 'large';

interface ButtonProps {
  title: string;
  onPress: () => void;
  type?: ButtonType;
  size?: ButtonSize;
  loading?: boolean;
  disabled?: boolean;
  icon?: React.ReactNode;
  style?: any;
  textStyle?: any;
}

export default function Button({
  title,
  onPress,
  type = 'primary',
  size = 'medium',
  loading = false,
  disabled = false,
  icon,
  style,
  textStyle,
}: ButtonProps) {
  const { isDark } = useTheme();
  
  const getStyles = () => {
    let buttonStyle;
    let textColorStyle;
    
    // Button background styles
    switch (type) {
      case 'primary':
        buttonStyle = isDark ? styles.primaryDark : styles.primary;
        textColorStyle = styles.textLight;
        break;
      case 'secondary':
        buttonStyle = isDark ? styles.secondaryDark : styles.secondary;
        textColorStyle = styles.textLight;
        break;
      case 'outline':
        buttonStyle = isDark ? styles.outlineDark : styles.outline;
        textColorStyle = isDark ? styles.textDark : styles.textPrimary;
        break;
      case 'text':
        buttonStyle = styles.text;
        textColorStyle = isDark ? styles.textDark : styles.textPrimary;
        break;
      case 'danger':
        buttonStyle = styles.danger;
        textColorStyle = styles.textLight;
        break;
      default:
        buttonStyle = isDark ? styles.primaryDark : styles.primary;
        textColorStyle = styles.textLight;
    }
    
    // Button size styles
    let sizeStyle;
    let textSizeStyle;
    
    switch (size) {
      case 'small':
        sizeStyle = styles.buttonSmall;
        textSizeStyle = styles.textSmall;
        break;
      case 'medium':
        sizeStyle = styles.buttonMedium;
        textSizeStyle = styles.textMedium;
        break;
      case 'large':
        sizeStyle = styles.buttonLarge;
        textSizeStyle = styles.textLarge;
        break;
      default:
        sizeStyle = styles.buttonMedium;
        textSizeStyle = styles.textMedium;
    }
    
    return {
      button: [buttonStyle, sizeStyle, disabled && styles.disabled, style],
      text: [textColorStyle, textSizeStyle, disabled && styles.disabledText, textStyle],
    };
  };
  
  const finalStyles = getStyles();
  
  return (
    <TouchableOpacity
      style={finalStyles.button}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator 
          color={type === 'outline' || type === 'text' ? '#0066FF' : '#FFFFFF'} 
          size="small" 
        />
      ) : (
        <View style={styles.contentContainer}>
          {icon && <View style={styles.iconContainer}>{icon}</View>}
          <Text style={finalStyles.text}>{title}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  primary: {
    backgroundColor: '#0066FF',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryDark: {
    backgroundColor: '#52A9FF',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondary: {
    backgroundColor: '#7A5AF8',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryDark: {
    backgroundColor: '#9D8FFC',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#0066FF',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  outlineDark: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#52A9FF',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    backgroundColor: 'transparent',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  danger: {
    backgroundColor: '#EF4444',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonSmall: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    minHeight: 32,
  },
  buttonMedium: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    minHeight: 44,
  },
  buttonLarge: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    minHeight: 56,
  },
  textSmall: {
    fontSize: 14,
    fontWeight: '500',
  },
  textMedium: {
    fontSize: 16,
    fontWeight: '600',
  },
  textLarge: {
    fontSize: 18,
    fontWeight: '600',
  },
  textLight: {
    color: '#FFFFFF',
  },
  textDark: {
    color: '#E2E8F0',
  },
  textPrimary: {
    color: '#0066FF',
  },
  disabled: {
    opacity: 0.5,
  },
  disabledText: {
    opacity: 0.8,
  },
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    marginRight: 8,
  },
});