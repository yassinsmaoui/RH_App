import React from 'react';
import { Box, Typography, Card, CardContent } from '@mui/material';

const LeaveRequests = () => {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Demandes de Conges
      </Typography>
      <Card>
        <CardContent>
          <Typography>
            Gestion des demandes de conges
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

export default LeaveRequests;