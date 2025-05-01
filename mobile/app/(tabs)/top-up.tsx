import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useWallet } from '@/hooks/useWallet';
import { SuggestedAmounts } from '@/components/topup/SuggestedAmounts';
import { TextInput } from '@/components/ui/TextInput';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { formatCurrency } from '@/utils/formatters';
import { ChevronDown } from 'lucide-react-native';
import { PinInput } from '@/components/ui/PinInput';
import Toast from 'react-native-toast-message';

export default function TopUpScreen() {
  const {
    amount,
    setAmount,
    description,
    setDescription,
    selectedPaymentMethod,
    setSelectedPaymentMethod,
    paymentMethods,
    fetchPaymentMethods,
    handleTopUp,
    isLoading,
    error,
    resetForm,
  } = useWallet();

  const [confirmModalVisible, setConfirmModalVisible] = useState(false);
  const [successModalVisible, setSuccessModalVisible] = useState(false);
  const [paymentMethodsModalVisible, setPaymentMethodsModalVisible] =
    useState(false);
  const [pinModalVisible, setPinModalVisible] = useState(false);
  const [pin, setPin] = useState(''); // state untuk menyimpan input pin
  const [successAmount, setSuccessAmount] = useState('');
  const [successPaymentMethod, setSuccessPaymentMethod] = useState('');
  const [amountError, setAmountError] = useState('');

  useEffect(() => {
    fetchPaymentMethods();
  }, [fetchPaymentMethods]);

  const suggestedAmounts = [50000, 100000, 200000, 500000];

  const handleAmountSelect = (selectedAmount: number) => {
    setAmount(selectedAmount.toString());
  };

  const handleContinue = () => {
    if (!validateAmount()) {
      Toast.show({
        type: 'error',
        text1: 'Invalid Amount',
        text2: amountError,
      });
      return;
    }
    setConfirmModalVisible(true);
    
  };

  // const handleConfirmTopUp = async () => {
  //   const success = await handleTopUp();
  //   setConfirmModalVisible(false);
  //   if (success) {
  //     setSuccessModalVisible(true);
  //   }
  // };

  const handleDone = () => {
    setSuccessModalVisible(false);
    // resetForm(); // baru reset setelah user klik Done
  };

  const handleSelectPaymentMethod = (id: string) => {
    setSelectedPaymentMethod(id);
    setPaymentMethodsModalVisible(false);
  };

  const getSelectedPaymentMethodName = () => {
    const method = paymentMethods.find((pm) => pm.id === selectedPaymentMethod);
    return method ? method.name : 'Select Payment Method';
  };

  const handleConfirmTopUp = async () => {
    setConfirmModalVisible(false);
    setPinModalVisible(true); // Buka modal pin

    // Ketika pin sudah masuk dan valid:
    const success = await handleTopUp(pin);

    if (success) {
      setSuccessAmount(amount);
      setSuccessPaymentMethod(getSelectedPaymentMethodName());
      setSuccessModalVisible(true);
      resetForm();
    }
  };

  // lalu setelah user input pin dan sukses:
  const handleSubmitPin = async () => {
    const success = await handleTopUp(pin); // cukup pin aja, pakai selectedPaymentMethod dari store

    if (success) {
      const methodName = getSelectedPaymentMethodName(); // methodName ini hanya untuk tampil di success modal
      setSuccessAmount(amount);
      setSuccessPaymentMethod(methodName);
      setSuccessModalVisible(true);
      resetForm();
    }
    setPinModalVisible(false);
  };

  const validateAmount = () => {
    const numeric = parseInt(amount.replace(/[^0-9]/g, ''), 10);

    if (isNaN(numeric)) {
      setAmountError('Amount must be a number');
      return false;
    }

    if (numeric < 10000) {
      setAmountError('Minimum top-up is Rp 10.000');
      return false;
    }

    setAmountError('');
    return true;
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Add Money</Text>
          <Text style={styles.subtitle}>Top up your account balance</Text>
        </View>

        <SuggestedAmounts
          amounts={suggestedAmounts}
          onSelectAmount={handleAmountSelect}
        />

        <View style={styles.form}>
          <TextInput
            label="Amount"
            value={amount}
            onChangeText={setAmount}
            placeholder="0"
            keyboardType="numeric"
          />
          {amountError ? (
            <Text style={{ color: 'red', marginBottom:8 }}>{amountError}</Text>
          ) : null}

          <View style={styles.formGroup}>
            <Text style={styles.label}>Payment Method</Text>
            <TouchableOpacity
              style={styles.dropdown}
              onPress={() => setPaymentMethodsModalVisible(true)}
            >
              <Text style={styles.dropdownText}>
                {getSelectedPaymentMethodName()}
              </Text>
              <ChevronDown size={20} color="#666" />
            </TouchableOpacity>
          </View>

          <TextInput
            label="Description"
            value={description}
            onChangeText={setDescription}
            placeholder="Add a note for your records"
            multiline
            numberOfLines={3}
          />

          <Button
            title="Continue"
            onPress={handleContinue}
            style={styles.button}
            disabled={!amount || !selectedPaymentMethod}
          />
        </View>
      </ScrollView>

      {/* Confirm Top Up Modal */}
      <Modal
        visible={confirmModalVisible}
        onClose={() => setConfirmModalVisible(false)}
        title="Confirm Top Up"
        primaryButton={{
          title: 'Confirm Top Up',
          onPress: handleConfirmTopUp,
          loading: isLoading,
        }}
        secondaryButton={{
          title: 'Cancel',
          onPress: () => setConfirmModalVisible(false),
        }}
      >
        <View style={styles.modalContent}>
          <Text style={styles.modalText}>
            You are about to top up your account with:
          </Text>

          <View style={styles.modalItem}>
            <Text style={styles.modalLabel}>Amount:</Text>
            <Text style={styles.modalValue}>
              {formatCurrency(Number(amount) || 0)}
            </Text>
          </View>

          <View style={styles.modalItem}>
            <Text style={styles.modalLabel}>Payment Method:</Text>
            <Text style={styles.modalValue}>
              {getSelectedPaymentMethodName()}
            </Text>
          </View>

          <Text style={styles.modalFooter}>
            Please verify the information before proceeding.
          </Text>
        </View>
      </Modal>

      {/* Success Modal */}
      <Modal
        visible={successModalVisible}
        onClose={handleDone}
        title=""
        primaryButton={{
          title: 'Done',
          onPress: handleDone,
        }}
      >
        <View style={{ alignItems: 'center', paddingVertical: 20 }}>
          <View
            style={{
              backgroundColor: '#4CAF50',
              padding: 10,
              marginBottom: 16,
              width: 64,
              height: 64,
              borderRadius: 32, // setengah dari width/height supaya bulat
              alignItems: 'center',
              // resizeMode: 'contain', // Removed as it is not valid for View
            }}
          >
            <Text style={{ fontSize: 32, color: 'white' }}>✓</Text>
          </View>
          <Text style={{ fontSize: 20, fontWeight: '700', marginBottom: 16 }}>
            Top Up Successful
          </Text>

          <View style={{ width: '100%', marginBottom: 24 }}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginBottom: 12,
              }}
            >
              <Text style={{ fontSize: 16, color: '#666' }}>Amount:</Text>
              <Text style={{ fontSize: 16, fontWeight: '600' }}>
                {formatCurrency(Number(successAmount) || 0)}
              </Text>
            </View>
            <View
              style={{ flexDirection: 'row', justifyContent: 'space-between' }}
            >
              <Text style={{ fontSize: 16, color: '#666' }}>
                Payment Method:
              </Text>
              <Text style={{ fontSize: 16, fontWeight: '600' }}>
                {successPaymentMethod}
              </Text>
            </View>
          </View>
        </View>
      </Modal>

      {/* Payment Methods Modal */}
      <Modal
        visible={paymentMethodsModalVisible}
        onClose={() => setPaymentMethodsModalVisible(false)}
        title="Select Payment Method"
      >
        <View style={styles.paymentMethodsList}>
          {paymentMethods.map((method) => (
            <TouchableOpacity
              key={method.id}
              style={styles.paymentMethodItem}
              onPress={() => handleSelectPaymentMethod(method.id)}
            >
              <Text style={styles.paymentMethodName}>{method.name}</Text>
              {method.last4 && (
                <Text style={styles.paymentMethodDetail}>
                  •••• {method.last4}
                </Text>
              )}
            </TouchableOpacity>
          ))}
        </View>
      </Modal>

      <Modal
        visible={pinModalVisible}
        onClose={() => setPinModalVisible(false)}
        title="Enter PIN"
        primaryButton={{
          title: 'Confirm',
          onPress: handleSubmitPin,
          loading: isLoading,
        }}
      >
        <PinInput pin={pin} setPin={setPin} />
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFBFD',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  form: {
    marginTop: 12,
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
    color: '#333',
  },
  dropdown: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  dropdownText: {
    fontSize: 16,
    color: '#333',
  },
  button: {
    marginTop: 24,
  },
  modalContent: {
    paddingVertical: 8,
  },
  modalText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 16,
  },
  modalItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  modalLabel: {
    fontSize: 14,
    color: '#666',
  },
  modalValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  modalFooter: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
    marginTop: 16,
  },
  paymentMethodsList: {
    marginTop: 8,
  },
  paymentMethodItem: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  paymentMethodName: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  paymentMethodDetail: {
    fontSize: 14,
    color: '#666',
  },
  shadowProp: {
    shadowColor: '#171717',
    shadowOffset: { width: -2, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
  },
});
