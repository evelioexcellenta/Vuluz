import React from 'react';
import { StyleSheet, View, TextInput as RNTextInput, Text, ViewStyle } from 'react-native';

interface TextInputProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  label?: string;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'number-pad' | 'decimal-pad' | 'numeric' | 'email-address' | 'phone-pad';
  error?: string;
  style?: ViewStyle;
  multiline?: boolean;
  numberOfLines?: number;
  editable?: boolean;
}

export function TextInput({
  value,
  onChangeText,
  placeholder,
  label,
  secureTextEntry = false,
  keyboardType = 'default',
  error,
  style,
  multiline = false,
  numberOfLines = 1,
  editable = true, // default true
}: TextInputProps) {
  return (
    <View style={[styles.container, style]}>
      {label && <Text style={styles.label}>{label}</Text>}
      <RNTextInput
        style={[
          styles.input,
          multiline && styles.multiline,
          error && styles.inputError,
          !editable && styles.inputDisabled, // <<< ini, kalau disable
        ]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        multiline={multiline}
        numberOfLines={multiline ? numberOfLines : 1}
        editable={editable}
        placeholderTextColor={editable ? '#999' : '#bbb'} // placeholder lebih soft kalau disabled
      />
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: '#FFFFFF',
    color: '#000000', // normal text color
  },
  multiline: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  inputError: {
    borderColor: '#FF6B6B',
  },
  inputDisabled: {
    backgroundColor: '#F5F5F5', // <<< warna latar belakang kalau disabled
    color: '#666666',             // <<< warna teks agak gelap
  },
  errorText: {
    color: '#FF6B6B',
    fontSize: 12,
    marginTop: 4,
  },
});
