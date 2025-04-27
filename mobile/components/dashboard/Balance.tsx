import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { Card } from '@/components/ui/Card';
import { formatCurrency, formatAccountNumber } from '@/utils/formatters';
import { Copy } from 'lucide-react-native';

interface BalanceProps {
  accountNumber: string;
  balance: number;
  onCopy?: () => void;
}

export function Balance({ accountNumber, balance, onCopy }: BalanceProps) {
  return (
    <View style={styles.container}>
      <View style={styles.accountContainer}>
        <Text style={styles.accountLabel}>Account Number</Text>
        <View style={styles.accountNumberContainer}>
          <Text style={styles.accountNumber}>
            {formatAccountNumber(accountNumber)}
          </Text>
          {onCopy && (
            <TouchableOpacity onPress={onCopy} style={styles.copyButton}>
              <Copy size={16} color="#7C5DF9" />
            </TouchableOpacity>
          )}
        </View>
      </View>
      
      <Card variant="primary" style={styles.balanceCard}>
        <Text style={styles.balanceLabel}>Current Balance</Text>
        <Text style={styles.balanceAmount}>{formatCurrency(balance)}</Text>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  accountContainer: {
    backgroundColor: '#F7F7FB',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  accountLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  accountNumberContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  accountNumber: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    flex: 1,
  },
  copyButton: {
    padding: 4,
  },
  balanceCard: {
    padding: 20,
  },
  balanceLabel: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 8,
  },
  balanceAmount: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});