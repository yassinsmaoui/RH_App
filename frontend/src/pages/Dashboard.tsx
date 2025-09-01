// src/components/Dashboard.tsx
import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Chip,
  Divider,
  Grid,            // <-- import nommé
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Paper,
  Typography,
  Avatar,
  Button,
} from '@mui/material';
import {
  People,
  EventNote,
  AttachMoney,
  Assignment,
  Refresh,
  ArrowUpward,
  ArrowDownward,
  MoreVert,
  CalendarToday,
} from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import { motion } from 'framer-motion';
import { Bar, Doughnut, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { useAppSelector } from '../store/hooks';

// Enregistrement ChartJS
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
);

interface StatCard {
  title: string;
  value: string | number;
  change: number;
  icon: React.ReactNode;
  color: string;
}

const Dashboard: React.FC = () => {
  const theme = useTheme();
  const { user } = useAppSelector((state) => state.auth);
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 2000);
  };

  const statCards: StatCard[] = [
    { title: 'Total Employees',   value: 248,         change: 12, icon: <People />,     color: '#667eea' },
    { title: 'On Leave Today',    value: 8,           change: -2, icon: <EventNote />,  color: '#f59e0b' },
    { title: 'Pending Requests',  value: 15,          change: 5,  icon: <Assignment />, color: '#10b981' },
    { title: 'Payroll This Month', value: '$125,430', change: 8,  icon: <AttachMoney />,color: '#ef4444' },
  ];

  const attendanceData = {
    labels: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'],
    datasets: [
      {
        label: 'Present',
        data: [95, 92, 97, 94, 96, 85, 0],
        backgroundColor: 'rgba(102,126,234,0.8)',
        borderColor: 'rgba(102,126,234,1)',
        borderWidth: 2,
        borderRadius: 8,
      },
      {
        label: 'Absent',
        data: [5, 8, 3, 6, 4, 15, 0],
        backgroundColor: 'rgba(239,68,68,0.8)',
        borderColor: 'rgba(239,68,68,1)',
        borderWidth: 2,
        borderRadius: 8,
      },
    ],
  };

  const departmentData = {
    labels: ['Engineering','Sales','Marketing','HR','Finance','Operations'],
    datasets: [{
      data: [65,45,35,20,25,38],
      backgroundColor: ['#667eea','#764ba2','#f59e0b','#10b981','#ef4444','#3b82f6'],
      borderWidth: 0,
    }],
  };

  const performanceData = {
    labels: ['Jan','Feb','Mar','Apr','May','Jun'],
    datasets: [{
      label: 'Avg Performance',
      data: [3.2, 3.5, 3.8, 3.6, 4.0, 4.2],
      borderColor: '#667eea',
      backgroundColor: 'rgba(102,126,234,0.1)',
      tension: 0.4,
      fill: true,
    }],
  };

  const recentActivities = [
    { id: 1, user: 'John Doe',     action: 'submitted a leave request',   time: '2 minutes ago',   avatar: 'JD' },
    { id: 2, user: 'Jane Smith',   action: 'completed performance review', time: '15 minutes ago',  avatar: 'JS' },
    { id: 3, user: 'Mike Johnson', action: 'checked in',                   time: '1 hour ago',      avatar: 'MJ' },
    { id: 4, user: 'Sarah Wilson', action: 'uploaded training certificate', time: '2 hours ago',     avatar: 'SW' },
  ];

  const upcomingEvents = [
    { id: 1, title: 'Team Meeting',        date: 'Today, 3:00 PM' },
    { id: 2, title: 'Performance Reviews', date: 'Tomorrow'       },
    { id: 3, title: 'Payroll Processing',  date: 'Dec 25'         },
    { id: 4, title: 'Holiday - Christmas', date: 'Dec 25'         },
  ];

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 600, mb: 1 }}>
            Welcome back, {user?.firstName}! 👋
          </Typography>
          <Typography color="text.secondary">
            Voici l’état de votre organisation aujourd’hui
          </Typography>
        </Box>
        <Button
          variant="outlined"
          startIcon={<Refresh />}
          onClick={handleRefresh}
          disabled={refreshing}
        >
          {refreshing ? 'Refreshing…' : 'Refresh'}
        </Button>
      </Box>

      {/* Stat Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {statCards.map((stat, i) => (
          <Grid item xs={12} sm={6} md={3} key={i}>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
              <Card sx={{
                p: 3,
                height: '100%',
                background: `linear-gradient(135deg, ${stat.color}15, ${stat.color}05)`,
                border: `1px solid ${stat.color}20`,
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar sx={{ bgcolor: stat.color, width: 48, height: 48, mr: 2 }}>
                    {stat.icon}
                  </Avatar>
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography color="text.secondary">{stat.title}</Typography>
                    <Typography variant="h5" sx={{ fontWeight: 600 }}>{stat.value}</Typography>
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  {stat.change > 0
                    ? <ArrowUpward sx={{ color: '#10b981', mr: 0.5 }} />
                    : <ArrowDownward sx={{ color: '#ef4444', mr: 0.5 }} />}
                  <Typography sx={{ color: stat.change > 0 ? '#10b981' : '#ef4444', fontWeight: 600 }}>
                    {Math.abs(stat.change)}%
                  </Typography>
                  <Typography color="text.secondary" sx={{ ml: 1 }}>vs last month</Typography>
                </Box>
              </Card>
            </motion.div>
          </Grid>
        ))}
      </Grid>

      {/* Charts Row */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, height: 400 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>Weekly Attendance</Typography>
              <IconButton><MoreVert /></IconButton>
            </Box>
            <Bar
              data={attendanceData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { position: 'bottom' } },
                scales: { y: { beginAtZero: true, max: 100 } },
              }}
            />
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, height: 400 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>Department Distribution</Typography>
              <IconButton><MoreVert /></IconButton>
            </Box>
            <Box sx={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Doughnut
                data={departmentData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: { legend: { position: 'bottom' } },
                }}
              />
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Bottom Row */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, height: 400 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>Recent Activities</Typography>
            <List>
              {recentActivities.map((act, idx) => (
                <React.Fragment key={act.id}>
                  <ListItem sx={{ px: 0 }}>
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: '#667eea' }}>{act.avatar}</Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={<Typography variant="body2"><strong>{act.user}</strong> {act.action}</Typography>}
                      secondary={act.time}
                    />
                  </ListItem>
                  {idx < recentActivities.length - 1 && <Divider component="li" variant="inset" />}
                </React.Fragment>
              ))}
            </List>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, height: 400 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>Upcoming Events</Typography>
            <List>
              {upcomingEvents.map(ev => (
                <ListItem key={ev.id} sx={{ px: 0 }}>
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: '#f59e0b' }}><CalendarToday /></Avatar>
                  </ListItemAvatar>
                  <ListItemText primary={ev.title} secondary={ev.date} />
                  <Chip label={ev.date.split(',')[0].toLowerCase()} size="small" sx={{ textTransform: 'capitalize' }} />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, height: 400 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>Performance Trend</Typography>
              <IconButton><MoreVert /></IconButton>
            </Box>
            <Line
              data={performanceData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: { y: { beginAtZero: true, max: 5 } },
              }}
            />
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
