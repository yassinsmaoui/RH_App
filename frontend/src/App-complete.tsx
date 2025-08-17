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
  ListItemSecondaryAction
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

interface AttendanceRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  date: string;
  checkIn: string;
  checkOut: string;
  hoursWorked: number;
  status: 'present' | 'absent' | 'late';
}

// Context d'authentification
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

// Données de test
const initialEmployees: Employee[] = [
  {
    id: '1',
    firstName: 'Marie',
    lastName: 'Dubois',
    email: 'marie.dubois@company.com',
    phone: '+33 1 23 45 67 89',
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
    phone: '+33 1 98 76 54 32',
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
    phone: '+33 1 11 22 33 44',
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
  },
  {
    id: '2',
    employeeId: '2',
    employeeName: 'Pierre Martin',
    type: 'Congé maladie',
    startDate: '2024-08-10',
    endDate: '2024-08-12',
    days: 3,
    reason: 'Consultation médicale',
    status: 'approved',
    submittedDate: '2024-08-08'
  }
];

// Provider d'authentification
const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<any>(null);

  const login = async (email: string, password: string): Promise<boolean> => {
    const testAccounts = [
      { email: 'admin@test.com', password: 'password', name: 'Admin User', role: 'admin' },
      { email: 'hr@test.com', password: 'password', name: 'HR Manager', role: 'hr' },
      { email: 'celeste.yassine@gmail.com', password: 'password', name: 'Celeste Yassine', role: 'employee' },
      { email: 'user@test.com', password: 'password', name: 'Regular User', role: 'employee' }
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

// Composant Login
const Login: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const validationSchema = yup.object({
    email: yup.string().email('Email invalide').required('Email requis'),
    password: yup.string().required('Mot de passe requis'),
  });

  const formik = useFormik({
    initialValues: { email: '', password: '' },
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
            <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
              Se connecter
            </Button>
          </Box>

          <Box sx={{ mt: 3, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
            <Typography variant="subtitle2" gutterBottom>Comptes de test :</Typography>
            <Typography variant="body2" component="div">
              • admin@test.com / password (Admin)<br/>
              • hr@test.com / password (RH)<br/>
              • celeste.yassine@gmail.com / password (Employé)<br/>
              • user@test.com / password (Utilisateur)
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

// Dashboard principal
const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const { employees, leaveRequests } = useHRData();
  const navigate = useNavigate();

  const stats = [
    {
      title: 'Total Employés',
      value: employees.length.toString(),
      icon: <PeopleIcon sx={{ fontSize: 40 }} />,
      color: '#1976d2',
      change: '+12%',
      bgColor: '#e3f2fd'
    },
    {
      title: 'Présent Aujourd\'hui',
      value: (employees.length - 1).toString(),
      icon: <AccessTimeIcon sx={{ fontSize: 40 }} />,
      color: '#388e3c',
      change: '+5%',
      bgColor: '#e8f5e8'
    },
    {
      title: 'Demandes de Congés',
      value: leaveRequests.filter(req => req.status === 'pending').length.toString(),
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
        <Paper sx={{ p: 3, mb: 4, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', borderRadius: 2 }}>
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
              <Card sx={{ height: '100%', transition: 'transform 0.2s', '&:hover': { transform: 'translateY(-4px)' }, borderRadius: 2 }}>
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
                        onClick={() => navigate(`/${action.route}`)}
                        sx={{ p: 2, height: 80, borderRadius: 2, textTransform: 'none', fontSize: '0.95rem' }}
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

// Page Employés avec fonctionnalités complètes
const EmployeesPage: React.FC = () => {
  const { employees, setEmployees } = useHRData();
  const [open, setOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const validationSchema = yup.object({
    firstName: yup.string().required('Prénom requis'),
    lastName: yup.string().required('Nom requis'),
    email: yup.string().email('Email invalide').required('Email requis'),
    phone: yup.string().required('Téléphone requis'),
    position: yup.string().required('Poste requis'),
    department: yup.string().required('Département requis'),
    salary: yup.number().positive('Salaire doit être positif').required('Salaire requis'),
  });

  const formik = useFormik({
    initialValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      position: '',
      department: '',
      salary: 0,
    },
    validationSchema,
    onSubmit: (values, { resetForm }) => {
      if (editingEmployee) {
        setEmployees(prev => prev.map(emp => 
          emp.id === editingEmployee.id 
            ? { ...emp, ...values, id: editingEmployee.id, hireDate: editingEmployee.hireDate, status: editingEmployee.status }
            : emp
        ));
      } else {
        const newEmployee: Employee = {
          ...values,
          id: Date.now().toString(),
          hireDate: new Date().toISOString().split('T')[0],
          status: 'active'
        };
        setEmployees(prev => [...prev, newEmployee]);
      }
      resetForm();
      setOpen(false);
      setEditingEmployee(null);
    },
  });

  const handleEdit = (employee: Employee) => {
    setEditingEmployee(employee);
    formik.setValues({
      firstName: employee.firstName,
      lastName: employee.lastName,
      email: employee.email,
      phone: employee.phone,
      position: employee.position,
      department: employee.department,
      salary: employee.salary,
    });
    setOpen(true);
  };

  const handleDelete = (id: string) => {
    setEmployees(prev => prev.filter(emp => emp.id !== id));
  };

  const filteredEmployees = employees.filter(emp =>
    emp.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.position.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Layout title="Gestion des Employés">
      <Box sx={{ mb: 3 }}>
        <Breadcrumbs aria-label="breadcrumb">
          <Link color="inherit" href="/dashboard" style={{ textDecoration: 'none' }}>Dashboard</Link>
          <Typography color="text.primary">Employés</Typography>
        </Breadcrumbs>
      </Box>

      <Paper sx={{ p: 3, borderRadius: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h5" sx={{ display: 'flex', alignItems: 'center' }}>
            <PeopleIcon sx={{ mr: 1 }} />
            Gestion des Employés ({filteredEmployees.length})
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => {
              setEditingEmployee(null);
              formik.resetForm();
              setOpen(true);
            }}
          >
            Ajouter un employé
          </Button>
        </Box>

        <TextField
          fullWidth
          placeholder="Rechercher un employé..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          sx={{ mb: 3 }}
        />

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Nom Complet</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Téléphone</TableCell>
                <TableCell>Poste</TableCell>
                <TableCell>Département</TableCell>
                <TableCell>Salaire</TableCell>
                <TableCell>Statut</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredEmployees
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((employee) => (
                <TableRow key={employee.id}>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Avatar sx={{ mr: 2, bgcolor: 'primary.main' }}>
                        {employee.firstName.charAt(0)}{employee.lastName.charAt(0)}
                      </Avatar>
                      {employee.firstName} {employee.lastName}
                    </Box>
                  </TableCell>
                  <TableCell>{employee.email}</TableCell>
                  <TableCell>{employee.phone}</TableCell>
                  <TableCell>{employee.position}</TableCell>
                  <TableCell>{employee.department}</TableCell>
                  <TableCell>{employee.salary.toLocaleString()} €</TableCell>
                  <TableCell>
                    <Chip 
                      label={employee.status === 'active' ? 'Actif' : 'Inactif'} 
                      color={employee.status === 'active' ? 'success' : 'default'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleEdit(employee)} color="primary">
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => handleDelete(employee.id)} color="error">
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredEmployees.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={(event, newPage) => setPage(newPage)}
          onRowsPerPageChange={(event) => {
            setRowsPerPage(parseInt(event.target.value, 10));
            setPage(0);
          }}
        />
      </Paper>

      {/* Dialog pour ajouter/modifier un employé */}
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingEmployee ? 'Modifier l\'employé' : 'Ajouter un nouvel employé'}
        </DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={formik.handleSubmit} sx={{ mt: 2 }}>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  name="firstName"
                  label="Prénom"
                  value={formik.values.firstName}
                  onChange={formik.handleChange}
                  error={formik.touched.firstName && Boolean(formik.errors.firstName)}
                  helperText={formik.touched.firstName && formik.errors.firstName}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  name="lastName"
                  label="Nom"
                  value={formik.values.lastName}
                  onChange={formik.handleChange}
                  error={formik.touched.lastName && Boolean(formik.errors.lastName)}
                  helperText={formik.touched.lastName && formik.errors.lastName}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  name="email"
                  label="Email"
                  type="email"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  error={formik.touched.email && Boolean(formik.errors.email)}
                  helperText={formik.touched.email && formik.errors.email}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  name="phone"
                  label="Téléphone"
                  value={formik.values.phone}
                  onChange={formik.handleChange}
                  error={formik.touched.phone && Boolean(formik.errors.phone)}
                  helperText={formik.touched.phone && formik.errors.phone}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  name="position"
                  label="Poste"
                  value={formik.values.position}
                  onChange={formik.handleChange}
                  error={formik.touched.position && Boolean(formik.errors.position)}
                  helperText={formik.touched.position && formik.errors.position}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <FormControl fullWidth>
                  <InputLabel>Département</InputLabel>
                  <Select
                    name="department"
                    value={formik.values.department}
                    onChange={formik.handleChange}
                    error={formik.touched.department && Boolean(formik.errors.department)}
                  >
                    <MenuItem value="IT">IT</MenuItem>
                    <MenuItem value="RH">Ressources Humaines</MenuItem>
                    <MenuItem value="Finance">Finance</MenuItem>
                    <MenuItem value="Marketing">Marketing</MenuItem>
                    <MenuItem value="Ventes">Ventes</MenuItem>
                    <MenuItem value="Design">Design</MenuItem>
                    <MenuItem value="Management">Management</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid size={12}>
                <TextField
                  fullWidth
                  name="salary"
                  label="Salaire annuel (€)"
                  type="number"
                  value={formik.values.salary}
                  onChange={formik.handleChange}
                  error={formik.touched.salary && Boolean(formik.errors.salary)}
                  helperText={formik.touched.salary && formik.errors.salary}
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Annuler</Button>
          <Button onClick={() => formik.handleSubmit()} variant="contained">
            {editingEmployee ? 'Modifier' : 'Ajouter'}
          </Button>
        </DialogActions>
      </Dialog>
    </Layout>
  );
};

// Page Congés avec fonctionnalités complètes
const LeavePage: React.FC = () => {
  const { user } = useAuth();
  const { leaveRequests, setLeaveRequests } = useHRData();
  const [open, setOpen] = useState(false);
  const [tabValue, setTabValue] = useState(0);

  const leaveValidationSchema = yup.object({
    type: yup.string().required('Type de congé requis'),
    startDate: yup.date().required('Date de début requise'),
    endDate: yup.date().required('Date de fin requise'),
    reason: yup.string().required('Raison requise'),
  });

  const leaveFormik = useFormik({
    initialValues: {
      type: '',
      startDate: '',
      endDate: '',
      reason: '',
    },
    validationSchema: leaveValidationSchema,
    onSubmit: (values, { resetForm }) => {
      const startDate = new Date(values.startDate);
      const endDate = new Date(values.endDate);
      const days = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24)) + 1;

      const newRequest: LeaveRequest = {
        id: Date.now().toString(),
        employeeId: user?.email === 'celeste.yassine@gmail.com' ? '1' : '1',
        employeeName: user?.name || 'Utilisateur',
        type: values.type,
        startDate: values.startDate,
        endDate: values.endDate,
        days,
        reason: values.reason,
        status: 'pending',
        submittedDate: new Date().toISOString().split('T')[0]
      };

      setLeaveRequests(prev => [...prev, newRequest]);
      resetForm();
      setOpen(false);
    },
  });

  const handleApproveReject = (id: string, status: 'approved' | 'rejected') => {
    setLeaveRequests(prev => prev.map(req => 
      req.id === id ? { ...req, status } : req
    ));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'success';
      case 'rejected': return 'error';
      default: return 'warning';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'approved': return 'Approuvé';
      case 'rejected': return 'Rejeté';
      default: return 'En attente';
    }
  };

  return (
    <Layout title="Gestion des Congés">
      <Box sx={{ mb: 3 }}>
        <Breadcrumbs aria-label="breadcrumb">
          <Link color="inherit" href="/dashboard" style={{ textDecoration: 'none' }}>Dashboard</Link>
          <Typography color="text.primary">Congés</Typography>
        </Breadcrumbs>
      </Box>

      <Paper sx={{ borderRadius: 2 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)}>
            <Tab label="Mes demandes" />
            <Tab label="Toutes les demandes" />
          </Tabs>
        </Box>

        <Box sx={{ p: 3 }}>
          {tabValue === 0 && (
            <Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6">Mes demandes de congés</Typography>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => setOpen(true)}
                >
                  Nouvelle demande
                </Button>
              </Box>

              <Grid container spacing={2}>
                {leaveRequests
                  .filter(req => req.employeeName === user?.name)
                  .map((request) => (
                  <Grid size={{ xs: 12, md: 6 }} key={request.id}>
                    <Card sx={{ borderRadius: 2 }}>
                      <CardContent>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 2 }}>
                          <Typography variant="h6">{request.type}</Typography>
                          <Chip 
                            label={getStatusText(request.status)} 
                            color={getStatusColor(request.status) as any}
                            size="small"
                          />
                        </Box>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          Du {new Date(request.startDate).toLocaleDateString()} au {new Date(request.endDate).toLocaleDateString()}
                        </Typography>
                        <Typography variant="body2" gutterBottom>
                          <strong>Durée:</strong> {request.days} jour(s)
                        </Typography>
                        <Typography variant="body2" gutterBottom>
                          <strong>Raison:</strong> {request.reason}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Demandé le {new Date(request.submittedDate).toLocaleDateString()}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Box>
          )}

          {tabValue === 1 && (user?.role === 'admin' || user?.role === 'hr') && (
            <Box>
              <Typography variant="h6" gutterBottom>
                Toutes les demandes de congés
              </Typography>

              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Employé</TableCell>
                      <TableCell>Type</TableCell>
                      <TableCell>Période</TableCell>
                      <TableCell>Jours</TableCell>
                      <TableCell>Statut</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {leaveRequests.map((request) => (
                      <TableRow key={request.id}>
                        <TableCell>{request.employeeName}</TableCell>
                        <TableCell>{request.type}</TableCell>
                        <TableCell>
                          {new Date(request.startDate).toLocaleDateString()} - {new Date(request.endDate).toLocaleDateString()}
                        </TableCell>
                        <TableCell>{request.days}</TableCell>
                        <TableCell>
                          <Chip 
                            label={getStatusText(request.status)} 
                            color={getStatusColor(request.status) as any}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          {request.status === 'pending' && (
                            <Box>
                              <IconButton 
                                color="success" 
                                onClick={() => handleApproveReject(request.id, 'approved')}
                              >
                                <CheckIcon />
                              </IconButton>
                              <IconButton 
                                color="error" 
                                onClick={() => handleApproveReject(request.id, 'rejected')}
                              >
                                <CloseIcon />
                              </IconButton>
                            </Box>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          )}
        </Box>
      </Paper>

      {/* Dialog pour nouvelle demande de congé */}
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Nouvelle demande de congé</DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={leaveFormik.handleSubmit} sx={{ mt: 2 }}>
            <Grid container spacing={2}>
              <Grid size={12}>
                <FormControl fullWidth>
                  <InputLabel>Type de congé</InputLabel>
                  <Select
                    name="type"
                    value={leaveFormik.values.type}
                    onChange={leaveFormik.handleChange}
                    error={leaveFormik.touched.type && Boolean(leaveFormik.errors.type)}
                  >
                    <MenuItem value="Congés payés">Congés payés</MenuItem>
                    <MenuItem value="Congé maladie">Congé maladie</MenuItem>
                    <MenuItem value="Congé maternité">Congé maternité</MenuItem>
                    <MenuItem value="Congé paternité">Congé paternité</MenuItem>
                    <MenuItem value="Congé sans solde">Congé sans solde</MenuItem>
                    <MenuItem value="Formation">Formation</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  name="startDate"
                  label="Date de début"
                  type="date"
                  value={leaveFormik.values.startDate}
                  onChange={leaveFormik.handleChange}
                  error={leaveFormik.touched.startDate && Boolean(leaveFormik.errors.startDate)}
                  helperText={leaveFormik.touched.startDate && leaveFormik.errors.startDate}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  name="endDate"
                  label="Date de fin"
                  type="date"
                  value={leaveFormik.values.endDate}
                  onChange={leaveFormik.handleChange}
                  error={leaveFormik.touched.endDate && Boolean(leaveFormik.errors.endDate)}
                  helperText={leaveFormik.touched.endDate && leaveFormik.errors.endDate}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid size={12}>
                <TextField
                  fullWidth
                  name="reason"
                  label="Raison de la demande"
                  multiline
                  rows={3}
                  value={leaveFormik.values.reason}
                  onChange={leaveFormik.handleChange}
                  error={leaveFormik.touched.reason && Boolean(leaveFormik.errors.reason)}
                  helperText={leaveFormik.touched.reason && leaveFormik.errors.reason}
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Annuler</Button>
          <Button onClick={() => leaveFormik.handleSubmit()} variant="contained">
            Soumettre la demande
          </Button>
        </DialogActions>
      </Dialog>
    </Layout>
  );
};

// Pages simplifiées pour les autres modules
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
        Suivi des pointages, horaires et temps de travail.
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
        Évaluations de performance et gestion des objectifs.
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
        Gestion des salaires et bulletins de paie.
      </Typography>
    </Paper>
  </Layout>
);

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
        Gestion des plannings et horaires de travail.
      </Typography>
    </Paper>
  </Layout>
);

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
