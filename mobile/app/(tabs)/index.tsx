import React, { useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '@/store/authStore';
import { useWalletStore } from '@/store/walletStore';
import { Balance } from '@/components/dashboard/Balance';
import { TransactionSummary } from '@/components/dashboard/TransactionSummary';
import { RecentTransactions } from '@/components/dashboard/RecentTransactions';
import { router } from 'expo-router';

export default function DashboardScreen() {
  const { user } = useAuthStore();
  const { balance, transactions, transactionSummary, fetchTransactions } = useWalletStore();
  
  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);
  
  const handleCopyAccountNumber = () => {
    // In a real app, this would copy to clipboard
  };
  
  const navigateToTransactions = () => {
    router.push('/(tabs)/transactions');
  };
  
  if (!user) return null;
  
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.greeting}>Welcome back, {user.name}!</Text>
          <Text style={styles.subtitle}>Here's your financial overview</Text>
        </View>
        
        <Balance
          accountNumber={user.accountNumber}
          balance={balance}
          onCopy={handleCopyAccountNumber}
        />
        
        <TransactionSummary
          topup={transactionSummary.topup}
          transfer={transactionSummary.transfer}
          expense={transactionSummary.expense}
        />
        
        <RecentTransactions
          transactions={transactions}
          onSeeAll={navigateToTransactions}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
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
  greeting: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
});