import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Stack,
  Button,
} from '@mui/material';

const Employees: React.FC = () => {
  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Gestion des Employés
      </Typography>
      <Typography variant="h6" color="text.secondary" gutterBottom>
        Liste et gestion des employés de l'entreprise
      </Typography>
      
      <Stack spacing={3} sx={{ mt: 3 }}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Employés Actifs
            </Typography>
            <Typography variant="body1">
              • John Doe - Développeur Senior
            </Typography>
            <Typography variant="body1">
              • Jane Smith - Responsable RH
            </Typography>
            <Typography variant="body1">
              • Bob Wilson - Designer UX/UI
            </Typography>
            <Typography variant="body1">
              • Alice Brown - Chef de Projet
            </Typography>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Actions Rapides
            </Typography>
            <Stack direction="row" spacing={2}>
              <Button variant="contained" color="primary">
                Ajouter Employé
              </Button>
              <Button variant="outlined">
                Exporter Liste
              </Button>
              <Button variant="outlined">
                Générer Rapport
              </Button>
            </Stack>
          </CardContent>
        </Card>
      </Stack>
    </Box>
  );
};

export default Employees;
