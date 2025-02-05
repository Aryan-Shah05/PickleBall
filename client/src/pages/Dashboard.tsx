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
import useAuthStore from '@/store/auth';

// Import theme colors from MainLayout
const pickleballTheme = {
  court: '#2ecc71', // Pickleball court green
  courtLight: '#a8e6cf', // Light court color
  ball: '#f39c12',  // Pickleball yellow/orange
  paddle: '#8e44ad', // Paddle purple
  net: '#2c3e50',   // Net dark blue
  accent: '#e74c3c', // Energetic red accent
  background: 'rgba(255, 255, 255, 0.9)', // Translucent white
  backgroundDark: 'rgba(44, 62, 80, 0.95)', // Translucent dark
};

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
  const { user } = useAuthStore();

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
        <CircularProgress sx={{ color: pickleballTheme.court }} />
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
      <Typography 
        variant="h4" 
        gutterBottom 
        sx={{ 
          color: pickleballTheme.paddle,
          fontWeight: 600,
          mb: 4,
          display: 'flex',
          alignItems: 'center',
          gap: 1,
        }}
      >
        Hi, {user?.firstName || 'Player'}! <Box component="span" sx={{ fontSize: '1.5em' }}>👋</Box>
      </Typography>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* Statistics Cards - Now in 2x2 grid on smaller screens */}
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            borderRadius: 3,
            height: '100%',
            '&:hover': { 
              transform: 'translateY(-4px)',
              boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
            }
          }}>
            <CardContent>
              <Typography color={pickleballTheme.paddle} gutterBottom variant="subtitle2">
                Total Bookings
              </Typography>
              <Typography variant="h4" sx={{ color: pickleballTheme.court, fontWeight: 600 }}>
                {dashboardData.statistics.totalBookings}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            borderRadius: 3,
            height: '100%',
            '&:hover': { 
              transform: 'translateY(-4px)',
              boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
            }
          }}>
            <CardContent>
              <Typography color={pickleballTheme.paddle} gutterBottom variant="subtitle2">
                Available Courts
              </Typography>
              <Typography variant="h4" sx={{ color: pickleballTheme.court, fontWeight: 600 }}>
                {dashboardData.statistics.availableCourts} / {dashboardData.statistics.totalCourts}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            borderRadius: 3,
            height: '100%',
            '&:hover': { 
              transform: 'translateY(-4px)',
              boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
            }
          }}>
            <CardContent>
              <Typography color={pickleballTheme.paddle} gutterBottom variant="subtitle2">
                Cancelled Bookings
              </Typography>
              <Typography variant="h4" sx={{ color: pickleballTheme.court, fontWeight: 600 }}>
                {dashboardData.statistics.cancelledBookings}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            borderRadius: 3,
            height: '100%',
            '&:hover': { 
              transform: 'translateY(-4px)',
              boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
            }
          }}>
            <CardContent>
              <Typography color={pickleballTheme.paddle} gutterBottom variant="subtitle2">
                Total Spent
              </Typography>
              <Typography variant="h4" sx={{ color: pickleballTheme.court, fontWeight: 600 }}>
                ₹{dashboardData.statistics.totalSpent}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Available Courts */}
      <Grid item xs={12}>
        <Card sx={{ 
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          borderRadius: 3,
          mb: 4,
          '&:hover': { 
            transform: 'translateY(-4px)',
            boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
          }
        }}>
          <CardContent>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
              <Typography variant="h6" sx={{ color: pickleballTheme.paddle }}>
                Available Courts ({dashboardData.courts.available.length})
              </Typography>
              <Button
                variant="contained"
                sx={{
                  bgcolor: pickleballTheme.court,
                  '&:hover': {
                    bgcolor: pickleballTheme.paddle,
                  },
                }}
                onClick={() => navigate('/book')}
              >
                Book a Court
              </Button>
            </Box>
            
            <Grid container spacing={2}>
              {dashboardData.courts.available.map((court) => (
                <Grid item xs={6} sm={6} md={4} key={court.id}>
                  <Card 
                    variant="outlined"
                    sx={{ 
                      transition: 'all 0.2s ease-in-out',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                      }
                    }}
                  >
                    <CardContent>
                      <Typography variant="h6" gutterBottom sx={{ color: pickleballTheme.paddle }}>
                        {court.name}
                      </Typography>
                      <Stack spacing={1}>
                        <Typography color="textSecondary">
                          Type: {court.type} • {court.isIndoor ? 'Indoor' : 'Outdoor'}
                        </Typography>
                        <Typography color="textSecondary">
                          Rate: ₹{court.hourlyRate}/hour
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                          Peak Rate: ₹{court.peakHourRate}/hour
                        </Typography>
                        <Button
                          variant="outlined"
                          size="small"
                          sx={{
                            color: pickleballTheme.court,
                            borderColor: pickleballTheme.court,
                            '&:hover': {
                              borderColor: pickleballTheme.paddle,
                              color: pickleballTheme.paddle,
                            },
                          }}
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
        <Card sx={{ 
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          borderRadius: 3,
          '&:hover': { 
            transform: 'translateY(-4px)',
            boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
          }
        }}>
          <CardContent>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h6" sx={{ color: pickleballTheme.paddle }}>
                Upcoming Bookings
              </Typography>
              <Button
                variant="outlined"
                sx={{
                  color: pickleballTheme.court,
                  borderColor: pickleballTheme.court,
                  '&:hover': {
                    borderColor: pickleballTheme.paddle,
                    color: pickleballTheme.paddle,
                  },
                }}
                onClick={() => navigate('/bookings')}
              >
                View All Bookings
              </Button>
            </Box>
            
            {dashboardData.upcomingBookings.length > 0 ? (
              <Grid container spacing={2}>
                {dashboardData.upcomingBookings.map((booking) => (
                  <Grid item xs={12} sm={6} md={4} key={booking.id}>
                    <Card 
                      variant="outlined"
                      sx={{ 
                        transition: 'all 0.2s ease-in-out',
                        '&:hover': {
                          transform: 'translateY(-4px)',
                          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                        }
                      }}
                    >
                      <CardContent>
                        <Typography variant="h6" gutterBottom sx={{ color: pickleballTheme.paddle }}>
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
                            Amount: ₹{booking.totalAmount}
                          </Typography>
                        </Stack>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Alert 
                severity="info"
                sx={{
                  '& .MuiAlert-icon': {
                    color: pickleballTheme.ball,
                  },
                }}
              >
                No upcoming bookings
              </Alert>
            )}
          </CardContent>
        </Card>
      </Grid>
    </Box>
  );
}; 