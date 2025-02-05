import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Stack,
  Alert,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Card,
} from '@mui/material';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { api } from '../api/api';
import { addDays, format, isPast, isAfter, isSameDay } from 'date-fns';
import { BookingCalendar } from '../components/booking/BookingCalendar';
import { pickleballColors } from '@/styles/theme';

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

interface TimeSlot {
  startTime: Date;
  endTime: Date;
  label: string;
  isAvailable: boolean;
  isPeakHour: boolean;
}

// Time slots from 6 AM to 10 PM (1-hour intervals)
const generateTimeSlots = (selectedDate: Date): TimeSlot[] => {
  const slots: TimeSlot[] = [];
  const startHour = 6; // 6 AM
  const endHour = 22; // 10 PM
  const peakHourStart = 17; // 5 PM

  for (let hour = startHour; hour < endHour; hour++) {
    const startTime = new Date(selectedDate);
    startTime.setHours(hour, 0, 0, 0);
    
    const endTime = new Date(selectedDate);
    endTime.setHours(hour + 1, 0, 0, 0);

    // Don't show past time slots for today
    if (isSameDay(selectedDate, new Date()) && isPast(startTime)) {
      continue;
    }

    const isPeakHour = hour >= peakHourStart;

    slots.push({
      startTime,
      endTime,
      label: `${format(startTime, 'h:mm a')} - ${format(endTime, 'h:mm a')}`,
      isAvailable: true,
      isPeakHour
    });
  }
  return slots;
};

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
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);

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
  const fetchExistingBookings = async () => {
    if (!bookingDate || !selectedCourt) return;

    try {
      // Create start and end time for the entire day
      const startTime = new Date(bookingDate);
      startTime.setHours(0, 0, 0, 0);
      
      const endTime = new Date(bookingDate);
      endTime.setHours(23, 59, 59, 999);

      const response = await api.get('/bookings/availability', {
        params: {
          courtId: selectedCourt,
          startTime: startTime.toISOString(),
          endTime: endTime.toISOString()
        }
      });
      setExistingBookings(response.data.data || []);
    } catch (err) {
      console.error('Error fetching existing bookings:', err);
    }
  };

  useEffect(() => {
    fetchExistingBookings();
  }, [bookingDate, selectedCourt]);

  // Update time slots when date or existing bookings change
  useEffect(() => {
    if (!bookingDate) return;
    
    const slots = generateTimeSlots(bookingDate);
    
    // Mark booked slots as unavailable
    const updatedSlots = slots.map(slot => ({
      ...slot,
      isAvailable: !existingBookings.some(booking => {
        const bookingStart = new Date(booking.startTime);
        return (
          isSameDay(slot.startTime, bookingStart) &&
          slot.startTime.getTime() === bookingStart.getTime()
        );
      })
    }));

    setTimeSlots(updatedSlots);
  }, [bookingDate, existingBookings]);

  const getUserBookingsForDate = (date: Date): number => {
    return userBookings.filter(booking => 
      isSameDay(new Date(booking.startTime), date)
    ).length;
  };

  const handleTimeSlotSelect = (slot: TimeSlot) => {
    if (!slot.isAvailable) {
      setError('This time slot is already booked');
      return;
    }
    setSelectedTimeSlot(format(slot.startTime, 'HH:mm'));
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

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
    const selectedSlot = timeSlots.find(
      slot => format(slot.startTime, 'HH:mm') === selectedTimeSlot
    );

    if (!selectedSlot) {
      setError('Invalid time slot selected');
      return;
    }

    if (!selectedSlot.isAvailable) {
      setError('This time slot is no longer available');
      return;
    }

    // Check if booking is in the past
    if (isPast(selectedSlot.startTime)) {
      setError('Cannot book a court for a past time');
      return;
    }

    // Check if booking is more than 30 days in advance
    if (isAfter(selectedSlot.startTime, addDays(new Date(), 30))) {
      setError('Cannot book more than 30 days in advance');
      return;
    }

    // Check if user has reached maximum bookings for the day
    const bookingsForDay = getUserBookingsForDate(bookingDate);
    if (bookingsForDay >= MAX_BOOKINGS_PER_DAY) {
      setError(`You can only make ${MAX_BOOKINGS_PER_DAY} bookings per day. Please select a different date.`);
      return;
    }

    setSubmitting(true);

    try {
      const bookingData = {
        courtId: selectedCourt,
        startTime: selectedSlot.startTime.toISOString(),
        endTime: selectedSlot.endTime.toISOString()
      };

      console.log('Creating booking with:', bookingData);

      const response = await api.post('/bookings', bookingData);

      if (response.data.success) {
        setSuccess('Booking created successfully! Redirecting to your bookings...');
        await fetchExistingBookings();
        setTimeout(() => {
          navigate('/bookings');
        }, 2000);
      }
    } catch (err: any) {
      console.error('Booking error:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Failed to create booking';
      setError(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const formattedTimeSlots = timeSlots.map(slot => ({
    time: format(slot.startTime, 'h:mm a'),
    isAvailable: slot.isAvailable,
    isPeakHour: slot.isPeakHour,
    price: slot.isPeakHour 
      ? courts.find(c => c.id === selectedCourt)?.peakHourRate || 0
      : courts.find(c => c.id === selectedCourt)?.hourlyRate || 0
  }));

  const courtAvailability = courts.reduce((acc, court) => ({
    ...acc,
    [court.id]: !existingBookings.some(booking => 
      booking.courtId === court.id && 
      isSameDay(new Date(booking.startTime), bookingDate || new Date())
    )
  }), {});

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 1200, mx: 'auto', p: 2 }}>
      <Stack spacing={3}>
        {error && <Alert severity="error">{error}</Alert>}
        {success && <Alert severity="success">{success}</Alert>}

        <Card sx={{ 
          p: 3, 
          bgcolor: 'white',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          borderRadius: 3,
        }}>
          <FormControl fullWidth>
            <InputLabel>Select Court</InputLabel>
            <Select
              value={selectedCourt}
              label="Select Court"
              onChange={(e) => setSelectedCourt(e.target.value)}
              disabled={submitting}
              required
              sx={{
                bgcolor: 'white',
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: pickleballColors.court.main + '40',
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: pickleballColors.court.main,
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: pickleballColors.court.main,
                },
              }}
            >
              {courts.map((court) => (
                <MenuItem key={court.id} value={court.id}>
                  {court.name} - ₹{court.hourlyRate}/hour (Peak: ₹{court.peakHourRate}/hour after 5 PM)
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Card>

        <Card sx={{ 
          p: 3, 
          bgcolor: 'white',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          borderRadius: 3,
        }}>
          <BookingCalendar
            selectedDate={bookingDate || new Date()}
            onDateChange={setBookingDate}
            timeSlots={formattedTimeSlots}
            selectedTimeSlot={selectedTimeSlot}
            onTimeSlotSelect={time => {
              const slot = timeSlots.find(s => format(s.startTime, 'h:mm a') === time);
              if (slot) {
                handleTimeSlotSelect(slot);
              }
            }}
            courtAvailability={{}}
          />
        </Card>

        <Button
          type="submit"
          variant="contained"
          color="primary"
          size="large"
          disabled={submitting || !selectedTimeSlot}
          sx={{ 
            mt: 2,
            bgcolor: pickleballColors.court.main,
            '&:hover': {
              bgcolor: pickleballColors.court.dark,
            },
            '&.Mui-disabled': {
              bgcolor: pickleballColors.court.main + '80',
            },
          }}
        >
          {submitting ? <CircularProgress size={24} /> : 'Book Court'}
        </Button>
      </Stack>
    </Box>
  );
};

export default BookCourt; 