import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux'; // Hook standard
import { useAppDispatch } from '../store/hooks';
import {
  AppBar,
  Box,
  CssBaseline,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  useTheme,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  EventNote as EventNoteIcon,
  AccessTime as AccessTimeIcon,
  Assessment as AssessmentIcon,
  AttachMoney as AttachMoneyIcon,
  ExitToApp as ExitToAppIcon,
} from '@mui/icons-material';
// import { useAppDispatch } from '../store/hooks'; // MAINTENANT ACTIVÉ
// import { logout } from '../store/slices/authSlice'; // COMMENTÉ
import { fetchEmployees } from '../store/slices/employeeSlice';
import { fetchLeaveRequests } from '../store/slices/leaveSlice';
import { fetchAttendance } from '../store/slices/attendanceSlice';
import { fetchPayrollRecords } from '../store/slices/payrollSlice';
import NotificationMenu from './NotificationMenu';

const drawerWidth = 240;

const Layout = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useTheme();
  const navigate = useNavigate();
  const dispatch = useAppDispatch(); // Hook typé
  const token = useSelector((state: any) => state.auth.token);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }

    // Fetch initial data
    const fetchInitialData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const today = new Date();
        const startDate = new Date(today.getFullYear(), today.getMonth(), 1).toISOString().split('T')[0];
        const endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0).toISOString().split('T')[0];

        const results = await Promise.allSettled([
          dispatch(fetchEmployees()),
          // dispatch(fetchLeaveRequests()), // COMMENTÉ TEMPORAIREMENT
          // dispatch(fetchAttendance({ startDate, endDate })), // COMMENTÉ TEMPORAIREMENT
          // dispatch(fetchPayrollRecords(1)) // COMMENTÉ TEMPORAIREMENT
        ]);

        const failedRequests = results.filter((result): result is PromiseRejectedResult => result.status === 'rejected');
        if (failedRequests.length > 0) {
          console.error('Some requests failed:', failedRequests);
          setError('Some data failed to load. Please refresh the page.');
        }
      } catch (error) {
        console.error('Error fetching initial data:', error);
        setError('Failed to load initial data. Please refresh the page.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchInitialData();
  }, [token, navigate, dispatch]);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
    { text: 'Employees', icon: <PeopleIcon />, path: '/employees' },
    { text: 'Leave Requests', icon: <EventNoteIcon />, path: '/leave-requests' },
    { text: 'Attendance', icon: <AccessTimeIcon />, path: '/attendance' },
    { text: 'Performance', icon: <AssessmentIcon />, path: '/performance' },
    { text: 'Payroll', icon: <AttachMoneyIcon />, path: '/payroll' },
  ];

  const handleLogout = () => {
    // dispatch(logout()); // COMMENTÉ TEMPORAIREMENT
    localStorage.removeItem('token'); // Solution temporaire
    navigate('/login');
  };

  const drawer = (
    <div>
      <Toolbar>
        <Typography variant="h6" noWrap component="div">
          HR Management
        </Typography>
      </Toolbar>
      <List>
        {menuItems.map((item) => (
          <ListItem
            component="button"
            key={item.text}
            onClick={() => {
              navigate(item.path);
              setMobileOpen(false);
            }}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
        <ListItem component="button" onClick={handleLogout}>
          <ListItemIcon>
            <ExitToAppIcon />
          </ListItemIcon>
          <ListItemText primary="Logout" />
        </ListItem>
      </List>
    </div>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            HR Management System
          </Typography>
          <NotificationMenu />
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="mailbox folders"
      >
        <Drawer
          variant="temporary"
          anchor={theme.direction === 'rtl' ? 'right' : 'left'}
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          mt: '64px',
          height: 'calc(100vh - 64px)',
          overflow: 'auto',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        {isLoading ? (
          <Box display="flex" justifyContent="center" alignItems="center" flexGrow={1}>
            <Typography variant="h6">Loading...</Typography>
          </Box>
        ) : error ? (
          <Box display="flex" justifyContent="center" alignItems="center" flexGrow={1}>
            <Typography variant="h6" color="error">{error}</Typography>
          </Box>
        ) : (
          <Outlet />
        )}
      </Box>
    </Box>
  );
};

export default Layout;