import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Svg, { G, Circle } from 'react-native-svg';
import axios from 'axios';
import { useAuthStore } from '@/store/authStore';

const periods = ['daily', 'weekly', 'monthly', 'quarterly'];

export const PieChartWithFilter = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('weekly');
  const [income, setIncome] = useState(0);
  const [expense, setExpense] = useState(0);

  const token = useAuthStore.getState().getAccessToken();

  useEffect(() => {
    fetchData();
  }, [selectedPeriod]);

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/cashflow?period=${selectedPeriod}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = response.data.data;
      const totalIncome = data.reduce(
        (sum: number, d: any) => sum + Number(d.income),
        0
      );
      const totalExpense = data.reduce(
        (sum: number, d: any) => sum + Number(d.expense),
        0
      );

      setIncome(totalIncome);
      setExpense(totalExpense);
    } catch (error) {
      console.error(error);
    }
  };

  const total = income + expense;
  const expensePercentage = (expense / total) * 100;
  const incomePercentage = 100 - expensePercentage;

  const radius = 50;
  const circumference = 2 * Math.PI * radius;

  return (
    <View style={styles.container}>
      <View style={styles.buttonGroup}>
        {periods.map((p) => (
          <TouchableOpacity
            key={p}
            style={[styles.button, selectedPeriod === p && styles.buttonActive]}
            onPress={() => setSelectedPeriod(p)}
          >
            <Text
              style={selectedPeriod === p ? styles.textActive : styles.text}
            >
              {p.toUpperCase()}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Svg width="150" height="150">
        <G rotation="-90" origin="75, 75">
          <Circle
            cx="75"
            cy="75"
            r={radius}
            stroke="#d1d5db"
            strokeWidth="20"
            fill="transparent"
          />
          <Circle
            cx="75"
            cy="75"
            r={radius}
            stroke="#3b82f6"
            strokeWidth="20"
            strokeDasharray={`${
              (incomePercentage / 100) * circumference
            } ${circumference}`}
            strokeLinecap="round"
            fill="transparent"
          />
        </G>
      </Svg>

      <Text style={styles.legend}>Income: {income.toLocaleString()}</Text>
      <Text style={styles.legend}>Expense: {expense.toLocaleString()}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { alignItems: 'center', marginVertical: 20 },
  buttonGroup: { flexDirection: 'row', marginBottom: 10 },
  button: {
    padding: 8,
    marginHorizontal: 5,
    borderRadius: 6,
    backgroundColor: '#f3f4f6',
  },
  buttonActive: { backgroundColor: '#3b82f6' },
  text: { color: '#374151' },
  textActive: { color: '#fff' },
  legend: { marginTop: 6, fontSize: 14 },
});
