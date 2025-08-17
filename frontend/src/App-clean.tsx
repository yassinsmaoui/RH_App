import React, { useState, createContext, useContext } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { 
  CssBaseline, 
  Container, 
  Typography, 
  Button, 
  TextField, 
  Paper, 
  Box,
  Alert,
  Grid,
  Card,
  CardContent,
  Avatar,
  Chip,
  Divider,
  AppBar,
  Toolbar,
  IconButton,
  Badge,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
  TablePagination,
  Fab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment,
  Breadcrumbs,
  Link,
  Tabs,
  Tab
} from '@mui/material';
import {
  People as PeopleIcon,
  AccessTime as AccessTimeIcon,
  BeachAccess as BeachAccessIcon,
  TrendingUp as TrendingUpIcon,
  Notifications as NotificationsIcon,
  AccountCircle as AccountCircleIcon,
  Dashboard as DashboardIcon,
  Business as BusinessIcon,
  Assignment as AssignmentIcon,
  Schedule as ScheduleIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  FilterList as FilterListIcon,
  ArrowBack as ArrowBackIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationOnIcon,
  Work as WorkIcon,
  CalendarToday as CalendarTodayIcon,
  AttachMoney as AttachMoneyIcon
} from '@mui/icons-material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import theme from './theme';

// Context d'authentification simple
interface AuthContextType {
  isAuthenticated: boolean;
  user: any;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

// Provider d'authentification
const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<any>(null);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Simulation des comptes de test
    const testAccounts = [
      { email: 'admin@test.com', password: 'password', name: 'Admin User' },
      { email: 'hr@test.com', password: 'password', name: 'HR Manager' },
      { email: 'celeste.yassine@gmail.com', password: 'password', name: 'Celeste Yassine' },
      { email: 'user@test.com', password: 'password', name: 'Regular User' }
    ];

    const account = testAccounts.find(acc => acc.email === email && acc.password === password);
    
    if (account) {
      setUser(account);
      setIsAuthenticated(true);
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Validation schema
const validationSchema = yup.object({
  email: yup
    .string()
    .email('Entrez un email valide')
    .required('Email requis'),
  password: yup
    .string()
    .min(6, 'Le mot de passe doit contenir au moins 6 caractères')
    .required('Mot de passe requis'),
});

// Composant Login fonctionnel
const Login: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      setError('');
      const success = await login(values.email, values.password);
      if (success) {
        navigate('/dashboard');
      } else {
        setError('Email ou mot de passe incorrect');
      }
    },
  });

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Paper elevation={3} sx={{ padding: 4, width: '100%' }}>
          <Typography component="h1" variant="h4" align="center" gutterBottom>
            Connexion
          </Typography>
          <Typography variant="body2" align="center" color="textSecondary" sx={{ mb: 3 }}>
            Système de Gestion RH
          </Typography>
          
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={formik.handleSubmit} sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Adresse email"
              name="email"
              autoComplete="email"
              autoFocus
              value={formik.values.email}
              onChange={formik.handleChange}
              error={formik.touched.email && Boolean(formik.errors.email)}
              helperText={formik.touched.email && formik.errors.email}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Mot de passe"
              type="password"
              id="password"
              autoComplete="current-password"
              value={formik.values.password}
              onChange={formik.handleChange}
              error={formik.touched.password && Boolean(formik.errors.password)}
              helperText={formik.touched.password && formik.errors.password}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={formik.isSubmitting}
            >
              Se connecter
            </Button>
          </Box>

          <Box sx={{ mt: 3, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
            <Typography variant="subtitle2" gutterBottom>
              Comptes de test :
            </Typography>
            <Typography variant="body2" component="div">
              • admin@test.com / password<br/>
              • hr@test.com / password<br/>
              • celeste.yassine@gmail.com / password<br/>
              • user@test.com / password
            </Typography>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

// Layout commun
const Layout: React.FC<{ children: React.ReactNode; title: string }> = ({ children, title }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" elevation={0} sx={{ bgcolor: 'primary.main', mb: 4 }}>
        <Toolbar>
          <IconButton color="inherit" onClick={() => navigate('/dashboard')} sx={{ mr: 1 }}>
            <ArrowBackIcon />
          </IconButton>
          <DashboardIcon sx={{ mr: 2 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            {title}
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <IconButton color="inherit">
              <Badge badgeContent={4} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>
            
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Avatar sx={{ width: 32, height: 32, bgcolor: 'secondary.main' }}>
                {user?.name?.charAt(0) || 'U'}
              </Avatar>
              <Box>
                <Typography variant="subtitle2" sx={{ color: 'white', lineHeight: 1 }}>
                  {user?.name || 'Utilisateur'}
                </Typography>
                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)', lineHeight: 1 }}>
                  {user?.email?.includes('admin') ? 'Administrateur' : 'Utilisateur'}
                </Typography>
              </Box>
            </Box>
            
            <Button color="inherit" variant="outlined" onClick={handleLogout} sx={{ ml: 2 }}>
              Déconnexion
            </Button>
          </Box>
        </Toolbar>
      </AppBar>
      <Container maxWidth="xl">
        {children}
      </Container>
    </Box>
  );
};

// Dashboard principal
const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleNavigateToPage = (page: string) => {
    navigate(`/${page}`);
  };

  const stats = [
    {
      title: 'Total Employés',
      value: '247',
      icon: <PeopleIcon sx={{ fontSize: 40 }} />,
      color: '#1976d2',
      change: '+12%',
      bgColor: '#e3f2fd'
    },
    {
      title: 'Présent Aujourd\'hui',
      value: '234',
      icon: <AccessTimeIcon sx={{ fontSize: 40 }} />,
      color: '#388e3c',
      change: '+5%',
      bgColor: '#e8f5e8'
    },
    {
      title: 'Demandes de Congés',
      value: '18',
      icon: <BeachAccessIcon sx={{ fontSize: 40 }} />,
      color: '#f57c00',
      change: '-3%',
      bgColor: '#fff3e0'
    },
    {
      title: 'Performance Moyenne',
      value: '87%',
      icon: <TrendingUpIcon sx={{ fontSize: 40 }} />,
      color: '#7b1fa2',
      change: '+8%',
      bgColor: '#f3e5f5'
    }
  ];

  const recentActivities = [
    { name: 'Marie Dubois', action: 'a demandé un congé', time: 'Il y a 2h', avatar: 'MD' },
    { name: 'Pierre Martin', action: 'a été promu', time: 'Il y a 4h', avatar: 'PM' },
    { name: 'Sophie Bernard', action: 'a terminé sa formation', time: 'Il y a 6h', avatar: 'SB' },
    { name: 'Lucas Petit', action: 'a rejoint l\'équipe', time: 'Hier', avatar: 'LP' },
  ];

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" elevation={0} sx={{ bgcolor: 'primary.main', mb: 4 }}>
        <Toolbar>
          <DashboardIcon sx={{ mr: 2 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Système de Gestion RH
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <IconButton color="inherit">
              <Badge badgeContent={4} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>
            
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Avatar sx={{ width: 32, height: 32, bgcolor: 'secondary.main' }}>
                {user?.name?.charAt(0) || 'U'}
              </Avatar>
              <Box>
                <Typography variant="subtitle2" sx={{ color: 'white', lineHeight: 1 }}>
                  {user?.name || 'Utilisateur'}
                </Typography>
                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)', lineHeight: 1 }}>
                  {user?.email?.includes('admin') ? 'Administrateur' : 'Utilisateur'}
                </Typography>
              </Box>
            </Box>
            
            <Button color="inherit" variant="outlined" onClick={handleLogout} sx={{ ml: 2 }}>
              Déconnexion
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      <Container maxWidth="xl">
        <Paper 
          sx={{ 
            p: 3, 
            mb: 4, 
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            borderRadius: 2
          }}
        >
          <Typography variant="h4" gutterBottom>
            Bienvenue, {user?.name || 'Utilisateur'} ! 👋
          </Typography>
          <Typography variant="h6" sx={{ opacity: 0.9 }}>
            Voici un aperçu de votre système RH aujourd'hui
          </Typography>
        </Paper>

        <Grid container spacing={3} sx={{ mb: 4 }}>
          {stats.map((stat, index) => (
            <Grid size={{ xs: 12, sm: 6, md: 3 }} key={index}>
              <Card 
                sx={{ 
                  height: '100%',
                  transition: 'transform 0.2s',
                  '&:hover': { transform: 'translateY(-4px)' },
                  borderRadius: 2,
                  overflow: 'visible'
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Box 
                      sx={{ 
                        p: 1.5, 
                        borderRadius: 2, 
                        bgcolor: stat.bgColor,
                        color: stat.color,
                        mr: 2
                      }}
                    >
                      {stat.icon}
                    </Box>
                    <Chip 
                      label={stat.change}
                      size="small"
                      color={stat.change.includes('+') ? 'success' : 'error'}
                      variant="outlined"
                    />
                  </Box>
                  <Typography variant="h3" component="div" sx={{ fontWeight: 'bold', mb: 1 }}>
                    {stat.value}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {stat.title}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 8 }}>
            <Card sx={{ borderRadius: 2, height: 'fit-content' }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                  <BusinessIcon sx={{ mr: 1 }} />
                  Actions Rapides
                </Typography>
                <Grid container spacing={2} sx={{ mt: 1 }}>
                  {[
                    { label: 'Gestion des Employés', color: 'primary', icon: <PeopleIcon />, route: 'employees' },
                    { label: 'Pointages', color: 'secondary', icon: <AccessTimeIcon />, route: 'attendance' },
                    { label: 'Demandes de Congés', color: 'success', icon: <BeachAccessIcon />, route: 'leave' },
                    { label: 'Évaluations', color: 'warning', icon: <TrendingUpIcon />, route: 'performance' },
                    { label: 'Bulletins de Paie', color: 'info', icon: <AssignmentIcon />, route: 'payroll' },
                    { label: 'Planning', color: 'error', icon: <ScheduleIcon />, route: 'planning' }
                  ].map((action, index) => (
                    <Grid size={{ xs: 12, sm: 6, md: 4 }} key={index}>
                      <Button
                        variant="outlined"
                        fullWidth
                        size="large"
                        startIcon={action.icon}
                        onClick={() => handleNavigateToPage(action.route)}
                        sx={{ 
                          p: 2, 
                          height: 80,
                          borderRadius: 2,
                          textTransform: 'none',
                          fontSize: '0.95rem'
                        }}
                        color={action.color as any}
                      >
                        {action.label}
                      </Button>
                    </Grid>
                  ))}
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <Card sx={{ borderRadius: 2, height: 'fit-content' }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                  <NotificationsIcon sx={{ mr: 1 }} />
                  Activités Récentes
                </Typography>
                <List sx={{ mt: 1 }}>
                  {recentActivities.map((activity, index) => (
                    <React.Fragment key={index}>
                      <ListItem sx={{ px: 0 }}>
                        <ListItemAvatar>
                          <Avatar sx={{ bgcolor: 'primary.main', width: 40, height: 40 }}>
                            {activity.avatar}
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={
                            <Typography variant="body2">
                              <strong>{activity.name}</strong> {activity.action}
                            </Typography>
                          }
                          secondary={activity.time}
                        />
                      </ListItem>
                      {index < recentActivities.length - 1 && <Divider variant="inset" component="li" />}
                    </React.Fragment>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

// Page Employés
const EmployeesPage: React.FC = () => {
  return (
    <Layout title="Gestion des Employés">
      <Box sx={{ mb: 3 }}>
        <Breadcrumbs aria-label="breadcrumb">
          <Link color="inherit" href="/dashboard">Dashboard</Link>
          <Typography color="text.primary">Employés</Typography>
        </Breadcrumbs>
      </Box>
      <Paper sx={{ p: 3, borderRadius: 2, textAlign: 'center' }}>
        <PeopleIcon sx={{ fontSize: 80, color: 'primary.main', mb: 2 }} />
        <Typography variant="h4" gutterBottom>Module Employés</Typography>
        <Typography variant="body1" color="text.secondary">
          Gestion complète des employés, profils et informations personnelles.
        </Typography>
      </Paper>
    </Layout>
  );
};

// Page Présences
const AttendancePage: React.FC = () => {
  return (
    <Layout title="Gestion des Présences">
      <Box sx={{ mb: 3 }}>
        <Breadcrumbs aria-label="breadcrumb">
          <Link color="inherit" href="/dashboard">Dashboard</Link>
          <Typography color="text.primary">Présences</Typography>
        </Breadcrumbs>
      </Box>
      <Paper sx={{ p: 3, borderRadius: 2, textAlign: 'center' }}>
        <AccessTimeIcon sx={{ fontSize: 80, color: 'primary.main', mb: 2 }} />
        <Typography variant="h4" gutterBottom>Module Présences</Typography>
        <Typography variant="body1" color="text.secondary">
          Suivi des pointages, horaires et temps de travail.
        </Typography>
      </Paper>
    </Layout>
  );
};

// Page Congés
const LeavePage: React.FC = () => {
  return (
    <Layout title="Gestion des Congés">
      <Box sx={{ mb: 3 }}>
        <Breadcrumbs aria-label="breadcrumb">
          <Link color="inherit" href="/dashboard">Dashboard</Link>
          <Typography color="text.primary">Congés</Typography>
        </Breadcrumbs>
      </Box>
      <Paper sx={{ p: 3, borderRadius: 2, textAlign: 'center' }}>
        <BeachAccessIcon sx={{ fontSize: 80, color: 'primary.main', mb: 2 }} />
        <Typography variant="h4" gutterBottom>Module Congés</Typography>
        <Typography variant="body1" color="text.secondary">
          Gestion des demandes de congés et validation.
        </Typography>
      </Paper>
    </Layout>
  );
};

// Page Performance
const PerformancePage: React.FC = () => {
  return (
    <Layout title="Évaluations de Performance">
      <Box sx={{ mb: 3 }}>
        <Breadcrumbs aria-label="breadcrumb">
          <Link color="inherit" href="/dashboard">Dashboard</Link>
          <Typography color="text.primary">Performance</Typography>
        </Breadcrumbs>
      </Box>
      <Paper sx={{ p: 3, borderRadius: 2, textAlign: 'center' }}>
        <TrendingUpIcon sx={{ fontSize: 80, color: 'primary.main', mb: 2 }} />
        <Typography variant="h4" gutterBottom>Module Performance</Typography>
        <Typography variant="body1" color="text.secondary">
          Évaluations de performance et gestion des objectifs.
        </Typography>
      </Paper>
    </Layout>
  );
};

// Page Paie
const PayrollPage: React.FC = () => {
  return (
    <Layout title="Gestion de la Paie">
      <Box sx={{ mb: 3 }}>
        <Breadcrumbs aria-label="breadcrumb">
          <Link color="inherit" href="/dashboard">Dashboard</Link>
          <Typography color="text.primary">Paie</Typography>
        </Breadcrumbs>
      </Box>
      <Paper sx={{ p: 3, borderRadius: 2, textAlign: 'center' }}>
        <AttachMoneyIcon sx={{ fontSize: 80, color: 'primary.main', mb: 2 }} />
        <Typography variant="h4" gutterBottom>Module Paie</Typography>
        <Typography variant="body1" color="text.secondary">
          Gestion des salaires et bulletins de paie.
        </Typography>
      </Paper>
    </Layout>
  );
};

// Page Planning
const PlanningPage: React.FC = () => {
  return (
    <Layout title="Planning et Horaires">
      <Box sx={{ mb: 3 }}>
        <Breadcrumbs aria-label="breadcrumb">
          <Link color="inherit" href="/dashboard">Dashboard</Link>
          <Typography color="text.primary">Planning</Typography>
        </Breadcrumbs>
      </Box>
      <Paper sx={{ p: 3, borderRadius: 2, textAlign: 'center' }}>
        <ScheduleIcon sx={{ fontSize: 80, color: 'primary.main', mb: 2 }} />
        <Typography variant="h4" gutterBottom>Module Planning</Typography>
        <Typography variant="body1" color="text.secondary">
          Gestion des plannings et horaires de travail.
        </Typography>
      </Paper>
    </Layout>
  );
};

// Route protégée
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

// Application principale
const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/employees"
              element={
                <ProtectedRoute>
                  <EmployeesPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/attendance"
              element={
                <ProtectedRoute>
                  <AttendancePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/leave"
              element={
                <ProtectedRoute>
                  <LeavePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/performance"
              element={
                <ProtectedRoute>
                  <PerformancePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/payroll"
              element={
                <ProtectedRoute>
                  <PayrollPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/planning"
              element={
                <ProtectedRoute>
                  <PlanningPage />
                </ProtectedRoute>
              }
            />
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
