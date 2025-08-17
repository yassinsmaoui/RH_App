import React from 'react';
import { Box, Typography, Card, CardContent, Stack } from '@mui/material';

const SimpleDashboard = () => {
  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Dashboard
      </Typography>
      <Typography variant="h6" color="text.secondary" gutterBottom>
        Bienvenue dans le système de gestion RH
      </Typography>
      
      <Stack spacing={3} sx={{ mt: 3 }}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Statistiques Rapides
            </Typography>
            <Typography variant="body1">
              • Total Employés: 45
            </Typography>
            <Typography variant="body1">
              • Présents aujourd'hui: 42
            </Typography>
            <Typography variant="body1">
              • Demandes en attente: 8
            </Typography>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Activités Récentes
            </Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
              Nouvelle demande de congé soumise par John Doe
            </Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
              Rapport d'assiduité généré pour décembre
            </Typography>
            <Typography variant="body2">
              3 nouveaux employés ajoutés cette semaine
            </Typography>
          </CardContent>
        </Card>
      </Stack>
    </Box>
  );
};

export default SimpleDashboard;
