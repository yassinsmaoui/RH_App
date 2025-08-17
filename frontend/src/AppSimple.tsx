import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { Box, Typography, Button } from '@mui/material';
import theme from './theme';

const TestLogin = () => (
  <Box sx={{ 
    minHeight: '100vh', 
    display: 'flex', 
    flexDirection: 'column', 
    alignItems: 'center', 
    justifyContent: 'center',
    backgroundColor: '#f5f5f5'
  }}>
    <Typography variant="h3" component="h1" gutterBottom>
      HR Management System
    </Typography>
    <Typography variant="h6" color="primary" gutterBottom>
      Page de Connexion Simplifiée
    </Typography>
    <Box sx={{ mt: 3, p: 3, backgroundColor: 'white', borderRadius: 2, boxShadow: 1 }}>
      <Typography variant="h5" gutterBottom>
        Connexion
      </Typography>
      <Typography variant="body1">
        Cette page de connexion fonctionne !
      </Typography>
      <Button variant="contained" sx={{ mt: 2 }}>
        Se connecter (test)
      </Button>
    </Box>
  </Box>
);

const TestPage = () => (
  <Box sx={{ 
    minHeight: '100vh', 
    display: 'flex', 
    flexDirection: 'column', 
    alignItems: 'center', 
    justifyContent: 'center',
    backgroundColor: '#f5f5f5'
  }}>
    <Typography variant="h3" component="h1" gutterBottom>
      HR Management System
    </Typography>
    <Typography variant="h6" color="primary">
      Application Test - Avec Router ! 🎉
    </Typography>
  </Box>
);

const AppSimple = () => {
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <Routes>
          <Route path="/login" element={<TestLogin />} />
          <Route path="*" element={<TestPage />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
};

export default AppSimple;
