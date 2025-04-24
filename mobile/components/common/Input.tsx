import React, { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  TextInput, 
  Text, 
  TouchableOpacity, 
  Platform, 
  KeyboardTypeOptions,
} from 'react-native';
import { Eye, EyeOff } from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';

interface InputProps {
  label?: string;
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  secureTextEntry?: boolean;
  keyboardType?: KeyboardTypeOptions;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  error?: string;
  disabled?: boolean;
  maxLength?: number;
  multiline?: boolean;
  rightIcon?: React.ReactNode;
  leftIcon?: React.ReactNode;
  onRightIconPress?: () => void;
  onLeftIconPress?: () => void;
  style?: any;
}

export default function Input({
  label,
  placeholder,
  value,
  onChangeText,
  secureTextEntry = false,
  keyboardType = 'default',
  autoCapitalize = 'none',
  error,
  disabled = false,
  maxLength,
  multiline = false,
  rightIcon,
  leftIcon,
  onRightIconPress,
  onLeftIconPress,
  style,
}: InputProps) {
  const { isDark } = useTheme();
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(false);
  
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  
  const getBorderColor = () => {
    if (error) return styles.errorBorder;
    if (isFocused) return isDark ? styles.focusedBorderDark : styles.focusedBorder;
    return isDark ? styles.defaultBorderDark : styles.defaultBorder;
  };
  
  return (
    <View style={[styles.container, style]}>
      {label && (
        <Text style={[
          styles.label,
          isDark ? styles.labelDark : styles.labelLight,
          disabled && styles.disabledText
        ]}>
          {label}
        </Text>
      )}
      
      <View style={[
        styles.inputContainer,
        getBorderColor(),
        disabled && styles.disabledInput,
        isDark ? styles.inputContainerDark : styles.inputContainerLight,
      ]}>
        {leftIcon && (
          <TouchableOpacity 
            onPress={onLeftIconPress}
            disabled={!onLeftIconPress}
            style={styles.iconContainer}
          >
            {typeof leftIcon === 'string' ? (
              <Text style={[
                styles.currencySymbol,
                isDark ? styles.textDark : styles.textLight
              ]}>
                {leftIcon}
              </Text>
            ) : (
              leftIcon
            )}
          </TouchableOpacity>
        )}
        
        <TextInput
          style={[
            styles.input,
            isDark ? styles.inputDark : styles.inputLight,
            disabled && styles.disabledText,
            multiline && styles.multilineInput,
          ]}
          placeholder={placeholder}
          placeholderTextColor={isDark ? '#94A3B8' : '#94A3B8'}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={secureTextEntry && !showPassword}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          editable={!disabled}
          selectTextOnFocus={!disabled}
          maxLength={maxLength}
          multiline={multiline}
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
        
        {secureTextEntry && (
          <TouchableOpacity
            style={styles.iconContainer}
            onPress={togglePasswordVisibility}
          >
            {showPassword 
              ? <EyeOff size={20} color={isDark ? '#94A3B8' : '#64748B'} /> 
              : <Eye size={20} color={isDark ? '#94A3B8' : '#64748B'} />
            }
          </TouchableOpacity>
        )}
        
        {rightIcon && !secureTextEntry && (
          <TouchableOpacity
            style={styles.iconContainer}
            onPress={onRightIconPress}
            disabled={!onRightIconPress}
          >
            {rightIcon}
          </TouchableOpacity>
        )}
      </View>
      
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    marginBottom: 8,
    fontSize: 14,
    fontWeight: '500',
  },
  labelLight: {
    color: '#1E293B',
  },
  labelDark: {
    color: '#E2E8F0',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 12,
    height: 48,
    paddingHorizontal: 12,
  },
  inputContainerLight: {
    backgroundColor: '#FFFFFF',
  },
  inputContainerDark: {
    backgroundColor: '#1E1E1E',
  },
  input: {
    flex: 1,
    fontSize: 16,
    height: '100%',
    paddingVertical: Platform.OS === 'ios' ? 12 : 8,
  },
  inputLight: {
    color: '#1E293B',
  },
  inputDark: {
    color: '#E2E8F0',
  },
  multilineInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  iconContainer: {
    padding: 4,
  },
  defaultBorder: {
    borderColor: '#E2E8F0',
  },
  defaultBorderDark: {
    borderColor: '#334155',
  },
  focusedBorder: {
    borderColor: '#0066FF',
  },
  focusedBorderDark: {
    borderColor: '#52A9FF',
  },
  errorBorder: {
    borderColor: '#EF4444',
  },
  errorText: {
    color: '#EF4444',
    fontSize: 12,
    marginTop: 4,
  },
  disabledInput: {
    backgroundColor: '#F1F5F9',
    opacity: 0.7,
  },
  disabledText: {
    opacity: 0.6,
  },
  currencySymbol: {
    fontSize: 18,
    fontWeight: '600',
  },
  textLight: {
    color: '#64748B',
  },
  textDark: {
    color: '#94A3B8',
  },
});