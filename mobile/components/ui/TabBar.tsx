import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Chrome as Home, Plus, ArrowRightLeft, ChartBar as BarChart3, User } from 'lucide-react-native';
import { usePathname, useRouter } from 'expo-router';

interface TabBarProps {
  state: {
    index: number;
    routes: { key: string; name: string }[];
  };
}

export function TabBar({ state }: TabBarProps) {
  const router = useRouter();
  const pathname = usePathname();
  
  const tabs = [
    { name: 'index', label: 'Dashboard', icon: Home },
    { name: 'top-up', label: 'Top Up', icon: Plus },
    { name: 'transfer', label: 'Transfer', icon: ArrowRightLeft },
    { name: 'transactions', label: 'Transactions', icon: BarChart3 },
    { name: 'profile', label: 'Profile', icon: User },
  ];

  const pathMap = {
    index: '/' as const,
    'top-up': '/(tabs)/top-up' as const,
    transfer: '/(tabs)/transfer' as const,
    transactions: '/(tabs)/transactions' as const,
    profile: '/(tabs)/profile' as const,
  };
  
  const getRouteInfo = (routeName: string) => {
    return tabs.find(tab => tab.name === routeName) || tabs[0];
  };
  
  return (
    <View style={styles.container}>
      {state.routes.map((route, index) => {
        const { label, icon: Icon } = getRouteInfo(route.name);
        const isFocused = state.index === index;
        
        const onPress = () => {
          const path = pathMap[route.name as keyof typeof pathMap] || '/';
          router.push(path);
        };
        
        return (
          <TouchableOpacity
            key={route.key}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            onPress={onPress}
            style={styles.tabButton}
          >
            <Icon
              size={24}
              color={isFocused ? '#7C5DF9' : '#C0C0C0'}
              strokeWidth={2}
            />
            <Text style={[
              styles.tabLabel,
              { color: isFocused ? '#7C5DF9' : '#C0C0C0' }
            ]}>
              {label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    height: 60,
  },
  tabButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabLabel: {
    fontSize: 12,
    marginTop: 4,
  },
});