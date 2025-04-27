import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { formatCurrency } from '@/utils/formatters';

interface SuggestedAmountsProps {
  amounts: number[];
  onSelectAmount: (amount: number) => void;
}

export function SuggestedAmounts({ amounts, onSelectAmount }: SuggestedAmountsProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Suggested amounts</Text>
      <View style={styles.amountsContainer}>
        {amounts.map((amount, index) => (
          <TouchableOpacity
            key={index}
            style={styles.amountButton}
            onPress={() => onSelectAmount(amount)}
          >
            <Text style={styles.amountText}>{formatCurrency(amount).replace('.00', '')}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  title: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 12,
  },
  amountsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  amountButton: {
    width: '48%',
    backgroundColor: '#F7F7FB',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginBottom: 12,
    alignItems: 'center',
  },
  amountText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
});