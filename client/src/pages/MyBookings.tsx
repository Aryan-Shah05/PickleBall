import { useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
} from '@mui/material';
import { useBookingStore } from '@/store/booking';
import { Booking } from '@/types';

const MyBookings = () => {
  const { bookings, isLoading, error, fetchBookings } = useBookingStore();

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  if (isLoading) {
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
        My Bookings
      </Typography>

      <Grid container spacing={3}>
        {bookings.map((booking: Booking) => (
          <Grid item xs={12} sm={6} md={4} key={booking.id}>
            <Card>
              <CardContent>
                <Typography variant="h6">
                  Court: {booking.court?.name}
                </Typography>
                <Typography color="textSecondary">
                  Date: {new Date(booking.startTime).toLocaleDateString()}
                </Typography>
                <Typography color="textSecondary">
                  Time: {new Date(booking.startTime).toLocaleTimeString()} - {new Date(booking.endTime).toLocaleTimeString()}
                </Typography>
                <Typography color="textSecondary">
                  Status: {booking.status}
                </Typography>
                <Typography color="textSecondary">
                  Payment: {booking.paymentStatus}
                </Typography>
                <Button
                  variant="contained"
                  color="secondary"
                  fullWidth
                  sx={{ mt: 2 }}
                >
                  Cancel Booking
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default MyBookings; 