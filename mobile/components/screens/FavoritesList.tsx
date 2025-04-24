import React from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  FlatList, 
  TouchableOpacity, 
  ActivityIndicator 
} from 'react-native';
import { User, ArrowUpRight } from 'lucide-react-native';
import { Favorite } from '@/contexts/FavoritesContext';
import { formatInitials, formatRelativeTime } from '@/utils/formatters';
import { useTheme } from '@/hooks/useTheme';

interface FavoritesListProps {
  favorites: Favorite[];
  isLoading: boolean;
  onFavoritePress: (favorite: Favorite) => void;
  onEditPress?: (favorite: Favorite) => void;
  emptyText?: string;
}

export default function FavoritesList({
  favorites,
  isLoading,
  onFavoritePress,
  onEditPress,
  emptyText = 'No favorites yet',
}: FavoritesListProps) {
  const { isDark } = useTheme();
  
  const renderItem = ({ item }: { item: Favorite }) => {
    const initials = formatInitials(item.recipientName);
    
    return (
      <TouchableOpacity
        style={[
          styles.favoriteItem,
          isDark ? styles.favoriteItemDark : styles.favoriteItemLight,
        ]}
        onPress={() => onFavoritePress(item)}
        activeOpacity={0.7}
      >
        <View style={[styles.avatarContainer, isDark ? styles.avatarDark : styles.avatarLight]}>
          <Text style={styles.avatarText}>{initials}</Text>
        </View>
        
        <View style={styles.favoriteDetails}>
          <Text 
            style={[
              styles.favoriteName,
              isDark ? styles.textDark : styles.textLight,
            ]} 
            numberOfLines={1}
          >
            {item.recipientName}
          </Text>
          
          {item.label && (
            <Text 
              style={[
                styles.favoriteLabel,
                isDark ? styles.textSecondaryDark : styles.textSecondaryLight,
              ]} 
              numberOfLines={1}
            >
              {item.label}
            </Text>
          )}
          
          {item.lastUsed && (
            <Text 
              style={[
                styles.favoriteLastUsed,
                isDark ? styles.textSecondaryDark : styles.textSecondaryLight,
              ]}
            >
              Last sent: {formatRelativeTime(item.lastUsed)}
            </Text>
          )}
        </View>
        
        <View style={styles.actionsContainer}>
          {onEditPress && (
            <TouchableOpacity
              style={[
                styles.editButton,
                isDark ? styles.editButtonDark : styles.editButtonLight,
              ]}
              onPress={() => onEditPress(item)}
            >
              <Text 
                style={[
                  styles.editButtonText,
                  isDark ? styles.editButtonTextDark : styles.editButtonTextLight,
                ]}
              >
                Edit
              </Text>
            </TouchableOpacity>
          )}
          
          <TouchableOpacity
            style={[
              styles.sendButton,
              isDark ? styles.sendButtonDark : styles.sendButtonLight,
            ]}
            onPress={() => onFavoritePress(item)}
          >
            <ArrowUpRight size={16} color={isDark ? '#000000' : '#FFFFFF'} />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };
  
  const renderEmpty = () => {
    if (isLoading) {
      return (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#0066FF" />
        </View>
      );
    }
    
    return (
      <View style={styles.emptyContainer}>
        <User size={48} color={isDark ? '#94A3B8' : '#64748B'} />
        <Text 
          style={[
            styles.emptyText,
            isDark ? styles.textSecondaryDark : styles.textSecondaryLight,
          ]}
        >
          {emptyText}
        </Text>
      </View>
    );
  };
  
  return (
    <FlatList
      data={favorites}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
      contentContainerStyle={[
        styles.listContainer,
        favorites.length === 0 && styles.emptyListContainer,
      ]}
      ListEmptyComponent={renderEmpty}
    />
  );
}

const styles = StyleSheet.create({
  listContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  emptyListContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  favoriteItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  favoriteItemLight: {
    borderBottomColor: '#E2E8F0',
  },
  favoriteItemDark: {
    borderBottomColor: '#334155',
  },
  avatarContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  avatarLight: {
    backgroundColor: '#E0EDFF',
  },
  avatarDark: {
    backgroundColor: '#0F172A',
  },
  avatarText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0066FF',
  },
  favoriteDetails: {
    flex: 1,
  },
  favoriteName: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  favoriteLabel: {
    fontSize: 14,
    marginBottom: 4,
  },
  favoriteLastUsed: {
    fontSize: 12,
  },
  actionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  editButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    marginRight: 8,
  },
  editButtonLight: {
    backgroundColor: '#F1F5F9',
  },
  editButtonDark: {
    backgroundColor: '#1E1E1E',
  },
  editButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  editButtonTextLight: {
    color: '#64748B',
  },
  editButtonTextDark: {
    color: '#94A3B8',
  },
  sendButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonLight: {
    backgroundColor: '#0066FF',
  },
  sendButtonDark: {
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
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 32,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 32,
  },
  emptyText: {
    fontSize: 16,
    marginTop: 16,
  },
});