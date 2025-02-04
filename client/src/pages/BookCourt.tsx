import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Stack,
  Alert,
  Grid,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tooltip,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { api } from '../api/api';
import { addDays, format, setHours, setMinutes, isPast, isAfter, isSameDay } from 'date-fns';

interface Court {
  id: string;
  name: string;
  type: string;
  isIndoor: boolean;
  hourlyRate: number;
  peakHourRate: number;
}

interface BookingSlot {
  startTime: string;
  endTime: string;
  courtId: string;
}

// Time slots from 6 AM to 10 PM (1-hour intervals)
const TIME_SLOTS = Array.from({ length: 17 }, (_, i) => {
  const hour = i + 6; // Start from 6 AM
  const date = new Date();
  date.setHours(hour, 0, 0, 0);
  return {
    label: format(date, 'h:mm a'),
    value: `${hour.toString().padStart(2, '0')}:00`
  };
});

const MAX_BOOKINGS_PER_DAY = 2; // Maximum bookings allowed per user per day

const BookCourt: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const preselectedCourtId = searchParams.get('courtId');

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [courts, setCourts] = useState<Court[]>([]);
  const [selectedCourt, setSelectedCourt] = useState<string>(preselectedCourtId || '');
  const [bookingDate, setBookingDate] = useState<Date | null>(new Date());
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [existingBookings, setExistingBookings] = useState<BookingSlot[]>([]);
  const [userBookings, setUserBookings] = useState<BookingSlot[]>([]);

  // Fetch courts and existing bookings
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true);
        
        // Fetch courts
        const courtsResponse = await api.get('/courts');
        const courtsData = courtsResponse.data.data || courtsResponse.data || [];
        
        if (courtsData.length === 0) {
          setError('No courts are currently available for booking');
          return;
        }

        setCourts(courtsData);
        
        // Set selected court
        if (preselectedCourtId) {
          const exists = courtsData.some((court: Court) => court.id === preselectedCourtId);
          if (exists) {
            setSelectedCourt(preselectedCourtId);
          } else {
            setSelectedCourt(courtsData[0].id);
          }
        } else if (courtsData.length > 0) {
          setSelectedCourt(courtsData[0].id);
        }

        // Fetch user's existing bookings
        const userBookingsResponse = await api.get('/bookings/my-bookings');
        setUserBookings(userBookingsResponse.data.data || []);

      } catch (err: any) {
        console.error('Initial data fetch error:', err);
        setError('Failed to load initial data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, [preselectedCourtId]);

  // Fetch existing bookings when date or court changes
  useEffect(() => {
    const fetchExistingBookings = async () => {
      if (!bookingDate || !selectedCourt) return;

      try {
        const response = await api.get('/bookings/availability', {
          params: {
            courtId: selectedCourt,
            date: format(bookingDate, 'yyyy-MM-dd')
          }
        });
        setExistingBookings(response.data.data || []);
      } catch (err) {
        console.error('Error fetching existing bookings:', err);
      }
    };

    fetchExistingBookings();
  }, [bookingDate, selectedCourt]);

  const isTimeSlotBooked = (timeSlot: string): boolean => {
    if (!bookingDate || !selectedCourt) return false;

    const [hours] = timeSlot.split(':');
    const startTime = new Date(bookingDate);
    startTime.setHours(parseInt(hours), 0, 0, 0);
    
    return existingBookings.some(booking => 
      new Date(booking.startTime).getTime() === startTime.getTime() &&
      booking.courtId === selectedCourt
    );
  };

  const getUserBookingsForDate = (date: Date): number => {
    return userBookings.filter(booking => 
      isSameDay(new Date(booking.startTime), date)
    ).length;
  };

  const validateBookingTime = (date: Date, timeSlot: string): boolean => {
    const [hours] = timeSlot.split(':');
    const bookingTime = new Date(date);
    bookingTime.setHours(parseInt(hours), 0, 0, 0);
    
    // Check if booking time is in the past
    if (isPast(bookingTime)) {
      setError('Cannot book a court for a past time');
      return false;
    }

    // Check if booking is more than 30 days in advance
    if (isAfter(bookingTime, addDays(new Date(), 30))) {
      setError('Cannot book more than 30 days in advance');
      return false;
    }

    // Check if time slot is already booked
    if (isTimeSlotBooked(timeSlot)) {
      setError('This time slot is already booked. Please select a different time.');
      return false;
    }

    // Check if user has reached maximum bookings for the day
    const bookingsForDay = getUserBookingsForDate(date);
    if (bookingsForDay >= MAX_BOOKINGS_PER_DAY) {
      setError(`You can only make ${MAX_BOOKINGS_PER_DAY} bookings per day. Please select a different date.`);
      return false;
    }

    return true;
  };

  const handleTimeSlotSelect = (value: string) => {
    console.log('Selected time slot:', value);
    setSelectedTimeSlot(value);
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    // Validate required fields
    if (!selectedCourt) {
      setError('Please select a court');
      return;
    }
    if (!bookingDate) {
      setError('Please select a booking date');
      return;
    }
    if (!selectedTimeSlot) {
      setError('Please select a time slot');
      return;
    }

    // Validate booking time
    if (!validateBookingTime(bookingDate, selectedTimeSlot)) {
      return;
    }

    setSubmitting(true);

    try {
      const [hours] = selectedTimeSlot.split(':');
      const startTime = new Date(bookingDate);
      startTime.setHours(parseInt(hours), 0, 0, 0);
      
      const endTime = new Date(startTime);
      endTime.setHours(startTime.getHours() + 1);

      console.log('Creating booking with:', {
        courtId: selectedCourt,
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString()
      });

      const response = await api.post('/bookings', {
        courtId: selectedCourt,
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString()
      });

      console.log('Booking response:', response);

      if (response.data.success || response.status === 201) {
        setSuccess('Booking created successfully! Redirecting to your bookings...');
        setTimeout(() => {
          navigate('/bookings');
        }, 2000);
      } else {
        throw new Error(response.data.message || 'Failed to create booking');
      }
    } catch (err: any) {
      console.error('Booking error:', err.response || err);
      const errorMessage = err.response?.data?.message || err.message || 'Failed to create booking';
      
      if (err.response?.status === 409) {
        setError('This time slot is already booked. Please select a different time.');
      } else if (err.response?.status === 403) {
        setError('You are not authorized to make this booking. Please log in again.');
      } else if (err.response?.status === 400) {
        setError(errorMessage || 'Invalid booking request. Please check your selections.');
      } else if (err.response?.status === 422) {
        setError('Invalid booking time. Please select a different time slot.');
      } else {
        setError(`Booking failed: ${errorMessage}`);
      }
    } finally {
      setSubmitting(false);
    }
  };

  const selectedCourtDetails = courts.find(court => court.id === selectedCourt);

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
        Book a Court
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}
      {success && (
        <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess(null)}>
          {success}
        </Alert>
      )}

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <form onSubmit={handleSubmit}>
                <Stack spacing={3}>
                  <FormControl fullWidth error={!selectedCourt}>
                    <InputLabel>Select Court</InputLabel>
                    <Select
                      value={selectedCourt}
                      label="Select Court"
                      onChange={(e) => {
                        setSelectedCourt(e.target.value);
                        setError(null);
                      }}
                      required
                    >
                      {courts.map((court) => (
                        <MenuItem key={court.id} value={court.id}>
                          {court.name} - {court.type} ({court.isIndoor ? 'Indoor' : 'Outdoor'})
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <DatePicker
                    label="Booking Date"
                    value={bookingDate}
                    onChange={(newValue) => {
                      setBookingDate(newValue);
                      setError(null);
                    }}
                    disablePast
                    minDate={new Date()}
                    maxDate={addDays(new Date(), 30)}
                    slotProps={{ 
                      textField: { 
                        fullWidth: true, 
                        required: true,
                        error: !bookingDate 
                      } 
                    }}
                  />

                  <FormControl fullWidth error={!selectedTimeSlot}>
                    <InputLabel>Select Time Slot</InputLabel>
                    <Select
                      value={selectedTimeSlot}
                      label="Select Time Slot"
                      onChange={(e) => handleTimeSlotSelect(e.target.value)}
                      required
                    >
                      {TIME_SLOTS.map((slot) => {
                        const isBooked = isTimeSlotBooked(slot.value);
                        return (
                          <Tooltip title={isBooked ? "This slot is already booked" : ""} key={slot.value}>
                            <MenuItem 
                              value={slot.value}
                              disabled={isBooked}
                              sx={isBooked ? { color: 'text.disabled' } : {}}
                            >
                              {slot.label} {isBooked ? '(Booked)' : ''}
                            </MenuItem>
                          </Tooltip>
                        );
                      })}
                    </Select>
                  </FormControl>

                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    size="large"
                    fullWidth
                    disabled={submitting || !selectedCourt || !bookingDate || !selectedTimeSlot}
                    onClick={handleSubmit}
                  >
                    {submitting ? <CircularProgress size={24} /> : 'Book Court'}
                  </Button>
                </Stack>
              </form>
            </CardContent>
          </Card>
        </Grid>

        {selectedCourtDetails && (
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Booking Summary
                </Typography>
                <Stack spacing={2}>
                  <Box>
                    <Typography color="textSecondary">Court</Typography>
                    <Typography variant="h6">{selectedCourtDetails.name}</Typography>
                  </Box>
                  <Box>
                    <Typography color="textSecondary">Type</Typography>
                    <Typography>
                      {selectedCourtDetails.type} • {selectedCourtDetails.isIndoor ? 'Indoor' : 'Outdoor'}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography color="textSecondary">Date</Typography>
                    <Typography>
                      {bookingDate ? format(bookingDate, 'MMMM dd, yyyy') : '-'}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography color="textSecondary">Time</Typography>
                    <Typography>
                      {selectedTimeSlot ? format(setMinutes(setHours(new Date(), parseInt(selectedTimeSlot.split(':')[0])), 0), 'h:mm a') : '-'}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography color="textSecondary">Rate</Typography>
                    <Typography variant="h6" color="primary">
                      ${selectedCourtDetails.hourlyRate}/hour
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                      Peak hours: ${selectedCourtDetails.peakHourRate}/hour
                    </Typography>
                  </Box>
                  <Box>
                    <Typography color="textSecondary">Bookings Today</Typography>
                    <Typography>
                      {bookingDate ? `${getUserBookingsForDate(bookingDate)} of ${MAX_BOOKINGS_PER_DAY} allowed` : '-'}
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default BookCourt; 