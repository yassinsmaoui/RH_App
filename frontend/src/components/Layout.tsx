import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  Divider,
  Avatar,
  Menu,
  MenuItem,
  Badge,
  Collapse,
  useTheme,
  useMediaQuery,
  Chip,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard,
  People,
  AccessTime,
  EventNote,
  AttachMoney,
  TrendingUp,
  Work,
  School,
  Settings,
  Logout,
  AccountCircle,
  Notifications,
  ExpandLess,
  ExpandMore,
  PersonAdd,
  Assessment,
  CalendarToday,
  Receipt,
  Assignment,
  Stars,
  BusinessCenter,
  ChevronLeft,
} from '@mui/icons-material';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { logout } from '../store/slices/authSlice';
import NotificationMenu from './NotificationMenu';

const drawerWidth = 280;

interface NavItem {
  title: string;
  path?: string;
  icon: React.ReactNode;
  children?: NavItem[];
  badge?: number;
  roles?: string[];
}

const navigationItems: NavItem[] = [
  {
    title: 'Dashboard',
    path: '/dashboard',
    icon: <Dashboard />,
  },
  {
    title: 'Employees',
    icon: <People />,
    roles: ['admin', 'hr'],
    children: [
      { title: 'All Employees', path: '/employees', icon: <People /> },
      { title: 'Add Employee', path: '/employees/create', icon: <PersonAdd /> },
    ],
  },
  {
    title: 'Attendance',
    icon: <AccessTime />,
    children: [
      { title: 'Overview', path: '/attendance', icon: <AccessTime /> },
      { title: 'Time Tracking', path: '/attendance/time-tracking', icon: <CalendarToday /> },
      { title: 'Reports', path: '/attendance/report', icon: <Assessment /> },
    ],
  },
  {
    title: 'Leave Management',
    icon: <EventNote />,
    children: [
      { title: 'Requests', path: '/leave', icon: <Assignment /> },
      { title: 'Calendar', path: '/leave/calendar', icon: <CalendarToday /> },
      { title: 'Balance', path: '/leave/balance', icon: <Assessment /> },
    ],
  },
  {
    title: 'Payroll',
    icon: <AttachMoney />,
    roles: ['admin', 'hr'],
    children: [
      { title: 'Overview', path: '/payroll', icon: <AttachMoney /> },
      { title: 'Payslips', path: '/payroll/payslips', icon: <Receipt /> },
      { title: 'History', path: '/payroll/history', icon: <Assessment /> },
    ],
  },
  {
    title: 'Performance',
    icon: <TrendingUp />,
    children: [
      { title: 'Overview', path: '/performance', icon: <TrendingUp /> },
      { title: 'Reviews', path: '/performance/reviews', icon: <Stars /> },
      { title: 'Goals', path: '/performance/goals', icon: <Assignment /> },
    ],
  },
  {
    title: 'Recruitment',
    path: '/recruitment',
    icon: <Work />,
    roles: ['admin', 'hr'],
  },
  {
    title: 'Training',
    path: '/training',
    icon: <School />,
  },
];

const Layout: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  
  const { user } = useAppSelector((state) => state.auth);
  const notifications = useAppSelector((state) => (state as any).notifications?.items || []);
  
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const [notificationAnchor, setNotificationAnchor] = useState<null | HTMLElement>(null);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const handleNavItemClick = (item: NavItem) => {
    if (item.children) {
      const isExpanded = expandedItems.includes(item.title);
      setExpandedItems(
        isExpanded
          ? expandedItems.filter((i) => i !== item.title)
          : [...expandedItems, item.title]
      );
    } else if (item.path) {
      navigate(item.path);
      if (isMobile) {
        setMobileOpen(false);
      }
    }
  };

  const isItemActive = (item: NavItem): boolean => {
    if (item.path) {
      return location.pathname === item.path;
    }
    if (item.children) {
      return item.children.some((child) => child.path === location.pathname);
    }
    return false;
  };

  const hasAccess = (item: NavItem): boolean => {
    if (!item.roles || item.roles.length === 0) {
      return true;
    }
    return item.roles.some((role) => user?.roles?.includes(role));
  };

  const unreadNotifications = notifications.filter((n: { read: any; }) => !n.read).length;

  const drawer = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Toolbar
        sx={{
          px: 2,
          py: 3,
          background: theme.palette.primary.main,
          color: 'white',
        }}
      >
        <Typography variant="h5" noWrap sx={{ fontWeight: 600 }}>
          HR System
        </Typography>
      </Toolbar>
      <Divider />
      <List sx={{ flex: 1, px: 2, py: 1 }}>
        {navigationItems.map((item) => {
          if (!hasAccess(item)) return null;
          
          const isExpanded = expandedItems.includes(item.title);
          const isActive = isItemActive(item);

          return (
            <React.Fragment key={item.title}>
              <ListItem disablePadding sx={{ mb: 0.5 }}>
                <ListItemButton
                  onClick={() => handleNavItemClick(item)}
                  selected={isActive}
                  sx={{
                    borderRadius: 2,
                    '&.Mui-selected': {
                      backgroundColor: theme.palette.primary.main + '15',
                      '&:hover': {
                        backgroundColor: theme.palette.primary.main + '25',
                      },
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{
                      color: isActive ? theme.palette.primary.main : 'inherit',
                      minWidth: 40,
                    }}
                  >
                    {item.badge ? (
                      <Badge badgeContent={item.badge} color="error">
                        {item.icon}
                      </Badge>
                    ) : (
                      item.icon
                    )}
                  </ListItemIcon>
                  <ListItemText
                    primary={item.title}
                    primaryTypographyProps={{
                      fontWeight: isActive ? 600 : 400,
                    }}
                  />
                  {item.children && (isExpanded ? <ExpandLess /> : <ExpandMore />)}
                </ListItemButton>
              </ListItem>
              {item.children && (
                <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding sx={{ pl: 2 }}>
                    {item.children.map((child) => {
                      const isChildActive = child.path === location.pathname;
                      return (
                        <ListItem key={child.title} disablePadding sx={{ mb: 0.5 }}>
                          <ListItemButton
                            onClick={() => handleNavItemClick(child)}
                            selected={isChildActive}
                            sx={{
                              borderRadius: 2,
                              pl: 3,
                              '&.Mui-selected': {
                                backgroundColor: theme.palette.primary.main + '10',
                              },
                            }}
                          >
                            <ListItemIcon sx={{ minWidth: 35 }}>
                              {child.icon}
                            </ListItemIcon>
                            <ListItemText
                              primary={child.title}
                              primaryTypographyProps={{
                                fontSize: '0.9rem',
                                fontWeight: isChildActive ? 600 : 400,
                              }}
                            />
                          </ListItemButton>
                        </ListItem>
                      );
                    })}
                  </List>
                </Collapse>
              )}
            </React.Fragment>
          );
        })}
      </List>
      <Divider />
      <List sx={{ px: 2, py: 1 }}>
        <ListItem disablePadding>
          <ListItemButton
            onClick={() => navigate('/settings')}
            sx={{ borderRadius: 2 }}
          >
            <ListItemIcon>
              <Settings />
            </ListItemIcon>
            <ListItemText primary="Settings" />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar
        position="fixed"
        sx={{
          width: { md: `calc(100% - ${drawerWidth}px)` },
          ml: { md: `${drawerWidth}px` },
          backgroundColor: 'background.paper',
          color: 'text.primary',
          boxShadow: 1,
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { md: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            {location.pathname.split('/')[1]
              ? location.pathname
                  .split('/')[1]
                  .split('-')
                  .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                  .join(' ')
              : 'Dashboard'}
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <IconButton
              color="inherit"
              onClick={(e) => setNotificationAnchor(e.currentTarget)}
            >
              <Badge badgeContent={unreadNotifications} color="error">
                <Notifications />
              </Badge>
            </IconButton>

            <Chip
              avatar={
                <Avatar sx={{ width: 24, height: 24 }}>
                  {user?.firstName?.[0]?.toUpperCase()}
                </Avatar>
              }
              label={`${user?.firstName} ${user?.lastName}`}
              onClick={handleProfileMenuOpen}
              sx={{ cursor: 'pointer' }}
            />
          </Box>
        </Toolbar>
      </AppBar>

      <NotificationMenu
        anchorEl={notificationAnchor}
        onClose={() => setNotificationAnchor(null)}
      />

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleProfileMenuClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem onClick={() => { navigate('/profile'); handleProfileMenuClose(); }}>
          <ListItemIcon>
            <AccountCircle fontSize="small" />
          </ListItemIcon>
          <ListItemText>My Profile</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => { navigate('/settings'); handleProfileMenuClose(); }}>
          <ListItemIcon>
            <Settings fontSize="small" />
          </ListItemIcon>
          <ListItemText>Settings</ListItemText>
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          <ListItemText>Logout</ListItemText>
        </MenuItem>
      </Menu>

      <Box
        component="nav"
        sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
              borderRight: `1px solid ${theme.palette.divider}`,
            },
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
          width: { md: `calc(100% - ${drawerWidth}px)` },
          minHeight: '100vh',
          backgroundColor: 'background.default',
        }}
      >
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
};

export default Layout;
