import { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
} from '@mui/material';
import apiClient from '@/api/client';
import { Court } from '@/types';

const Home = () => {
  const [courts, setCourts] = useState<Court[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCourts = async () => {
      setLoading(true);
      try {
        const response = await apiClient.get<{ data: { courts: Court[] } }>('/api/v1/courts');
        setCourts(response.data.data.courts);
      } catch (error) {
        setError('Failed to fetch courts');
      } finally {
        setLoading(false);
      }
    };

    fetchCourts();
  }, []);

  if (loading) {
    return (
      <Box p={3}>
        <Typography>Loading...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={3}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Welcome to PickleBall
      </Typography>

      <Typography variant="h6" gutterBottom>
        Available Courts
      </Typography>

      <Grid container spacing={3}>
        {courts.map((court) => (
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
                >
                  Book Now
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Home; 