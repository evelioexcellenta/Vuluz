import React, { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TouchableOpacity,
  Modal,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/hooks/useTheme';
import { useWallet } from '@/hooks/useWallet';
import { useFavorites } from '@/hooks/useFavorites';
import TransferForm from '@/components/screens/TransferForm';
import FavoritesList from '@/components/screens/FavoritesList';
import { formatCurrency } from '@/utils/formatters';
import Input from '@/components/common/Input';
import Button from '@/components/common/Button';
import { X } from 'lucide-react-native';

export default function TransferScreen() {
  const { isDark } = useTheme();
  const { balance, transferMoney, isLoading } = useWallet();
  const { favorites, addFavorite, updateLastUsed } = useFavorites();
  
  const [activeTab, setActiveTab] = useState('new');
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [transferDetails, setTransferDetails] = useState({
    recipientId: '',
    recipientName: '',
    amount: 0,
    note: '',
  });
  
  const handleTransfer = async (recipientId: string, amount: number, note?: string) => {
    // In a real app, you'd get the recipient name from an API
    const recipientName = 'Recipient Name';
    
    setTransferDetails({
      recipientId,
      recipientName,
      amount,
      note: note || '',
    });
    
    setShowConfirmModal(true);
  };
  
  const confirmTransfer = async () => {
    try {
      await transferMoney(
        transferDetails.recipientId,
        transferDetails.amount,
        transferDetails.note
      );
      
      // Add to favorites option would be here in a real app
      setShowConfirmModal(false);
      
      Alert.alert(
        'Transfer Successful',
        `You have sent ${formatCurrency(transferDetails.amount)} to ${transferDetails.recipientName}.`,
        [
          {
            text: 'Add to Favorites',
            onPress: () => {
              addFavorite(
                transferDetails.recipientId,
                transferDetails.recipientName
              );
            },
          },
          { text: 'OK', style: 'default' },
        ]
      );
    } catch (error) {
      setShowConfirmModal(false);
      Alert.alert('Transfer Failed', error instanceof Error ? error.message : 'An error occurred');
    }
  };
  
  const handleFavoriteTransfer = (favorite: any) => {
    // Pre-fill transfer form or show confirmation directly
    setTransferDetails({
      recipientId: favorite.recipientId,
      recipientName: favorite.recipientName,
      amount: 0, // The user still needs to enter an amount
      note: '',
    });
    
    // Update last used timestamp
    updateLastUsed(favorite.id);
    
    // Switch to the new transfer tab
    setActiveTab('new');
  };
  
  return (
    <SafeAreaView style={[
      styles.container,
      isDark ? styles.containerDark : styles.containerLight,
    ]}>
      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === 'new' && (isDark ? styles.activeTabDark : styles.activeTabLight),
          ]}
          onPress={() => setActiveTab('new')}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === 'new' && styles.activeTabText,
              isDark ? styles.textDark : styles.textLight,
            ]}
          >
            New Transfer
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === 'favorites' && (isDark ? styles.activeTabDark : styles.activeTabLight),
          ]}
          onPress={() => setActiveTab('favorites')}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === 'favorites' && styles.activeTabText,
              isDark ? styles.textDark : styles.textLight,
            ]}
          >
            Favorites
          </Text>
        </TouchableOpacity>
      </View>
      
      {/* Content based on active tab */}
      <View style={styles.content}>
        {activeTab === 'new' ? (
          <TransferForm
            balance={balance}
            onTransfer={handleTransfer}
            onSearchRecipient={() => {}}
            isLoading={isLoading}
          />
        ) : (
          <FavoritesList
            favorites={favorites}
            isLoading={isLoading}
            onFavoritePress={handleFavoriteTransfer}
            onEditPress={() => {}}
            emptyText="You don't have any favorites yet. They will appear here after you make transfers."
          />
        )}
      </View>
      
      {/* Confirmation Modal */}
      <Modal
        visible={showConfirmModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowConfirmModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[
            styles.modalContent,
            isDark ? styles.modalContentDark : styles.modalContentLight,
          ]}>
            <View style={styles.modalHeader}>
              <Text style={[
                styles.modalTitle,
                isDark ? styles.textDark : styles.textLight,
              ]}>
                Confirm Transfer
              </Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setShowConfirmModal(false)}
              >
                <X size={24} color={isDark ? '#E2E8F0' : '#1E293B'} />
              </TouchableOpacity>
            </View>
            
            <View style={styles.modalBody}>
              <Text style={[
                styles.confirmLabel,
                isDark ? styles.textSecondaryDark : styles.textSecondaryLight,
              ]}>
                You are about to send
              </Text>
              <Text style={[
                styles.confirmAmount,
                isDark ? styles.textDark : styles.textLight,
              ]}>
                {formatCurrency(transferDetails.amount)}
              </Text>
              
              <Text style={[
                styles.confirmLabel,
                isDark ? styles.textSecondaryDark : styles.textSecondaryLight,
              ]}>
                to
              </Text>
              <Text style={[
                styles.confirmRecipient,
                isDark ? styles.textDark : styles.textLight,
              ]}>
                {transferDetails.recipientName}
              </Text>
              
              {transferDetails.note && (
                <>
                  <Text style={[
                    styles.confirmLabel,
                    isDark ? styles.textSecondaryDark : styles.textSecondaryLight,
                  ]}>
                    Note
                  </Text>
                  <Text style={[
                    styles.confirmNote,
                    isDark ? styles.textDark : styles.textLight,
                  ]}>
                    {transferDetails.note}
                  </Text>
                </>
              )}
              
              <View style={styles.pinContainer}>
                <Text style={[
                  styles.pinLabel,
                  isDark ? styles.textDark : styles.textLight,
                ]}>
                  Enter PIN to confirm
                </Text>
                <Input
                  placeholder="Enter 4-digit PIN"
                  value=""
                  onChangeText={() => {}}
                  secureTextEntry
                  keyboardType="numeric"
                  maxLength={4}
                />
              </View>
            </View>
            
            <View style={styles.modalFooter}>
              <Button
                title="Cancel"
                onPress={() => setShowConfirmModal(false)}
                type="outline"
                style={styles.cancelButton}
              />
              <Button
                title="Confirm Transfer"
                onPress={confirmTransfer}
                loading={isLoading}
                style={styles.confirmButton}
              />
            </View>
          </View>
        </View>
      </Modal>
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
  tabContainer: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginVertical: 16,
    borderRadius: 8,
    overflow: 'hidden',
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  activeTabLight: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 2,
    borderBottomColor: '#0066FF',
  },
  activeTabDark: {
    backgroundColor: '#1E1E1E',
    borderBottomWidth: 2,
    borderBottomColor: '#52A9FF',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
  },
  activeTabText: {
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  modalContent: {
    width: '90%',
    borderRadius: 16,
    padding: 24,
  },
  modalContentLight: {
    backgroundColor: '#FFFFFF',
  },
  modalContentDark: {
    backgroundColor: '#1E1E1E',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  closeButton: {
    padding: 4,
  },
  modalBody: {
    marginBottom: 24,
  },
  confirmLabel: {
    fontSize: 14,
    marginBottom: 4,
  },
  confirmAmount: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 16,
  },
  confirmRecipient: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  confirmNote: {
    fontSize: 16,
    marginBottom: 16,
  },
  pinContainer: {
    marginTop: 16,
  },
  pinLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cancelButton: {
    flex: 1,
    marginRight: 8,
  },
  confirmButton: {
    flex: 2,
    marginLeft: 8,
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
});