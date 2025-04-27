import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useWallet } from '@/hooks/useWallet';
import { TextInput } from '@/components/ui/TextInput';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { formatCurrency } from '@/utils/formatters';
import { FavoritesList } from '@/components/transfer/FavoritesList';
import { Card } from '@/components/ui/Card';
import { Star } from 'lucide-react-native';

export default function TransferScreen() {
  const {
    amount,
    setAmount,
    description,
    setDescription,
    recipientAccount,
    setRecipientAccount,
    recipientName,
    setRecipientName,
    selectedRecipient,
    setSelectedRecipient,
    recipients,
    fetchRecipients,
    handleTransfer,
    handleAddFavorite,
    removeFavorite,
    isLoading,
    error,
  } = useWallet();
  
  const [activeTab, setActiveTab] = useState<'favorites' | 'manual'>('favorites');
  const [favoritesModalVisible, setFavoritesModalVisible] = useState(false);
  const [addFavoriteModalVisible, setAddFavoriteModalVisible] = useState(false);
  const [confirmModalVisible, setConfirmModalVisible] = useState(false);
  const [successModalVisible, setSuccessModalVisible] = useState(false);
  
  useEffect(() => {
    fetchRecipients();
  }, [fetchRecipients]);
  
  const handleSelectRecipient = (recipient: any) => {
    setSelectedRecipient(recipient.accountNumber);
    setFavoritesModalVisible(false);
  };
  
  const handleContinue = () => {
    setConfirmModalVisible(true);
  };
  
  const handleConfirmTransfer = async () => {
    const success = await handleTransfer();
    setConfirmModalVisible(false);
    if (success) {
      setSuccessModalVisible(true);
    }
  };
  
  const handleDone = () => {
    setSuccessModalVisible(false);
  };
  
  const handleSaveFavorite = async () => {
    if (recipientAccount && recipientName) {
      const success = await handleAddFavorite();
      if (success) {
        setAddFavoriteModalVisible(false);
      }
    }
  };
  
  const getSelectedRecipientName = () => {
    if (!selectedRecipient) return null;
    const recipient = recipients.find(r => r.accountNumber === selectedRecipient);
    return recipient ? recipient.name : null;
  };

  const getReceipientAccountLabel = () => {
    return activeTab === 'favorites' ? 'Select Recipient' : 'Account Number*';
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>Transfer Money</Text>
          <View style={styles.tabContainer}>
            <TouchableOpacity
              style={[styles.tab, activeTab === 'favorites' && styles.activeTab]}
              onPress={() => setActiveTab('favorites')}
            >
              <Text style={[styles.tabText, activeTab === 'favorites' && styles.activeTabText]}>
                Favorite Recipients
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, activeTab === 'manual' && styles.activeTab]}
              onPress={() => setActiveTab('manual')}
            >
              <Text style={[styles.tabText, activeTab === 'manual' && styles.activeTabText]}>
                Manual Transfer
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        
        <View style={styles.transferContainer}>
          {activeTab === 'favorites' ? (
            <View>
              <Text style={styles.sectionTitle}>Transfer to Favorites</Text>
              <View style={styles.recipientSelection}>
                <Text style={styles.label}>{getReceipientAccountLabel()}</Text>
                {selectedRecipient ? (
                  <Card style={styles.selectedRecipient}>
                    <Text style={styles.selectedRecipientName}>{getSelectedRecipientName()}</Text>
                    <Text style={styles.selectedRecipientAccount}>{selectedRecipient}</Text>
                  </Card>
                ) : (
                  <Button
                    title="Show Favorites"
                    onPress={() => setFavoritesModalVisible(true)}
                    variant="outline"
                  />
                )}
              </View>
            </View>
          ) : (
            <View>
              <Text style={styles.sectionTitle}>Transfer Money</Text>
              <Text style={styles.sectionSubtitle}>Send money to another account</Text>
              <TextInput
                label="Account Number*"
                value={recipientAccount}
                onChangeText={setRecipientAccount}
                placeholder="Enter account number"
                keyboardType="numeric"
              />
              <TextInput
                label="Recipient Name*"
                value={recipientName}
                onChangeText={setRecipientName}
                placeholder="Enter recipient name"
              />
              <View style={styles.favoriteAction}>
                <TouchableOpacity style={styles.favoriteButton}>
                  <Star size={16} color="#7C5DF9" />
                  <Text style={styles.favoriteButtonText}>Add to Favorites</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
          
          <TextInput
            label="Amount*"
            value={amount}
            onChangeText={setAmount}
            placeholder="0"
            keyboardType="numeric"
          />
          
          <TextInput
            label="Description"
            value={description}
            onChangeText={setDescription}
            placeholder="What's this transfer for?"
            multiline
            numberOfLines={3}
          />
          
          <Button
            title="Continue"
            onPress={handleContinue}
            style={styles.button}
            disabled={!amount || (!selectedRecipient && !recipientAccount)}
          />
        </View>
      </ScrollView>
      
      {/* Favorites Modal */}
      <Modal
        visible={favoritesModalVisible}
        onClose={() => setFavoritesModalVisible(false)}
        title="Add Favorite"
      >
        <View>
          <View style={styles.addFavoriteForm}>
            <TextInput
              label="Input Account Number"
              value={recipientAccount}
              onChangeText={setRecipientAccount}
              placeholder="Enter account number"
              keyboardType="numeric"
            />
            <View style={styles.inlineAction}>
              <Button
                title="Check"
                onPress={() => {/* This would verify the account */}}
                variant="outline"
                style={styles.checkButton}
              />
            </View>
          </View>
          
          <TextInput
            label="Recipient Name"
            value={recipientName}
            onChangeText={setRecipientName}
            placeholder="Enter recipient name"
          />
          
          <View style={styles.modalActionContainer}>
            <Button
              title="Add"
              onPress={handleSaveFavorite}
              disabled={!recipientAccount || !recipientName}
            />
          </View>
          
          <FavoritesList
            favorites={recipients}
            onSelectFavorite={handleSelectRecipient}
            onRemoveFavorite={removeFavorite}
          />
        </View>
      </Modal>
      
      {/* Confirm Transfer Modal */}
      <Modal
        visible={confirmModalVisible}
        onClose={() => setConfirmModalVisible(false)}
        title="Confirm Transfer"
        primaryButton={{
          title: "Confirm Transfer",
          onPress: handleConfirmTransfer,
          loading: isLoading,
        }}
        secondaryButton={{
          title: "Cancel",
          onPress: () => setConfirmModalVisible(false),
        }}
      >
        <View style={styles.modalContent}>
          <Text style={styles.modalText}>You are about to transfer:</Text>
          
          <View style={styles.modalItem}>
            <Text style={styles.modalLabel}>Amount:</Text>
            <Text style={styles.modalValue}>{formatCurrency(Number(amount) || 0)}</Text>
          </View>
          
          <View style={styles.modalItem}>
            <Text style={styles.modalLabel}>To:</Text>
            <Text style={styles.modalValue}>
              {activeTab === 'favorites' ? getSelectedRecipientName() : recipientName}
            </Text>
          </View>
          
          <View style={styles.modalItem}>
            <Text style={styles.modalLabel}>Account:</Text>
            <Text style={styles.modalValue}>
              {activeTab === 'favorites' ? selectedRecipient : recipientAccount}
            </Text>
          </View>
          
          <Text style={styles.modalFooter}>Please verify the information before proceeding.</Text>
        </View>
      </Modal>
      
      {/* Success Modal */}
      <Modal
        visible={successModalVisible}
        onClose={handleDone}
        title="Transfer Successful"
        primaryButton={{
          title: "Done",
          onPress: handleDone,
        }}
      >
        <View style={styles.modalContent}>
          <Text style={styles.modalText}>Your transfer was completed successfully.</Text>
          
          <View style={styles.modalItem}>
            <Text style={styles.modalLabel}>Amount:</Text>
            <Text style={styles.modalValue}>{formatCurrency(Number(amount) || 0)}</Text>
          </View>
          
          <View style={styles.modalItem}>
            <Text style={styles.modalLabel}>To:</Text>
            <Text style={styles.modalValue}>
              {activeTab === 'favorites' ? getSelectedRecipientName() : recipientName}
            </Text>
          </View>
          
          <View style={styles.modalItem}>
            <Text style={styles.modalLabel}>Account:</Text>
            <Text style={styles.modalValue}>
              {activeTab === 'favorites' ? selectedRecipient : recipientAccount}
            </Text>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 16,
  },
  tabContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  tab: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginRight: 8,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#7C5DF9',
  },
  tabText: {
    fontSize: 14,
    color: '#666',
  },
  activeTabText: {
    color: '#7C5DF9',
    fontWeight: '600',
  },
  transferContainer: {
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  recipientSelection: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
    color: '#333',
  },
  selectedRecipient: {
    padding: 12,
  },
  selectedRecipientName: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  selectedRecipientAccount: {
    fontSize: 14,
    color: '#666',
  },
  favoriteAction: {
    alignItems: 'flex-end',
    marginBottom: 16,
  },
  favoriteButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  favoriteButtonText: {
    marginLeft: 4,
    color: '#7C5DF9',
    fontWeight: '500',
  },
  button: {
    marginTop: 24,
  },
  addFavoriteForm: {
    marginBottom: 16,
  },
  inlineAction: {
    alignItems: 'flex-end',
    marginTop: -8,
  },
  checkButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  modalActionContainer: {
    marginVertical: 16,
  },
  modalContent: {
    paddingVertical: 8,
  },
  modalText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 16,
  },
  modalItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  modalLabel: {
    fontSize: 14,
    color: '#666',
  },
  modalValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  modalFooter: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
    marginTop: 16,
  },
});