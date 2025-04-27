import React, { ReactNode } from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';

interface CardProps {
  children: ReactNode;
  style?: ViewStyle;
  variant?: 'default' | 'primary' | 'elevated';
}

export function Card({ children, style, variant = 'default' }: CardProps) {
  const getCardStyle = () => {
    switch (variant) {
      case 'primary':
        return [styles.card, styles.primaryCard, style];
      case 'elevated':
        return [styles.card, styles.elevatedCard, style];
      default:
        return [styles.card, style];
    }
  };
  
  return <View style={getCardStyle()}>{children}</View>;
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  primaryCard: {
    backgroundColor: '#7C5DF9',
    borderColor: '#7C5DF9',
  },
  elevatedCard: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    borderColor: 'transparent',
  },
});