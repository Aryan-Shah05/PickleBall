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
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        My Bookings
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Grid container spacing={3}>
        {bookings.map((booking) => (
          <Grid item xs={12} sm={6} md={4} key={booking.id}>
            <Card>
              <CardContent>
                <Stack spacing={2}>
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="h6">{booking.court.name}</Typography>
                    <Chip
                      label={booking.status}
                      color={getStatusColor(booking.status) as any}
                      size="small"
                    />
                  </Box>

                  <Stack direction="row" spacing={1} alignItems="center">
                    <SportsTennis fontSize="small" />
                    <Typography>
                      {booking.court.type} • {booking.court.isIndoor ? 'Indoor' : 'Outdoor'}
                    </Typography>
                  </Stack>

                  <Stack direction="row" spacing={1} alignItems="center">
                    <CalendarToday fontSize="small" />
                    <Typography>
                      {format(new Date(booking.startTime), 'MMMM dd, yyyy')}
                    </Typography>
                  </Stack>

                  <Stack direction="row" spacing={1} alignItems="center">
                    <AccessTime fontSize="small" />
                    <Typography>
                      {format(new Date(booking.startTime), 'hh:mm a')} - 
                      {format(new Date(booking.endTime), 'hh:mm a')}
                    </Typography>
                  </Stack>

                  <Box>
                    <Typography color="textSecondary">Total Amount</Typography>
                    <Typography variant="h6" color="primary">
                      ${booking.totalAmount}
                    </Typography>
                  </Box>

                  {booking.status !== 'CANCELLED' && (
                    <Button
                      variant="outlined"
                      color="error"
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
            <Typography color="textSecondary" align="center">
              No bookings found
            </Typography>
          </Grid>
        )}
      </Grid>

      {/* Cancel Booking Dialog */}
      <Dialog open={cancelDialogOpen} onClose={() => setCancelDialogOpen(false)}>
        <DialogTitle>Cancel Booking</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to cancel this booking? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCancelDialogOpen(false)}>No, Keep It</Button>
          <Button onClick={handleCancelBooking} color="error" variant="contained">
            Yes, Cancel Booking
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MyBookings; 