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
  Typography,
  keyframes,
  Fade,
  Slide,
} from '@mui/material';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { api } from '../api/api';
import { addDays, format, isPast, isAfter, isSameDay } from 'date-fns';
import { BookingCalendar } from '../components/booking/BookingCalendar';
import { pickleballColors } from '@/styles/theme';
import { SportsTennis } from '@mui/icons-material';

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
  time: string;
  price: number;
}

interface CalendarTimeSlot {
  time: string;
  isAvailable: boolean;
  isPeakHour: boolean;
  price: number;
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
      isPeakHour,
      time: format(startTime, 'h:mm a'),
      price: 0
    });
  }
  return slots;
};

const MAX_BOOKINGS_PER_DAY = 2; // Maximum bookings allowed per user per day

// Court-inspired decorative pattern
const courtPattern = `
  linear-gradient(#2C528220 1px, transparent 1px),
  linear-gradient(90deg, #2C528220 1px, transparent 1px)
`;

// Keyframe animations
const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const bounce = keyframes`
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-10px) rotate(180deg); }
`;

const slideIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const LoadingSpinner: React.FC = () => (
  <Box 
    display="flex" 
    flexDirection="column" 
    alignItems="center" 
    justifyContent="center" 
    minHeight="80vh"
    gap={2}
  >
    <Box
      sx={{
        position: 'relative',
        width: 60,
        height: 60,
        '&::before': {
          content: '""',
          position: 'absolute',
          width: '100%',
          height: '100%',
          borderRadius: '50%',
          border: '3px solid',
          borderColor: '#2C528220',
          borderTopColor: '#2C5282',
          animation: `${spin} 1s linear infinite`,
        },
      }}
    >
      <SportsTennis 
        sx={{ 
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          color: '#F6E05E',
          fontSize: 30,
          animation: `${bounce} 2s ease-in-out infinite`,
        }} 
      />
    </Box>
    <Typography 
      variant="body1" 
      sx={{ 
        color: '#2C5282',
        animation: `${slideIn} 0.5s ease-out`,
      }}
    >
      Loading courts...
    </Typography>
  </Box>
);

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
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>(() => {
    // Initialize with current date's time slots
    return generateTimeSlots(new Date());
  });

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
    if (!bookingDate) {
      setBookingDate(new Date()); // Set to current date if null
      return;
    }
    
    const slots = generateTimeSlots(bookingDate);
    
    // Mark booked slots as unavailable and set prices
    const updatedSlots = slots.map(slot => {
      const isBooked = existingBookings.some(booking => {
        const bookingStart = new Date(booking.startTime);
        return (
          isSameDay(slot.startTime, bookingStart) &&
          slot.startTime.getTime() === bookingStart.getTime()
        );
      });

      const selectedCourtData = courts.find(c => c.id === selectedCourt);
      const price = slot.isPeakHour 
        ? selectedCourtData?.peakHourRate || 0
        : selectedCourtData?.hourlyRate || 0;

      return {
        ...slot,
        isAvailable: !isBooked,
        price
      };
    });

    console.log('Updated time slots:', updatedSlots); // Debug log
    setTimeSlots(updatedSlots);
  }, [bookingDate, existingBookings, courts, selectedCourt]);

  const getUserBookingsForDate = (date: Date): number => {
    return userBookings.filter(booking => 
      isSameDay(new Date(booking.startTime), date)
    ).length;
  };

  const handleTimeSlotSelect = (time: string) => {
    const slot = timeSlots.find(s => s.time === time);
    if (!slot) return;
    
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

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <Box p={3}>
        <Fade in timeout={500}>
          <Alert severity="error">{error}</Alert>
        </Fade>
      </Box>
    );
  }

  if (selectedCourt && bookingDate && (!timeSlots || timeSlots.length === 0)) {
    return (
      <Box p={3}>
        <Fade in timeout={500}>
          <Alert severity="info">No time slots available for the selected date. Please try another date.</Alert>
        </Fade>
      </Box>
    );
  }

  return (
    <Box 
      p={3}
      sx={{
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: courtPattern,
          backgroundSize: '40px 40px',
          opacity: 0.1,
          pointerEvents: 'none',
        },
      }}
    >
      <Slide direction="down" in mountOnEnter unmountOnExit timeout={500}>
        <Typography 
          variant="h4" 
          gutterBottom 
          sx={{ 
            color: '#2C5282',
            fontWeight: 600,
            mb: 4,
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            '&::after': {
              content: '""',
              flex: 1,
              height: '2px',
              background: `linear-gradient(90deg, #2C5282 0%, #48BB78 100%)`,
              borderRadius: '2px',
            },
          }}
        >
          Book a Court
        </Typography>
      </Slide>

      <Fade in timeout={800}>
        <Card sx={{ 
          p: 3,
          mb: 3,
          boxShadow: '0 4px 12px rgba(44, 82, 130, 0.1)',
          borderRadius: '12px',
          background: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(8px)',
          position: 'relative',
          overflow: 'hidden',
          animation: `${slideIn} 0.5s ease-out`,
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '3px',
            background: `linear-gradient(90deg, #2C5282, #F6E05E, #48BB78)`,
          },
          '&:hover': {
            boxShadow: '0 8px 24px rgba(44, 82, 130, 0.15)',
            transform: 'translateY(-2px)',
            transition: 'all 0.3s ease',
          }
        }}>
          <Stack spacing={3}>
            <Slide direction="right" in mountOnEnter unmountOnExit timeout={500}>
              <FormControl fullWidth>
                <InputLabel id="court-select-label" sx={{ color: '#2C5282' }}>Select Court</InputLabel>
                <Select
                  labelId="court-select-label"
                  value={selectedCourt}
                  label="Select Court"
                  onChange={(e) => setSelectedCourt(e.target.value)}
                  sx={{
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#2C528240',
                      borderWidth: '2px',
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#48BB78',
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#48BB78',
                    },
                    color: '#2C5282',
                    '& .MuiSvgIcon-root': {
                      color: '#2C5282',
                    },
                  }}
                >
                  {courts.map((court) => (
                    <MenuItem 
                      key={court.id} 
                      value={court.id}
                      sx={{
                        color: '#2C5282',
                        '&:hover': {
                          color: '#48BB78',
                          backgroundColor: `#48BB7810`,
                        },
                        '&.Mui-selected': {
                          backgroundColor: `#48BB7820`,
                          color: '#48BB78',
                          '&:hover': {
                            backgroundColor: `#48BB7830`,
                          },
                        },
                      }}
                    >
                      {court.name} - ₹{court.hourlyRate}/hour
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Slide>

            <Slide direction="left" in mountOnEnter unmountOnExit timeout={700}>
              <Box sx={{ 
                position: 'relative',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: -16,
                  left: -16,
                  right: -16,
                  height: '1px',
                  background: `linear-gradient(90deg, transparent, #2C528220, transparent)`,
                },
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  bottom: -16,
                  left: -16,
                  right: -16,
                  height: '1px',
                  background: `linear-gradient(90deg, transparent, #2C528220, transparent)`,
                },
              }}>
                <BookingCalendar
                  selectedDate={bookingDate || new Date()}
                  onDateChange={(date: Date) => setBookingDate(date)}
                  timeSlots={timeSlots.map(slot => ({
                    time: slot.time,
                    isAvailable: slot.isAvailable,
                    isPeakHour: slot.isPeakHour,
                    price: slot.price
                  } as CalendarTimeSlot))}
                  selectedTimeSlot={selectedTimeSlot}
                  onTimeSlotSelect={handleTimeSlotSelect}
                />
              </Box>
            </Slide>

            <Slide direction="up" in mountOnEnter unmountOnExit timeout={900}>
              <Button
                variant="contained"
                onClick={handleSubmit}
                disabled={submitting}
                sx={{
                  bgcolor: '#2C5282',
                  color: 'white',
                  py: 1.5,
                  borderRadius: '8px',
                  position: 'relative',
                  overflow: 'hidden',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: `linear-gradient(45deg, #48BB78, #2C5282)`,
                    opacity: 0,
                    transition: 'opacity 0.3s ease',
                  },
                  '&:hover': {
                    bgcolor: '#2C5282',
                    '&::before': {
                      opacity: 1,
                    },
                  },
                  '&:disabled': {
                    bgcolor: '#2C528280',
                  },
                  '& .MuiButton-label': {
                    position: 'relative',
                    zIndex: 1,
                  },
                }}
              >
                {submitting ? (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <SportsTennis 
                      sx={{ 
                        animation: `${spin} 1s linear infinite`,
                        fontSize: 20,
                      }} 
                    />
                    Booking...
                  </Box>
                ) : (
                  'Book Court'
                )}
              </Button>
            </Slide>

            {error && (
              <Fade in timeout={500}>
                <Alert 
                  severity="error"
                  sx={{
                    borderRadius: '8px',
                    animation: `${slideIn} 0.3s ease-out`,
                    '& .MuiAlert-icon': {
                      color: '#F6E05E',
                    },
                  }}
                >
                  {error}
                </Alert>
              </Fade>
            )}

            {success && (
              <Fade in timeout={500}>
                <Alert 
                  severity="success"
                  sx={{
                    borderRadius: '8px',
                    animation: `${slideIn} 0.3s ease-out`,
                    '& .MuiAlert-icon': {
                      color: '#48BB78',
                    },
                  }}
                >
                  {success}
                </Alert>
              </Fade>
            )}
          </Stack>
        </Card>
      </Fade>
    </Box>
  );
};

export default BookCourt; 