import React, { useRef, useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, LineElement, CategoryScale, LinearScale, PointElement, Filler } from 'chart.js';
import axios from 'axios';
import { HOMEDATA } from '../pages/Helpers/url';

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Filler);

const GraphChart = () => {
  const chartRef = useRef(null);
  const [chartData, setChartData] = useState(null);
  const [maxValue, setMaxValue] = useState(10);

  useEffect(() => {
   

    fetchChartData();
  }, []);

  const fetchChartData = async () => {
    try {
      const token = localStorage.getItem('Token');
      if (!token) {
        throw new Error('No token found');
      }

      const response = await axios.get(HOMEDATA, {
        headers: {
          "Authorization": `Bearer ${JSON.parse(token)}`
        }
      });

      const dataValues = response.data.events2024.map(event => event.count);
      const maxDataValue = Math.max(...dataValues);
      setMaxValue(maxDataValue + 5); // Add some buffer to the max value for better visualization
console.log(response.data.events2024,"callingg datta")
      const newData = {
        labels: response.data.events2024.map(event => event.month),
        datasets: [
          {
            label: 'Data',
            data: dataValues,
            borderColor: '#8A2CF4',
            backgroundColor: '', // This will be set dynamically
            fill: true,
            tension: 0.4,
          }, 
        ],
      };
      setChartData(newData);
    } catch (error) {
      console.error('Error fetching chart data:', error);
    }
  };

  useEffect(() => {
    const updateChart = () => {
      if (chartRef.current && chartData) {
        const chart = chartRef.current;
        const ctx = chart.ctx;
        const gradient = ctx.createLinearGradient(0, 0, 0, ctx.canvas.height);
        gradient.addColorStop(0.7, 'rgba(66, 28, 87, 0.8)');
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

        chart.data.datasets[0].backgroundColor = gradient;
        chart.data.datasets[0].data = chartData.datasets[0].data;
        chart.update();
      }
    };

    updateChart();
  }, [chartData]);

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: '#FFFFFF',
        },
        border: {
          display: true,
          color: '#fff',
          width: 2,
        },
      },
      y: {
        min: 0,
        max: maxValue, // Use the calculated max value
        grid: {
          display: false,
        },
        ticks: {
          color: '#FFFFFF',
          stepSize: 1,
        },
        border: {
          display: true,
          color: '#fff',
          width: 2,
        },
      },
    },
    elements: {
      line: {
        borderWidth: 4,
        borderColor: '#8A2CF4',
      },
      point: {
        radius: 0,
      },
    },
  };

  return (
    <div style={{ position: 'relative', width: '100%' }}>
      {chartData ? <Line ref={chartRef} data={chartData} options={options} /> : <p className='left'>Loading...</p>}
    </div>
  );
};

export default GraphChart;
