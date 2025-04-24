import React, { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TouchableOpacity, 
  ScrollView, 
  Alert, 
  Modal, 
  Image, 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Input from '@/components/common/Input';
import Button from '@/components/common/Button';
import Card from '@/components/common/Card';
import { useTheme } from '@/hooks/useTheme';
import { useWallet } from '@/hooks/useWallet';
import { formatCurrency } from '@/utils/formatters';
import { validateNumeric } from '@/utils/validators';
import { CreditCard, Landmark, ArrowDownLeft, X, Check } from 'lucide-react-native';

export default function TopUpScreen() {
  const { isDark } = useTheme();
  const { topUp, isLoading } = useWallet();
  
  const [amount, setAmount] = useState('');
  const [selectedMethod, setSelectedMethod] = useState('');
  const [amountError, setAmountError] = useState('');
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  
  // Preset amounts
  const presetAmounts = [10, 25, 50, 100, 250, 500];
  
  // Payment methods
  const paymentMethods = [
    {
      id: 'card',
      name: 'Credit Card',
      icon: <CreditCard size={24} color={isDark ? '#E2E8F0' : '#1E293B'} />,
      description: 'Visa, Mastercard, Amex',
    },
    {
      id: 'bank',
      name: 'Bank Transfer',
      icon: <Landmark size={24} color={isDark ? '#E2E8F0' : '#1E293B'} />,
      description: 'Direct bank transfer',
    },
  ];
  
  const handleAmountChange = (value: string) => {
    // Only allow numeric input with at most one decimal point
    if (validateNumeric(value) || value === '') {
      setAmount(value);
      setAmountError('');
    }
  };
  
  const handleSelectPreset = (presetAmount: number) => {
    setAmount(presetAmount.toString());
    setAmountError('');
  };
  
  const validateForm = (): boolean => {
    if (!amount) {
      setAmountError('Please enter an amount');
      return false;
    }
    
    const numAmount = parseFloat(amount);
    if (numAmount <= 0) {
      setAmountError('Amount must be greater than 0');
      return false;
    }
    
    if (!selectedMethod) {
      Alert.alert('Selection Required', 'Please select a payment method');
      return false;
    }
    
    return true;
  };
  
  const handleTopUp = () => {
    if (!validateForm()) return;
    setShowConfirmModal(true);
  };
  
  const confirmTopUp = async () => {
    try {
      await topUp(parseFloat(amount), selectedMethod);
      setShowConfirmModal(false);
      setShowSuccessModal(true);
      
      // Reset form
      setAmount('');
      setSelectedMethod('');
    } catch (error) {
      setShowConfirmModal(false);
      Alert.alert('Top-up Failed', error instanceof Error ? error.message : 'An error occurred');
    }
  };
  
  const handleSuccessModalClose = () => {
    setShowSuccessModal(false);
  };
  
  return (
    <SafeAreaView style={[
      styles.container,
      isDark ? styles.containerDark : styles.containerLight,
    ]}>
      <ScrollView style={styles.scrollContainer}>
        <Text style={[
          styles.title,
          isDark ? styles.textDark : styles.textLight,
        ]}>
          Top Up Your Wallet
        </Text>
        
        <View style={styles.amountContainer}>
          <Text style={[
            styles.label,
            isDark ? styles.textDark : styles.textLight,
          ]}>
            Enter Amount
          </Text>
          
          <Input
            placeholder="0.00"
            value={amount}
            onChangeText={handleAmountChange}
            keyboardType="numeric"
            error={amountError}
            leftIcon={<Text style={styles.currencySymbol}>$</Text>}
          />
          
          <View style={styles.presetsContainer}>
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
        </View>
        
        <View style={styles.methodsContainer}>
          <Text style={[
            styles.label,
            isDark ? styles.textDark : styles.textLight,
          ]}>
            Payment Method
          </Text>
          
          {paymentMethods.map((method) => (
            <TouchableOpacity
              key={method.id}
              style={[
                styles.methodCard,
                selectedMethod === method.id && (
                  isDark ? styles.selectedMethodCardDark : styles.selectedMethodCardLight
                ),
              ]}
              onPress={() => setSelectedMethod(method.id)}
            >
              <View style={styles.methodContent}>
                <View style={styles.methodIconContainer}>
                  {method.icon}
                </View>
                <View style={styles.methodDetails}>
                  <Text style={[
                    styles.methodName,
                    isDark ? styles.textDark : styles.textLight,
                  ]}>
                    {method.name}
                  </Text>
                  <Text style={[
                    styles.methodDescription,
                    isDark ? styles.textSecondaryDark : styles.textSecondaryLight,
                  ]}>
                    {method.description}
                  </Text>
                </View>
              </View>
              
              <View style={[
                styles.radioButton,
                selectedMethod === method.id && (
                  isDark ? styles.radioButtonSelectedDark : styles.radioButtonSelectedLight
                ),
              ]}>
                {selectedMethod === method.id && (
                  <View style={styles.radioButtonInner} />
                )}
              </View>
            </TouchableOpacity>
          ))}
        </View>
        
        <Button
          title="Top Up Now"
          onPress={handleTopUp}
          loading={isLoading}
          icon={<ArrowDownLeft size={20} color="#FFFFFF" />}
          style={styles.topUpButton}
        />
      </ScrollView>
      
      {/* Confirmation Modal */}
      <Modal
        visible={showConfirmModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowConfirmModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[
            styles.modalContent,
            isDark ? styles.modalContentDark : styles.modalContentLight,
          ]}>
            <View style={styles.modalHeader}>
              <Text style={[
                styles.modalTitle,
                isDark ? styles.textDark : styles.textLight,
              ]}>
                Confirm Top-Up
              </Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setShowConfirmModal(false)}
              >
                <X size={24} color={isDark ? '#E2E8F0' : '#1E293B'} />
              </TouchableOpacity>
            </View>
            
            <View style={styles.modalBody}>
              <Text style={[
                styles.confirmLabel,
                isDark ? styles.textSecondaryDark : styles.textSecondaryLight,
              ]}>
                You are about to top up
              </Text>
              <Text style={[
                styles.confirmAmount,
                isDark ? styles.textDark : styles.textLight,
              ]}>
                {formatCurrency(parseFloat(amount) || 0)}
              </Text>
              
              <Text style={[
                styles.confirmLabel,
                isDark ? styles.textSecondaryDark : styles.textSecondaryLight,
              ]}>
                using
              </Text>
              <Text style={[
                styles.confirmMethod,
                isDark ? styles.textDark : styles.textLight,
              ]}>
                {paymentMethods.find(m => m.id === selectedMethod)?.name || 'Selected method'}
              </Text>
            </View>
            
            <View style={styles.modalFooter}>
              <Button
                title="Cancel"
                onPress={() => setShowConfirmModal(false)}
                type="outline"
                style={styles.cancelButton}
              />
              <Button
                title="Confirm"
                onPress={confirmTopUp}
                loading={isLoading}
                style={styles.confirmButton}
              />
            </View>
          </View>
        </View>
      </Modal>
      
      {/* Success Modal */}
      <Modal
        visible={showSuccessModal}
        transparent={true}
        animationType="fade"
        onRequestClose={handleSuccessModalClose}
      >
        <View style={styles.modalOverlay}>
          <View style={[
            styles.modalContent,
            isDark ? styles.modalContentDark : styles.modalContentLight,
          ]}>
            <View style={styles.successIconContainer}>
              <View style={styles.successIconCircle}>
                <Check size={40} color="#FFFFFF" />
              </View>
            </View>
            
            <Text style={[
              styles.successTitle,
              isDark ? styles.textDark : styles.textLight,
            ]}>
              Top-Up Successful!
            </Text>
            
            <Text style={[
              styles.successMessage,
              isDark ? styles.textSecondaryDark : styles.textSecondaryLight,
            ]}>
              Your wallet has been topped up with {formatCurrency(parseFloat(amount) || 0)}.
            </Text>
            
            <Button
              title="Done"
              onPress={handleSuccessModalClose}
              style={styles.doneButton}
            />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  containerLight: {
    backgroundColor: '#F8FAFC',
  },
  containerDark: {
    backgroundColor: '#121212',
  },
  scrollContainer: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 24,
  },
  amountContainer: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  currencySymbol: {
    fontSize: 18,
    fontWeight: '600',
    color: '#64748B',
  },
  presetsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 12,
  },
  presetButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    margin: 4,
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
  methodsContainer: {
    marginBottom: 24,
  },
  methodCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
  },
  selectedMethodCardLight: {
    borderColor: '#0066FF',
    backgroundColor: '#F0F9FF',
  },
  selectedMethodCardDark: {
    borderColor: '#52A9FF',
    backgroundColor: 'rgba(82, 169, 255, 0.1)',
  },
  methodContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  methodIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  methodDetails: {
    flex: 1,
  },
  methodName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  methodDescription: {
    fontSize: 14,
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#E2E8F0',
  },
  radioButtonSelectedLight: {
    borderColor: '#0066FF',
  },
  radioButtonSelectedDark: {
    borderColor: '#52A9FF',
  },
  radioButtonInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#0066FF',
  },
  topUpButton: {
    marginBottom: 24,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  modalContent: {
    width: '90%',
    borderRadius: 16,
    padding: 24,
  },
  modalContentLight: {
    backgroundColor: '#FFFFFF',
  },
  modalContentDark: {
    backgroundColor: '#1E1E1E',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  closeButton: {
    padding: 4,
  },
  modalBody: {
    marginBottom: 24,
  },
  confirmLabel: {
    fontSize: 14,
    marginBottom: 4,
  },
  confirmAmount: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 16,
  },
  confirmMethod: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cancelButton: {
    flex: 1,
    marginRight: 8,
  },
  confirmButton: {
    flex: 2,
    marginLeft: 8,
  },
  successIconContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  successIconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#22C55E',
    justifyContent: 'center',
    alignItems: 'center',
  },
  successTitle: {
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 12,
  },
  successMessage: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
  },
  doneButton: {
    marginTop: 8,
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