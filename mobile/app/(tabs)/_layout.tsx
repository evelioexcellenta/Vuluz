import React from 'react';
import { Tabs } from 'expo-router';
import { TabBar } from '@/components/ui/TabBar';
import { isLoggedInOrRedirect } from '@/app/_layout';

export default function TabLayout() {
  // Check if user is logged in, redirect to login if not
  isLoggedInOrRedirect();
  
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
      }}
      tabBar={(props) => <TabBar {...props} />}
    >
      <Tabs.Screen name="index" />
      <Tabs.Screen name="top-up" />
      <Tabs.Screen name="transfer" />
      <Tabs.Screen name="transactions" />
      <Tabs.Screen name="profile" />
    </Tabs>
  );
}