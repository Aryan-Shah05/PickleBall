import React from 'react';
import {
  Box,
  Paper,
  Grid,
  Typography,
  IconButton,
  Tooltip,
  keyframes,
} from '@mui/material';
import {
  ChevronLeft,
  ChevronRight,
  AccessTime,
} from '@mui/icons-material';
import { format, addDays, isSameDay } from 'date-fns';
import { pickleballColors } from '@/styles/theme';
import { CourtDiagram } from '../court/CourtDiagram';

const pulse = keyframes`
  0%, 100% {
    transform: scale(1);
    opacity: 0.8;
  }
  50% {
    transform: scale(1.05);
    opacity: 1;
  }
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

interface TimeSlot {
  time: string;
  isAvailable: boolean;
  isPeakHour: boolean;
  price: number;
}

interface BookingCalendarProps {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
  timeSlots: TimeSlot[];
  selectedTimeSlot?: string;
  onTimeSlotSelect: (time: string) => void;
  courtAvailability?: {
    [key: string]: boolean;
  };
}

export const BookingCalendar: React.FC<BookingCalendarProps> = ({
  selectedDate,
  onDateChange,
  timeSlots,
  selectedTimeSlot,
  onTimeSlotSelect,
  courtAvailability,
}) => {
  const dateRange = Array.from({ length: 7 }, (_, i) => addDays(new Date(), i));

  return (
    <Box>
      {/* Date Selection */}
      <Paper
        elevation={0}
        sx={{
          p: 2,
          mb: 3,
          background: `linear-gradient(135deg, ${pickleballColors.court.main}10, ${pickleballColors.ball.main}10)`,
          borderRadius: 2,
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '2px',
            background: `linear-gradient(90deg, ${pickleballColors.court.main}, ${pickleballColors.ball.main})`,
          },
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            mb: 2,
          }}
        >
          <IconButton
            onClick={() => onDateChange(addDays(selectedDate, -1))}
            disabled={isSameDay(selectedDate, new Date())}
          >
            <ChevronLeft />
          </IconButton>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            {format(selectedDate, 'MMMM yyyy')}
          </Typography>
          <IconButton onClick={() => onDateChange(addDays(selectedDate, 1))}>
            <ChevronRight />
          </IconButton>
        </Box>

        <Grid container spacing={1}>
          {dateRange.map((date) => (
            <Grid item xs key={date.toISOString()}>
              <Paper
                elevation={0}
                onClick={() => onDateChange(date)}
                sx={{
                  p: 1.5,
                  textAlign: 'center',
                  cursor: 'pointer',
                  backgroundColor: isSameDay(date, selectedDate)
                    ? pickleballColors.court.main
                    : 'transparent',
                  color: isSameDay(date, selectedDate)
                    ? 'white'
                    : 'inherit',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  transform: 'perspective(1000px)',
                  '&:hover': {
                    transform: 'perspective(1000px) rotateX(10deg) scale(1.05)',
                    backgroundColor: isSameDay(date, selectedDate)
                      ? pickleballColors.court.main
                      : pickleballColors.court.light + '20',
                  },
                }}
              >
                <Typography variant="subtitle2">
                  {format(date, 'EEE')}
                </Typography>
                <Typography variant="h6">{format(date, 'd')}</Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Paper>

      {/* Time Slots Grid */}
      <Grid container spacing={2}>
        <Grid item xs={12} md={8}>
          <Typography variant="h6" gutterBottom>
            Available Time Slots
          </Typography>
          <Grid container spacing={1}>
            {timeSlots.map((slot) => (
              <Grid item xs={12} sm={6} md={4} key={slot.time}>
                <Tooltip
                  title={`${slot.isPeakHour ? 'Peak Hour - ' : ''}₹${slot.price}`}
                  arrow
                >
                  <Paper
                    elevation={0}
                    onClick={() => slot.isAvailable && onTimeSlotSelect(slot.time)}
                    sx={{
                      p: 2,
                      textAlign: 'center',
                      cursor: slot.isAvailable ? 'pointer' : 'not-allowed',
                      backgroundColor: slot.isAvailable
                        ? selectedTimeSlot === slot.time
                          ? pickleballColors.accent.main
                          : 'white'
                        : '#f5f5f5',
                      color: selectedTimeSlot === slot.time ? 'white' : 'inherit',
                      opacity: slot.isAvailable ? 1 : 0.5,
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      animation: slot.isAvailable
                        ? `${slideIn} 0.3s ease-out`
                        : 'none',
                      transform: 'perspective(1000px)',
                      '&:hover': slot.isAvailable
                        ? {
                            transform:
                              'perspective(1000px) rotateX(10deg) scale(1.02)',
                            backgroundColor:
                              selectedTimeSlot === slot.time
                                ? pickleballColors.accent.main
                                : pickleballColors.accent.light + '20',
                          }
                        : {},
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 1,
                    }}
                  >
                    <AccessTime
                      fontSize="small"
                      sx={{
                        color: selectedTimeSlot === slot.time
                          ? 'white'
                          : pickleballColors.court.main,
                      }}
                    />
                    <Typography>{slot.time}</Typography>
                    {slot.isPeakHour && (
                      <Box
                        sx={{
                          position: 'absolute',
                          top: 4,
                          right: 4,
                          width: 8,
                          height: 8,
                          borderRadius: '50%',
                          backgroundColor: pickleballColors.ball.main,
                          animation: `${pulse} 2s infinite`,
                        }}
                      />
                    )}
                  </Paper>
                </Tooltip>
              </Grid>
            ))}
          </Grid>
        </Grid>

        {/* Mini Court Diagram */}
        {courtAvailability && Object.keys(courtAvailability).length > 0 && (
          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom>
              Court Availability
            </Typography>
            <Box sx={{ mt: 2 }}>
              {Object.entries(courtAvailability).map(([courtId, isAvailable]) => (
                <Box key={courtId} sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Court {courtId}
                  </Typography>
                  <CourtDiagram
                    isAvailable={isAvailable}
                    width="100%"
                    height={100}
                  />
                </Box>
              ))}
            </Box>
          </Grid>
        )}
      </Grid>
    </Box>
  );
}; 