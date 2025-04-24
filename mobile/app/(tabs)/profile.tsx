import React, { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  Image, 
  TouchableOpacity, 
  ScrollView, 
  Switch,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Card from '@/components/common/Card';
import Button from '@/components/common/Button';
import { useTheme } from '@/hooks/useTheme';
import { useAuth } from '@/hooks/useAuth';
import { 
  User, 
  Settings, 
  Bell, 
  Shield, 
  CreditCard, 
  HelpCircle, 
  LogOut, 
  ChevronRight,
  Sun,
  Moon,
} from 'lucide-react-native';

export default function ProfileScreen() {
  const { isDark, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  
  const [isPushNotificationsEnabled, setIsPushNotificationsEnabled] = useState(true);
  const [isEmailNotificationsEnabled, setIsEmailNotificationsEnabled] = useState(true);
  
  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: () => logout(),
        },
      ]
    );
  };
  
  const renderSettingsItem = (
    icon: React.ReactNode,
    title: string,
    subtitle?: string,
    onPress?: () => void,
    rightElement?: React.ReactNode
  ) => (
    <TouchableOpacity
      style={[
        styles.settingsItem,
        isDark ? styles.settingsItemDark : styles.settingsItemLight,
      ]}
      onPress={onPress}
      disabled={!onPress}
    >
      <View style={styles.settingsItemLeft}>
        {icon}
        <View style={styles.settingsItemTextContainer}>
          <Text style={[
            styles.settingsItemTitle,
            isDark ? styles.textDark : styles.textLight,
          ]}>
            {title}
          </Text>
          {subtitle && (
            <Text style={[
              styles.settingsItemSubtitle,
              isDark ? styles.textSecondaryDark : styles.textSecondaryLight,
            ]}>
              {subtitle}
            </Text>
          )}
        </View>
      </View>
      
      {rightElement || (onPress && (
        <ChevronRight size={20} color={isDark ? '#94A3B8' : '#64748B'} />
      ))}
    </TouchableOpacity>
  );
  
  return (
    <SafeAreaView style={[
      styles.container,
      isDark ? styles.containerDark : styles.containerLight,
    ]}>
      <ScrollView>
        <View style={styles.header}>
          <Text style={[
            styles.title,
            isDark ? styles.textDark : styles.textLight,
          ]}>
            My Profile
          </Text>
        </View>
        
        <Card style={styles.profileCard}>
          <View style={styles.profileContent}>
            <Image
              source={{ uri: 'https://randomuser.me/api/portraits/men/1.jpg' }}
              style={styles.profileImage}
            />
            <View style={styles.profileInfo}>
              <Text style={[
                styles.profileName,
                isDark ? styles.textDark : styles.textLight,
              ]}>
                {user?.fullName || 'User Name'}
              </Text>
              <Text style={[
                styles.profileEmail,
                isDark ? styles.textSecondaryDark : styles.textSecondaryLight,
              ]}>
                {user?.email || 'user@example.com'}
              </Text>
            </View>
            <Button
              title="Edit"
              type="outline"
              size="small"
              onPress={() => {}}
            />
          </View>
        </Card>
        
        <View style={styles.settingsSection}>
          <Text style={[
            styles.sectionTitle,
            isDark ? styles.textDark : styles.textLight,
          ]}>
            App Settings
          </Text>
          
          {renderSettingsItem(
            isDark 
              ? <Moon size={24} color="#E2E8F0" /> 
              : <Sun size={24} color="#1E293B" />,
            'Dark Mode',
            'Switch between light and dark themes',
            undefined,
            <Switch
              value={isDark}
              onValueChange={toggleTheme}
              trackColor={{ false: '#E2E8F0', true: '#52A9FF' }}
              thumbColor={isDark ? '#FFFFFF' : '#FFFFFF'}
            />
          )}
          
          {renderSettingsItem(
            <Bell size={24} color={isDark ? '#E2E8F0' : '#1E293B'} />,
            'Push Notifications',
            'Get important updates on your device',
            undefined,
            <Switch
              value={isPushNotificationsEnabled}
              onValueChange={setIsPushNotificationsEnabled}
              trackColor={{ false: '#E2E8F0', true: '#52A9FF' }}
              thumbColor={isPushNotificationsEnabled ? '#FFFFFF' : '#FFFFFF'}
            />
          )}
          
          {renderSettingsItem(
            <Bell size={24} color={isDark ? '#E2E8F0' : '#1E293B'} />,
            'Email Notifications',
            'Get important updates via email',
            undefined,
            <Switch
              value={isEmailNotificationsEnabled}
              onValueChange={setIsEmailNotificationsEnabled}
              trackColor={{ false: '#E2E8F0', true: '#52A9FF' }}
              thumbColor={isEmailNotificationsEnabled ? '#FFFFFF' : '#FFFFFF'}
            />
          )}
        </View>
        
        <View style={styles.settingsSection}>
          <Text style={[
            styles.sectionTitle,
            isDark ? styles.textDark : styles.textLight,
          ]}>
            Account Settings
          </Text>
          
          {renderSettingsItem(
            <User size={24} color={isDark ? '#E2E8F0' : '#1E293B'} />,
            'Personal Information',
            'Manage your personal details',
            () => {}
          )}
          
          {renderSettingsItem(
            <Shield size={24} color={isDark ? '#E2E8F0' : '#1E293B'} />,
            'Security',
            'Set up PIN, biometrics, and password',
            () => {}
          )}
          
          {renderSettingsItem(
            <CreditCard size={24} color={isDark ? '#E2E8F0' : '#1E293B'} />,
            'Payment Methods',
            'Manage cards and bank accounts',
            () => {}
          )}
        </View>
        
        <View style={styles.settingsSection}>
          <Text style={[
            styles.sectionTitle,
            isDark ? styles.textDark : styles.textLight,
          ]}>
            Support
          </Text>
          
          {renderSettingsItem(
            <HelpCircle size={24} color={isDark ? '#E2E8F0' : '#1E293B'} />,
            'Help Center',
            'Get support and answers',
            () => {}
          )}
          
          {renderSettingsItem(
            <Settings size={24} color={isDark ? '#E2E8F0' : '#1E293B'} />,
            'About',
            'App version and information',
            () => {}
          )}
        </View>
        
        <Button
          title="Logout"
          type="outline"
          icon={<LogOut size={20} color={isDark ? '#52A9FF' : '#0066FF'} />}
          onPress={handleLogout}
          style={styles.logoutButton}
        />
        
        <Text style={[
          styles.versionText,
          isDark ? styles.textSecondaryDark : styles.textSecondaryLight,
        ]}>
          Version 1.0.0
        </Text>
      </ScrollView>
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
  profileCard: {
    margin: 16,
    marginTop: 0,
  },
  profileContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 16,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
  },
  settingsSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginHorizontal: 16,
    marginBottom: 12,
  },
  settingsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
  },
  settingsItemLight: {
    borderBottomColor: '#E2E8F0',
  },
  settingsItemDark: {
    borderBottomColor: '#334155',
  },
  settingsItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingsItemTextContainer: {
    marginLeft: 16,
  },
  settingsItemTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  settingsItemSubtitle: {
    fontSize: 14,
  },
  logoutButton: {
    marginHorizontal: 16,
    marginBottom: 16,
  },
  versionText: {
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 24,
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