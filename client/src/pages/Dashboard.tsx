import React from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Stack,
  Chip
} from '@mui/material';
import {
  SportsTennis,
  Event,
  TrendingUp,
  CalendarToday,
  AccessTime,
  ArrowForward
} from '@mui/icons-material';

export const Dashboard: React.FC = () => {
  // Mock data - replace with real API calls later
  const stats = [
    { label: 'Total Bookings', value: '24', icon: <Event /> },
    { label: 'Courts Available', value: '6', icon: <SportsTennis /> },
    { label: 'Peak Hours', value: '80%', icon: <TrendingUp /> },
  ];

  const upcomingBookings = [
    {
      id: 1,
      court: 'Court A',
      date: '2024-02-03',
      time: '10:00 AM',
      status: 'confirmed',
    },
    {
      id: 2,
      court: 'Court B',
      date: '2024-02-04',
      time: '2:00 PM',
      status: 'pending',
    },
  ];

  const availableCourts = [
    {
      id: 1,
      name: 'Court A',
      type: 'Indoor',
      status: 'Available',
      nextSlot: '10:00 AM',
    },
    {
      id: 2,
      name: 'Court B',
      type: 'Outdoor',
      status: 'Available',
      nextSlot: '11:00 AM',
    },
    {
      id: 3,
      name: 'Court C',
      type: 'Indoor',
      status: 'Maintenance',
      nextSlot: '2:00 PM',
    },
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom fontWeight="500">
        Welcome Back
      </Typography>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={4} key={index}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Box sx={{ 
                    p: 1, 
                    borderRadius: 1, 
                    bgcolor: 'primary.light',
                    color: 'white',
                    mr: 2 
                  }}>
                    {stat.icon}
                  </Box>
                  <Box>
                    <Typography variant="h4" fontWeight="500">
                      {stat.value}
                    </Typography>
                    <Typography color="text.secondary" variant="body2">
                      {stat.label}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Main Content */}
      <Grid container spacing={3}>
        {/* Available Courts */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h6">Available Courts</Typography>
                <Button 
                  variant="outlined" 
                  endIcon={<ArrowForward />}
                  onClick={() => window.location.href = '/book'}
                >
                  Book Now
                </Button>
              </Box>
              <Stack spacing={2}>
                {availableCourts.map((court) => (
                  <Box
                    key={court.id}
                    sx={{
                      p: 2,
                      border: 1,
                      borderColor: 'divider',
                      borderRadius: 1,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <Box>
                      <Typography variant="subtitle1" fontWeight="500">
                        {court.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {court.type}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Chip
                        label={court.status}
                        color={court.status === 'Available' ? 'success' : 'warning'}
                        size="small"
                      />
                      <Box sx={{ textAlign: 'right' }}>
                        <Typography variant="caption" display="block" color="text.secondary">
                          Next Available
                        </Typography>
                        <Typography variant="body2">
                          {court.nextSlot}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                ))}
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* Upcoming Bookings */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Upcoming Bookings
              </Typography>
              <Stack spacing={2}>
                {upcomingBookings.map((booking) => (
                  <Box
                    key={booking.id}
                    sx={{
                      p: 2,
                      border: 1,
                      borderColor: 'divider',
                      borderRadius: 1,
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Typography variant="subtitle1" fontWeight="500">
                        {booking.court}
                      </Typography>
                      <Chip
                        label={booking.status}
                        color={booking.status === 'confirmed' ? 'success' : 'warning'}
                        size="small"
                        sx={{ ml: 'auto' }}
                      />
                    </Box>
                    <Stack direction="row" spacing={2}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <CalendarToday sx={{ fontSize: 16, mr: 0.5 }} />
                        <Typography variant="body2">
                          {new Date(booking.date).toLocaleDateString()}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <AccessTime sx={{ fontSize: 16, mr: 0.5 }} />
                        <Typography variant="body2">{booking.time}</Typography>
                      </Box>
                    </Stack>
                  </Box>
                ))}
              </Stack>
              <Button
                fullWidth
                variant="outlined"
                sx={{ mt: 2 }}
                onClick={() => window.location.href = '/bookings'}
              >
                View All Bookings
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}; 