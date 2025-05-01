import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '@/store/authStore';
import { useWalletStore } from '@/store/walletStore';
import { Balance } from '@/components/dashboard/Balance';
import { TransactionSummary } from '@/components/dashboard/TransactionSummary';
import { RecentTransactions } from '@/components/dashboard/RecentTransactions';
import { router } from 'expo-router';
import { useWallet } from '@/hooks/useWallet';
// import { TransactionPieChart } from '@/components/dashboard/TransactionPieChart';

export default function DashboardScreen() {
  const { user } = useAuthStore();
  const {
    balance,
    walletNumber,
    transactions,
    transactionSummary,
    fetchTransactions,
    fetchBalance,
    fetchTransactionSummary
  } = useWalletStore();

  const [isVisible, setIsVisible] = useState(true);
  useEffect(() => {
    fetchTransactions();
    fetchBalance();
    fetchTransactionSummary();
  }, [fetchTransactions, fetchBalance,fetchTransactionSummary]);

  const handleCopyAccountNumber = () => {
    // In a real app, this would copy to clipboard
  };
  const previousBalance = balance - transactionSummary.netSaving;

  const navigateToTransactions = () => {
    router.push('/(tabs)/transactions');
  };

  if (!user) return null;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.header}>
          <Text style={styles.greeting}>Welcome back, {user.name}!</Text>
          <Text style={styles.subtitle}>Here's your financial overview</Text>
        </View>

        <Balance
          accountNumber={walletNumber}
          balance={balance}
          previousBalance={previousBalance}
          isBalanceVisible={isVisible}
          onToggleVisibility={() => setIsVisible(!isVisible)}
          onCopy={handleCopyAccountNumber}
          onTransfer={() => router.push('/(tabs)/transfer')}
          onTopUp={() => router.push('/(tabs)/top-up')}
        />

        <TransactionSummary
          topup={transactionSummary.topup}
          transfer={transactionSummary.transfer}
          netSaving={transactionSummary.netSaving}
        />
        {/* <PieChartWithFilter /> */}

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
