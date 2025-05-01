import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ArrowUp, ArrowDown, CreditCard } from 'lucide-react-native';
import { formatCurrency } from '@/utils/formatters';
import Svg, { Circle, G } from 'react-native-svg';
import { useWallet } from '@/hooks/useWallet';
import { black } from 'react-native-paper/lib/typescript/styles/themes/v2/colors';

interface TransactionSummaryProps {
  topup: number;
  transfer: number;
  netSaving: number;
}

export function TransactionSummary({
  topup,
  transfer,
  netSaving,
}: TransactionSummaryProps) {
  const total = topup + transfer;
  const incomePercentage = total === 0 ? 0 : (topup / total) * 100;
  const expensePercentage = 100 - incomePercentage;

  const size = 120;
  const strokeWidth = 14;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const incomeStrokeDashoffset = circumference * (1 - incomePercentage / 100);

  const netSavingColor = netSaving > 0 ? '#4CAF50' : '#EB5757';

  return (
    <View style={[styles.card, styles.shadowProp]}>
      <Text style={styles.title}>Transaction Summary</Text>

      <View style={styles.row}>
        <View style={styles.leftCol}>
          <View style={styles.rowItem}>
            <View
              style={[
                styles.iconCircle,
                { backgroundColor: 'rgba(111, 207, 151, 0.2)' },
              ]}
            >
              <ArrowUp color="#6FCF97" size={20} />
            </View>
            <View>
              <Text style={styles.label}>Monthly Top-ups</Text>
              <Text style={styles.value}>{formatCurrency(topup)}</Text>
            </View>
          </View>

          <View style={styles.rowItem}>
            <View
              style={[
                styles.iconCircle,
                { backgroundColor:  'rgba(235, 87, 87, 0.2)' },
              ]}
            >
              <ArrowDown color="#EB5757" size={20} />
            </View>
            <View>
              <Text style={styles.label}>Monthly Transfers</Text>
              <Text style={styles.value}>{formatCurrency(transfer)}</Text>
            </View>
          </View>
        </View>

        <View style={styles.rightCol}>
          <Svg width={size} height={size}>
            <G rotation="-90" origin={`${size / 2}, ${size / 2}`}>
              <Circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                stroke="#E0E0E0"
                strokeWidth={strokeWidth}
                fill="transparent"
              />
              <Circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                stroke="#7C5DF9"
                strokeWidth={strokeWidth}
                strokeDasharray={`${circumference} ${circumference}`}
                strokeDashoffset={incomeStrokeDashoffset}
                strokeLinecap="round"
                fill="transparent"
              />
            </G>
          </Svg>
          <View style={styles.chartLabels}>
            <Text style={styles.chartText}>
              {Math.round(incomePercentage)}%
            </Text>
            <Text style={styles.chartLabel}>Income</Text>
            <Text style={styles.chartTextSmall}>
              {Math.round(expensePercentage)}%
            </Text>
            <Text style={styles.chartLabel}>Expenses</Text>
          </View>
        </View>
      </View>

      <View style={styles.expenseRow}>
        <View
          style={[
            styles.iconCircle,
            {
              backgroundColor:'rgba(86, 204, 242, 0.2)'
            },
          ]}
        >
          <CreditCard color={'#56CCF2'} size={20} />
        </View>
        <View>
          <Text style={styles.label}>Monthly netSaving</Text>
          <Text style={[styles.value, { color: netSavingColor }]}>
            {formatCurrency(netSaving)}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  shadowProp: {
    shadowColor: '#171717',
    shadowOffset: { width: -2, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  leftCol: {
    flex: 1,
    justifyContent: 'space-between',
  },
  rightCol: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
      
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  label: {
    fontSize: 14,
    color: '#666',
  },
  value: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  chartLabels: {
    position: 'absolute',
    alignItems: 'center',
  },
  chartText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#7C5DF9',
  },
  chartTextSmall: {
    fontSize: 14,
    fontWeight: '600',
    color: '#999',
    marginTop: 4,
  },
  chartLabel: {
    fontSize: 12,
    color: '#999',
  },
  expenseRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    justifyContent:'center',
    borderWidth: 2,
    padding:2,
    borderColor: '#E0E0E0',
    borderRadius: 8,
  },
});
