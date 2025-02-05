import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
  Button,
  Stack,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { CalendarToday, AccessTime, SportsTennis } from '@mui/icons-material';
import { format } from 'date-fns';
import { api } from '../api/api';
import { pickleballColors } from '@/styles/theme';

interface Booking {
  id: string;
  startTime: string;
  endTime: string;
  status: string;
  totalAmount: number;
  court: {
    name: string;
    type: string;
    isIndoor: boolean;
  };
}

const MyBookings: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedBooking, setSelectedBooking] = useState<string | null>(null);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);

  const fetchBookings = async () => {
    try {
      const response = await api.get('/bookings/my-bookings');
      setBookings(response.data.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleCancelBooking = async () => {
    if (!selectedBooking) return;

    try {
      await api.delete(`/bookings/${selectedBooking}`);
      await fetchBookings(); // Refresh bookings
      setCancelDialogOpen(false);
      setSelectedBooking(null);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to cancel booking');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'CONFIRMED':
        return 'success';
      case 'PENDING':
        return 'warning';
      case 'CANCELLED':
        return 'error';
      default:
        return 'default';
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress sx={{ color: '#34495E' }} />
      </Box>
    );
  }

  return (
    <Box p={3}>
      <Typography 
        variant="h4" 
        gutterBottom 
        sx={{ 
          color: '#34495E',
          fontWeight: 600,
          mb: 4,
        }}
      >
        My Bookings
      </Typography>

      {error && (
        <Alert 
          severity="error" 
          sx={{ 
            mb: 2,
            '& .MuiAlert-icon': {
              color: pickleballColors.accent.main,
            },
          }}
        >
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        {bookings.map((booking) => (
          <Grid item xs={12} sm={6} md={4} key={booking.id}>
            <Card sx={{ 
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              borderRadius: '12px',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
              }
            }}>
              <CardContent>
                <Stack spacing={2}>
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography 
                      variant="h6" 
                      sx={{ 
                        color: '#34495E',
                        fontWeight: 600,
                      }}
                    >
                      {booking.court.name}
                    </Typography>
                    <Chip
                      label={booking.status}
                      color={getStatusColor(booking.status) as any}
                      size="small"
                      sx={{
                        fontWeight: 500,
                        '& .MuiChip-label': {
                          color: 'white',
                        },
                      }}
                    />
                  </Box>

                  <Stack direction="row" spacing={1} alignItems="center">
                    <SportsTennis 
                      fontSize="small" 
                      sx={{ 
                        color: '#34495E',
                        transition: 'color 0.2s ease-in-out',
                      }} 
                    />
                    <Typography sx={{ color: '#34495E' }}>
                      {booking.court.type} • {booking.court.isIndoor ? 'Indoor' : 'Outdoor'}
                    </Typography>
                  </Stack>

                  <Stack direction="row" spacing={1} alignItems="center">
                    <CalendarToday 
                      fontSize="small" 
                      sx={{ 
                        color: '#34495E',
                        transition: 'color 0.2s ease-in-out',
                      }} 
                    />
                    <Typography sx={{ color: '#34495E' }}>
                      {format(new Date(booking.startTime), 'MMMM dd, yyyy')}
                    </Typography>
                  </Stack>

                  <Stack direction="row" spacing={1} alignItems="center">
                    <AccessTime 
                      fontSize="small" 
                      sx={{ 
                        color: '#34495E',
                        transition: 'color 0.2s ease-in-out',
                      }} 
                    />
                    <Typography sx={{ color: '#34495E' }}>
                      {format(new Date(booking.startTime), 'hh:mm a')} - 
                      {format(new Date(booking.endTime), 'hh:mm a')}
                    </Typography>
                  </Stack>

                  <Box>
                    <Typography sx={{ color: 'text.secondary' }}>Total Amount</Typography>
                    <Typography 
                      variant="h6" 
                      sx={{ 
                        color: '#34495E',
                        fontWeight: 600,
                      }}
                    >
                      ₹{booking.totalAmount}
                    </Typography>
                  </Box>

                  {booking.status !== 'CANCELLED' && (
                    <Button
                      variant="outlined"
                      sx={{
                        color: '#34495E',
                        borderColor: '#34495E',
                        '&:hover': {
                          borderColor: pickleballColors.accent.main,
                          color: pickleballColors.accent.main,
                          backgroundColor: `${pickleballColors.accent.main}10`,
                        },
                      }}
                      onClick={() => {
                        setSelectedBooking(booking.id);
                        setCancelDialogOpen(true);
                      }}
                    >
                      Cancel Booking
                    </Button>
                  )}
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        ))}

        {bookings.length === 0 && (
          <Grid item xs={12}>
            <Alert 
              severity="info"
              sx={{
                '& .MuiAlert-icon': {
                  color: pickleballColors.accent.main,
                },
              }}
            >
              No bookings found
            </Alert>
          </Grid>
        )}
      </Grid>

      {/* Cancel Booking Dialog */}
      <Dialog 
        open={cancelDialogOpen} 
        onClose={() => setCancelDialogOpen(false)}
        PaperProps={{
          sx: {
            borderRadius: '12px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
          },
        }}
      >
        <DialogTitle sx={{ color: '#34495E', fontWeight: 600 }}>
          Cancel Booking
        </DialogTitle>
        <DialogContent>
          <Typography sx={{ color: '#34495E' }}>
            Are you sure you want to cancel this booking? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setCancelDialogOpen(false)}
            sx={{
              color: '#34495E',
              '&:hover': {
                color: pickleballColors.accent.main,
                backgroundColor: `${pickleballColors.accent.main}10`,
              },
            }}
          >
            No, Keep It
          </Button>
          <Button 
            onClick={handleCancelBooking} 
            variant="contained"
            sx={{
              bgcolor: '#34495E',
              color: 'white',
              '&:hover': {
                bgcolor: pickleballColors.accent.main,
              },
            }}
          >
            Yes, Cancel Booking
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MyBookings; 