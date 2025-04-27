import { useState } from 'react';
import { useWalletStore } from '@/store/walletStore';
import axios from 'axios'; 
import { useAuthStore } from '@/store/authStore';

export function useWallet() {
  const {
    balance,
    transactions,
    recipients,
    paymentMethods,
    transactionSummary,
    isLoading,
    error,
    fetchTransactions,
    fetchRecipients,
    fetchPaymentMethods,
    topUp,
    transfer,
    addFavorite,
    removeFavorite
  } = useWalletStore();
  
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');
  const [recipientAccount, setRecipientAccount] = useState('');
  const [recipientName, setRecipientName] = useState('');
  const [selectedRecipient, setSelectedRecipient] = useState<string | null>(null);
  
  const handleTopUp = async (pin: string) => {
    if (!amount || !selectedPaymentMethod || !pin) return false;
  
    const amountValue = parseFloat(amount.replace(/[^0-9]/g, ''));
    if (isNaN(amountValue) || amountValue <= 0) return false;
  
    const success = await topUp(amountValue, selectedPaymentMethod, pin, description);
    if (success) {
      resetForm();
    }
    return success;
  };
  
  
  const handleTransfer = async () => {
    if ((!recipientAccount && !selectedRecipient) || !amount) return false;
    
    const amountValue = parseFloat(amount.replace(/[^0-9]/g, ''));
    if (isNaN(amountValue) || amountValue <= 0) return false;
    
    const account = selectedRecipient || recipientAccount;
    const success = await transfer(account, amountValue, description);
    if (success) {
      resetForm();
    }
    return success;
  };
  
  const handleAddFavorite = async () => {
    if (!recipientName || !recipientAccount) return false;
    
    const success = await addFavorite(recipientName, recipientAccount);
    if (success) {
      setRecipientName('');
      setRecipientAccount('');
    }
    return success;
  };

  const handleCheckRecipient = async () => {
    try {
      const token = useAuthStore.getState().getAccessToken(); // ambil token JWT kamu
  
      const response = await axios.get(`http://localhost:8080/api/wallet/owner/${recipientAccount}`, {
        headers: {
          Authorization: `Bearer ${token}`, // kirim token di headers!
        },
      });
  
      setRecipientName(response.data.fullName);
    } catch (error) {
      console.error(error);
      setRecipientName('User not found');
    }
  };
  
  
  const resetForm = () => {
    setAmount('');
    setDescription('');
    setSelectedPaymentMethod('');
    setRecipientAccount('');
    setRecipientName('');
    setSelectedRecipient(null);
  };
  
  return {
    balance,
    transactions,
    recipients,
    paymentMethods,
    transactionSummary,
    isLoading,
    error,
    amount,
    setAmount,
    description,
    setDescription,
    selectedPaymentMethod,
    setSelectedPaymentMethod,
    recipientAccount,
    setRecipientAccount,
    recipientName,
    setRecipientName,
    selectedRecipient,
    setSelectedRecipient,
    fetchTransactions,
    fetchRecipients,
    fetchPaymentMethods,
    handleTopUp,
    handleTransfer,
    handleAddFavorite,
    removeFavorite,
    resetForm,
    handleCheckRecipient,
  };
}