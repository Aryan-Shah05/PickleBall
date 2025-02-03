import { useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
} from '@mui/material';
import { useCourtStore } from '@/store/court';
import { Court } from '@/types';

const BookCourt: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const { courts, isLoading, error, fetchCourts } = useCourtStore();

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Book a Court
      </Typography>

      {error && (
        <Typography color="error" gutterBottom>
          {error}
        </Typography>
      )}

      <Grid container spacing={3}>
        {courts.map((court: Court) => (
          <Grid item xs={12} sm={6} md={4} key={court.id}>
            <Card>
              <CardContent>
                <Typography variant="h6">{court.name}</Typography>
                <Typography color="textSecondary">
                  Type: {court.type}
                </Typography>
                <Typography color="textSecondary">
                  Rate: ${court.hourlyRate}/hour
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  sx={{ mt: 2 }}
                  disabled={isLoading}
                >
                  Select Time
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default BookCourt; 