import React, { useState, useEffect } from 'react';
import {
  Typography,
  Box,
  Grid,
  Paper,
  CircularProgress,
  Container,
  Card,
  CardContent,
  Divider,
  useTheme
} from '@mui/material';
import {
  Timeline,
  Assessment,
  EmojiEvents,
  School,
  TrendingUp,
  AccessTime
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

function CircularProgressWithLabel({ value, label, icon: Icon }) {
  const theme = useTheme();
  
  return (
    <Box sx={{ position: 'relative', display: 'inline-flex', flexDirection: 'column', alignItems: 'center' }}>
      <Box sx={{ position: 'relative', display: 'inline-flex' }}>
        <CircularProgress
          variant="determinate"
          value={value}
          size={80}
          thickness={4}
          sx={{
            color: theme.palette.primary.main,
            circle: {
              strokeLinecap: 'round',
            },
          }}
        />
        <Box
          sx={{
            top: 0,
            left: 0,
            bottom: 0,
            right: 0,
            position: 'absolute',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Icon color="primary" />
        </Box>
      </Box>
      <Typography variant="h6" component="div" sx={{ mt: 1 }}>
        {value}%
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
        {label}
      </Typography>
    </Box>
  );
}

function StatCard({ title, value, icon: Icon, description }) {
  return (
    <Card
      component={motion.div}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      sx={{ height: '100%' }}
    >
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Icon color="primary" sx={{ mr: 1 }} />
          <Typography variant="h6" component="div">
            {title}
          </Typography>
        </Box>
        <Typography variant="h4" component="div" sx={{ mb: 1 }}>
          {value}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {description}
        </Typography>
      </CardContent>
    </Card>
  );
}

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
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 4 }}>
          Your Statistics
        </Typography>

        <Grid container spacing={3}>
          {/* Progress Overview */}
          <Grid item xs={12}>
            <Paper
              elevation={3}
              sx={{
                p: 3,
                mb: 3,
                display: 'flex',
                justifyContent: 'space-around',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: 3
              }}
            >
              <CircularProgressWithLabel
                value={stats.averageScore}
                label="Average Score"
                icon={Assessment}
              />
              <CircularProgressWithLabel
                value={75}
                label="Completion Rate"
                icon={Timeline}
              />
              <CircularProgressWithLabel
                value={90}
                label="Accuracy"
                icon={TrendingUp}
              />
            </Paper>
          </Grid>

          {/* Detailed Stats */}
          <Grid item xs={12} sm={6} md={4}>
            <StatCard
              title="Total Quizzes"
              value={stats.totalQuizzes}
              icon={School}
              description="Quizzes completed overall"
            />
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <StatCard
              title="Current Streak"
              value={`${stats.streak} days`}
              icon={EmojiEvents}
              description="Keep up the momentum!"
            />
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <StatCard
              title="Study Time"
              value={stats.totalTime}
              icon={AccessTime}
              description="Total time spent learning"
            />
          </Grid>

          {/* Recent Activity */}
          <Grid item xs={12}>
            <Paper elevation={3} sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Recent Activity
              </Typography>
              <Divider sx={{ mb: 2 }} />
              {/* Add your recent activity timeline/list here */}
              <Typography color="text.secondary">
                Your recent quiz activities will appear here
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </motion.div>
    </Container>
  );
}

export default Statistics; 