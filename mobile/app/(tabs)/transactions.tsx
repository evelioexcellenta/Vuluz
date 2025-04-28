import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useWalletStore } from '@/store/walletStore';
import { Card } from '@/components/ui/Card';
import { formatCurrency, formatDate } from '@/utils/formatters';
import { Transaction } from '@/types';
import { Search, Filter, ArrowDown, ArrowUp } from 'lucide-react-native';

export default function TransactionsScreen() {
  const { transactions, fetchTransactions } = useWalletStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [filteredTransactions, setFilteredTransactions] = useState<
    Transaction[]
  >([]);
  const [filterVisible, setFilterVisible] = useState(false);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [filterType, setFilterType] = useState<
    'All' | 'Top Up' | 'Transfer In' | 'Transfer Out'
  >('All');

  useEffect(() => {
    fetchTransactions({
      search: searchQuery,
      sortOrder: sortOrder === 'desc' ? 'date_desc' : 'date_asc',
      transactionType: filterType === 'All' ? undefined : filterType,
    });
  }, [searchQuery, sortOrder, filterType]);

  useEffect(() => {
    filterTransactions();
  }, [searchQuery, transactions, sortOrder, filterType]);

  const filterTransactions = () => {
    let filtered = [...transactions];

    // Apply search
    if (searchQuery) {
      filtered = filtered.filter(
        (t) =>
          t.recipientName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          t.senderName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          t.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          t.amount.toString().includes(searchQuery)
      );
    }

    // Apply type filter
    if (filterType !== 'All') {
      filtered = filtered.filter((t) => t.type === filterType);
    }

    // Apply sort
    filtered.sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
    });

    setFilteredTransactions(filtered);
  };

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc');
  };

  const resetFilters = () => {
    setFilterType('All');
    setSortOrder('desc');
    setSearchQuery('');
  };

  const renderItem = ({ item }: { item: Transaction }) => {
    // const isIncoming = item.type === 'topup';

    return (
      <Card style={styles.transactionItem}>
        <View style={styles.transactionHeader}>
          <View style={styles.transactionTitleContainer}>
            <Text style={styles.transactionTitle}>
              {item.type === 'Top Up'
                ? `Top Up from ${item.senderName}`
                : item.type === 'Transfer In'
                ? `Received from ${item.senderName}`
                : `Payment to ${item.recipientName}`}
            </Text>
            <Text style={styles.transactionDate}>{formatDate(item.date)}</Text>
          </View>
          <View
            style={[
              styles.transactionStatus,
              item.amount > 0 ? styles.incomingStatus : styles.outgoingStatus,
            ]}
          >
            <Text
              style={[
                styles.transactionStatusText,
                item.amount > 0
                  ? styles.incomingStatusText
                  : styles.outgoingStatusText,
              ]}
            >
              {item.type}
            </Text>
          </View>
        </View>

        <View style={styles.transactionDetails}>
          <View>
            <Text style={styles.transactionLabel}>
              {item.type === 'Transfer Out' ? 'To' : 'From'}:
            </Text>
            <Text style={styles.transactionValue}>
              {item.type === 'Transfer Out'
                ? item.recipientName
                : item.senderName}
            </Text>
          </View>

          <View>
            <Text style={styles.amountLabel}>Amount</Text>
            <Text
              style={[
                styles.amountValue,
                item.amount > 0 ? styles.incomingAmount : styles.outgoingAmount,
              ]}
            >
              {item.amount > 0 ? '+' : '-'}
              {formatCurrency(Math.abs(item.amount))}
            </Text>
          </View>
        </View>

        {item.description && (
          <View style={styles.descriptionContainer}>
            <Text style={styles.descriptionLabel}>Description:</Text>
            <Text style={styles.descriptionValue}>{item.description}</Text>
          </View>
        )}
      </Card>
    );
  };

  const ListEmptyComponent = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>No transactions found</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Transaction History</Text>

        <View style={styles.searchContainer}>
          <Search size={20} color="#666" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search transactions..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        <View style={styles.filterContainer}>
          <TouchableOpacity
            style={styles.filterButton}
            onPress={() => setFilterVisible(!filterVisible)}
          >
            <Filter size={20} color="#666" />
            <Text style={styles.filterButtonText}>Filter</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.sortButton} onPress={toggleSortOrder}>
            {sortOrder === 'desc' ? (
              <ArrowDown size={20} color="#666" />
            ) : (
              <ArrowUp size={20} color="#666" />
            )}
            <Text style={styles.sortButtonText}>
              {sortOrder === 'desc' ? 'Newest First' : 'Oldest First'}
            </Text>
          </TouchableOpacity>
        </View>

        {filterVisible && (
          <View style={styles.filterOptions}>
            <Text style={styles.filterTitle}>Filter by type:</Text>
            <View style={styles.filterButtons}>
              <TouchableOpacity
                style={[
                  styles.typeButton,
                  filterType === 'All' && styles.activeTypeButton,
                ]}
                onPress={() => setFilterType('All')}
              >
                <Text
                  style={[
                    styles.typeButtonText,
                    filterType === 'All' && styles.activeTypeButtonText,
                  ]}
                >
                  All
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.typeButton,
                  filterType === 'Top Up' && styles.activeTypeButton,
                ]}
                onPress={() => setFilterType('Top Up')}
              >
                <Text
                  style={[
                    styles.typeButtonText,
                    filterType === 'Top Up' && styles.activeTypeButtonText,
                  ]}
                >
                  Top Up
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.typeButton,
                  filterType === 'Transfer In' && styles.activeTypeButton,
                ]}
                onPress={() => setFilterType('Transfer In')}
              >
                <Text
                  style={[
                    styles.typeButtonText,
                    filterType === 'Transfer In' && styles.activeTypeButtonText,
                  ]}
                >
                  Transfer In
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.typeButton,
                  filterType === 'Transfer Out' && styles.activeTypeButton,
                ]}
                onPress={() => setFilterType('Transfer Out')}
              >
                <Text
                  style={[
                    styles.typeButtonText,
                    filterType === 'Transfer Out' &&
                      styles.activeTypeButtonText,
                  ]}
                >
                  Transfer Out
                </Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.resetButton} onPress={resetFilters}>
              <Text style={styles.resetButtonText}>Reset Filters</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      <FlatList
        data={filteredTransactions}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={ListEmptyComponent}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F7F7FB',
    borderRadius: 12,
    paddingHorizontal: 12,
    marginBottom: 16,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  filterButtonText: {
    marginLeft: 4,
    fontSize: 14,
    color: '#666',
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sortButtonText: {
    marginLeft: 4,
    fontSize: 14,
    color: '#666',
  },
  filterOptions: {
    marginTop: 16,
    padding: 16,
    backgroundColor: '#F7F7FB',
    borderRadius: 12,
  },
  filterTitle: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 12,
  },
  filterButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap', 
    justifyContent: 'flex-start',
    gap: 8, 
  },
  typeButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    
  },
  activeTypeButton: {
    backgroundColor: '#7C5DF9',
    borderColor: '#7C5DF9',
  },
  typeButtonText: {
    fontSize: 14,
    color: '#333',
  },
  activeTypeButtonText: {
    color: '#FFFFFF',
  },
  resetButton: {
    alignSelf: 'flex-end',
  },
  resetButtonText: {
    fontSize: 14,
    color: '#7C5DF9',
    fontWeight: '500',
  },
  list: {
    padding: 16,
  },
  transactionItem: {
    marginBottom: 16,
  },
  transactionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  transactionTitleContainer: {
    flex: 1,
  },
  transactionTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  transactionDate: {
    fontSize: 12,
    color: '#666',
  },
  transactionStatus: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 8,
  },
  incomingStatus: {
    backgroundColor: 'rgba(111, 207, 151, 0.2)',
  },
  outgoingStatus: {
    backgroundColor: 'rgba(235, 87, 87, 0.2)',
  },
  transactionStatusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  incomingStatusText: {
    color: '#27AE60',
  },
  outgoingStatusText: {
    color: '#EB5757',
  },
  transactionDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  transactionLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  transactionValue: {
    fontSize: 14,
    fontWeight: '500',
  },
  amountLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
    textAlign: 'right',
  },
  amountValue: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'right',
  },
  incomingAmount: {
    color: '#27AE60',
  },
  outgoingAmount: {
    color: '#EB5757',
  },
  descriptionContainer: {
    padding: 12,
    backgroundColor: '#F7F7FB',
    borderRadius: 8,
  },
  descriptionLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  descriptionValue: {
    fontSize: 14,
  },
  emptyContainer: {
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
  },
});
