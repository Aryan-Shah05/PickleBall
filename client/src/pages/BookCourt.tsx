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
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { api } from '../api/api';
import { addDays, format, setHours, setMinutes, isPast, isAfter } from 'date-fns';

interface Court {
  id: string;
  name: string;
  type: string;
  isIndoor: boolean;
  hourlyRate: number;
  peakHourRate: number;
}

// Time slots from 6 AM to 10 PM (1-hour intervals)
const TIME_SLOTS = Array.from({ length: 16 }, (_, i) => {
  const hour = i + 6; // Start from 6 AM
  return {
    label: format(setHours(new Date(), hour), 'h:mm a'),
    value: `${hour.toString().padStart(2, '0')}:00`
  };
});

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

  useEffect(() => {
    const fetchCourts = async () => {
      try {
        const response = await api.get('/courts/available');
        console.log('Courts response:', response.data); // Debug log
        if (!response.data.data || response.data.data.length === 0) {
          setError('No courts are currently available for booking');
          return;
        }
        const courtsData = response.data.data;
        setCourts(courtsData);
        
        // Set selected court if preselected or default to first court
        if (preselectedCourtId) {
          const exists = courtsData.some((court: Court) => court.id === preselectedCourtId);
          if (exists) {
            setSelectedCourt(preselectedCourtId);
          } else {
            setSelectedCourt(courtsData[0].id);
            setError('Selected court is not available, defaulting to first available court');
          }
        } else if (courtsData.length > 0) {
          setSelectedCourt(courtsData[0].id);
        }
      } catch (err: any) {
        console.error('Courts fetch error:', err); // Debug log
        setError(err.response?.data?.message || 'Failed to load courts. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchCourts();
  }, [preselectedCourtId]);

  // Add debug log for selected court changes
  useEffect(() => {
    console.log('Selected court:', selectedCourt);
    console.log('Available courts:', courts);
  }, [selectedCourt, courts]);

  const validateBookingTime = (date: Date, timeSlot: string): boolean => {
    const [hours, minutes] = timeSlot.split(':');
    const bookingTime = setMinutes(setHours(date, parseInt(hours)), parseInt(minutes));
    
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

    return true;
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
      const [hours, minutes] = selectedTimeSlot.split(':');
      const startTime = setMinutes(setHours(bookingDate, parseInt(hours)), parseInt(minutes));
      const endTime = setMinutes(setHours(bookingDate, parseInt(hours) + 1), parseInt(minutes));

      const response = await api.post('/bookings', {
        courtId: selectedCourt,
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString(),
      });

      if (response.data.success) {
        setSuccess('Booking created successfully! Redirecting to your bookings...');
        setTimeout(() => {
          navigate('/bookings');
        }, 2000);
      } else {
        setError('Failed to create booking. Please try again.');
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to create booking. Please try again later.';
      if (err.response?.status === 409) {
        setError('This time slot is already booked. Please select a different time.');
      } else if (err.response?.status === 403) {
        setError('You are not authorized to make this booking.');
      } else {
        setError(errorMessage);
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
                      onChange={(e) => {
                        setSelectedTimeSlot(e.target.value);
                        setError(null);
                      }}
                      required
                    >
                      {TIME_SLOTS.map((slot) => (
                        <MenuItem key={slot.value} value={slot.value}>
                          {slot.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    fullWidth
                    disabled={submitting || !selectedCourt || !bookingDate || !selectedTimeSlot}
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
                      {selectedTimeSlot ? format(setMinutes(setHours(new Date(), parseInt(selectedTimeSlot.split(':')[0])), parseInt(selectedTimeSlot.split(':')[1])), 'h:mm a') : '-'}
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