import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Stack,
  TextField,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { format, addDays, isAfter, isBefore, startOfDay } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import { courtService, Court } from '../api/court.service';
import { bookingService } from '../api/booking.service';
import { useNavigate } from 'react-router-dom';
import {
  MotionBox,
  fadeUpVariant,
  staggerContainer,
  CardContainer,
  TimeSlotContainer,
  LoadingSpinner
} from '../components/animations';

// Create a motion-wrapped Card component
const MotionCard = motion(Card);

export const BookCourt = () => {
  const navigate = useNavigate();
  const [courts, setCourts] = useState<Court[]>([]);
  const [selectedCourt, setSelectedCourt] = useState<Court | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [selectedTime, setSelectedTime] = useState<Date | null>(null);
  const [duration, setDuration] = useState<number>(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  useEffect(() => {
    loadCourts();
  }, []);

  useEffect(() => {
    if (selectedCourt && selectedDate) {
      checkCourtAvailability();
    }
  }, [selectedCourt, selectedDate]);

  const loadCourts = async () => {
    try {
      setLoading(true);
      const data = await courtService.getCourts();
      setCourts(data);
    } catch (err) {
      setError('Failed to load courts');
    } finally {
      setLoading(false);
    }
  };

  const checkCourtAvailability = async () => {
    if (!selectedCourt || !selectedDate) return;

    try {
      const formattedDate = format(selectedDate, 'yyyy-MM-dd');
      const availability = await courtService.getCourtAvailability(
        selectedCourt.id,
        formattedDate
      );
      // Update available time slots based on the response
      // This will depend on your API response structure
    } catch (err) {
      setError('Failed to check court availability');
    }
  };

  const handleDateChange = (date: Date | null) => {
    setSelectedDate(date);
    setSelectedTime(null); // Reset time when date changes
  };

  const handleTimeChange = (time: Date | null) => {
    setSelectedTime(time);
  };

  const handleDurationChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(event.target.value);
    if (!isNaN(value) && value > 0 && value <= 4) {
      setDuration(value);
    }
  };

  const handleCourtSelect = (court: Court) => {
    setSelectedCourt(court);
  };

  const isTimeValid = (time: Date | null): boolean => {
    if (!time) return false;
    const minTime = new Date();
    minTime.setHours(8, 0, 0, 0);
    const maxTime = new Date();
    maxTime.setHours(22, 0, 0, 0);
    return isAfter(time, minTime) && isBefore(time, maxTime);
  };

  const isDateValid = (date: Date | null): boolean => {
    if (!date) return false;
    const today = startOfDay(new Date());
    const maxDate = addDays(today, 30);
    return !isBefore(date, today) && !isAfter(date, maxDate);
  };

  const handleBooking = async () => {
    if (!selectedCourt || !selectedDate || !selectedTime) return;

    try {
      setLoading(true);
      await bookingService.createBooking({
        courtId: selectedCourt.id,
        date: format(selectedDate, 'yyyy-MM-dd'),
        time: format(selectedTime, 'HH:mm'),
        duration: duration
      });
      setSuccess('Booking created successfully!');
      setShowConfirmDialog(false);
      setTimeout(() => {
        navigate('/my-bookings');
      }, 2000);
    } catch (err) {
      setError('Failed to create booking');
    } finally {
      setLoading(false);
    }
  };

  const calculateTotalPrice = () => {
    if (!selectedCourt) return 0;
    return selectedCourt.pricePerHour * duration;
  };

  if (loading && courts.length === 0) {
    return <LoadingSpinner />;
  }

  return (
    <MotionBox
      variants={staggerContainer}
      initial="initial"
      animate="animate"
      p={3}
    >
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
          </motion.div>
        )}
        {success && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>
          </motion.div>
        )}
      </AnimatePresence>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <motion.div variants={fadeUpVariant}>
            <Typography variant="h5" gutterBottom>Select a Court</Typography>
          </motion.div>
          <Grid container spacing={2}>
            {courts.map((court, index) => (
              <Grid item xs={12} sm={6} key={court.id}>
                <motion.div
                  variants={fadeUpVariant}
                  custom={index}
                  transition={{ delay: index * 0.1 }}
                >
                  <MotionCard
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleCourtSelect(court)}
                    sx={{
                      cursor: 'pointer',
                      border: selectedCourt?.id === court.id ? 2 : 0,
                      borderColor: 'primary.main',
                    }}
                  >
                    <CardContent>
                      <Typography variant="h6">{court.name}</Typography>
                      <Typography color="text.secondary">{court.description}</Typography>
                      <Typography color="primary" variant="h6" sx={{ mt: 1 }}>
                        ${court.pricePerHour}/hour
                      </Typography>
                    </CardContent>
                  </MotionCard>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Grid>

        <Grid item xs={12} md={4}>
          <motion.div
            variants={fadeUpVariant}
            transition={{ delay: 0.2 }}
          >
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>Booking Details</Typography>
                <Stack spacing={3}>
                  <DatePicker
                    label="Select Date"
                    value={selectedDate}
                    onChange={handleDateChange}
                    minDate={new Date()}
                    maxDate={addDays(new Date(), 30)}
                  />

                  <TimeSlotContainer>
                    <TimePicker
                      label="Select Time"
                      value={selectedTime}
                      onChange={handleTimeChange}
                      disabled={!selectedDate || !isDateValid(selectedDate)}
                    />
                  </TimeSlotContainer>

                  <TextField
                    label="Duration (hours)"
                    type="number"
                    value={duration}
                    onChange={handleDurationChange}
                    inputProps={{ min: 1, max: 4 }}
                  />

                  <AnimatePresence>
                    {selectedCourt && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                      >
                        <Box>
                          <Typography variant="subtitle1">Total Price</Typography>
                          <Typography variant="h5" color="primary">
                            ${calculateTotalPrice()}
                          </Typography>
                        </Box>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <Button
                    variant="contained"
                    fullWidth
                    disabled={
                      !selectedCourt ||
                      !selectedDate ||
                      !selectedTime ||
                      !isDateValid(selectedDate) ||
                      !isTimeValid(selectedTime) ||
                      loading
                    }
                    onClick={() => setShowConfirmDialog(true)}
                  >
                    {loading ? <CircularProgress size={24} /> : 'Book Now'}
                  </Button>
                </Stack>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>
      </Grid>

      <Dialog
        open={showConfirmDialog}
        onClose={() => setShowConfirmDialog(false)}
        TransitionProps={{
          enter: true,
          exit: true,
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
        >
          <DialogTitle>Confirm Booking</DialogTitle>
          <DialogContent>
            <Stack spacing={2} sx={{ mt: 2 }}>
              {selectedCourt && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <Typography><strong>Court:</strong> {selectedCourt.name}</Typography>
                  <Typography>
                    <strong>Date:</strong> {selectedDate ? format(selectedDate, 'MMMM d, yyyy') : ''}
                  </Typography>
                  <Typography>
                    <strong>Time:</strong> {selectedTime ? format(selectedTime, 'h:mm a') : ''}
                  </Typography>
                  <Typography><strong>Duration:</strong> {duration} hour(s)</Typography>
                  <Typography><strong>Total Price:</strong> ${calculateTotalPrice()}</Typography>
                </motion.div>
              )}
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setShowConfirmDialog(false)}>Cancel</Button>
            <Button
              onClick={handleBooking}
              variant="contained"
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : 'Confirm Booking'}
            </Button>
          </DialogActions>
        </motion.div>
      </Dialog>
    </MotionBox>
  );
}; 