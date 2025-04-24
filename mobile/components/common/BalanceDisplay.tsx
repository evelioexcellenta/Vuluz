import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Animated } from 'react-native';
import { Eye, EyeOff } from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';

interface BalanceDisplayProps {
  amount: number;
  isHidden: boolean;
  onToggleVisibility: () => void;
  style?: any;
  labelStyle?: any;
  amountStyle?: any;
}

export default function BalanceDisplay({
  amount,
  isHidden,
  onToggleVisibility,
  style,
  labelStyle,
  amountStyle,
}: BalanceDisplayProps) {
  const { isDark } = useTheme();
  
  // Format currency
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  });
  
  return (
    <View style={[styles.container, style]}>
      <Text style={[
        styles.label,
        isDark ? styles.labelDark : styles.labelLight,
        labelStyle,
      ]}>
        Available Balance
      </Text>
      
      <View style={styles.balanceRow}>
        <Text style={[
          styles.amount,
          isDark ? styles.amountDark : styles.amountLight,
          amountStyle,
        ]}>
          {isHidden ? '••••••' : formatter.format(amount)}
        </Text>
        
        <TouchableOpacity 
          onPress={onToggleVisibility}
          style={styles.visibilityButton}
        >
          {isHidden ? (
            <Eye size={20} color={isDark ? '#94A3B8' : '#64748B'} />
          ) : (
            <EyeOff size={20} color={isDark ? '#94A3B8' : '#64748B'} />
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  label: {
    fontSize: 14,
    marginBottom: 8,
  },
  labelLight: {
    color: '#64748B',
  },
  labelDark: {
    color: '#94A3B8',
  },
  balanceRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  amount: {
    fontSize: 28,
    fontWeight: '700',
    flex: 1,
  },
  amountLight: {
    color: '#1E293B',
  },
  amountDark: {
    color: '#E2E8F0',
  },
  visibilityButton: {
    padding: 8,
  },
});