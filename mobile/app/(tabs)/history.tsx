import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TouchableOpacity, 
  TextInput, 
  ActivityIndicator, 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import TransactionList from '@/components/screens/TransactionList';
import { useWallet } from '@/hooks/useWallet';
import { useTheme } from '@/hooks/useTheme';
import { Search, Filter, Calendar } from 'lucide-react-native';
import { Transaction } from '@/contexts/WalletContext';

export default function HistoryScreen() {
  const { 
    transactions, 
    isLoading, 
    fetchTransactions, 
    searchTransactions,
    filterTransactions 
  } = useWallet();
  const { isDark } = useTheme();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<Transaction[]>([]);
  
  const [selectedFilter, setSelectedFilter] = useState<Transaction['type'] | 'all'>('all');
  const [isFiltering, setIsFiltering] = useState(false);
  const [filterResults, setFilterResults] = useState<Transaction[]>([]);
  
  const [refreshing, setRefreshing] = useState(false);
  
  // Reset search and filter when component mounts
  useEffect(() => {
    fetchTransactions();
  }, []);
  
  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setIsSearching(false);
      return;
    }
    
    setIsSearching(true);
    const results = await searchTransactions(searchQuery);
    setSearchResults(results);
  };
  
  const clearSearch = () => {
    setSearchQuery('');
    setIsSearching(false);
  };
  
  const handleFilter = async (type: Transaction['type'] | 'all') => {
    setSelectedFilter(type);
    
    if (type === 'all') {
      setIsFiltering(false);
      return;
    }
    
    setIsFiltering(true);
    const results = await filterTransactions(type);
    setFilterResults(results);
  };
  
  const onRefresh = async () => {
    setRefreshing(true);
    await fetchTransactions();
    setIsSearching(false);
    setIsFiltering(false);
    setRefreshing(false);
  };
  
  const loadMoreTransactions = () => {
    if (!isSearching && !isFiltering && !isLoading) {
      fetchTransactions(10, transactions.length);
    }
  };
  
  return (
    <SafeAreaView style={[
      styles.container,
      isDark ? styles.containerDark : styles.containerLight,
    ]}>
      <View style={styles.header}>
        <Text style={[
          styles.title,
          isDark ? styles.textDark : styles.textLight,
        ]}>
          Transaction History
        </Text>
      </View>
      
      <View style={styles.searchContainer}>
        <View style={[
          styles.searchInputContainer,
          isDark ? styles.searchInputContainerDark : styles.searchInputContainerLight,
        ]}>
          <Search size={20} color={isDark ? '#94A3B8' : '#64748B'} />
          <TextInput
            style={[
              styles.searchInput,
              isDark ? styles.searchInputDark : styles.searchInputLight,
            ]}
            placeholder="Search by name or note"
            placeholderTextColor={isDark ? '#94A3B8' : '#64748B'}
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={handleSearch}
          />
          {searchQuery ? (
            <TouchableOpacity onPress={clearSearch} style={styles.clearButton}>
              <Text style={styles.clearButtonText}>✕</Text>
            </TouchableOpacity>
          ) : null}
        </View>
      </View>
      
      <View style={styles.filtersContainer}>
        {['all', 'transfer', 'topup', 'withdraw'].map(type => (
          <TouchableOpacity
            key={type}
            style={[
              styles.filterChip,
              selectedFilter === type && (
                isDark ? styles.selectedFilterChipDark : styles.selectedFilterChipLight
              ),
            ]}
            onPress={() => handleFilter(type as Transaction['type'] | 'all')}
          >
            <Text
              style={[
                styles.filterChipText,
                selectedFilter === type && styles.selectedFilterChipText,
              ]}
            >
              {type === 'all' ? 'All' : 
               type === 'transfer' ? 'Transfers' : 
               type === 'topup' ? 'Top-ups' : 'Withdrawals'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      
      {isLoading && !refreshing ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0066FF" />
        </View>
      ) : (
        <TransactionList
          transactions={
            isSearching ? searchResults : 
            isFiltering ? filterResults : 
            transactions
          }
          isLoading={isLoading}
          onEndReached={loadMoreTransactions}
          onRefresh={onRefresh}
          isRefreshing={refreshing}
          emptyText={
            isSearching ? "No transactions match your search" : 
            isFiltering ? "No transactions of this type" : 
            "No transactions yet"
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  containerLight: {
    backgroundColor: '#F8FAFC',
  },
  containerDark: {
    backgroundColor: '#121212',
  },
  header: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
  },
  searchContainer: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 48,
  },
  searchInputContainerLight: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E2E8F0',
  },
  searchInputContainerDark: {
    backgroundColor: '#1E1E1E',
    borderColor: '#334155',
  },
  searchInput: {
    flex: 1,
    height: '100%',
    marginLeft: 8,
    fontSize: 16,
  },
  searchInputLight: {
    color: '#1E293B',
  },
  searchInputDark: {
    color: '#E2E8F0',
  },
  clearButton: {
    padding: 4,
  },
  clearButtonText: {
    fontSize: 16,
    color: '#64748B',
  },
  filtersContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    backgroundColor: '#F1F5F9',
  },
  selectedFilterChipLight: {
    backgroundColor: '#0066FF',
  },
  selectedFilterChipDark: {
    backgroundColor: '#52A9FF',
  },
  filterChipText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#64748B',
  },
  selectedFilterChipText: {
    color: '#FFFFFF',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textLight: {
    color: '#1E293B',
  },
  textDark: {
    color: '#E2E8F0',
  },
});