import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Stack,
  Button,
} from '@mui/material';

const Attendance: React.FC = () => {
  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Gestion de la Présence
      </Typography>
      <Typography variant="h6" color="text.secondary" gutterBottom>
        Suivi des heures de travail et de la présence
      </Typography>
      
      <Stack spacing={3} sx={{ mt: 3 }}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Présences Aujourd'hui
            </Typography>
            <Typography variant="body1">
              • 42 employés présents sur 45
            </Typography>
            <Typography variant="body1">
              • Taux de présence: 93%
            </Typography>
            <Typography variant="body1">
              • 3 absences justifiées
            </Typography>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Heures de Travail
            </Typography>
            <Typography variant="body1">
              • Heures normales: 8h00 - 17h00
            </Typography>
            <Typography variant="body1">
              • Pause déjeuner: 12h00 - 13h00
            </Typography>
            <Typography variant="body1">
              • Heures supplémentaires: 15 cette semaine
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
                Pointer Arrivée
              </Button>
              <Button variant="outlined">
                Voir Rapport
              </Button>
              <Button variant="outlined">
                Exporter Données
              </Button>
            </Stack>
          </CardContent>
        </Card>
      </Stack>
    </Box>
  );
};

export default Attendance;