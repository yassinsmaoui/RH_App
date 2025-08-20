import React, { Suspense, lazy, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline, CircularProgress, Box } from '@mui/material';
import { Provider } from 'react-redux';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { SnackbarProvider } from 'notistack';

import { store } from './store';
import theme from './theme';
import { useAppSelector } from './store/hooks';
import Layout from './components/Layout';
import LoadingScreen from './components/LoadingScreen';
import ErrorBoundary from './components/ErrorBoundary';
import AuthGuard from './components/guards/AuthGuard';
import GuestGuard from './components/guards/GuestGuard';

// Lazy load pages for better performance
const Login = lazy(() => import('./pages/auth/Login'));
const Register = lazy(() => import('./pages/auth/Register'));
const ForgotPassword = lazy(() => import('./pages/auth/ForgotPassword'));
const ResetPassword = lazy(() => import('./pages/auth/ResetPassword'));

const Dashboard = lazy(() => import('./pages/Dashboard'));
const Employees = lazy(() => import('./pages/employees/Employees'));
const EmployeeDetail = lazy(() => import('./pages/employees/EmployeeDetail'));
const EmployeeCreate = lazy(() => import('./pages/employees/EmployeeCreate'));

const Attendance = lazy(() => import('./pages/attendance/Attendance'));
const AttendanceReport = lazy(() => import('./pages/attendance/AttendanceReport'));
const TimeTracking = lazy(() => import('./pages/attendance/TimeTracking'));

const LeaveRequests = lazy(() => import('./pages/leave/LeaveRequests'));
const LeaveCalendar = lazy(() => import('./pages/leave/LeaveCalendar'));
const LeaveBalance = lazy(() => import('./pages/leave/LeaveBalance'));

const Payroll = lazy(() => import('./pages/payroll/Payroll'));
const PayrollHistory = lazy(() => import('./pages/payroll/PayrollHistory'));
const Payslips = lazy(() => import('./pages/payroll/Payslips'));

const Performance = lazy(() => import('./pages/performance/Performance'));
const Reviews = lazy(() => import('./pages/performance/Reviews'));
const Goals = lazy(() => import('./pages/performance/Goals'));

const Recruitment = lazy(() => import('./pages/recruitment/Recruitment'));
const Training = lazy(() => import('./pages/training/Training'));
const Settings = lazy(() => import('./pages/settings/Settings'));
const Profile = lazy(() => import('./pages/Profile'));
const NotFound = lazy(() => import('./pages/NotFound'));

// Loading component
const PageLoader: React.FC = () => (
  <Box
    sx={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
    }}
  >
    <CircularProgress />
  </Box>
);

// Main App Router Component
const AppRouter: React.FC = () => {
  const { isAuthenticated, isInitialized } = useAppSelector((state) => state.auth);

  if (!isInitialized) {
    return <LoadingScreen />;
  }

  return (
    <BrowserRouter>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* Public Routes */}
          <Route
            path="/login"
            element={
              <GuestGuard>
                <Login />
              </GuestGuard>
            }
          />
          <Route
            path="/register"
            element={
              <GuestGuard>
                <Register />
              </GuestGuard>
            }
          />
          <Route
            path="/forgot-password"
            element={
              <GuestGuard>
                <ForgotPassword />
              </GuestGuard>
            }
          />
          <Route
            path="/reset-password/:token"
            element={
              <GuestGuard>
                <ResetPassword />
              </GuestGuard>
            }
          />

          {/* Protected Routes */}
          <Route
            path="/"
            element={
              <AuthGuard>
                <Layout />
              </AuthGuard>
            }
          >
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            
            {/* Employee Module */}
            <Route path="employees">
              <Route index element={<Employees />} />
              <Route path="create" element={<EmployeeCreate />} />
              <Route path=":id" element={<EmployeeDetail />} />
            </Route>

            {/* Attendance Module */}
            <Route path="attendance">
              <Route index element={<Attendance />} />
              <Route path="report" element={<AttendanceReport />} />
              <Route path="time-tracking" element={<TimeTracking />} />
            </Route>

            {/* Leave Module */}
            <Route path="leave">
              <Route index element={<LeaveRequests />} />
              <Route path="calendar" element={<LeaveCalendar />} />
              <Route path="balance" element={<LeaveBalance />} />
            </Route>

            {/* Payroll Module */}
            <Route path="payroll">
              <Route index element={<Payroll />} />
              <Route path="history" element={<PayrollHistory />} />
              <Route path="payslips" element={<Payslips />} />
            </Route>

            {/* Performance Module */}
            <Route path="performance">
              <Route index element={<Performance />} />
              <Route path="reviews" element={<Reviews />} />
              <Route path="goals" element={<Goals />} />
            </Route>

            {/* Additional Modules */}
            <Route path="recruitment" element={<Recruitment />} />
            <Route path="training" element={<Training />} />
            <Route path="profile" element={<Profile />} />
            <Route path="settings" element={<Settings />} />
          </Route>

          {/* 404 Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
};

// Main App Component
const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <SnackbarProvider
              maxSnack={3}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              autoHideDuration={3000}
            >
              <CssBaseline />
              <AppRouter />
            </SnackbarProvider>
          </LocalizationProvider>
        </ThemeProvider>
      </Provider>
    </ErrorBoundary>
  );
};

export default App;
