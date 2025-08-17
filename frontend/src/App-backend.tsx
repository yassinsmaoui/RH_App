import React, { useState, createContext, useContext, useEffect } from 'react';
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
  Tab,
  ListItemSecondaryAction,
  CircularProgress
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
  AttachMoney as AttachMoneyIcon,
  Check as CheckIcon,
  Close as CloseIcon,
  Visibility as VisibilityIcon
} from '@mui/icons-material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import theme from './theme';

// API Configuration
const API_BASE_URL = 'http://127.0.0.1:8000';

// API Service
class ApiService {
  static async post(endpoint: string, data: any) {
    const token = localStorage.getItem('access_token');
    console.log('API POST:', { endpoint, data: { ...data, password: data.password ? '***' : undefined } });
    
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` })
      },
      body: JSON.stringify(data)
    });
    
    const result = await response.json();
    console.log('API Response:', { status: response.status, result });
    return result;
  }

  static async get(endpoint: string) {
    const token = localStorage.getItem('access_token');
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` })
      }
    });
    return response.json();
  }

  static async login(email: string, password: string) {
    return this.post('/api/auth/login/', { email, password });
  }

  static async checkAuth() {
    return this.get('/api/auth/check-auth/');
  }
}

// Types et interfaces
interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  position: string;
  department: string;
  salary: number;
  hireDate: string;
  status: 'active' | 'inactive';
}

interface LeaveRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  type: string;
  startDate: string;
  endDate: string;
  days: number;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedDate: string;
}

// Context d'authentification
interface AuthContextType {
  isAuthenticated: boolean;
  user: any;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

// Context pour les données HR
interface HRDataContextType {
  employees: Employee[];
  setEmployees: React.Dispatch<React.SetStateAction<Employee[]>>;
  leaveRequests: LeaveRequest[];
  setLeaveRequests: React.Dispatch<React.SetStateAction<LeaveRequest[]>>;
}

const HRDataContext = createContext<HRDataContextType | null>(null);

const useHRData = () => {
  const context = useContext(HRDataContext);
  if (!context) throw new Error('useHRData must be used within HRDataProvider');
  return context;
};

// Données de test (utilisées en cas d'échec de l'API)
const initialEmployees: Employee[] = [
  {
    id: '1',
    firstName: 'Marie',
    lastName: 'Dubois',
    email: 'marie.dubois@company.com',
    phone: '+33123456789',
    position: 'Développeuse Senior',
    department: 'IT',
    salary: 55000,
    hireDate: '2022-01-15',
    status: 'active'
  },
  {
    id: '2',
    firstName: 'Pierre',
    lastName: 'Martin',
    email: 'pierre.martin@company.com',
    phone: '+33987654321',
    position: 'Chef de Projet',
    department: 'Management',
    salary: 65000,
    hireDate: '2021-03-10',
    status: 'active'
  },
  {
    id: '3',
    firstName: 'Sophie',
    lastName: 'Bernard',
    email: 'sophie.bernard@company.com',
    phone: '+33112233445',
    position: 'Designer UX/UI',
    department: 'Design',
    salary: 48000,
    hireDate: '2023-06-01',
    status: 'active'
  }
];

const initialLeaveRequests: LeaveRequest[] = [
  {
    id: '1',
    employeeId: '1',
    employeeName: 'Marie Dubois',
    type: 'Congés payés',
    startDate: '2024-08-15',
    endDate: '2024-08-30',
    days: 15,
    reason: 'Vacances d\'été en famille',
    status: 'pending',
    submittedDate: '2024-07-15'
  }
];

// Provider d'authentification
const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Vérifier l'authentification au chargement
    const checkAuth = async () => {
      const token = localStorage.getItem('access_token');
      if (token) {
        try {
          const response = await ApiService.checkAuth();
          if (response.authenticated) {
            const userData = {
              ...response.user,
              name: response.user.name || `${response.user.first_name || ''} ${response.user.last_name || ''}`.trim() || response.user.email
            };
            setUser(userData);
            setIsAuthenticated(true);
          } else {
            localStorage.removeItem('access_token');
          }
        } catch (error) {
          console.error('Erreur lors de la vérification de l\'authentification:', error);
          localStorage.removeItem('access_token');
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      console.log('Tentative de connexion:', { email, password: '***' });
      const response = await ApiService.login(email, password);
      console.log('Réponse API login:', response);
      
      if (response.access) {
        localStorage.setItem('access_token', response.access);
        localStorage.setItem('refresh_token', response.refresh);
        
        // Vérifier si les données utilisateur sont présentes
        if (response.user) {
          // Assurer que l'objet user a un nom complet
          const userData = {
            ...response.user,
            name: response.user.name || `${response.user.first_name || ''} ${response.user.last_name || ''}`.trim() || response.user.email
          };
          
          console.log('Données utilisateur:', userData);
          setUser(userData);
          setIsAuthenticated(true);
          return true;
        } else {
          // Si pas de données utilisateur dans la réponse, on fait un appel pour les récupérer
          console.log('Pas de données utilisateur, récupération...');
          try {
            const authResponse = await ApiService.checkAuth();
            if (authResponse.authenticated && authResponse.user) {
              const userData = {
                ...authResponse.user,
                name: authResponse.user.name || `${authResponse.user.first_name || ''} ${authResponse.user.last_name || ''}`.trim() || authResponse.user.email
              };
              setUser(userData);
              setIsAuthenticated(true);
              return true;
            }
          } catch (authError) {
            console.error('Erreur lors de la récupération des données utilisateur:', authError);
          }
          return false;
        }
      } else {
        console.error('Erreur de connexion:', response.error || response);
        return false;
      }
    } catch (error) {
      console.error('Erreur réseau lors de la connexion:', error);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

// Provider pour les données HR
const HRDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [employees, setEmployees] = useState<Employee[]>(initialEmployees);
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>(initialLeaveRequests);

  return (
    <HRDataContext.Provider value={{ employees, setEmployees, leaveRequests, setLeaveRequests }}>
      {children}
    </HRDataContext.Provider>
  );
};

// Composant Login avec API
const Login: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const validationSchema = yup.object({
    email: yup.string().email('Email invalide').required('Email requis'),
    password: yup.string().required('Mot de passe requis'),
  });

  const formik = useFormik({
    initialValues: { email: '', password: '' },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      setError('');
      setLoading(true);
      
      const success = await login(values.email, values.password);
      if (success) {
        navigate('/dashboard');
      } else {
        setError('Email ou mot de passe incorrect');
      }
      setLoading(false);
    },
  });

  return (
    <Container component="main" maxWidth="xs">
      <Box sx={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Paper elevation={3} sx={{ padding: 4, width: '100%' }}>
          <Typography component="h1" variant="h4" align="center" gutterBottom>
            Connexion RH
          </Typography>
          
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

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
              disabled={loading}
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
              disabled={loading}
            />
            <Button 
              type="submit" 
              fullWidth 
              variant="contained" 
              sx={{ mt: 3, mb: 2 }}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : 'Se connecter'}
            </Button>
          </Box>

          <Box sx={{ mt: 3, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
            <Typography variant="subtitle2" gutterBottom>🔑 Comptes de Test Disponibles :</Typography>
            
            <Typography variant="body2" component="div" sx={{ mb: 2 }}>
              <strong>👑 ADMINISTRATEURS</strong> (mot de passe: admin123)<br/>
              • directeur@company.com - Jean-Pierre Rousseau (DG)<br/>
              • dg@company.com - Catherine Moreau (Direction)<br/>
              • admin@test.com - Admin Test<br/>
            </Typography>

            <Typography variant="body2" component="div" sx={{ mb: 2 }}>
              <strong>👥 RESPONSABLES RH</strong> (mot de passe: rh123)<br/>
              • rh.manager@company.com - Sophie Lemaire (Manager RH)<br/>
              • recrutement@company.com - Marc Dubois (Recrutement)<br/>
              • formation@company.com - Isabelle Vincent (Formation)<br/>
              • hr@test.com - RH Test<br/>
            </Typography>

            <Typography variant="body2" component="div">
              <strong>👤 EMPLOYÉS</strong> (mot de passe: emp123)<br/>
              • dev.senior@company.com - Alexandre Martin (IT)<br/>
              • marketing.manager@company.com - Amélie Garcia (Marketing)<br/>
              • commercial@company.com - Pierre Durand (Commercial)<br/>
              • comptable@company.com - François Blanc (Comptabilité)<br/>
              • celeste.yassine@gmail.com - Celeste Yassine<br/>
              <em>+ 13 autres employés...</em>
            </Typography>
            
            <Box sx={{ mt: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              <Button 
                size="small" 
                variant="outlined" 
                onClick={() => {
                  formik.setFieldValue('email', 'admin@test.com');
                  formik.setFieldValue('password', 'admin123');
                }}
              >
                Test Admin
              </Button>
              <Button 
                size="small" 
                variant="outlined" 
                onClick={() => {
                  formik.setFieldValue('email', 'hr@test.com');
                  formik.setFieldValue('password', 'rh123');
                }}
              >
                Test RH
              </Button>
              <Button 
                size="small" 
                variant="outlined" 
                onClick={() => {
                  formik.setFieldValue('email', 'celeste.yassine@gmail.com');
                  formik.setFieldValue('password', 'emp123');
                }}
              >
                Test Employé
              </Button>
            </Box>
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
                {user?.first_name?.charAt(0) || user?.name?.charAt(0) || 'U'}
              </Avatar>
              <Box>
                <Typography variant="subtitle2" sx={{ color: 'white', lineHeight: 1 }}>
                  {user?.name || `${user?.first_name} ${user?.last_name}` || 'Utilisateur'}
                </Typography>
                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)', lineHeight: 1 }}>
                  {user?.role === 'admin' ? 'Administrateur' : user?.role === 'hr' ? 'RH' : 'Employé'}
                </Typography>
              </Box>
            </Box>
            
            <Button color="inherit" variant="outlined" onClick={() => { logout(); navigate('/login'); }} sx={{ ml: 2 }}>
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

// Fonction utilitaire pour obtenir le nom de l'utilisateur
const getUserDisplayName = (user: any) => {
  if (user?.name && user.name !== 'undefined undefined') {
    return user.name;
  }
  if (user?.first_name || user?.last_name) {
    return `${user.first_name || ''} ${user.last_name || ''}`.trim();
  }
  return user?.email?.split('@')[0] || 'Utilisateur';
};

// Dashboard Admin
const AdminDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const { employees, leaveRequests } = useHRData();
  const navigate = useNavigate();

  const adminStats = [
    {
      title: 'Total Employés',
      value: employees.length.toString(),
      icon: <PeopleIcon sx={{ fontSize: 40 }} />,
      color: '#1976d2',
      change: '+12%',
      bgColor: '#e3f2fd'
    },
    {
      title: 'Départements',
      value: '8',
      icon: <BusinessIcon sx={{ fontSize: 40 }} />,
      color: '#388e3c',
      change: '+2%',
      bgColor: '#e8f5e8'
    },
    {
      title: 'Demandes en Attente',
      value: leaveRequests.filter(req => req.status === 'pending').length.toString(),
      icon: <BeachAccessIcon sx={{ fontSize: 40 }} />,
      color: '#f57c00',
      change: '-3%',
      bgColor: '#fff3e0'
    },
    {
      title: 'Budget RH',
      value: '2.5M€',
      icon: <AttachMoneyIcon sx={{ fontSize: 40 }} />,
      color: '#7b1fa2',
      change: '+8%',
      bgColor: '#f3e5f5'
    }
  ];

  const adminActions = [
    { label: 'Gestion Globale des Employés', color: 'primary', icon: <PeopleIcon />, route: 'employees', description: 'Accès complet aux données' },
    { label: 'Administration Système', color: 'secondary', icon: <BusinessIcon />, route: 'admin-panel', description: 'Configuration avancée' },
    { label: 'Rapports & Analytics', color: 'success', icon: <TrendingUpIcon />, route: 'reports', description: 'Tableaux de bord détaillés' },
    { label: 'Gestion des Départements', color: 'warning', icon: <WorkIcon />, route: 'departments', description: 'Structure organisationnelle' },
    { label: 'Budgets & Finances', color: 'info', icon: <AttachMoneyIcon />, route: 'finance', description: 'Gestion financière RH' },
    { label: 'Audit & Conformité', color: 'error', icon: <AssignmentIcon />, route: 'audit', description: 'Suivi réglementaire' }
  ];

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" elevation={0} sx={{ bgcolor: 'error.main', mb: 4 }}>
        <Toolbar>
          <BusinessIcon sx={{ mr: 2 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Administration RH - Accès Complet
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Chip label="ADMINISTRATEUR" color="secondary" variant="filled" />
            <IconButton color="inherit">
              <Badge badgeContent={7} color="warning">
                <NotificationsIcon />
              </Badge>
            </IconButton>
            
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Avatar sx={{ width: 32, height: 32, bgcolor: 'secondary.main' }}>
                {user?.first_name?.charAt(0) || 'A'}
              </Avatar>
              <Box>
                <Typography variant="subtitle2" sx={{ color: 'white', lineHeight: 1 }}>
                  {getUserDisplayName(user)}
                </Typography>
                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)', lineHeight: 1 }}>
                  Administrateur Système
                </Typography>
              </Box>
            </Box>
            
            <Button color="inherit" variant="outlined" onClick={() => { logout(); navigate('/login'); }} sx={{ ml: 2 }}>
              Déconnexion
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      <Container maxWidth="xl">
        <Paper sx={{ p: 3, mb: 4, background: 'linear-gradient(135deg, #d32f2f 0%, #f44336 100%)', color: 'white', borderRadius: 2 }}>
          <Typography variant="h4" gutterBottom>
            🛡️ Panneau Administrateur - {getUserDisplayName(user)}
          </Typography>
          <Typography variant="h6" sx={{ opacity: 0.9 }}>
            Accès total au système RH - Gestion avancée et configuration
          </Typography>
        </Paper>

        <Grid container spacing={3} sx={{ mb: 4 }}>
          {adminStats.map((stat, index) => (
            <Grid size={{ xs: 12, sm: 6, md: 3 }} key={index}>
              <Card sx={{ height: '100%', transition: 'transform 0.2s', '&:hover': { transform: 'translateY(-4px)' }, borderRadius: 2, border: '2px solid #f44336' }}>
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: stat.bgColor, color: stat.color, mr: 2 }}>
                      {stat.icon}
                    </Box>
                    <Chip label={stat.change} size="small" color={stat.change.includes('+') ? 'success' : 'error'} variant="outlined" />
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
          <Grid size={12}>
            <Card sx={{ borderRadius: 2, border: '1px solid #f44336' }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', color: 'error.main' }}>
                  <BusinessIcon sx={{ mr: 1 }} />
                  Actions Administrateur
                </Typography>
                <Grid container spacing={2} sx={{ mt: 1 }}>
                  {adminActions.map((action, index) => (
                    <Grid size={{ xs: 12, sm: 6, md: 4 }} key={index}>
                      <Card sx={{ 
                        height: '100%', 
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        '&:hover': { 
                          transform: 'translateY(-2px)',
                          boxShadow: 4
                        },
                        border: '1px solid #eee'
                      }}
                      onClick={() => navigate(`/${action.route}`)}
                      >
                        <CardContent sx={{ p: 2, textAlign: 'center' }}>
                          <Box sx={{ color: `${action.color}.main`, mb: 1 }}>
                            {action.icon}
                          </Box>
                          <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold' }}>
                            {action.label}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {action.description}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

// Dashboard RH
const HRDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const { employees, leaveRequests } = useHRData();
  const navigate = useNavigate();

  const hrStats = [
    {
      title: 'Équipe Gérée',
      value: employees.length.toString(),
      icon: <PeopleIcon sx={{ fontSize: 40 }} />,
      color: '#1976d2',
      change: '+5%',
      bgColor: '#e3f2fd'
    },
    {
      title: 'Présences du Jour',
      value: (employees.length - 1).toString(),
      icon: <AccessTimeIcon sx={{ fontSize: 40 }} />,
      color: '#388e3c',
      change: '+2%',
      bgColor: '#e8f5e8'
    },
    {
      title: 'Congés à Valider',
      value: leaveRequests.filter(req => req.status === 'pending').length.toString(),
      icon: <BeachAccessIcon sx={{ fontSize: 40 }} />,
      color: '#f57c00',
      change: '0%',
      bgColor: '#fff3e0'
    },
    {
      title: 'Évaluations',
      value: '12',
      icon: <TrendingUpIcon sx={{ fontSize: 40 }} />,
      color: '#7b1fa2',
      change: '+3%',
      bgColor: '#f3e5f5'
    }
  ];

  const hrActions = [
    { label: 'Gestion des Employés', color: 'primary', icon: <PeopleIcon />, route: 'employees', description: 'Recruter, modifier, gérer' },
    { label: 'Validation Congés', color: 'warning', icon: <BeachAccessIcon />, route: 'leave', description: 'Approuver les demandes' },
    { label: 'Pointages', color: 'secondary', icon: <AccessTimeIcon />, route: 'attendance', description: 'Suivi des présences' },
    { label: 'Évaluations', color: 'success', icon: <TrendingUpIcon />, route: 'performance', description: 'Performance équipe' },
    { label: 'Planification', color: 'info', icon: <ScheduleIcon />, route: 'planning', description: 'Horaires et planning' },
    { label: 'Rapports RH', color: 'error', icon: <AssignmentIcon />, route: 'reports', description: 'Analyses et statistiques' }
  ];

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" elevation={0} sx={{ bgcolor: 'primary.main', mb: 4 }}>
        <Toolbar>
          <WorkIcon sx={{ mr: 2 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Interface RH - Gestion des Ressources Humaines
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Chip label="RH" color="secondary" variant="filled" />
            <IconButton color="inherit">
              <Badge badgeContent={4} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>
            
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Avatar sx={{ width: 32, height: 32, bgcolor: 'secondary.main' }}>
                {user?.first_name?.charAt(0) || 'H'}
              </Avatar>
              <Box>
                <Typography variant="subtitle2" sx={{ color: 'white', lineHeight: 1 }}>
                  {getUserDisplayName(user)}
                </Typography>
                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)', lineHeight: 1 }}>
                  Responsable RH
                </Typography>
              </Box>
            </Box>
            
            <Button color="inherit" variant="outlined" onClick={() => { logout(); navigate('/login'); }} sx={{ ml: 2 }}>
              Déconnexion
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      <Container maxWidth="xl">
        <Paper sx={{ p: 3, mb: 4, background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)', color: 'white', borderRadius: 2 }}>
          <Typography variant="h4" gutterBottom>
            👥 Espace RH - {getUserDisplayName(user)}
          </Typography>
          <Typography variant="h6" sx={{ opacity: 0.9 }}>
            Gestion optimisée des ressources humaines et du personnel
          </Typography>
        </Paper>

        <Grid container spacing={3} sx={{ mb: 4 }}>
          {hrStats.map((stat, index) => (
            <Grid size={{ xs: 12, sm: 6, md: 3 }} key={index}>
              <Card sx={{ height: '100%', transition: 'transform 0.2s', '&:hover': { transform: 'translateY(-4px)' }, borderRadius: 2, border: '2px solid #1976d2' }}>
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: stat.bgColor, color: stat.color, mr: 2 }}>
                      {stat.icon}
                    </Box>
                    <Chip label={stat.change} size="small" color={stat.change.includes('+') ? 'success' : 'default'} variant="outlined" />
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
          <Grid size={12}>
            <Card sx={{ borderRadius: 2, border: '1px solid #1976d2' }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', color: 'primary.main' }}>
                  <WorkIcon sx={{ mr: 1 }} />
                  Actions RH Disponibles
                </Typography>
                <Grid container spacing={2} sx={{ mt: 1 }}>
                  {hrActions.map((action, index) => (
                    <Grid size={{ xs: 12, sm: 6, md: 4 }} key={index}>
                      <Card sx={{ 
                        height: '100%', 
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        '&:hover': { 
                          transform: 'translateY(-2px)',
                          boxShadow: 4
                        },
                        border: '1px solid #eee'
                      }}
                      onClick={() => navigate(`/${action.route}`)}
                      >
                        <CardContent sx={{ p: 2, textAlign: 'center' }}>
                          <Box sx={{ color: `${action.color}.main`, mb: 1 }}>
                            {action.icon}
                          </Box>
                          <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold' }}>
                            {action.label}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {action.description}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

// Dashboard Employé
const EmployeeDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const { leaveRequests } = useHRData();
  const navigate = useNavigate();

  const employeeStats = [
    {
      title: 'Congés Restants',
      value: '18',
      icon: <BeachAccessIcon sx={{ fontSize: 40 }} />,
      color: '#388e3c',
      change: '-2 jours',
      bgColor: '#e8f5e8'
    },
    {
      title: 'Heures ce Mois',
      value: '156h',
      icon: <AccessTimeIcon sx={{ fontSize: 40 }} />,
      color: '#1976d2',
      change: '+4h',
      bgColor: '#e3f2fd'
    },
    {
      title: 'Demandes en Cours',
      value: leaveRequests.filter(req => req.status === 'pending' && req.employeeName.includes(user?.first_name || '')).length.toString(),
      icon: <AssignmentIcon sx={{ fontSize: 40 }} />,
      color: '#f57c00',
      change: 'En attente',
      bgColor: '#fff3e0'
    },
    {
      title: 'Score Performance',
      value: '92%',
      icon: <TrendingUpIcon sx={{ fontSize: 40 }} />,
      color: '#7b1fa2',
      change: '+5%',
      bgColor: '#f3e5f5'
    }
  ];

  const employeeActions = [
    { label: 'Mes Congés', color: 'success', icon: <BeachAccessIcon />, route: 'my-leave', description: 'Demander et suivre' },
    { label: 'Mon Planning', color: 'primary', icon: <ScheduleIcon />, route: 'my-schedule', description: 'Horaires personnels' },
    { label: 'Pointage', color: 'secondary', icon: <AccessTimeIcon />, route: 'my-attendance', description: 'Pointer entrée/sortie' },
    { label: 'Ma Performance', color: 'warning', icon: <TrendingUpIcon />, route: 'my-performance', description: 'Évaluations reçues' },
    { label: 'Mon Profil', color: 'info', icon: <AccountCircleIcon />, route: 'my-profile', description: 'Informations personnelles' },
    { label: 'Bulletin de Paie', color: 'error', icon: <AttachMoneyIcon />, route: 'my-payroll', description: 'Consulter fiches de paie' }
  ];

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" elevation={0} sx={{ bgcolor: 'success.main', mb: 4 }}>
        <Toolbar>
          <AccountCircleIcon sx={{ mr: 2 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Mon Espace Employé
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Chip label="EMPLOYÉ" color="secondary" variant="filled" />
            <IconButton color="inherit">
              <Badge badgeContent={2} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>
            
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Avatar sx={{ width: 32, height: 32, bgcolor: 'secondary.main' }}>
                {user?.first_name?.charAt(0) || 'E'}
              </Avatar>
              <Box>
                <Typography variant="subtitle2" sx={{ color: 'white', lineHeight: 1 }}>
                  {getUserDisplayName(user)}
                </Typography>
                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)', lineHeight: 1 }}>
                  {user?.department || 'Employé'}
                </Typography>
              </Box>
            </Box>
            
            <Button color="inherit" variant="outlined" onClick={() => { logout(); navigate('/login'); }} sx={{ ml: 2 }}>
              Déconnexion
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      <Container maxWidth="xl">
        <Paper sx={{ p: 3, mb: 4, background: 'linear-gradient(135deg, #388e3c 0%, #66bb6a 100%)', color: 'white', borderRadius: 2 }}>
          <Typography variant="h4" gutterBottom>
            👤 Mon Espace Personnel - {getUserDisplayName(user)}
          </Typography>
          <Typography variant="h6" sx={{ opacity: 0.9 }}>
            Gérez vos demandes, consultez vos informations et suivez votre activité
          </Typography>
        </Paper>

        <Grid container spacing={3} sx={{ mb: 4 }}>
          {employeeStats.map((stat, index) => (
            <Grid size={{ xs: 12, sm: 6, md: 3 }} key={index}>
              <Card sx={{ height: '100%', transition: 'transform 0.2s', '&:hover': { transform: 'translateY(-4px)' }, borderRadius: 2, border: '2px solid #388e3c' }}>
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: stat.bgColor, color: stat.color, mr: 2 }}>
                      {stat.icon}
                    </Box>
                    <Chip label={stat.change} size="small" color={stat.change.includes('+') ? 'success' : 'default'} variant="outlined" />
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
          <Grid size={12}>
            <Card sx={{ borderRadius: 2, border: '1px solid #388e3c' }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', color: 'success.main' }}>
                  <AccountCircleIcon sx={{ mr: 1 }} />
                  Mes Actions Disponibles
                </Typography>
                <Grid container spacing={2} sx={{ mt: 1 }}>
                  {employeeActions.map((action, index) => (
                    <Grid size={{ xs: 12, sm: 6, md: 4 }} key={index}>
                      <Card sx={{ 
                        height: '100%', 
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        '&:hover': { 
                          transform: 'translateY(-2px)',
                          boxShadow: 4
                        },
                        border: '1px solid #eee'
                      }}
                      onClick={() => navigate(`/${action.route}`)}
                      >
                        <CardContent sx={{ p: 2, textAlign: 'center' }}>
                          <Box sx={{ color: `${action.color}.main`, mb: 1 }}>
                            {action.icon}
                          </Box>
                          <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold' }}>
                            {action.label}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {action.description}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

// Dashboard principal qui route selon le rôle
const Dashboard: React.FC = () => {
  const { user } = useAuth();

  // Rediriger selon le rôle de l'utilisateur
  if (user?.role === 'admin') {
    return <AdminDashboard />;
  } else if (user?.role === 'hr') {
    return <HRDashboard />;
  } else {
    return <EmployeeDashboard />;
  }
};

// Pages simplifiées pour les autres modules
const EmployeesPage: React.FC = () => (
  <Layout title="Gestion des Employés">
    <Box sx={{ mb: 3 }}>
      <Breadcrumbs aria-label="breadcrumb">
        <Link color="inherit" href="/dashboard" style={{ textDecoration: 'none' }}>Dashboard</Link>
        <Typography color="text.primary">Employés</Typography>
      </Breadcrumbs>
    </Box>
    <Paper sx={{ p: 3, borderRadius: 2, textAlign: 'center' }}>
      <PeopleIcon sx={{ fontSize: 80, color: 'primary.main', mb: 2 }} />
      <Typography variant="h4" gutterBottom>Module Employés</Typography>
      <Typography variant="body1" color="text.secondary">
        Connecté avec la base de données ! Les utilisateurs sont maintenant stockés en base.
      </Typography>
    </Paper>
  </Layout>
);

const AttendancePage: React.FC = () => (
  <Layout title="Gestion des Présences">
    <Box sx={{ mb: 3 }}>
      <Breadcrumbs aria-label="breadcrumb">
        <Link color="inherit" href="/dashboard" style={{ textDecoration: 'none' }}>Dashboard</Link>
        <Typography color="text.primary">Présences</Typography>
      </Breadcrumbs>
    </Box>
    <Paper sx={{ p: 3, borderRadius: 2, textAlign: 'center' }}>
      <AccessTimeIcon sx={{ fontSize: 80, color: 'primary.main', mb: 2 }} />
      <Typography variant="h4" gutterBottom>Module Présences</Typography>
      <Typography variant="body1" color="text.secondary">
        Suivi des pointages avec base de données.
      </Typography>
    </Paper>
  </Layout>
);

const LeavePage: React.FC = () => (
  <Layout title="Gestion des Congés">
    <Box sx={{ mb: 3 }}>
      <Breadcrumbs aria-label="breadcrumb">
        <Link color="inherit" href="/dashboard" style={{ textDecoration: 'none' }}>Dashboard</Link>
        <Typography color="text.primary">Congés</Typography>
      </Breadcrumbs>
    </Box>
    <Paper sx={{ p: 3, borderRadius: 2, textAlign: 'center' }}>
      <BeachAccessIcon sx={{ fontSize: 80, color: 'primary.main', mb: 2 }} />
      <Typography variant="h4" gutterBottom>Module Congés</Typography>
      <Typography variant="body1" color="text.secondary">
        Gestion des demandes avec persistance en base.
      </Typography>
    </Paper>
  </Layout>
);

const PerformancePage: React.FC = () => (
  <Layout title="Évaluations de Performance">
    <Box sx={{ mb: 3 }}>
      <Breadcrumbs aria-label="breadcrumb">
        <Link color="inherit" href="/dashboard" style={{ textDecoration: 'none' }}>Dashboard</Link>
        <Typography color="text.primary">Performance</Typography>
      </Breadcrumbs>
    </Box>
    <Paper sx={{ p: 3, borderRadius: 2, textAlign: 'center' }}>
      <TrendingUpIcon sx={{ fontSize: 80, color: 'primary.main', mb: 2 }} />
      <Typography variant="h4" gutterBottom>Module Performance</Typography>
      <Typography variant="body1" color="text.secondary">
        Évaluations stockées en base de données.
      </Typography>
    </Paper>
  </Layout>
);

const PayrollPage: React.FC = () => (
  <Layout title="Gestion de la Paie">
    <Box sx={{ mb: 3 }}>
      <Breadcrumbs aria-label="breadcrumb">
        <Link color="inherit" href="/dashboard" style={{ textDecoration: 'none' }}>Dashboard</Link>
        <Typography color="text.primary">Paie</Typography>
      </Breadcrumbs>
    </Box>
    <Paper sx={{ p: 3, borderRadius: 2, textAlign: 'center' }}>
      <AttachMoneyIcon sx={{ fontSize: 80, color: 'primary.main', mb: 2 }} />
      <Typography variant="h4" gutterBottom>Module Paie</Typography>
      <Typography variant="body1" color="text.secondary">
        Bulletins de paie avec base de données.
      </Typography>
    </Paper>
  </Layout>
);

const AdminPanelPage: React.FC = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simuler le chargement des utilisateurs
    setLoading(true);
    setTimeout(() => {
      const mockUsers = [
        // Administrateurs
        { id: 1, name: 'Jean-Pierre Rousseau', email: 'directeur@company.com', role: 'admin', department: 'Direction Générale', status: 'active' },
        { id: 2, name: 'Catherine Moreau', email: 'dg@company.com', role: 'admin', department: 'Direction Générale', status: 'active' },
        
        // RH
        { id: 3, name: 'Sophie Lemaire', email: 'rh.manager@company.com', role: 'hr', department: 'Ressources Humaines', status: 'active' },
        { id: 4, name: 'Marc Dubois', email: 'recrutement@company.com', role: 'hr', department: 'Ressources Humaines', status: 'active' },
        { id: 5, name: 'Isabelle Vincent', email: 'formation@company.com', role: 'hr', department: 'Formation & Développement', status: 'active' },
        
        // Employés
        { id: 6, name: 'Alexandre Martin', email: 'dev.senior@company.com', role: 'employee', department: 'Informatique', status: 'active' },
        { id: 7, name: 'Laura Bernard', email: 'devops@company.com', role: 'employee', department: 'Informatique', status: 'active' },
        { id: 8, name: 'Thomas Petit', email: 'ux.designer@company.com', role: 'employee', department: 'Design & UX', status: 'active' },
        { id: 9, name: 'Amélie Garcia', email: 'marketing.manager@company.com', role: 'employee', department: 'Marketing', status: 'active' },
        { id: 10, name: 'Kevin Lopez', email: 'social.media@company.com', role: 'employee', department: 'Communication', status: 'active' },
        { id: 11, name: 'Pierre Durand', email: 'commercial@company.com', role: 'employee', department: 'Commercial', status: 'active' },
        { id: 12, name: 'Nathalie Roux', email: 'ventes@company.com', role: 'employee', department: 'Ventes', status: 'active' },
        { id: 13, name: 'François Blanc', email: 'comptable@company.com', role: 'employee', department: 'Comptabilité', status: 'active' },
        { id: 14, name: 'Marie-Claire Bonnet', email: 'controle.gestion@company.com', role: 'employee', department: 'Contrôle de Gestion', status: 'active' },
        { id: 15, name: 'David Leroy', email: 'operations@company.com', role: 'employee', department: 'Opérations', status: 'active' },
      ];
      setUsers(mockUsers);
      setLoading(false);
    }, 1000);
  }, []);

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'error';
      case 'hr': return 'primary';
      case 'employee': return 'success';
      default: return 'default';
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'admin': return 'Administrateur';
      case 'hr': return 'RH';
      case 'employee': return 'Employé';
      default: return role;
    }
  };

  if (user?.role !== 'admin') {
    return (
      <Layout title="Accès Refusé">
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="h5" color="error" gutterBottom>
            🚫 Accès Refusé
          </Typography>
          <Typography variant="body1">
            Seuls les administrateurs peuvent accéder à cette section.
          </Typography>
        </Paper>
      </Layout>
    );
  }

  return (
    <Layout title="Panneau d'Administration">
      <Box sx={{ mb: 3 }}>
        <Breadcrumbs aria-label="breadcrumb">
          <Link color="inherit" href="/dashboard" style={{ textDecoration: 'none' }}>Dashboard</Link>
          <Typography color="text.primary">Administration</Typography>
        </Breadcrumbs>
      </Box>

      <Paper sx={{ p: 3, mb: 3, background: 'linear-gradient(135deg, #d32f2f 0%, #f44336 100%)', color: 'white', borderRadius: 2 }}>
        <Typography variant="h4" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
          <BusinessIcon sx={{ mr: 2, fontSize: 40 }} />
          Panneau d'Administration
        </Typography>
        <Typography variant="h6" sx={{ opacity: 0.9 }}>
          Gestion complète des utilisateurs et du système
        </Typography>
      </Paper>

      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card sx={{ textAlign: 'center', border: '2px solid #f44336' }}>
            <CardContent>
              <Typography variant="h3" color="error.main">
                {users.filter(u => u.role === 'admin').length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Administrateurs
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card sx={{ textAlign: 'center', border: '2px solid #1976d2' }}>
            <CardContent>
              <Typography variant="h3" color="primary.main">
                {users.filter(u => u.role === 'hr').length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Responsables RH
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card sx={{ textAlign: 'center', border: '2px solid #388e3c' }}>
            <CardContent>
              <Typography variant="h3" color="success.main">
                {users.filter(u => u.role === 'employee').length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Employés
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card sx={{ textAlign: 'center', border: '2px solid #666' }}>
            <CardContent>
              <Typography variant="h3" color="text.primary">
                {users.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Utilisateurs
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Card sx={{ borderRadius: 2 }}>
        <CardContent sx={{ p: 0 }}>
          <Box sx={{ p: 3, borderBottom: '1px solid #eee' }}>
            <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center' }}>
              <PeopleIcon sx={{ mr: 1 }} />
              Liste des Utilisateurs
            </Typography>
          </Box>
          
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: 'grey.50' }}>
                    <TableCell><strong>Nom</strong></TableCell>
                    <TableCell><strong>Email</strong></TableCell>
                    <TableCell><strong>Rôle</strong></TableCell>
                    <TableCell><strong>Département</strong></TableCell>
                    <TableCell><strong>Statut</strong></TableCell>
                    <TableCell><strong>Actions</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id} hover>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Avatar sx={{ mr: 2, bgcolor: `${getRoleColor(user.role)}.main` }}>
                            {user.name.split(' ').map((n: string) => n[0]).join('').substring(0, 2)}
                          </Avatar>
                          <Typography variant="body2" fontWeight="bold">
                            {user.name}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {user.email}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={getRoleLabel(user.role)} 
                          color={getRoleColor(user.role) as any}
                          size="small"
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {user.department}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={user.status === 'active' ? 'Actif' : 'Inactif'} 
                          color={user.status === 'active' ? 'success' : 'default'}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <IconButton size="small" color="primary">
                            <VisibilityIcon fontSize="small" />
                          </IconButton>
                          <IconButton size="small" color="secondary">
                            <EditIcon fontSize="small" />
                          </IconButton>
                          <IconButton size="small" color="error">
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </CardContent>
      </Card>
    </Layout>
  );
};

const PlanningPage: React.FC = () => (
  <Layout title="Planning et Horaires">
    <Box sx={{ mb: 3 }}>
      <Breadcrumbs aria-label="breadcrumb">
        <Link color="inherit" href="/dashboard" style={{ textDecoration: 'none' }}>Dashboard</Link>
        <Typography color="text.primary">Planning</Typography>
      </Breadcrumbs>
    </Box>
    <Paper sx={{ p: 3, borderRadius: 2, textAlign: 'center' }}>
      <ScheduleIcon sx={{ fontSize: 80, color: 'primary.main', mb: 2 }} />
      <Typography variant="h4" gutterBottom>Module Planning</Typography>
      <Typography variant="body1" color="text.secondary">
        Planification avec persistance des données.
      </Typography>
    </Paper>
  </Layout>
);

// Route protégée
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }
  
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
        <HRDataProvider>
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
                path="/admin-panel"
                element={
                  <ProtectedRoute>
                    <AdminPanelPage />
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
        </HRDataProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
