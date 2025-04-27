import React from 'react';
import { StyleSheet, View, Text, FlatList, TouchableOpacity } from 'react-native';
import { Card } from '@/components/ui/Card';
import { formatCurrency, formatDate } from '@/utils/formatters';
import { Transaction } from '@/types';
import { ChevronRight, ArrowUpRight, ArrowDownLeft } from 'lucide-react-native';

interface RecentTransactionsProps {
  transactions: Transaction[];
  onSeeAll?: () => void;
}

export function RecentTransactions({ transactions, onSeeAll }: RecentTransactionsProps) {
  const renderItem = ({ item }: { item: Transaction }) => {
    const isIncoming = item.type === 'topup';
    
    return (
      <View style={styles.transactionItem}>
        <View style={[styles.iconContainer, isIncoming ? styles.incomingIcon : styles.outgoingIcon]}>
          {isIncoming ? (
            <ArrowDownLeft size={20} color="#6FCF97" />
          ) : (
            <ArrowUpRight size={20} color="#EB5757" />
          )}
        </View>
        
        <View style={styles.transactionDetails}>
          <Text style={styles.transactionTitle}>
            {isIncoming ? `Payment from ${item.senderName}` : `Payment to ${item.recipientName}`}
          </Text>
          <View style={styles.transactionMeta}>
            <Text style={styles.transactionDate}>{formatDate(item.date)}</Text>
            <View style={[styles.badge, isIncoming ? styles.incomingBadge : styles.outgoingBadge]}>
              <Text style={[styles.badgeText, isIncoming ? styles.incomingBadgeText : styles.outgoingBadgeText]}>
                {item.description}
              </Text>
            </View>
          </View>
        </View>
        
        <Text style={[styles.amount, isIncoming ? styles.incomingAmount : styles.outgoingAmount]}>
          {isIncoming ? '+' : '-'}{formatCurrency(item.amount)}
        </Text>
      </View>
    );
  };
  
  return (
    <Card style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Recent Transactions</Text>
        {onSeeAll && (
          <TouchableOpacity onPress={onSeeAll} style={styles.seeAllButton}>
            <Text style={styles.seeAllText}>See All</Text>
            <ChevronRight size={16} color="#7C5DF9" />
          </TouchableOpacity>
        )}
      </View>
      
      <FlatList
        data={transactions.slice(0, 5)}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        scrollEnabled={false}
      />
    </Card>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
  },
  seeAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  seeAllText: {
    fontSize: 14,
    color: '#7C5DF9',
    marginRight: 4,
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  incomingIcon: {
    backgroundColor: 'rgba(111, 207, 151, 0.2)',
  },
  outgoingIcon: {
    backgroundColor: 'rgba(235, 87, 87, 0.2)',
  },
  transactionDetails: {
    flex: 1,
  },
  transactionTitle: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
  },
  transactionMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  transactionDate: {
    fontSize: 12,
    color: '#666',
    marginRight: 8,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  incomingBadge: {
    backgroundColor: 'rgba(111, 207, 151, 0.2)',
  },
  outgoingBadge: {
    backgroundColor: 'rgba(235, 87, 87, 0.2)',
  },
  badgeText: {
    fontSize: 10,
  },
  incomingBadgeText: {
    color: '#27AE60',
  },
  outgoingBadgeText: {
    color: '#EB5757',
  },
  amount: {
    fontSize: 14,
    fontWeight: '600',
  },
  incomingAmount: {
    color: '#27AE60',
  },
  outgoingAmount: {
    color: '#EB5757',
  },
  separator: {
    height: 1,
    backgroundColor: '#F0F0F0',
  },
});