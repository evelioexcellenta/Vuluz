import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { Card } from '@/components/ui/Card';
import { formatCurrency, formatAccountNumber } from '@/utils/formatters';
import { Eye, EyeOff, Copy } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface BalanceProps {
  accountNumber: string;
  balance: number;
  previousBalance: number;
  onCopy?: () => void;
  onToggleVisibility?: () => void;
  isBalanceVisible?: boolean;
  onTransfer?: () => void;
  onTopUp?: () => void;
}

export function Balance({
  accountNumber,
  balance,
  previousBalance,
  onCopy,
  onToggleVisibility,
  isBalanceVisible = true,
  onTransfer,
  onTopUp,
}: BalanceProps) {
  const percentChange =
    previousBalance !== 0
      ? ((balance - previousBalance) / previousBalance) * 100
      : 0;

  const formattedChange = `${percentChange.toFixed(1)}% ${
    percentChange >= 0 ? 'increase' : 'decrease'
  }`;
  const changeColor = percentChange >= 0 ? '#27AE60' : '#EB5757';

  return (
    <View style={[styles.container]}>
      <View style={[styles.accountContainer, styles.shadowProp]}>
        <Text style={styles.accountLabel}>Account Number</Text>
        <View style={styles.accountNumberContainer}>
          <Text style={styles.accountNumber}>{accountNumber}</Text>
          {onCopy && (
            <TouchableOpacity onPress={onCopy} style={styles.copyButton}>
              <Copy size={16} color="#7C5DF9" />
            </TouchableOpacity>
          )}
        </View>
      </View>
      <LinearGradient
        colors={['#7C5DF9', '#5A3EBA']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.balanceCard, styles.shadowProp]}
      >
        {/* <Card style={styles.balanceCard}> */}
          <View style={styles.balanceHeader}>
            <Text style={styles.balanceLabel}>Current Balance</Text>
            {onToggleVisibility && (
              <TouchableOpacity onPress={onToggleVisibility}>
                {isBalanceVisible ? (
                  <EyeOff size={20} color="#FFF" />
                ) : (
                  <Eye size={20} color="#FFF" />
                )}
              </TouchableOpacity>
            )}
          </View>

          <Text style={styles.balanceAmount}>
            {isBalanceVisible ? formatCurrency(balance) : '••••••'}
          </Text>

          {/* <Text style={[styles.balanceChange, { color: changeColor }]}>
          {formattedChange} this month
        </Text> */}

          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.actionButton} onPress={onTransfer}>
              <Text style={styles.buttonText}>Transfer</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton} onPress={onTopUp}>
              <Text style={styles.buttonText}>Top Up</Text>
            </TouchableOpacity>
          </View>
        {/* </Card> */}
      </LinearGradient>
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
    backgroundColor: '#7C5DF9',
    padding: 20,
    borderRadius: 12, // ➔ supaya ujungnya tetap rounded
  overflow: 'hidden',
  },
  balanceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  balanceLabel: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  balanceAmount: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  balanceChange: {
    fontSize: 12,
    marginTop: 6,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 10,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: '#FFFFFF',
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  shadowProp: {
    shadowColor: '#171717',
    shadowOffset: {width: -2, height: 4},
    shadowOpacity: 0.2,
    shadowRadius: 10,
  },
});
