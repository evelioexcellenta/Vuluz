import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, FlatList } from 'react-native';
import { Recipient } from '@/types';
import { Trash2 } from 'lucide-react-native';

interface FavoritesListProps {
  favorites: Recipient[];
  onSelectFavorite: (recipient: Recipient) => void;
  onRemoveFavorite: (id: string) => void;
}

export function FavoritesList({ favorites, onSelectFavorite, onRemoveFavorite }: FavoritesListProps) {
  const renderItem = ({ item }: { item: Recipient }) => (
    <TouchableOpacity
      style={styles.favoriteItem}
      onPress={() => onSelectFavorite(item)}
    >
      <View style={styles.avatarContainer}>
        <Text style={styles.avatarText}>{item.name.charAt(0)}</Text>
      </View>
      <View style={styles.favoriteDetails}>
        <Text style={styles.favoriteName}>{item.name}</Text>
        <Text style={styles.favoriteAccount}>{item.accountNumber}</Text>
      </View>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => onRemoveFavorite(item.id)}
      >
        <Trash2 size={20} color="#EB5757" />
      </TouchableOpacity>
    </TouchableOpacity>
  );
  
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Favorite List</Text>
      
      {favorites.length > 0 ? (
        <FlatList
          data={favorites}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No favorites added yet</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  favoriteItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  avatarContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#7C5DF9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  favoriteDetails: {
    flex: 1,
  },
  favoriteName: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
  },
  favoriteAccount: {
    fontSize: 12,
    color: '#666',
  },
  deleteButton: {
    padding: 8,
  },
  separator: {
    height: 1,
    backgroundColor: '#F0F0F0',
  },
  emptyContainer: {
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F7F7FB',
    borderRadius: 12,
  },
  emptyText: {
    fontSize: 14,
    color: '#666',
  },
});