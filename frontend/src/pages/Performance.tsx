import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Stack,
  Button,
  LinearProgress,
} from '@mui/material';

const Performance: React.FC = () => {
  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Évaluation des Performances
      </Typography>
      <Typography variant="h6" color="text.secondary" gutterBottom>
        Suivi et évaluation des performances des employés
      </Typography>
      
      <Stack spacing={3} sx={{ mt: 3 }}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Objectifs de l'Équipe
            </Typography>
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" gutterBottom>
                Ventes Trimestrielles (85%)
              </Typography>
              <LinearProgress variant="determinate" value={85} />
            </Box>
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" gutterBottom>
                Satisfaction Client (92%)
              </Typography>
              <LinearProgress variant="determinate" value={92} />
            </Box>
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" gutterBottom>
                Projets Livrés (78%)
              </Typography>
              <LinearProgress variant="determinate" value={78} />
            </Box>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Évaluations Récentes
            </Typography>
            <Typography variant="body1">
              • John Doe - Performance Excellente (4.5/5)
            </Typography>
            <Typography variant="body1">
              • Jane Smith - Performance Très Bonne (4.2/5)
            </Typography>
            <Typography variant="body1">
              • Bob Wilson - Performance Bonne (3.8/5)
            </Typography>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Actions
            </Typography>
            <Stack direction="row" spacing={2}>
              <Button variant="contained" color="primary">
                Nouvelle Évaluation
              </Button>
              <Button variant="outlined">
                Voir Rapports
              </Button>
              <Button variant="outlined">
                Planifier 1-on-1
              </Button>
            </Stack>
          </CardContent>
        </Card>
      </Stack>
    </Box>
  );
};

export default Performance;
