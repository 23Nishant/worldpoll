import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

interface Poll {
  question: string;
  options: string[];
  votes: number[];
}

interface DynamicPieChartProps {
  poll: Poll;
}

const DynamicPieChart: React.FC<DynamicPieChartProps> = ({ poll }) => {
  const data = {
    labels: poll.options,
    datasets: [
      {
        data: poll.votes,
        backgroundColor: [
          'rgba(0, 0, 0, 0.8)',
          'rgba(0, 0, 0, 0.5)',
        ],
        borderColor: [
          'rgba(0, 0, 0, 1)',
          'rgba(0, 0, 0, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom' as const,
      },
      title: {
        display: false,
      },
    },
  };

  return <Pie data={data} options={options} />;
};

export default DynamicPieChart;