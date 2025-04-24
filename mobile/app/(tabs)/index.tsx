import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  RefreshControl, 
  Image, 
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Card from '@/components/common/Card';
import BalanceDisplay from '@/components/common/BalanceDisplay';
import TransactionList from '@/components/screens/TransactionList';
import { useWallet } from '@/hooks/useWallet';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/hooks/useTheme';
import { formatCurrency } from '@/utils/formatters';
import { 
  Sun, 
  Moon, 
  ArrowUpRight, 
  Banknote, 
  CreditCard, 
  QrCode,
  Wallet,
  TrendingUp, 
  TrendingDown,
  Plus,
} from 'lucide-react-native';
import { router } from 'expo-router';

export default function DashboardScreen() {
  const { user } = useAuth();
  const { 
    balance, 
    isBalanceHidden, 
    toggleBalanceVisibility, 
    transactions, 
    isLoading, 
    fetchTransactions,
    monthlyStats,
  } = useWallet();
  const { theme, toggleTheme, isDark } = useTheme();
  
  const [refreshing, setRefreshing] = useState(false);
  
  // Screen width for responsive sizing
  const screenWidth = Dimensions.get('window').width;
  
  const onRefresh = async () => {
    setRefreshing(true);
    await fetchTransactions();
    setRefreshing(false);
  };
  
  useEffect(() => {
    fetchTransactions();
  }, []);
  
  const navigateToTransfer = () => {
    router.push('/transfer');
  };
  
  const navigateToTopUp = () => {
    router.push('/topup');
  };
  
  const navigateToHistory = () => {
    router.push('/history');
  };
  
  const navigateToProfile = () => {
    router.push('/profile');
  };
  
  return (
    <SafeAreaView style={[
      styles.container,
      isDark ? styles.containerDark : styles.containerLight,
    ]}>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeftContent}>
            <TouchableOpacity 
              style={styles.userInfoContainer}
              onPress={navigateToProfile}
            >
              <Image
                source={{ uri: 'https://randomuser.me/api/portraits/men/1.jpg' }}
                style={styles.userAvatar}
              />
              <View>
                <Text style={[
                  styles.welcomeText,
                  isDark ? styles.textSecondaryDark : styles.textSecondaryLight,
                ]}>
                  Welcome back
                </Text>
                <Text style={[
                  styles.userName,
                  isDark ? styles.textDark : styles.textLight,
                ]}>
                  {user?.fullName || 'User'}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
          
          <TouchableOpacity 
            style={[
              styles.themeToggle,
              isDark ? styles.themeToggleDark : styles.themeToggleLight,
            ]}
            onPress={toggleTheme}
          >
            {isDark ? (
              <Sun size={20} color="#E2E8F0" />
            ) : (
              <Moon size={20} color="#1E293B" />
            )}
          </TouchableOpacity>
        </View>
        
        {/* Balance Card */}
        <Card style={styles.balanceCard}>
          <BalanceDisplay
            amount={balance}
            isHidden={isBalanceHidden}
            onToggleVisibility={toggleBalanceVisibility}
          />
          
          <View style={styles.quickActionsContainer}>
            <TouchableOpacity 
              style={[
                styles.quickActionButton,
                isDark ? styles.quickActionButtonDark : styles.quickActionButtonLight,
              ]}
              onPress={navigateToTransfer}
            >
              <View style={[
                styles.quickActionIcon,
                styles.sendIcon,
              ]}>
                <ArrowUpRight size={20} color="#FFFFFF" />
              </View>
              <Text style={[
                styles.quickActionText,
                isDark ? styles.textDark : styles.textLight,
              ]}>
                Send
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[
                styles.quickActionButton,
                isDark ? styles.quickActionButtonDark : styles.quickActionButtonLight,
              ]}
              onPress={navigateToTopUp}
            >
              <View style={[
                styles.quickActionIcon,
                styles.topUpIcon,
              ]}>
                <Banknote size={20} color="#FFFFFF" />
              </View>
              <Text style={[
                styles.quickActionText,
                isDark ? styles.textDark : styles.textLight,
              ]}>
                Top Up
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[
                styles.quickActionButton,
                isDark ? styles.quickActionButtonDark : styles.quickActionButtonLight,
              ]}
            >
              <View style={[
                styles.quickActionIcon,
                styles.billsIcon,
              ]}>
                <CreditCard size={20} color="#FFFFFF" />
              </View>
              <Text style={[
                styles.quickActionText,
                isDark ? styles.textDark : styles.textLight,
              ]}>
                Bills
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[
                styles.quickActionButton,
                isDark ? styles.quickActionButtonDark : styles.quickActionButtonLight,
              ]}
            >
              <View style={[
                styles.quickActionIcon,
                styles.scanIcon,
              ]}>
                <QrCode size={20} color="#FFFFFF" />
              </View>
              <Text style={[
                styles.quickActionText,
                isDark ? styles.textDark : styles.textLight,
              ]}>
                Scan
              </Text>
            </TouchableOpacity>
          </View>
        </Card>
        
        {/* Monthly Stats */}
        <View style={styles.statsContainer}>
          <Text style={[
            styles.sectionTitle,
            isDark ? styles.textDark : styles.textLight,
          ]}>
            Monthly Statistics
          </Text>
          
          <View style={styles.statsCardsContainer}>
            <Card style={[styles.statsCard, { width: screenWidth / 2 - 24 }]}>
              <View style={styles.statsIconContainer}>
                <View style={[
                  styles.statsIcon,
                  styles.incomeIcon,
                ]}>
                  <TrendingUp size={18} color="#FFFFFF" />
                </View>
                <Text style={[
                  styles.statsLabel,
                  isDark ? styles.textSecondaryDark : styles.textSecondaryLight,
                ]}>
                  Income
                </Text>
              </View>
              <Text style={[
                styles.statsValue,
                isDark ? styles.textDark : styles.textLight,
              ]}>
                {formatCurrency(monthlyStats.income)}
              </Text>
            </Card>
            
            <Card style={[styles.statsCard, { width: screenWidth / 2 - 24 }]}>
              <View style={styles.statsIconContainer}>
                <View style={[
                  styles.statsIcon,
                  styles.expensesIcon,
                ]}>
                  <TrendingDown size={18} color="#FFFFFF" />
                </View>
                <Text style={[
                  styles.statsLabel,
                  isDark ? styles.textSecondaryDark : styles.textSecondaryLight,
                ]}>
                  Expenses
                </Text>
              </View>
              <Text style={[
                styles.statsValue,
                isDark ? styles.textDark : styles.textLight,
              ]}>
                {formatCurrency(monthlyStats.expenses)}
              </Text>
            </Card>
          </View>
          
          <Card style={styles.savingsCard}>
            <View style={styles.savingsContent}>
              <View>
                <Text style={[
                  styles.savingsLabel,
                  isDark ? styles.textSecondaryDark : styles.textSecondaryLight,
                ]}>
                  This Month You've Saved
                </Text>
                <Text style={[
                  styles.savingsValue,
                  isDark ? styles.textDark : styles.textLight,
                ]}>
                  {formatCurrency(monthlyStats.saved)}
                </Text>
              </View>
              <View style={[
                styles.savingsIcon,
                styles.walletIcon,
              ]}>
                <Wallet size={24} color="#FFFFFF" />
              </View>
            </View>
          </Card>
        </View>
        
        {/* Recent Transactions */}
        <View style={styles.recentTransactionsContainer}>
          <View style={styles.sectionHeaderContainer}>
            <Text style={[
              styles.sectionTitle,
              isDark ? styles.textDark : styles.textLight,
            ]}>
              Recent Transactions
            </Text>
            <TouchableOpacity onPress={navigateToHistory}>
              <Text style={[
                styles.viewAllButton,
                isDark ? styles.linkDark : styles.linkLight,
              ]}>
                View All
              </Text>
            </TouchableOpacity>
          </View>
          
          <TransactionList
            transactions={transactions.slice(0, 5)}
            isLoading={isLoading}
            onTransactionPress={() => navigateToHistory()}
          />
        </View>
      </ScrollView>
      
      {/* Floating Add Button */}
      <TouchableOpacity 
        style={[
          styles.floatingButton,
          isDark ? styles.floatingButtonDark : styles.floatingButtonLight,
        ]}
        onPress={navigateToTransfer}
      >
        <Plus size={24} color="#FFFFFF" />
      </TouchableOpacity>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  headerLeftContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  welcomeText: {
    fontSize: 12,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
  },
  themeToggle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  themeToggleLight: {
    backgroundColor: '#F1F5F9',
  },
  themeToggleDark: {
    backgroundColor: '#1E1E1E',
  },
  balanceCard: {
    margin: 16,
    marginTop: 8,
  },
  quickActionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  quickActionButton: {
    alignItems: 'center',
    width: '22%',
  },
  quickActionButtonLight: {
    backgroundColor: 'transparent',
  },
  quickActionButtonDark: {
    backgroundColor: 'transparent',
  },
  quickActionIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  sendIcon: {
    backgroundColor: '#0066FF',
  },
  topUpIcon: {
    backgroundColor: '#22C55E',
  },
  billsIcon: {
    backgroundColor: '#F59E0B',
  },
  scanIcon: {
    backgroundColor: '#7A5AF8',
  },
  quickActionText: {
    fontSize: 12,
    fontWeight: '500',
  },
  statsContainer: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  statsCardsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  statsCard: {
    padding: 16,
  },
  statsIconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  statsIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  incomeIcon: {
    backgroundColor: '#22C55E',
  },
  expensesIcon: {
    backgroundColor: '#EF4444',
  },
  statsLabel: {
    fontSize: 14,
  },
  statsValue: {
    fontSize: 18,
    fontWeight: '700',
  },
  savingsCard: {
    padding: 16,
  },
  savingsContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  savingsLabel: {
    fontSize: 14,
    marginBottom: 4,
  },
  savingsValue: {
    fontSize: 20,
    fontWeight: '700',
  },
  savingsIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  walletIcon: {
    backgroundColor: '#00BA88',
  },
  recentTransactionsContainer: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  sectionHeaderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  viewAllButton: {
    fontSize: 14,
    fontWeight: '500',
  },
  floatingButton: {
    position: 'absolute',
    right: 24,
    bottom: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#0066FF',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  floatingButtonLight: {
    backgroundColor: '#0066FF',
  },
  floatingButtonDark: {
    backgroundColor: '#52A9FF',
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
  linkLight: {
    color: '#0066FF',
  },
  linkDark: {
    color: '#52A9FF',
  },
});