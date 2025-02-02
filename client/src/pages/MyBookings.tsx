import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Stack,
  Chip,
  Tab,
  Tabs,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  CircularProgress,
  Grid
} from '@mui/material';
import {
  CalendarToday,
  AccessTime,
  SportsTennis,
  Cancel as CancelIcon,
  Info as InfoIcon,
} from '@mui/icons-material';
import { format } from 'date-fns';
import { bookingService } from '../api/booking.service';
import { motion, AnimatePresence } from 'framer-motion';
import { MotionBox, fadeUpVariant, staggerContainer, LoadingSpinner } from '../components/animations';

const getStatusColor = (status: string) => {
  switch (status) {
    case 'upcoming':
      return 'primary';
    case 'completed':
      return 'success';
    case 'cancelled':
      return 'error';
    default:
      return 'default';
  }
};

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`bookings-tabpanel-${index}`}
      aria-labelledby={`bookings-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

// Define interfaces
interface Court {
  id: string;
  name: string;
}

interface BookingType {
  id: string;
  courtId: string;
  court: Court;
  date: string;
  startTime: string;
  endTime: string;
  status: 'upcoming' | 'completed' | 'cancelled';
  price: number;
  duration: number;
}

// Create motion-wrapped components
const MotionCard = motion(Card);

export const MyBookings = () => {
  const [bookings, setBookings] = useState<BookingType[]>([]);
  const [loading, setLoading] = useState(true);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(null);

  const handleCancelBooking = (bookingId: string) => {
    setSelectedBookingId(bookingId);
    setShowConfirmDialog(true);
  };

  const confirmCancellation = async () => {
    if (selectedBookingId) {
      try {
        await bookingService.cancelBooking(selectedBookingId);
        setBookings(bookings.filter(booking => booking.id !== selectedBookingId));
        setShowConfirmDialog(false);
      } catch (error) {
        console.error('Error cancelling booking:', error);
      }
    }
  };

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await bookingService.getBookings();
        setBookings(response);
      } catch (error) {
        console.error('Error fetching bookings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <MotionBox
      variants={staggerContainer}
      initial="initial"
      animate="animate"
      p={3}
    >
      <motion.div variants={fadeUpVariant}>
        <Typography variant="h4" gutterBottom>My Bookings</Typography>
      </motion.div>

      <Grid container spacing={3}>
        {bookings.map((booking, index) => (
          <Grid item xs={12} sm={6} md={4} key={booking.id}>
            <motion.div
              variants={fadeUpVariant}
              custom={index}
              transition={{ delay: index * 0.1 }}
            >
              <MotionCard
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                sx={{ height: '100%' }}
              >
                <CardContent>
                  <Typography variant="h6">{booking.court.name}</Typography>
                  <Typography color="text.secondary">
                    Date: {new Date(booking.date).toLocaleDateString()}
                  </Typography>
                  <Typography color="text.secondary">
                    Time: {booking.startTime} - {booking.endTime}
                  </Typography>
                  <Typography color="text.secondary">
                    Duration: {booking.duration} hour(s)
                  </Typography>
                  <Typography color="text.secondary">
                    Price: ${booking.price}
                  </Typography>
                  <Button
                    color="error"
                    onClick={() => handleCancelBooking(booking.id)}
                    sx={{ mt: 2 }}
                  >
                    Cancel Booking
                  </Button>
                </CardContent>
              </MotionCard>
            </motion.div>
          </Grid>
        ))}
      </Grid>

      <AnimatePresence>
        {showConfirmDialog && (
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
              <DialogTitle>Confirm Cancellation</DialogTitle>
              <DialogContent>
                <Typography>
                  Are you sure you want to cancel this booking? This action cannot be undone.
                </Typography>
              </DialogContent>
              <DialogActions>
                <Button onClick={() => setShowConfirmDialog(false)}>
                  No, Keep Booking
                </Button>
                <Button
                  color="error"
                  onClick={confirmCancellation}
                  autoFocus
                >
                  Yes, Cancel Booking
                </Button>
              </DialogActions>
            </motion.div>
          </Dialog>
        )}
      </AnimatePresence>
    </MotionBox>
  );
};

interface BookingCardProps {
  booking: BookingType;
  onViewDetails: () => void;
  onCancel?: () => void;
}

const BookingCard = ({ booking, onViewDetails, onCancel }: BookingCardProps) => (
  <Card>
    <CardContent>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Stack spacing={1}>
          <Typography variant="h6">{booking.court.name}</Typography>
          <Typography color="text.secondary">
            {format(new Date(booking.date), 'MMMM d, yyyy')} at {booking.startTime} - {booking.endTime}
          </Typography>
          <Typography>Duration: {booking.duration} hour(s)</Typography>
          <Typography>Price: ${booking.price}</Typography>
          <Chip
            label={booking.status}
            color={getStatusColor(booking.status)}
            size="small"
            sx={{ width: 'fit-content' }}
          />
        </Stack>
        <Stack direction="row" spacing={1}>
          <IconButton onClick={onViewDetails} color="primary" size="small">
            <InfoIcon />
          </IconButton>
          {booking.status === 'upcoming' && onCancel && (
            <IconButton onClick={onCancel} color="error" size="small">
              <CancelIcon />
            </IconButton>
          )}
        </Stack>
      </Box>
    </CardContent>
  </Card>
); 