import React, { useEffect, useState } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Stack,
  Chip,
  CircularProgress
} from '@mui/material';
import {
  SportsTennis,
  Event,
  TrendingUp,
  CalendarToday,
  AccessTime,
  ArrowForward
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { api } from '../api/api';
import { format } from 'date-fns';

interface DashboardData {
  stats: {
    totalCourts: number;
    availableCourts: number;
    userBookings: number;
  };
  upcomingBookings: Array<{
    id: string;
    startTime: string;
    endTime: string;
    status: string;
    court: {
      name: string;
      type: string;
    };
  }>;
  availableCourtsDetails: Array<{
    id: string;
    name: string;
    type: string;
    hourlyRate: number;
    isIndoor: boolean;
  }>;
}

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await api.get('/dashboard/stats');
        setDashboardData(response.data);
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
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  const stats = [
    { 
      label: 'Total Bookings', 
      value: dashboardData?.stats.userBookings.toString() || '0', 
      icon: <Event /> 
    },
    { 
      label: 'Courts Available', 
      value: dashboardData?.stats.availableCourts.toString() || '0', 
      icon: <SportsTennis /> 
    },
    { 
      label: 'Total Courts', 
      value: dashboardData?.stats.totalCourts.toString() || '0', 
      icon: <TrendingUp /> 
    },
  ];

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Welcome to PickleBall
      </Typography>

      {/* Stats Cards */}
      <Grid container spacing={3} mb={4}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={4} key={index}>
            <Card>
              <CardContent>
                <Stack direction="row" spacing={2} alignItems="center">
                  {stat.icon}
                  <Box>
                    <Typography variant="h5">{stat.value}</Typography>
                    <Typography color="textSecondary">{stat.label}</Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Upcoming Bookings */}
      <Box mb={4}>
        <Typography variant="h6" gutterBottom>
          Upcoming Bookings
        </Typography>
        <Grid container spacing={2}>
          {dashboardData?.upcomingBookings.map((booking) => (
            <Grid item xs={12} sm={6} md={4} key={booking.id}>
              <Card>
                <CardContent>
                  <Stack spacing={2}>
                    <Typography variant="h6">{booking.court.name}</Typography>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <CalendarToday fontSize="small" />
                      <Typography>
                        {format(new Date(booking.startTime), 'MMM dd, yyyy')}
                      </Typography>
                    </Stack>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <AccessTime fontSize="small" />
                      <Typography>
                        {format(new Date(booking.startTime), 'hh:mm a')} - 
                        {format(new Date(booking.endTime), 'hh:mm a')}
                      </Typography>
                    </Stack>
                    <Chip 
                      label={booking.status} 
                      color={booking.status === 'CONFIRMED' ? 'success' : 'warning'}
                      size="small"
                    />
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          ))}
          {(!dashboardData?.upcomingBookings || dashboardData.upcomingBookings.length === 0) && (
            <Grid item xs={12}>
              <Typography color="textSecondary">No upcoming bookings</Typography>
            </Grid>
          )}
        </Grid>
      </Box>

      {/* Available Courts */}
      <Box>
        <Typography variant="h6" gutterBottom>
          Available Courts
        </Typography>
        <Grid container spacing={2}>
          {dashboardData?.availableCourtsDetails.map((court) => (
            <Grid item xs={12} sm={6} md={4} key={court.id}>
              <Card>
                <CardContent>
                  <Stack spacing={2}>
                    <Typography variant="h6">{court.name}</Typography>
                    <Typography color="textSecondary">
                      {court.type} • {court.isIndoor ? 'Indoor' : 'Outdoor'}
                    </Typography>
                    <Typography>
                      ${court.hourlyRate}/hour
                    </Typography>
                    <Button
                      variant="contained"
                      endIcon={<ArrowForward />}
                      onClick={() => navigate(`/book?courtId=${court.id}`)}
                    >
                      Book Now
                    </Button>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          ))}
          {(!dashboardData?.availableCourtsDetails || dashboardData.availableCourtsDetails.length === 0) && (
            <Grid item xs={12}>
              <Typography color="textSecondary">No courts available</Typography>
            </Grid>
          )}
        </Grid>
      </Box>
    </Box>
  );
}; 