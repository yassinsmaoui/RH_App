import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline, Box, Typography } from '@mui/material';
import theme from './theme';

// Test avec seulement Login - pas de Dashboard
import Login from './pages/Login';

// Page de test simple au lieu de Dashboard
const TestDashboard: React.FC = () => {
  return (
    <Box 
      sx={{
        backgroundColor: 'success.main',
        color: 'white',
        padding: 3,
        textAlign: 'center',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column'
      }}
    >
      <Typography variant="h3" gutterBottom>
        Dashboard Test
      </Typography>
      <Typography variant="h6">
        Si vous voyez ceci, Login fonctionne et vous êtes "connecté"
      </Typography>
    </Box>
  );
};

const App: React.FC = () => {
  // Pour ce test, simulons qu'on n'est jamais connecté
  const isAuthenticated = false;
  
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<TestDashboard />} />
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default App;
