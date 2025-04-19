import { useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
import { Transaction, TransactionType } from '../../types/transaction';
import Card from '../common/Card';
import Button from '../common/Button';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface TransactionChartProps {
  transactions: Transaction[];
}

type ChartView = 'weekly' | 'monthly' | 'quarterly';
type ChartType = 'line' | 'bar';

const TransactionChart: React.FC<TransactionChartProps> = ({ transactions }) => {
  const [chartView, setChartView] = useState<ChartView>('weekly');
  const [chartType, setChartType] = useState<ChartType>('line');
  
  const getChartData = () => {
    const now = new Date();
    const startDate = new Date();
    const labels: string[] = [];
    const incomingData: number[] = [];
    const outgoingData: number[] = [];
    
    if (chartView === 'weekly') {
      startDate.setDate(now.getDate() - now.getDay());
      for (let i = 0; i < 7; i++) {
        const day = new Date(startDate);
        day.setDate(startDate.getDate() + i);
        labels.push(day.toLocaleDateString('en-US', { weekday: 'short' }));
        
        const dayTransactions = transactions.filter(tx => {
          const txDate = new Date(tx.date);
          return txDate.toDateString() === day.toDateString();
        });
        
        incomingData.push(sumTransactions(dayTransactions, TransactionType.TOP_UP));
        outgoingData.push(sumTransactions(dayTransactions, TransactionType.TRANSFER));
      }
    } else if (chartView === 'monthly') {
      startDate.setDate(1);
      const weeks = 4;
      for (let i = 0; i < weeks; i++) {
        labels.push(`Week ${i + 1}`);
        
        const weekStart = new Date(startDate);
        weekStart.setDate(startDate.getDate() + (i * 7));
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekStart.getDate() + 6);
        
        const weekTransactions = transactions.filter(tx => {
          const txDate = new Date(tx.date);
          return txDate >= weekStart && txDate <= weekEnd;
        });
        
        incomingData.push(sumTransactions(weekTransactions, TransactionType.TOP_UP));
        outgoingData.push(sumTransactions(weekTransactions, TransactionType.TRANSFER));
      }
    } else {
      // Quarterly view
      startDate.setMonth(Math.floor(now.getMonth() / 3) * 3);
      for (let i = 0; i < 3; i++) {
        const monthDate = new Date(startDate);
        monthDate.setMonth(startDate.getMonth() + i);
        labels.push(monthDate.toLocaleDateString('en-US', { month: 'short' }));
        
        const monthTransactions = transactions.filter(tx => {
          const txDate = new Date(tx.date);
          return txDate.getMonth() === monthDate.getMonth();
        });
        
        incomingData.push(sumTransactions(monthTransactions, TransactionType.TOP_UP));
        outgoingData.push(sumTransactions(monthTransactions, TransactionType.TRANSFER));
      }
    }
    
    return {
      labels,
      datasets: [
        {
          label: 'Incoming',
          data: incomingData,
          borderColor: 'rgb(16, 185, 129)',
          backgroundColor: 'rgba(16, 185, 129, 0.5)',
          tension: 0.3,
        },
        {
          label: 'Outgoing',
          data: outgoingData,
          borderColor: 'rgb(239, 68, 68)',
          backgroundColor: 'rgba(239, 68, 68, 0.5)',
          tension: 0.3,
        },
      ],
    };
  };
  
  const sumTransactions = (transactions: Transaction[], type: TransactionType): number => {
    return transactions
      .filter(tx => tx.type === type)
      .reduce((sum, tx) => sum + tx.amount, 0);
  };
  
  const chartOptions: ChartOptions<'line' | 'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              label += new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD'
              }).format(context.parsed.y);
            }
            return label;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value) {
            return '$' + value;
          }
        }
      }
    },
  };
  
  return (
    <Card title="Transaction Overview" className="h-full">
      <div className="flex justify-between items-center mb-4">
        <div className="flex space-x-2">
          <Button
            size="sm"
            variant={chartView === 'weekly' ? 'primary' : 'outline'}
            onClick={() => setChartView('weekly')}
          >
            Weekly
          </Button>
          <Button
            size="sm"
            variant={chartView === 'monthly' ? 'primary' : 'outline'}
            onClick={() => setChartView('monthly')}
          >
            Monthly
          </Button>
          <Button
            size="sm"
            variant={chartView === 'quarterly' ? 'primary' : 'outline'}
            onClick={() => setChartView('quarterly')}
          >
            Quarterly
          </Button>
        </div>
        <div className="flex space-x-2">
          <Button
            size="sm"
            variant={chartType === 'line' ? 'secondary' : 'ghost'}
            onClick={() => setChartType('line')}
          >
            Line
          </Button>
          <Button
            size="sm"
            variant={chartType === 'bar' ? 'secondary' : 'ghost'}
            onClick={() => setChartType('bar')}
          >
            Bar
          </Button>
        </div>
      </div>
      <div className="h-64">
        {chartType === 'line' ? (
          <Line data={getChartData()} options={chartOptions} />
        ) : (
          <Bar data={getChartData()} options={chartOptions} />
        )}
      </div>
    </Card>
  );
};

export default TransactionChart;