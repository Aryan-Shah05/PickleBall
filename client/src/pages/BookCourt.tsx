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
import { addDays, format, setHours, setMinutes } from 'date-fns';

interface Court {
  id: string;
  name: string;
  type: string;
  isIndoor: boolean;
  hourlyRate: number;
  peakHourRate: number;
}

// Time slots from 6 AM to 10 PM
const TIME_SLOTS = Array.from({ length: 32 }, (_, i) => {
  const hour = Math.floor(i / 2) + 6;
  const minutes = (i % 2) * 30;
  return {
    label: format(setMinutes(setHours(new Date(), hour), minutes), 'h:mm a'),
    value: `${hour.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`
  };
});

const BookCourt: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const preselectedCourtId = searchParams.get('courtId');

  const [loading, setLoading] = useState(true);
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
        setCourts(response.data.data);
        if (!preselectedCourtId && response.data.data.length > 0) {
          setSelectedCourt(response.data.data[0].id);
        }
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load courts');
      } finally {
        setLoading(false);
      }
    };

    fetchCourts();
  }, [preselectedCourtId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCourt || !bookingDate || !selectedTimeSlot) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      const [hours, minutes] = selectedTimeSlot.split(':');
      const startTime = setMinutes(setHours(bookingDate!, parseInt(hours)), parseInt(minutes));
      const endTime = setMinutes(setHours(bookingDate!, parseInt(hours) + 1), parseInt(minutes));

      await api.post('/bookings', {
        courtId: selectedCourt,
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString(),
      });

      setSuccess('Booking created successfully!');
      setTimeout(() => {
        navigate('/bookings');
      }, 2000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create booking');
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

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <form onSubmit={handleSubmit}>
                <Stack spacing={3}>
                  <FormControl fullWidth>
                    <InputLabel>Select Court</InputLabel>
                    <Select
                      value={selectedCourt}
                      label="Select Court"
                      onChange={(e) => setSelectedCourt(e.target.value)}
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
                    onChange={(newValue) => setBookingDate(newValue)}
                    disablePast
                    minDate={new Date()}
                    maxDate={addDays(new Date(), 30)}
                    slotProps={{ textField: { fullWidth: true, required: true } }}
                  />

                  <FormControl fullWidth>
                    <InputLabel>Select Time Slot</InputLabel>
                    <Select
                      value={selectedTimeSlot}
                      label="Select Time Slot"
                      onChange={(e) => setSelectedTimeSlot(e.target.value)}
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
                  >
                    Book Court
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