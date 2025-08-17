import React from 'react';
import { Box, Typography, Card, CardContent } from '@mui/material';

const Payroll = () => {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Paie
      </Typography>
      <Card>
        <CardContent>
          <Typography>
            Gestion de la paie et des salaires
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Payroll;
