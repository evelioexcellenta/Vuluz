import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { Card } from '@/components/ui/Card';
import { formatCurrency } from '@/utils/formatters';
import { PieChart } from 'react-native-chart-kit';
import { ArrowUp, ArrowDown, CreditCard } from 'lucide-react-native';

interface TransactionSummaryProps {
  topup: number;
  transfer: number;
  expense: number;
}

export function TransactionSummary({ topup, transfer, expense }: TransactionSummaryProps) {
  const [activeTab, setActiveTab] = useState<'weekly' | 'monthly' | 'quarterly'>('monthly');
  
  const pieData = [
    {
      name: 'Income',
      population: 40,
      color: '#7C5DF9',
      legendFontColor: '#7F7F7F',
      legendFontSize: 12,
    },
    {
      name: 'Expenses',
      population: 60,
      color: '#D6D0FB',
      legendFontColor: '#7F7F7F',
      legendFontSize: 12,
    },
  ];
  
  return (
    <Card style={styles.container}>
      <Text style={styles.title}>Transaction Summary</Text>
      
      <View style={styles.summaryContainer}>
        <View style={styles.summaryCol}>
          <View style={[styles.iconContainer, styles.topupIcon]}>
            <ArrowUp size={20} color="#6FCF97" />
          </View>
          <View style={styles.summaryTextContainer}>
            <Text style={styles.summaryLabel}>Monthly Top-ups</Text>
            <Text style={styles.summaryValue}>{formatCurrency(topup)}</Text>
          </View>
        </View>
        
        <View style={styles.summaryCol}>
          <View style={[styles.iconContainer, styles.transferIcon]}>
            <ArrowDown size={20} color="#56CCF2" />
          </View>
          <View style={styles.summaryTextContainer}>
            <Text style={styles.summaryLabel}>Monthly Transfers</Text>
            <Text style={styles.summaryValue}>{formatCurrency(transfer)}</Text>
          </View>
        </View>
        
        <View style={styles.summaryCol}>
          <View style={[styles.iconContainer, styles.expenseIcon]}>
            <CreditCard size={20} color="#EB5757" />
          </View>
          <View style={styles.summaryTextContainer}>
            <Text style={styles.summaryLabel}>Monthly Expenses</Text>
            <Text style={styles.summaryValue}>{formatCurrency(expense)}</Text>
          </View>
        </View>
      </View>
      
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'weekly' && styles.activeTab]}
          onPress={() => setActiveTab('weekly')}
        >
          <Text style={[styles.tabText, activeTab === 'weekly' && styles.activeTabText]}>
            Weekly
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'monthly' && styles.activeTab]}
          onPress={() => setActiveTab('monthly')}
        >
          <Text style={[styles.tabText, activeTab === 'monthly' && styles.activeTabText]}>
            Monthly
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'quarterly' && styles.activeTab]}
          onPress={() => setActiveTab('quarterly')}
        >
          <Text style={[styles.tabText, activeTab === 'quarterly' && styles.activeTabText]}>
            Quarterly
          </Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.chartContainer}>
        <PieChart
          data={pieData}
          width={300}
          height={180}
          chartConfig={{
            backgroundColor: '#FFFFFF',
            backgroundGradientFrom: '#FFFFFF',
            backgroundGradientTo: '#FFFFFF',
            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          }}
          accessor="population"
          backgroundColor="transparent"
          paddingLeft="15"
          absolute
        />
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  summaryContainer: {
    marginBottom: 20,
  },
  summaryCol: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  topupIcon: {
    backgroundColor: 'rgba(111, 207, 151, 0.2)',
  },
  transferIcon: {
    backgroundColor: 'rgba(86, 204, 242, 0.2)',
  },
  expenseIcon: {
    backgroundColor: 'rgba(235, 87, 87, 0.2)',
  },
  summaryTextContainer: {
    flex: 1,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  tabContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    backgroundColor: '#F7F7FB',
    borderRadius: 8,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 6,
  },
  activeTab: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  tabText: {
    fontSize: 14,
    color: '#666',
  },
  activeTabText: {
    color: '#7C5DF9',
    fontWeight: '600',
  },
  chartContainer: {
    alignItems: 'center',
  },
});