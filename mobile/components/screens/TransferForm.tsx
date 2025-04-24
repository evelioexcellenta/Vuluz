import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';
import Input from '@/components/common/Input';
import Button from '@/components/common/Button';
import { Search, Send } from 'lucide-react-native';
import { validateTransferAmount, validateNumeric } from '@/utils/validators';
import { formatCurrency } from '@/utils/formatters';
import { useTheme } from '@/hooks/useTheme';

interface TransferFormProps {
  balance: number;
  onTransfer: (recipientId: string, amount: number, note?: string) => Promise<void>;
  onSearchRecipient?: () => void;
  isLoading: boolean;
}

export default function TransferForm({
  balance,
  onTransfer,
  onSearchRecipient,
  isLoading,
}: TransferFormProps) {
  const { isDark } = useTheme();
  const [recipientId, setRecipientId] = useState('');
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [errors, setErrors] = useState({
    recipientId: '',
    amount: '',
  });
  
  // Preset amounts
  const presetAmounts = [10, 20, 50, 100];
  
  const handleAmountChange = (value: string) => {
    // Only allow numeric input with at most one decimal point
    if (validateNumeric(value) || value === '') {
      setAmount(value);
      
      // Clear error when user types
      if (errors.amount) {
        setErrors(prev => ({ ...prev, amount: '' }));
      }
    }
  };
  
  const handleSelectPreset = (presetAmount: number) => {
    setAmount(presetAmount.toString());
    setErrors(prev => ({ ...prev, amount: '' }));
  };
  
  const validateForm = (): boolean => {
    const newErrors = {
      recipientId: '',
      amount: '',
    };
    
    let isValid = true;
    
    // Validate recipient ID
    if (!recipientId.trim()) {
      newErrors.recipientId = 'Recipient ID is required';
      isValid = false;
    }
    
    // Validate amount
    if (!amount) {
      newErrors.amount = 'Amount is required';
      isValid = false;
    } else {
      const numAmount = parseFloat(amount);
      const validation = validateTransferAmount(numAmount, balance);
      
      if (!validation.isValid) {
        newErrors.amount = validation.message;
        isValid = false;
      }
    }
    
    setErrors(newErrors);
    return isValid;
  };
  
  const handleSubmit = async () => {
    if (!validateForm()) return;
    
    try {
      await onTransfer(recipientId, parseFloat(amount), note);
      
      // Reset form on success
      setRecipientId('');
      setAmount('');
      setNote('');
      
      Alert.alert('Success', 'Transfer completed successfully!');
    } catch (error) {
      Alert.alert('Error', error instanceof Error ? error.message : 'Failed to transfer money');
    }
  };
  
  return (
    <ScrollView style={styles.container}>
      <View style={styles.balanceContainer}>
        <Text style={[
          styles.balanceLabel,
          isDark ? styles.textSecondaryDark : styles.textSecondaryLight,
        ]}>
          Available Balance
        </Text>
        <Text style={[
          styles.balanceAmount,
          isDark ? styles.textDark : styles.textLight,
        ]}>
          {formatCurrency(balance)}
        </Text>
      </View>
      
      <View style={styles.form}>
        <Input
          label="Recipient ID"
          placeholder="Enter recipient ID or username"
          value={recipientId}
          onChangeText={setRecipientId}
          error={errors.recipientId}
          rightIcon={<Search size={20} color={isDark ? '#94A3B8' : '#64748B'} />}
          onRightIconPress={onSearchRecipient}
        />
        
        <Input
          label="Amount"
          placeholder="0.00"
          value={amount}
          onChangeText={handleAmountChange}
          keyboardType="numeric"
          error={errors.amount}
        />
        
        <View style={styles.presetContainer}>
          {presetAmounts.map((preset) => (
            <TouchableOpacity
              key={preset}
              style={[
                styles.presetButton,
                isDark ? styles.presetButtonDark : styles.presetButtonLight,
              ]}
              onPress={() => handleSelectPreset(preset)}
            >
              <Text style={[
                styles.presetText,
                isDark ? styles.presetTextDark : styles.presetTextLight,
              ]}>
                ${preset}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        
        <Input
          label="Note (Optional)"
          placeholder="What's this for?"
          value={note}
          onChangeText={setNote}
          multiline={true}
        />
        
        <Button
          title="Transfer Money"
          onPress={handleSubmit}
          loading={isLoading}
          icon={<Send size={18} color="#FFFFFF" />}
          style={styles.submitButton}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  balanceContainer: {
    marginBottom: 24,
  },
  balanceLabel: {
    fontSize: 14,
    marginBottom: 4,
  },
  balanceAmount: {
    fontSize: 24,
    fontWeight: '700',
  },
  form: {
    marginBottom: 24,
  },
  presetContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  presetButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    minWidth: 70,
    alignItems: 'center',
  },
  presetButtonLight: {
    backgroundColor: '#F1F5F9',
  },
  presetButtonDark: {
    backgroundColor: '#1E1E1E',
  },
  presetText: {
    fontSize: 14,
    fontWeight: '500',
  },
  presetTextLight: {
    color: '#0066FF',
  },
  presetTextDark: {
    color: '#52A9FF',
  },
  submitButton: {
    marginTop: 16,
  },
  textLight: {
    color: '#1E293B',
  },
  textDark: {
    color: '#E2E8F0',
  },
  textSecondaryLight: {
    color: '#64748B',
  },
  textSecondaryDark: {
    color: '#94A3B8',
  },
});