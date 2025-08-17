import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Stack,
  Paper,
  Chip
} from '@mui/material';
import {
  People as PeopleIcon,
  AccessTime as AccessTimeIcon,
  BeachAccess as BeachAccessIcon,
  TrendingUp as TrendingUpIcon,
  AttachMoney as AttachMoneyIcon
} from '@mui/icons-material';

const DashboardNew: React.FC = () => {
  const statsCards = [
    {
      title: 'Total Employes',
      value: '156',
      icon: <PeopleIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
      color: 'primary.light'
    },
    {
      title: 'Presences Aujourd\'hui',
      value: '142',
      icon: <AccessTimeIcon sx={{ fontSize: 40, color: 'success.main' }} />,
      color: 'success.light'
    },
    {
      title: 'Demandes de Conge',
      value: '8',
      icon: <BeachAccessIcon sx={{ fontSize: 40, color: 'warning.main' }} />,
      color: 'warning.light'
    },
    {
      title: 'Performance Moyenne',
      value: '87%',
      icon: <TrendingUpIcon sx={{ fontSize: 40, color: 'info.main' }} />,
      color: 'info.light'
    }
  ];

  return (
    <Box sx={{ flexGrow: 1, p: 3, bgcolor: 'background.default', minHeight: '100vh' }}>
      {/* En-tête */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
          Tableau de Bord RH
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Vue d'ensemble du système de gestion des ressources humaines
        </Typography>
      </Box>

      {/* Cartes de statistiques */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {statsCards.map((card, index) => (
          <Grid size={{ xs: 12, sm: 6, md: 3 }} key={index}>
            <Card sx={{ 
              height: '100%',
              transition: 'transform 0.2s',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: 4
              }
            }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Box
                    sx={{
                      backgroundColor: card.color,
                      borderRadius: 2,
                      p: 1,
                      mr: 2
                    }}
                  >
                    {card.icon}
                  </Box>
                  <Box>
                    <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
                      {card.value}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {card.title}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Sections d'actions rapides */}
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper sx={{ p: 3, height: '300px' }}>
            <Typography variant="h6" gutterBottom>
              Actions Rapides
            </Typography>
            <Stack spacing={2}>
              <Chip 
                label="Ajouter un employe" 
                clickable 
                color="primary" 
                variant="outlined"
                sx={{ justifyContent: 'flex-start' }}
              />
              <Chip 
                label="Enregistrer presence" 
                clickable 
                color="success" 
                variant="outlined"
                sx={{ justifyContent: 'flex-start' }}
              />
              <Chip 
                label="Gerer les conges" 
                clickable 
                color="warning" 
                variant="outlined"
                sx={{ justifyContent: 'flex-start' }}
              />
              <Chip 
                label="Rapport de performance" 
                clickable 
                color="info" 
                variant="outlined"
                sx={{ justifyContent: 'flex-start' }}
              />
            </Stack>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Paper sx={{ p: 3, height: '300px' }}>
            <Typography variant="h6" gutterBottom>
              Activite Recente
            </Typography>
            <Stack spacing={2}>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Il y a 2 minutes
                </Typography>
                <Typography variant="body1">
                  Nouvel employe ajoute: Jean Dupont
                </Typography>
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Il y a 15 minutes
                </Typography>
                <Typography variant="body1">
                  Demande de conge approuvee pour Marie Martin
                </Typography>
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Il y a 1 heure
                </Typography>
                <Typography variant="body1">
                  Rapport de performance genere
                </Typography>
              </Box>
            </Stack>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DashboardNew;
