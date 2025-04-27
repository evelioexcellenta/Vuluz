import { useState, useEffect } from "react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import Card from "../UI/Card";
import Button from "../UI/Button";
import { apiRequest } from "../../utils/api";
import { formatCurrency } from "../../utils/formatters";

const periods = ["daily", "weekly", "monthly", "quarterly"];
const chartTypes = ["bar", "area"];

const CashFlowChart = () => {
  const [period, setPeriod] = useState("weekly");
  const [chartType, setChartType] = useState("bar");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCashflow = async (selectedPeriod) => {
    try {
      setLoading(true);
      const res = await apiRequest(`/api/cashflow?period=${selectedPeriod}`);

      const monthOrder = [
        "JAN",
        "FEB",
        "MAR",
        "APR",
        "MAY",
        "JUN",
        "JUL",
        "AUG",
        "SEP",
        "OCT",
        "NOV",
        "DEC",
      ];

      const sortedData = [...res.data].sort((a, b) => {
        if (selectedPeriod === "daily") {
          return new Date(a.label) - new Date(b.label);
        } else if (selectedPeriod === "weekly") {
          return (
            Number(a.label.replace("Week ", "")) -
            Number(b.label.replace("Week ", ""))
          );
        } else if (selectedPeriod === "monthly") {
          return (
            monthOrder.indexOf(a.label.toUpperCase()) -
            monthOrder.indexOf(b.label.toUpperCase())
          );
        } else if (selectedPeriod === "quarterly") {
          return (
            Number(a.label.replace("Q", "")) - Number(b.label.replace("Q", ""))
          );
        }
      });

      setData(sortedData);
    } catch (error) {
      console.error("Failed to fetch cashflow:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCashflow(period);
  }, [period]);

  const handlePeriodChange = (newPeriod) => setPeriod(newPeriod);
  const handleChartTypeChange = (newType) => setChartType(newType);

  const isDark = document.documentElement.classList.contains("dark");

  const chartColors = {
    income: "#34d399",
    expense: "#f87171",
    net: "#60a5fa",
    background: isDark ? "#1f2937" : "#ffffff",
    grid: isDark ? "#374151" : "#e5e7eb",
    text: isDark ? "#d1d5db" : "#4b5563",
  };

  return (
    <Card>
      <Card.Header
        title="Cash Flow Chart"
        subtitle="Income, Expenses, and Net Savings"
      />
      <Card.Body>
        {/* Tombol Pilihan */}
        <div className="flex justify-between mb-4">
          {/* Period Button */}
          <div className="space-x-2">
            {periods.map((p) => (
              <Button
                key={p}
                size="sm"
                variant={period === p ? "primary" : "outline"}
                onClick={() => handlePeriodChange(p)}
              >
                {p.charAt(0).toUpperCase() + p.slice(1)}
              </Button>
            ))}
          </div>

          {/* Chart Type Button */}
          <div className="space-x-2">
            {chartTypes.map((t) => (
              <Button
                key={t}
                size="sm"
                variant={chartType === t ? "primary" : "outline"}
                onClick={() => handleChartTypeChange(t)}
              >
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </Button>
            ))}
          </div>
        </div>

        {/* Chart */}
        {loading ? (
          <div className="h-64 flex items-center justify-center">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary-500"></div>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={350}>
            {chartType === "bar" ? (
              <BarChart
                data={data}
                margin={{ top: 20, right: 30, left: 50, bottom: 0 }}
              >
                <CartesianGrid
                  stroke={chartColors.grid}
                  strokeDasharray="3 3"
                />
                <XAxis
                  dataKey="label"
                  stroke={chartColors.text}
                  tickFormatter={(tick) =>
                    tick.charAt(0) + tick.slice(1).toLowerCase()
                  }
                />

                <YAxis
                  stroke={chartColors.text}
                  tickFormatter={formatCurrency}
                />
                <Tooltip
                  formatter={formatCurrency}
                  contentStyle={{
                    background: chartColors.background,
                    borderRadius: 8,
                  }}
                />
                <Legend />
                <Bar
                  dataKey="income"
                  fill={chartColors.income}
                  barSize={20}
                  radius={[6, 6, 0, 0]}
                />
                <Bar
                  dataKey="expense"
                  fill={chartColors.expense}
                  barSize={20}
                  radius={[6, 6, 0, 0]}
                />
                <Bar
                  dataKey="net"
                  fill={chartColors.net}
                  barSize={20}
                  radius={[6, 6, 0, 0]}
                />
              </BarChart>
            ) : (
              <AreaChart
                data={data}
                margin={{ top: 20, right: 30, left: 60, bottom: 0 }}
              >
                <defs>
                  <linearGradient
                    id="incomeGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="5%"
                      stopColor={chartColors.income}
                      stopOpacity={0.8}
                    />
                    <stop
                      offset="95%"
                      stopColor={chartColors.income}
                      stopOpacity={0}
                    />
                  </linearGradient>
                  <linearGradient
                    id="expenseGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="5%"
                      stopColor={chartColors.expense}
                      stopOpacity={0.8}
                    />
                    <stop
                      offset="95%"
                      stopColor={chartColors.expense}
                      stopOpacity={0}
                    />
                  </linearGradient>
                  <linearGradient id="netGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="5%"
                      stopColor={chartColors.net}
                      stopOpacity={0.8}
                    />
                    <stop
                      offset="95%"
                      stopColor={chartColors.net}
                      stopOpacity={0}
                    />
                  </linearGradient>
                </defs>

                <CartesianGrid
                  stroke={chartColors.grid}
                  strokeDasharray="3 3"
                />
                <XAxis
                  dataKey="label"
                  stroke={chartColors.text}
                  tickFormatter={(tick) =>
                    tick.charAt(0) + tick.slice(1).toLowerCase()
                  }
                />

                <YAxis
                  stroke={chartColors.text}
                  tickFormatter={formatCurrency}
                />
                <Tooltip
                  formatter={formatCurrency}
                  contentStyle={{
                    background: chartColors.background,
                    borderRadius: 8,
                  }}
                />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="income"
                  stroke={chartColors.income}
                  fill="url(#incomeGradient)"
                  strokeWidth={3}
                />
                <Area
                  type="monotone"
                  dataKey="expense"
                  stroke={chartColors.expense}
                  fill="url(#expenseGradient)"
                  strokeWidth={3}
                />
                <Area
                  type="monotone"
                  dataKey="net"
                  stroke={chartColors.net}
                  fill="url(#netGradient)"
                  strokeWidth={3}
                />
              </AreaChart>
            )}
          </ResponsiveContainer>
        )}
      </Card.Body>
    </Card>
  );
};

export default CashFlowChart;
