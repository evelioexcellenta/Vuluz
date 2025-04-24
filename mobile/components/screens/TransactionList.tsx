import React from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  FlatList, 
  TouchableOpacity, 
  ActivityIndicator 
} from 'react-native';
import { ArrowUpRight, ArrowDownLeft, CreditCard } from 'lucide-react-native';
import { formatCurrency, formatRelativeTime } from '@/utils/formatters';
import { Transaction } from '@/contexts/WalletContext';
import { useTheme } from '@/hooks/useTheme';

interface TransactionListProps {
  transactions: Transaction[];
  isLoading: boolean;
  onEndReached?: () => void;
  onRefresh?: () => void;
  isRefreshing?: boolean;
  onTransactionPress?: (transaction: Transaction) => void;
  emptyText?: string;
}

export default function TransactionList({
  transactions,
  isLoading,
  onEndReached,
  onRefresh,
  isRefreshing = false,
  onTransactionPress,
  emptyText = 'No transactions yet',
}: TransactionListProps) {
  const { isDark } = useTheme();
  
  const renderTransactionIcon = (type: Transaction['type']) => {
    switch (type) {
      case 'transfer':
        return (
          <View style={[
            styles.iconContainer, 
            styles.transferIcon,
            isDark ? styles.transferIconDark : styles.transferIconLight,
          ]}>
            <ArrowUpRight size={20} color={isDark ? '#000000' : '#FFFFFF'} />
          </View>
        );
      case 'topup':
        return (
          <View style={[
            styles.iconContainer, 
            styles.topupIcon,
            isDark ? styles.topupIconDark : styles.topupIconLight,
          ]}>
            <ArrowDownLeft size={20} color={isDark ? '#000000' : '#FFFFFF'} />
          </View>
        );
      case 'withdraw':
        return (
          <View style={[
            styles.iconContainer, 
            styles.withdrawIcon,
            isDark ? styles.withdrawIconDark : styles.withdrawIconLight,
          ]}>
            <CreditCard size={20} color={isDark ? '#000000' : '#FFFFFF'} />
          </View>
        );
      default:
        return null;
    }
  };
  
  const renderItem = ({ item }: { item: Transaction }) => {
    // Determine if user is sender or recipient to show correct name
    const isOutgoing = item.type === 'withdraw' || (item.type === 'transfer' && item.senderId === '1');
    const displayName = isOutgoing 
      ? item.recipientName || 'Unknown' 
      : item.senderName || 'System';
      
    const displayNote = item.type === 'topup' 
      ? item.note || 'Wallet top-up'
      : item.note || (isOutgoing ? 'Money sent' : 'Money received');
    
    return (
      <TouchableOpacity
        style={[
          styles.transactionItem,
          isDark ? styles.transactionItemDark : styles.transactionItemLight,
        ]}
        onPress={() => onTransactionPress?.(item)}
        activeOpacity={0.7}
      >
        {renderTransactionIcon(item.type)}
        
        <View style={styles.transactionDetails}>
          <Text 
            style={[
              styles.transactionName,
              isDark ? styles.textDark : styles.textLight,
            ]} 
            numberOfLines={1}
          >
            {displayName}
          </Text>
          
          <Text 
            style={[
              styles.transactionNote,
              isDark ? styles.textSecondaryDark : styles.textSecondaryLight,
            ]} 
            numberOfLines={1}
          >
            {displayNote}
          </Text>
        </View>
        
        <View style={styles.transactionAmountContainer}>
          <Text 
            style={[
              styles.transactionAmount,
              isOutgoing ? styles.amountNegative : styles.amountPositive,
            ]}
          >
            {isOutgoing ? '-' : '+'}{formatCurrency(item.amount)}
          </Text>
          
          <Text 
            style={[
              styles.transactionTime,
              isDark ? styles.textSecondaryDark : styles.textSecondaryLight,
            ]}
          >
            {formatRelativeTime(item.createdAt)}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };
  
  const renderFooter = () => {
    if (!isLoading) return null;
    
    return (
      <View style={styles.footer}>
        <ActivityIndicator size="small" color="#0066FF" />
      </View>
    );
  };
  
  const renderEmpty = () => {
    if (isLoading) return null;
    
    return (
      <View style={styles.emptyContainer}>
        <Text 
          style={[
            styles.emptyText,
            isDark ? styles.textSecondaryDark : styles.textSecondaryLight,
          ]}
        >
          {emptyText}
        </Text>
      </View>
    );
  };
  
  return (
    <FlatList
      data={transactions}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
      contentContainerStyle={[
        styles.listContainer,
        transactions.length === 0 && styles.emptyListContainer,
      ]}
      ListFooterComponent={renderFooter}
      ListEmptyComponent={renderEmpty}
      onEndReached={onEndReached}
      onEndReachedThreshold={0.5}
      refreshing={isRefreshing}
      onRefresh={onRefresh}
    />
  );
}

const styles = StyleSheet.create({
  listContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  emptyListContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  transactionItemLight: {
    borderBottomColor: '#E2E8F0',
  },
  transactionItemDark: {
    borderBottomColor: '#334155',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  transferIcon: {
    backgroundColor: '#0066FF',
  },
  transferIconLight: {
    backgroundColor: '#0066FF',
  },
  transferIconDark: {
    backgroundColor: '#52A9FF',
  },
  topupIcon: {
    backgroundColor: '#22C55E',
  },
  topupIconLight: {
    backgroundColor: '#22C55E',
  },
  topupIconDark: {
    backgroundColor: '#4ADE80',
  },
  withdrawIcon: {
    backgroundColor: '#EF4444',
  },
  withdrawIconLight: {
    backgroundColor: '#EF4444',
  },
  withdrawIconDark: {
    backgroundColor: '#F87171',
  },
  transactionDetails: {
    flex: 1,
  },
  transactionName: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  transactionNote: {
    fontSize: 14,
  },
  transactionAmountContainer: {
    alignItems: 'flex-end',
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  amountPositive: {
    color: '#22C55E',
  },
  amountNegative: {
    color: '#EF4444',
  },
  transactionTime: {
    fontSize: 12,
  },
  textLight: {
    color: '#1E293B',
  },
  textDark: {
    color: '#E2E8F0',
  },
  textSecondaryLight: {
    color: '#64748B',
  },
  textSecondaryDark: {
    color: '#94A3B8',
  },
  footer: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 32,
  },
  emptyText: {
    fontSize: 16,
  },
});