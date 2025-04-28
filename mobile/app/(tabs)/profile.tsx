import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '@/store/authStore';
import { useAuth } from '@/hooks/useAuth';
import { TextInput } from '@/components/ui/TextInput';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Modal } from '@/components/ui/Modal';
import { User, ChevronRight, LogOut, Camera, Settings, Bell, Shield, CircleHelp as HelpCircle } from 'lucide-react-native';
import Toast from 'react-native-toast-message';

export default function ProfileScreen() {
  const { user, updateUser } = useAuthStore();
  const { handleLogout } = useAuth();
  
  const [editMode, setEditMode] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [username, setUsername] = useState(user?.username || '');

  const [confirmLogoutVisible, setConfirmLogoutVisible] = useState(false);
  
  const handleSaveProfile = async () => {
    try {
      await updateUser({
        name,
        username,
      });
      setEditMode(false);
  
      Toast.show({
        type: 'success',
        text1: 'Profile updated!',
        position: 'top',
      });
    } catch (error: any) {
      Toast.show({
        type: 'error',
        text1: 'Failed to update profile',
        text2: error.message || 'Something went wrong',
        position: 'top',
      });
    }
  };
  
  
  const handleCancel = () => {
    setName(user?.name || '');
    setUsername(user?.username || '');
    setEditMode(false);
  };
  
  const renderEditProfile = () => (
    <View style={styles.editForm}>
      <TextInput
        label="Full Name"
        value={name}
        onChangeText={setName}
        placeholder="Enter your full name"
      />
      
      <TextInput
        label="Username"
        value={username}
        onChangeText={setUsername}
        placeholder="Enter your email"
        keyboardType="email-address"
      />
      
      
      <View style={styles.editActions}>
        <Button
          title="Cancel"
          onPress={handleCancel}
          variant="outline"
          style={styles.cancelButton}
        />
        <Button
          title="Save Changes"
          onPress={handleSaveProfile}
          style={styles.saveButton}
        />
      </View>
    </View>
  );
  
  const renderProfileInfo = () => (
    <View>
      <View style={styles.profileHeader}>
        <View style={styles.avatarContainer}>
          {user?.avatar ? (
            <Image source={{ uri: user.avatar }} style={styles.avatar} />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Text style={styles.avatarText}>{user?.name.charAt(0)}</Text>
            </View>
          )}
          <TouchableOpacity style={styles.cameraButton}>
            <Camera size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
        
        <Text style={styles.profileName}>{user?.name}</Text>
        <Text style={styles.accountNumber}>{user?.accountNumber}</Text>
      </View>
      
      <View style={styles.profileActions}>
        <Button
          title="Edit Profile"
          onPress={() => setEditMode(true)}
          style={styles.editButton}
        />
      </View>
      
      <View style={styles.menuSection}>
        <Text style={styles.menuSectionTitle}>Account Settings</Text>
        
        <Card style={styles.menuCard}>
          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuItemLeft}>
              <View style={[styles.menuIcon, styles.settingsIcon]}>
                <Settings size={20} color="#7C5DF9" />
              </View>
              <Text style={styles.menuText}>App Settings</Text>
            </View>
            <ChevronRight size={20} color="#C0C0C0" />
          </TouchableOpacity>
          
          <View style={styles.divider} />
          
          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuItemLeft}>
              <View style={[styles.menuIcon, styles.notificationIcon]}>
                <Bell size={20} color="#56CCF2" />
              </View>
              <Text style={styles.menuText}>Notifications</Text>
            </View>
            <ChevronRight size={20} color="#C0C0C0" />
          </TouchableOpacity>
          
          <View style={styles.divider} />
          
          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuItemLeft}>
              <View style={[styles.menuIcon, styles.securityIcon]}>
                <Shield size={20} color="#27AE60" />
              </View>
              <Text style={styles.menuText}>Security & Privacy</Text>
            </View>
            <ChevronRight size={20} color="#C0C0C0" />
          </TouchableOpacity>
        </Card>
      </View>
      
      <View style={styles.menuSection}>
        <Text style={styles.menuSectionTitle}>Support</Text>
        
        <Card style={styles.menuCard}>
          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuItemLeft}>
              <View style={[styles.menuIcon, styles.helpIcon]}>
                <HelpCircle size={20} color="#F2C94C" />
              </View>
              <Text style={styles.menuText}>Help Center</Text>
            </View>
            <ChevronRight size={20} color="#C0C0C0" />
          </TouchableOpacity>
          
          <View style={styles.divider} />
          
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => setConfirmLogoutVisible(true)}
          >
            <View style={styles.menuItemLeft}>
              <View style={[styles.menuIcon, styles.logoutIcon]}>
                <LogOut size={20} color="#EB5757" />
              </View>
              <Text style={styles.logoutText}>Log Out</Text>
            </View>
            <ChevronRight size={20} color="#C0C0C0" />
          </TouchableOpacity>
        </Card>
      </View>
    </View>
  );
  
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>Profile</Text>
        </View>
        
        {editMode ? renderEditProfile() : renderProfileInfo()}
      </ScrollView>
      
      <Modal
        visible={confirmLogoutVisible}
        onClose={() => setConfirmLogoutVisible(false)}
        title="Log Out"
        primaryButton={{
          title: "Log Out",
          onPress: handleLogout,
        }}
        secondaryButton={{
          title: "Cancel",
          onPress: () => setConfirmLogoutVisible(false),
        }}
      >
        <Text style={styles.logoutConfirmText}>
          Are you sure you want to log out of your account?
        </Text>
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
    fontSize: 24,
    fontWeight: '700',
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: 24,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#7C5DF9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 36,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  cameraButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#56CCF2',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  profileName: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 4,
  },
  accountNumber: {
    fontSize: 14,
    color: '#666',
  },
  profileActions: {
    marginBottom: 32,
  },
  editButton: {
    marginHorizontal: 40,
  },
  menuSection: {
    marginBottom: 24,
  },
  menuSectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  menuCard: {
    padding: 0,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  settingsIcon: {
    backgroundColor: 'rgba(124, 93, 249, 0.1)',
  },
  notificationIcon: {
    backgroundColor: 'rgba(86, 204, 242, 0.1)',
  },
  securityIcon: {
    backgroundColor: 'rgba(39, 174, 96, 0.1)',
  },
  helpIcon: {
    backgroundColor: 'rgba(242, 201, 76, 0.1)',
  },
  logoutIcon: {
    backgroundColor: 'rgba(235, 87, 87, 0.1)',
  },
  menuText: {
    fontSize: 16,
    color: '#333',
  },
  logoutText: {
    fontSize: 16,
    color: '#EB5757',
  },
  divider: {
    height: 1,
    backgroundColor: '#F0F0F0',
  },
  editForm: {
    marginTop: 16,
  },
  editActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
  },
  saveButton: {
    flex: 1,
    marginLeft: 8,
  },
  cancelButton: {
    flex: 1,
    marginRight: 8,
  },
  logoutConfirmText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
  },
});