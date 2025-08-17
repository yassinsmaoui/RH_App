import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { Box, Typography, Button } from '@mui/material';
import theme from './theme';

// Simple test component
const TestPage = () => {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Application RH - Test
      </Typography>
      <Typography variant="body1" gutterBottom>
        L'application fonctionne !
      </Typography>
      <Button variant="contained" onClick={() => window.location.href = '/login'}>
        Aller au Login
      </Button>
    </Box>
  );
};

const SimpleLogin = () => {
  const handleLogin = () => {
    localStorage.setItem('token', 'test-token');
    window.location.href = '/';
  };

  return (
    <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Typography variant="h4" gutterBottom>
        Login Test
      </Typography>
      <Button variant="contained" onClick={handleLogin}>
        Se Connecter (Test)
      </Button>
    </Box>
  );
};

const TestApp = () => {
  const token = localStorage.getItem('token');
  
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <Routes>
          <Route path="/login" element={<SimpleLogin />} />
          <Route path="/" element={token ? <TestPage /> : <Navigate to="/login" replace />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
};

export default TestApp;
