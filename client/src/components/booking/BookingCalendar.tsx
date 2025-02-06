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
          background: 'white',
          borderRadius: 2,
          position: 'relative',
          overflow: 'hidden',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          border: `1px solid ${pickleballColors.court.main}20`,
          '&:hover': { 
            transform: 'translateY(-4px)',
            boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
            border: `1px solid ${pickleballColors.court.main}40`,
          }
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
            sx={{
              color: pickleballColors.court.main,
              '&:hover': {
                backgroundColor: `${pickleballColors.court.main}10`,
              },
            }}
          >
            <ChevronLeft />
          </IconButton>
          <Typography variant="h6" sx={{ fontWeight: 600, color: pickleballColors.court.main }}>
            {format(selectedDate, 'MMMM yyyy')}
          </Typography>
          <IconButton 
            onClick={() => onDateChange(addDays(selectedDate, 1))}
            sx={{
              color: pickleballColors.court.main,
              '&:hover': {
                backgroundColor: `${pickleballColors.court.main}10`,
              },
            }}
          >
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
                  borderRadius: 2,
                  backgroundColor: isSameDay(date, selectedDate)
                    ? pickleballColors.court.main
                    : 'white',
                  color: isSameDay(date, selectedDate)
                    ? 'white'
                    : pickleballColors.court.main,
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                  border: `1px solid ${isSameDay(date, selectedDate) ? 'transparent' : pickleballColors.court.main + '20'}`,
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    border: `1px solid ${pickleballColors.court.main}40`,
                    backgroundColor: isSameDay(date, selectedDate)
                      ? pickleballColors.court.main
                      : `${pickleballColors.court.main}10`,
                  },
                }}
              >
                <Typography variant="subtitle2" sx={{ opacity: 0.8 }}>
                  {format(date, 'EEE')}
                </Typography>
                <Typography 
                  variant="h6" 
                  sx={{ 
                    fontWeight: 600,
                    color: isSameDay(date, selectedDate) ? 'white' : pickleballColors.court.main
                  }}
                >
                  {format(date, 'd')}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Paper>

      {/* Time Slots Grid */}
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom sx={{ color: pickleballColors.court.main }}>
            Available Time Slots
          </Typography>
          <Grid container spacing={2}>
            {timeSlots.map((slot) => (
              <Grid item xs={6} sm={6} md={4} key={slot.time}>
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
                      borderRadius: 2,
                      backgroundColor: slot.isAvailable
                        ? selectedTimeSlot === slot.time
                          ? pickleballColors.court.main
                          : 'white'
                        : '#f5f5f5',
                      color: selectedTimeSlot === slot.time ? 'white' : 'inherit',
                      opacity: slot.isAvailable ? 1 : 0.5,
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                      border: `1px solid ${selectedTimeSlot === slot.time ? 'transparent' : pickleballColors.court.main + '20'}`,
                      '&:hover': slot.isAvailable
                        ? {
                            transform: 'translateY(-4px)',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                            border: `1px solid ${pickleballColors.court.main}40`,
                            backgroundColor:
                              selectedTimeSlot === slot.time
                                ? pickleballColors.court.main
                                : `${pickleballColors.court.main}10`,
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
                    <Typography sx={{ fontWeight: 500 }}>{slot.time}</Typography>
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