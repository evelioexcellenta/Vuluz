import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { useTheme } from '@/hooks/useTheme';

interface CardProps {
  children: React.ReactNode;
  title?: string;
  onPress?: () => void;
  style?: any;
  titleStyle?: any;
}

export default function Card({
  children,
  title,
  onPress,
  style,
  titleStyle,
}: CardProps) {
  const { isDark } = useTheme();
  
  const CardContainer = onPress ? TouchableOpacity : View;
  
  return (
    <CardContainer
      style={[
        styles.card,
        isDark ? styles.cardDark : styles.cardLight,
        style,
      ]}
      onPress={onPress}
      activeOpacity={onPress ? 0.7 : 1}
    >
      {title && (
        <Text
          style={[
            styles.title,
            isDark ? styles.titleDark : styles.titleLight,
            titleStyle,
          ]}
        >
          {title}
        </Text>
      )}
      {children}
    </CardContainer>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    padding: 16,
    marginVertical: 8,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  cardLight: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000000',
  },
  cardDark: {
    backgroundColor: '#1E1E1E',
    shadowColor: '#000000',
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  titleLight: {
    color: '#1E293B',
  },
  titleDark: {
    color: '#E2E8F0',
  },
});