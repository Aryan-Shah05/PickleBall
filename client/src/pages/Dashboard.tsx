import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Alert,
  Stack,
  Button,
} from '@mui/material';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { api } from '../api/api';

interface Court {
  id: string;
  name: string;
  type: string;
  isIndoor: boolean;
  hourlyRate: number;
  peakHourRate: number;
}

interface Booking {
  id: string;
  startTime: string;
  endTime: string;
  court: Court;
  status: string;
  totalAmount: number;
}

interface DashboardData {
  statistics: {
    totalBookings: number;
    cancelledBookings: number;
    totalSpent: number;
    availableCourts: number;
    totalCourts: number;
  };
  upcomingBookings: Booking[];
  courts: {
    all: Court[];
    available: Court[];
  };
}

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await api.get('/dashboard');
        setDashboardData(response.data.data);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={3}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  if (!dashboardData) {
    return (
      <Box p={3}>
        <Alert severity="info">No dashboard data available</Alert>
      </Box>
    );
  }

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>

      <Grid container spacing={3}>
        {/* Statistics Cards */}
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Bookings
              </Typography>
              <Typography variant="h4">
                {dashboardData.statistics.totalBookings}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Available Courts
              </Typography>
              <Typography variant="h4">
                {dashboardData.statistics.availableCourts} / {dashboardData.statistics.totalCourts}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Cancelled Bookings
              </Typography>
              <Typography variant="h4">
                {dashboardData.statistics.cancelledBookings}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Spent
              </Typography>
              <Typography variant="h4">
                ${dashboardData.statistics.totalSpent}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Available Courts */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6">
                  Available Courts ({dashboardData.courts.available.length})
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => navigate('/book')}
                >
                  Book a Court
                </Button>
              </Box>
              
              <Grid container spacing={2}>
                {dashboardData.courts.available.map((court) => (
                  <Grid item xs={12} sm={6} md={4} key={court.id}>
                    <Card variant="outlined">
                      <CardContent>
                        <Typography variant="h6" gutterBottom>
                          {court.name}
                        </Typography>
                        <Stack spacing={1}>
                          <Typography color="textSecondary">
                            Type: {court.type} • {court.isIndoor ? 'Indoor' : 'Outdoor'}
                          </Typography>
                          <Typography color="textSecondary">
                            Rate: ${court.hourlyRate}/hour
                          </Typography>
                          <Typography variant="caption" color="textSecondary">
                            Peak Rate: ${court.peakHourRate}/hour
                          </Typography>
                          <Button
                            variant="outlined"
                            size="small"
                            onClick={() => navigate(`/book?courtId=${court.id}`)}
                          >
                            Book Now
                          </Button>
                        </Stack>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Upcoming Bookings */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6">
                  Upcoming Bookings
                </Typography>
                <Button
                  variant="outlined"
                  onClick={() => navigate('/bookings')}
                >
                  View All Bookings
                </Button>
              </Box>
              
              {dashboardData.upcomingBookings.length > 0 ? (
                <Grid container spacing={2}>
                  {dashboardData.upcomingBookings.map((booking) => (
                    <Grid item xs={12} sm={6} md={4} key={booking.id}>
                      <Card variant="outlined">
                        <CardContent>
                          <Typography variant="h6" gutterBottom>
                            {booking.court.name}
                          </Typography>
                          <Stack spacing={1}>
                            <Typography>
                              Date: {format(new Date(booking.startTime), 'MMM dd, yyyy')}
                            </Typography>
                            <Typography>
                              Time: {format(new Date(booking.startTime), 'h:mm a')} - {format(new Date(booking.endTime), 'h:mm a')}
                            </Typography>
                            <Typography color="textSecondary">
                              Amount: ${booking.totalAmount}
                            </Typography>
                          </Stack>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              ) : (
                <Alert severity="info">No upcoming bookings</Alert>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}; 