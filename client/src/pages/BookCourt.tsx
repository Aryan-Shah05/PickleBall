import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  CircularProgress,
  Stack
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { api } from '../api/api';
import { format, addHours } from 'date-fns';

interface Court {
  id: string;
  name: string;
  type: string;
  hourlyRate: number;
  peakHourRate: number;
  isIndoor: boolean;
}

const BookCourt: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const preselectedCourtId = searchParams.get('courtId');

  const [loading, setLoading] = useState(true);
  const [courts, setCourts] = useState<Court[]>([]);
  const [selectedCourt, setSelectedCourt] = useState<string>(preselectedCourtId || '');
  const [bookingDate, setBookingDate] = useState<Date | null>(new Date());
  const [startTime, setStartTime] = useState<Date | null>(new Date());
  const [duration, setDuration] = useState<number>(1);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    const fetchCourts = async () => {
      try {
        const response = await api.get('/courts/available');
        setCourts(response.data);
        if (!preselectedCourtId && response.data.length > 0) {
          setSelectedCourt(response.data[0].id);
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
    if (!selectedCourt || !bookingDate || !startTime) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      const endTime = addHours(startTime, duration);
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

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  const selectedCourtDetails = courts.find(court => court.id === selectedCourt);

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box p={3}>
        <Typography variant="h4" gutterBottom>
          Book a Court
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Card>
              <CardContent>
                <form onSubmit={handleSubmit}>
                  {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                  {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

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
                            {court.name} - {court.type}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>

                    <DatePicker
                      label="Booking Date"
                      value={bookingDate}
                      onChange={(newValue) => setBookingDate(newValue)}
                      disablePast
                      slotProps={{ textField: { fullWidth: true } }}
                    />

                    <TimePicker
                      label="Start Time"
                      value={startTime}
                      onChange={(newValue) => setStartTime(newValue)}
                      slotProps={{ textField: { fullWidth: true } }}
                    />

                    <FormControl fullWidth>
                      <InputLabel>Duration (hours)</InputLabel>
                      <Select
                        value={duration}
                        label="Duration (hours)"
                        onChange={(e) => setDuration(Number(e.target.value))}
                      >
                        {[1, 2, 3, 4].map((hours) => (
                          <MenuItem key={hours} value={hours}>
                            {hours} {hours === 1 ? 'hour' : 'hours'}
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
                        {startTime ? format(startTime, 'hh:mm a') : '-'} - 
                        {startTime ? format(addHours(startTime, duration), 'hh:mm a') : '-'}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography color="textSecondary">Duration</Typography>
                      <Typography>{duration} {duration === 1 ? 'hour' : 'hours'}</Typography>
                    </Box>
                    <Box>
                      <Typography color="textSecondary">Rate</Typography>
                      <Typography>${selectedCourtDetails.hourlyRate}/hour</Typography>
                    </Box>
                    <Box>
                      <Typography variant="h6">Total Cost</Typography>
                      <Typography variant="h5" color="primary">
                        ${selectedCourtDetails.hourlyRate * duration}
                      </Typography>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          )}
        </Grid>
      </Box>
    </LocalizationProvider>
  );
};

export default BookCourt; 