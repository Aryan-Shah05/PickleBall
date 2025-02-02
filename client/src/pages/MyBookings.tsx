import React from 'react';
import { Typography, Card, CardContent } from '@mui/material';
import useBookingStore from '@/store/booking';

const MyBookings: React.FC = () => {
  const { bookings, isLoading, error } = useBookingStore();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <Typography variant="h4" gutterBottom>
        My Bookings
      </Typography>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {bookings.map((booking) => (
          <Card key={booking.id}>
            <CardContent>
              <Typography variant="h6">
                Court {booking.courtId}
              </Typography>
              <Typography color="textSecondary">
                Start: {new Date(booking.startTime).toLocaleString()}
              </Typography>
              <Typography color="textSecondary">
                End: {new Date(booking.endTime).toLocaleString()}
              </Typography>
              <Typography color="textSecondary">
                Status: {booking.status}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default MyBookings; 