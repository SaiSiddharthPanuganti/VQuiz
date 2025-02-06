import React, { useState, useEffect } from 'react';
import {
  Typography,
  Box,
  Grid,
  Paper,
  CircularProgress,
} from '@mui/material';
import {
  Timeline,
  TrendingUp,
  Grade,
  AccessTime,
  Quiz,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { PageContainer, GlassPaper } from '../styles/StyledComponents';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import api from '../services/api';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const StatCard = ({ icon: Icon, title, value, color }) => (
  <Paper
    sx={{
      p: 3,
      height: '100%',
      bgcolor: 'rgba(255, 255, 255, 0.05)',
      backdropFilter: 'blur(10px)',
      border: `1px solid ${color}22`,
      transition: 'transform 0.2s',
      '&:hover': {
        transform: 'translateY(-5px)',
      }
    }}
  >
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
      <Icon sx={{ color: color, fontSize: 32 }} />
      <Typography variant="h6" color="text.secondary">
        {title}
      </Typography>
    </Box>
    <Typography variant="h4" color={color}>
      {value}
    </Typography>
  </Paper>
);

function Statistics() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStatistics();
  }, []);

  const fetchStatistics = async () => {
    try {
      const response = await api.getStatistics();
      setStats(response);
    } catch (error) {
      console.error('Error fetching statistics:', error);
    } finally {
      setLoading(false);
    }
  };

  const chartData = {
    labels: stats?.progressData.map(d => d.date) || [],
    datasets: [
      {
        label: 'Quiz Scores',
        data: stats?.progressData.map(d => d.score) || [],
        borderColor: '#2196f3',
        backgroundColor: 'rgba(33, 150, 243, 0.1)',
        tension: 0.4,
        fill: true,
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: 'Progress Over Time',
        color: '#fff',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
        ticks: {
          color: '#fff',
        },
      },
      x: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
        ticks: {
          color: '#fff',
        },
      },
    },
  };

  if (loading) {
    return (
      <PageContainer>
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <CircularProgress />
        </Box>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{ width: '100%', maxWidth: '1200px' }}
      >
        <GlassPaper>
          <Typography variant="h4" gutterBottom sx={{ mb: 4 }}>
            Your Statistics
          </Typography>

          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                icon={Quiz}
                title="Total Quizzes"
                value={stats?.totalQuizzes}
                color="#2196f3"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                icon={Grade}
                title="Average Score"
                value={`${stats?.averageScore}%`}
                color="#4caf50"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                icon={TrendingUp}
                title="Best Score"
                value={`${stats?.bestScore}%`}
                color="#ff9800"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                icon={AccessTime}
                title="Total Time"
                value={`${stats?.totalTime}m`}
                color="#f50057"
              />
            </Grid>
          </Grid>

          <Paper
            sx={{
              p: 3,
              bgcolor: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(10px)',
            }}
          >
            <Line data={chartData} options={chartOptions} />
          </Paper>
        </GlassPaper>
      </motion.div>
    </PageContainer>
  );
}

export default Statistics; 