import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Chip,
  Stack,
} from '@mui/material';
import {
  People as PeopleIcon,
  AccessTime as AccessTimeIcon,
  BeachAccess as BeachAccessIcon,
  TrendingUp as TrendingUpIcon,
} from '@mui/icons-material';

const Dashboard = () => {
  return (
    <Box sx={{ 
      flexGrow: 1, 
      p: 3, 
      backgroundColor: '#f5f5f5',
      minHeight: '100vh'
    }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography 
          variant="h4" 
          component="h1" 
          sx={{ 
            fontWeight: 600,
            color: '#1a1a1a',
            mb: 0.5
          }}
        >
          Tableau de Bord RH
        </Typography>
        <Typography 
          variant="subtitle1" 
          color="text.secondary"
        >
          Vue d'ensemble du système de gestion des ressources humaines
        </Typography>
      </Box>

      {/* Statistiques principales */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card elevation={1} sx={{ borderRadius: 2 }}>
            <CardContent sx={{ display: 'flex', alignItems: 'center', p: 3 }}>
              <Box 
                sx={{ 
                  p: 1.5,
                  borderRadius: 2,
                  backgroundColor: '#e3f2fd',
                  mr: 2
                }}
              >
                <PeopleIcon sx={{ color: '#1976d2', fontSize: 28 }} />
              </Box>
              <Box>
                <Typography variant="h4" sx={{ fontWeight: 700 }}>
                  156
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Employés
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card elevation={1} sx={{ borderRadius: 2 }}>
            <CardContent sx={{ display: 'flex', alignItems: 'center', p: 3 }}>
              <Box 
                sx={{ 
                  p: 1.5,
                  borderRadius: 2,
                  backgroundColor: '#e8f5e8',
                  mr: 2
                }}
              >
                <AccessTimeIcon sx={{ color: '#2e7d32', fontSize: 28 }} />
              </Box>
              <Box>
                <Typography variant="h4" sx={{ fontWeight: 700 }}>
                  142
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Présences Aujourd'hui
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card elevation={1} sx={{ borderRadius: 2 }}>
            <CardContent sx={{ display: 'flex', alignItems: 'center', p: 3 }}>
              <Box 
                sx={{ 
                  p: 1.5,
                  borderRadius: 2,
                  backgroundColor: '#fff3e0',
                  mr: 2
                }}
              >
                <BeachAccessIcon sx={{ color: '#ed6c02', fontSize: 28 }} />
              </Box>
              <Box>
                <Typography variant="h4" sx={{ fontWeight: 700 }}>
                  8
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Demandes de Congé
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card elevation={1} sx={{ borderRadius: 2 }}>
            <CardContent sx={{ display: 'flex', alignItems: 'center', p: 3 }}>
              <Box 
                sx={{ 
                  p: 1.5,
                  borderRadius: 2,
                  backgroundColor: '#f3e5f5',
                  mr: 2
                }}
              >
                <TrendingUpIcon sx={{ color: '#9c27b0', fontSize: 28 }} />
              </Box>
              <Box>
                <Typography variant="h4" sx={{ fontWeight: 700 }}>
                  87%
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Performance Moyenne
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Actions rapides et activité récente */}
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Card elevation={1} sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
              Actions Rapides
            </Typography>
            <Stack spacing={2}>
              <Chip 
                label="Ajouter un employé" 
                variant="outlined" 
                color="primary" 
                clickable 
                sx={{ justifyContent: 'flex-start' }}
              />
              <Chip 
                label="Enregistrer présence" 
                variant="outlined" 
                color="success" 
                clickable 
                sx={{ justifyContent: 'flex-start' }}
              />
              <Chip 
                label="Gérer les congés" 
                variant="outlined" 
                color="warning" 
                clickable 
                sx={{ justifyContent: 'flex-start' }}
              />
              <Chip 
                label="Rapport de performance" 
                variant="outlined" 
                color="info" 
                clickable 
                sx={{ justifyContent: 'flex-start' }}
              />
            </Stack>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Card elevation={1} sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
              Activité Récente
            </Typography>
            <Stack spacing={2}>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Il y a 2 minutes
                </Typography>
                <Typography variant="body1">
                  Nouvel employé ajouté: Jean Dupont
                </Typography>
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Il y a 15 minutes
                </Typography>
                <Typography variant="body1">
                  Demande de congé approuvée pour Marie Martin
                </Typography>
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Il y a 1 heure
                </Typography>
                <Typography variant="body1">
                  Rapport de performance généré
                </Typography>
              </Box>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
