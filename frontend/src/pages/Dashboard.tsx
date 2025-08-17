import React, { useEffect, useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Avatar,
  Button,
  Alert,
  Stack,
} from '@mui/material';
import {
  People as PeopleIcon,
  EventNote as EventNoteIcon,
  AccessTime as AccessTimeIcon,
  AttachMoney as AttachMoneyIcon,
  Notifications as NotificationsIcon,
  BeachAccess as BeachAccessIcon,
  Work as WorkIcon,
} from '@mui/icons-material';

interface DashboardStats {
  totalEmployees: number;
  activeEmployees: number;
  presentToday: number;
  attendanceRate: number;
  pendingLeaves: number;
  openPositions: number;
}

interface Activity {
  id: number;
  type: 'leave' | 'attendance' | 'employee' | 'alert';
  message: string;
  timestamp: string;
  priority: 'high' | 'medium' | 'low';
}

interface NotificationStats {
  total: number;
  unread: number;
}

const StatCard: React.FC<{
  title: string;
  value: number;
  icon: React.ReactNode;
  color: string;
  subtitle?: string;
}> = ({ title, value, icon, color, subtitle }) => (
  <Card>
    <CardContent>
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <Box>
          <Typography color="textSecondary" gutterBottom variant="overline">
            {title}
          </Typography>
          <Typography variant="h4" component="div">
            {value}
          </Typography>
          {subtitle && (
            <Typography variant="body2" color="textSecondary">
              {subtitle}
            </Typography>
          )}
        </Box>
        <Avatar
          sx={{
            backgroundColor: color,
            height: 56,
            width: 56,
          }}
        >
          {icon}
        </Avatar>
      </Box>
    </CardContent>
  </Card>
);

const ActivityIcon: React.FC<{ type: string }> = ({ type }) => {
  switch (type) {
    case 'leave':
      return <BeachAccessIcon />;
    case 'attendance':
      return <AccessTimeIcon />;
    case 'employee':
      return <PeopleIcon />;
    default:
      return <NotificationsIcon />;
  }
};

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'high':
      return 'error';
    case 'medium':
      return 'warning';
    case 'low':
      return 'success';
    default:
      return 'default';
  }
};

const Dashboard: React.FC = () => {
  // Code original restauré
  const [stats, setStats] = useState<DashboardStats>({
    totalEmployees: 0,
    activeEmployees: 0,
    presentToday: 0,
    attendanceRate: 0,
    pendingLeaves: 0,
    openPositions: 0,
  });
  
  const [notificationStats, setNotificationStats] = useState<NotificationStats>({
    total: 0,
    unread: 0,
  });

  const [recentActivities, setRecentActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Simulate API calls for now
        setStats({
          totalEmployees: 125,
          activeEmployees: 118,
          presentToday: 105,
          attendanceRate: 89,
          pendingLeaves: 12,
          openPositions: 5,
        });

        setNotificationStats({
          total: 25,
          unread: 8,
        });

        setRecentActivities([
          {
            id: 1,
            type: 'leave',
            message: 'Marie Dubois a demandé un congé maladie',
            timestamp: new Date().toISOString(),
            priority: 'medium',
          },
          {
            id: 2,
            type: 'employee',
            message: 'Nouvel employé ajouté: Jean Martin',
            timestamp: new Date(Date.now() - 86400000).toISOString(),
            priority: 'low',
          },
          {
            id: 3,
            type: 'attendance',
            message: 'Retard signalé pour Pierre Durand',
            timestamp: new Date(Date.now() - 172800000).toISOString(),
            priority: 'high',
          },
        ]);
      } catch (err) {
        setError('Erreur lors du chargement des données du tableau de bord');
        console.error('Dashboard data fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        {error}
      </Alert>
    );
  }

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Tableau de Bord RH
      </Typography>
      
      {/* Stats Cards */}
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} sx={{ mb: 4 }}>
        <StatCard
          title="Total Employés"
          value={stats.totalEmployees}
          icon={<PeopleIcon />}
          color="#1976d2"
          subtitle={`${stats.activeEmployees} actifs`}
        />
        <StatCard
          title="Présents Aujourd'hui"
          value={stats.presentToday}
          icon={<EventNoteIcon />}
          color="#388e3c"
          subtitle={`${stats.attendanceRate}% taux`}
        />
        <StatCard
          title="Congés en Attente"
          value={stats.pendingLeaves}
          icon={<BeachAccessIcon />}
          color="#f57c00"
          subtitle="En attente d'approbation"
        />
        <StatCard
          title="Postes Ouverts"
          value={stats.openPositions}
          icon={<WorkIcon />}
          color="#7b1fa2"
          subtitle="Annonces actives"
        />
        <StatCard
          title="Notifications"
          value={notificationStats.total}
          icon={<NotificationsIcon />}
          color="#d32f2f"
          subtitle={`${notificationStats.unread} non lues`}
        />
      </Stack>

      <Stack direction={{ xs: 'column', md: 'row' }} spacing={3}>
        {/* Recent Activities */}
        <Card sx={{ flex: 1 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Activités Récentes
            </Typography>
            <List>
              {recentActivities.map((activity) => (
                <ListItem key={activity.id} divider>
                  <ListItemIcon>
                    <ActivityIcon type={activity.type} />
                  </ListItemIcon>
                  <ListItemText
                    primary={activity.message}
                    secondary={new Date(activity.timestamp).toLocaleDateString('fr-FR')}
                  />
                  <Chip
                    label={activity.priority}
                    color={getPriorityColor(activity.priority) as any}
                    size="small"
                  />
                </ListItem>
              ))}
            </List>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card sx={{ flex: 1 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Actions Rapides
            </Typography>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ flexWrap: 'wrap' }}>
              <Button
                variant="outlined"
                startIcon={<PeopleIcon />}
                href="/employees"
                sx={{ flex: 1, minWidth: '200px' }}
              >
                Voir Employés
              </Button>
              <Button
                variant="outlined"
                startIcon={<EventNoteIcon />}
                href="/attendance"
                sx={{ flex: 1, minWidth: '200px' }}
              >
                Présences
              </Button>
              <Button
                variant="outlined"
                startIcon={<BeachAccessIcon />}
                href="/leave"
                sx={{ flex: 1, minWidth: '200px' }}
              >
                Demandes de Congé
              </Button>
              <Button
                variant="outlined"
                startIcon={<AttachMoneyIcon />}
                href="/payroll"
                sx={{ flex: 1, minWidth: '200px' }}
              >
                Paie
              </Button>
            </Stack>
          </CardContent>
        </Card>
      </Stack>
    </Box>
  );
};

export default Dashboard;