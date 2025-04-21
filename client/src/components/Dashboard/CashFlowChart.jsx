import { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { Chart, registerables } from 'chart.js';
import Card from '../UI/Card';
import useTransactions from '../../hooks/useTransactions';

// Register Chart.js components
Chart.register(...registerables);

const CashFlowChart = ({ period = 'weekly', className = '' }) => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);
  const { summary, isLoading } = useTransactions();
  
  // Set up chart data based on period
  useEffect(() => {
    if (isLoading || !summary) return;
    
    // Clean up any existing chart
    if (chartInstance.current) {
      chartInstance.current.destroy();
      chartInstance.current = null;
    }
    
    const canvas = chartRef.current;
    if (!canvas) return;
    
    // Determine data and labels based on period
    let data, labels;
    
    switch (period) {
      case 'weekly':
        data = summary.weeklyData || [];
        labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        break;
      case 'monthly':
        data = summary.monthlyData || [];
        labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        break;
      default:
        data = summary.weeklyData || [];
        labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    }
    
    // Create gradient for area under the line
    const ctx = canvas.getContext('2d');
    const gradient = ctx.createLinearGradient(0, 0, 0, 250);
    gradient.addColorStop(0, 'rgba(59, 130, 246, 0.3)');
    gradient.addColorStop(1, 'rgba(59, 130, 246, 0)');
    
    // Create chart
    chartInstance.current = new Chart(ctx, {
      type: 'line',
      data: {
        labels,
        datasets: [
          {
            label: 'Balance',
            data,
            borderColor: '#3B82F6',
            backgroundColor: gradient,
            tension: 0.3,
            fill: true,
            pointBackgroundColor: '#3B82F6',
            pointBorderColor: '#fff',
            pointBorderWidth: 2,
            pointRadius: 4,
            pointHoverRadius: 6
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            mode: 'index',
            intersect: false,
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            titleColor: '#1F2937',
            bodyColor: '#4B5563',
            borderColor: '#E5E7EB',
            borderWidth: 1,
            padding: 12,
            boxPadding: 6,
            usePointStyle: true,
            callbacks: {
              labelPointStyle: () => ({
                pointStyle: 'circle',
                rotation: 0
              }),
              label: (context) => {
                return `$${context.parsed.y.toFixed(2)}`;
              }
            }
          }
        },
        scales: {
          x: {
            grid: {
              display: false
            },
            ticks: {
              color: '#9CA3AF'
            }
          },
          y: {
            grid: {
              color: '#F3F4F6'
            },
            ticks: {
              color: '#9CA3AF',
              callback: (value) => {
                return `$${value}`;
              }
            },
            beginAtZero: false
          }
        }
      }
    });
    
    // Clean up on unmount
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
        chartInstance.current = null;
      }
    };
  }, [period, summary, isLoading]);
  
  // Determine title based on period
  const getChartTitle = () => {
    switch (period) {
      case 'weekly': return 'Weekly Cash Flow';
      case 'monthly': return 'Monthly Cash Flow';
      case 'quarterly': return 'Quarterly Cash Flow';
      default: return 'Cash Flow';
    }
  };
  
  return (
    <Card className={`animate-fade-in ${className}`}>
      <Card.Header title={getChartTitle()} />
      <Card.Body>
        {isLoading ? (
          <div className="h-64 w-full flex items-center justify-center">
            <svg className="animate-spin h-8 w-8 text-primary-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
        ) : (
          <div className="h-64">
            <canvas ref={chartRef}></canvas>
          </div>
        )}
        Chart here
      </Card.Body>
    </Card>
  );
};

CashFlowChart.propTypes = {
  period: PropTypes.oneOf(['weekly', 'monthly', 'quarterly']),
  className: PropTypes.string
};

export default CashFlowChart;