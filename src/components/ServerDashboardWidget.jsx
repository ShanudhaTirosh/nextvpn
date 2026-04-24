import React, { useEffect, useRef, useState } from 'react';
import GlassCard from './GlassCard';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend
);

const ServerDashboardWidget = () => {
  const chartRef = useRef(null);
  const [cpuData, setCpuData] = useState([20, 22, 25, 23, 28, 30, 24]);
  const [ramData, setRamData] = useState([45, 46, 46, 48, 50, 49, 47]);
  const [logs] = useState([
    { type: 'info', text: 'Server started on port 25565' },
    { type: 'load', text: 'Loading world... Done (2.3s)' }
  ]);

  const labels = ['1', '2', '3', '4', '5', '6', '7'];

  useEffect(() => {
    // Simulate live data updates
    const interval = setInterval(() => {
      setCpuData(prev => {
        const newData = [...prev.slice(1)];
        newData.push(Math.max(10, Math.min(90, prev[prev.length - 1] + (Math.random() * 10 - 5))));
        return newData;
      });
      setRamData(prev => {
        const newData = [...prev.slice(1)];
        newData.push(Math.max(30, Math.min(80, prev[prev.length - 1] + (Math.random() * 4 - 2))));
        return newData;
      });
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const data = {
    labels,
    datasets: [
      {
        label: 'CPU',
        data: cpuData,
        borderColor: '#00E5FF', // var(--accent-cyan)
        backgroundColor: 'rgba(0, 229, 255, 0.08)',
        fill: true,
        tension: 0.4,
        borderWidth: 2,
        pointRadius: 0,
        pointHitRadius: 10,
      },
      {
        label: 'RAM',
        data: ramData,
        borderColor: '#8B5CF6', // var(--accent-purple)
        backgroundColor: 'rgba(139, 92, 246, 0.08)',
        fill: true,
        tension: 0.4,
        borderWidth: 2,
        pointRadius: 0,
        pointHitRadius: 10,
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    animation: { duration: 1000, easing: 'linear' },
    plugins: {
      legend: { display: false },
      tooltip: { enabled: false }
    },
    scales: {
      x: {
        display: false,
        grid: { display: false }
      },
      y: {
        display: true,
        min: 0,
        max: 100,
        grid: {
          color: 'rgba(255, 255, 255, 0.04)',
          drawBorder: false,
        },
        ticks: { display: false }
      }
    }
  };

  return (
    <GlassCard className="server-widget widget-float">
      <div className="server-widget-header">
        <div className="text-white fw-bold" style={{ fontSize: '0.85rem' }}>Server Dashboard</div>
        <div className="badge-active px-2 py-1" style={{ fontSize: '0.65rem' }}>
          <span className="pulse-dot"></span> Live
        </div>
      </div>

      <div className="latency-badge">
        <i className="fa-solid fa-bolt text-warning"></i> 2.3ms latency
      </div>

      <div className="metric-cards">
        <div className="metric-card">
          <i className="fa-solid fa-users text-muted"></i>
          <div className="value" style={{ color: 'var(--accent-cyan)' }}>347 <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 600 }}>/500</span></div>
          <div className="label">Players</div>
        </div>
        <div className="metric-card">
          <i className="fa-solid fa-microchip text-muted"></i>
          <div className="value" style={{ color: 'var(--accent-cyan)' }}>{Math.round(cpuData[cpuData.length - 1])}%</div>
          <div className="label">CPU Usage</div>
        </div>
        <div className="metric-card">
          <i className="fa-solid fa-memory text-muted"></i>
          <div className="value" style={{ color: 'var(--accent-purple)' }}>{((ramData[ramData.length - 1] / 100) * 8).toFixed(1)}<span style={{ fontSize: '0.8rem' }}>GB</span></div>
          <div className="label">RAM Usage</div>
        </div>
      </div>

      <div className="chart-section">
        <div className="chart-header">
          <div className="text-white" style={{ fontSize: '0.85rem', fontWeight: 600 }}>Performance</div>
          <div className="chart-legend">
            <div><span className="dot" style={{ background: 'var(--accent-cyan)' }}></span> CPU</div>
            <div><span className="dot" style={{ background: 'var(--accent-purple)' }}></span> RAM</div>
          </div>
        </div>
        <div style={{ height: '100px', width: '100%' }}>
          <Line options={options} data={data} ref={chartRef} />
        </div>
      </div>

      <div className="ddos-badge">
        <i className="fa-solid fa-shield-halved"></i> DDoS Protected
      </div>

      <div className="terminal-block">
        <div className="terminal-header">&gt;_ Console</div>
        {logs.map((log, idx) => (
          <div className="terminal-line" key={idx}>
            <span className={`tag ${log.type}`}>[{log.type.toUpperCase()}]</span> {log.text}
          </div>
        ))}
        <div className="terminal-line">
          &gt; <span className="terminal-cursor">|</span>
        </div>
      </div>
    </GlassCard>
  );
};

export default ServerDashboardWidget;
