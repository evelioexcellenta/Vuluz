import React from 'react';
import { StyleSheet, View, Text, ScrollView } from 'react-native';
import { useTheme } from '@/hooks/useTheme';

interface Column {
  key: string;
  title: string;
  width?: number | string;
  render?: (value: any, item: any, index: number) => React.ReactNode;
}

interface TableProps {
  data: any[];
  columns: Column[];
  emptyText?: string;
}

export default function Table({ data, columns, emptyText = 'No data available' }: TableProps) {
  const { isDark } = useTheme();
  
  return (
    <View style={styles.container}>
      {/* Table Header */}
      <View style={[
        styles.headerRow,
        isDark ? styles.headerRowDark : styles.headerRowLight,
      ]}>
        {columns.map((column, index) => (
          <View
            key={`header-${column.key}-${index}`}
            style={[
              styles.headerCell,
              { width: column.width || `${100 / columns.length}%` },
            ]}
          >
            <Text
              style={[
                styles.headerText,
                isDark ? styles.headerTextDark : styles.headerTextLight,
              ]}
            >
              {column.title}
            </Text>
          </View>
        ))}
      </View>
      
      {/* Table Body */}
      <ScrollView>
        {data.length > 0 ? (
          data.map((item, rowIndex) => (
            <View
              key={`row-${rowIndex}`}
              style={[
                styles.row,
                rowIndex % 2 === 0
                  ? isDark ? styles.evenRowDark : styles.evenRowLight
                  : isDark ? styles.oddRowDark : styles.oddRowLight,
              ]}
            >
              {columns.map((column, cellIndex) => (
                <View
                  key={`cell-${rowIndex}-${cellIndex}`}
                  style={[
                    styles.cell,
                    { width: column.width || `${100 / columns.length}%` },
                  ]}
                >
                  {column.render ? (
                    column.render(item[column.key], item, rowIndex)
                  ) : (
                    <Text
                      style={[
                        styles.cellText,
                        isDark ? styles.cellTextDark : styles.cellTextLight,
                      ]}
                    >
                      {item[column.key]?.toString() || ''}
                    </Text>
                  )}
                </View>
              ))}
            </View>
          ))
        ) : (
          <View style={styles.emptyContainer}>
            <Text
              style={[
                styles.emptyText,
                isDark ? styles.emptyTextDark : styles.emptyTextLight,
              ]}
            >
              {emptyText}
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderRadius: 8,
    overflow: 'hidden',
  },
  headerRow: {
    flexDirection: 'row',
    padding: 12,
  },
  headerRowLight: {
    backgroundColor: '#F1F5F9',
    borderBottomColor: '#E2E8F0',
    borderBottomWidth: 1,
  },
  headerRowDark: {
    backgroundColor: '#0F172A',
    borderBottomColor: '#334155',
    borderBottomWidth: 1,
  },
  headerCell: {
    justifyContent: 'center',
  },
  headerText: {
    fontWeight: '600',
    fontSize: 14,
  },
  headerTextLight: {
    color: '#64748B',
  },
  headerTextDark: {
    color: '#94A3B8',
  },
  row: {
    flexDirection: 'row',
    padding: 12,
    borderBottomWidth: 1,
  },
  evenRowLight: {
    backgroundColor: '#FFFFFF',
    borderBottomColor: '#E2E8F0',
  },
  evenRowDark: {
    backgroundColor: '#1E1E1E',
    borderBottomColor: '#334155',
  },
  oddRowLight: {
    backgroundColor: '#F8FAFC',
    borderBottomColor: '#E2E8F0',
  },
  oddRowDark: {
    backgroundColor: '#111827',
    borderBottomColor: '#334155',
  },
  cell: {
    justifyContent: 'center',
  },
  cellText: {
    fontSize: 14,
  },
  cellTextLight: {
    color: '#1E293B',
  },
  cellTextDark: {
    color: '#E2E8F0',
  },
  emptyContainer: {
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 14,
  },
  emptyTextLight: {
    color: '#64748B',
  },
  emptyTextDark: {
    color: '#94A3B8',
  },
});