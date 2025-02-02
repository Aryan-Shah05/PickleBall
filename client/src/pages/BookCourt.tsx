import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { Calendar } from 'react-big-calendar';
import { Card, CardContent, Typography, Button } from '@mui/material';
import { Court } from '../types';
import api from '../api/client';
import useAuthStore from '@/store/auth';

const BookCourt: React.FC = () => {
  const navigate = useNavigate();
  const [courts, setCourts] = useState<Court[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const { user } = useAuthStore();

  useEffect(() => {
    const fetchCourts = async () => {
      try {
        const response = await api.get('/api/v1/courts');
        setCourts(response.data.data);
      } catch (error) {
        console.error('Error fetching courts:', error);
      }
    };

    fetchCourts();
  }, []);

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
  };

  const handleCourtSelect = (court: Court) => {
    navigate(`/book/${court.id}`, {
      state: { date: format(selectedDate, 'yyyy-MM-dd') }
    });
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Book a Court</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {courts.map((court) => (
          <Card key={court.id}>
            <CardContent>
              <Typography variant="h6">{court.name}</Typography>
              <Typography color="textSecondary">
                Type: {court.type}
              </Typography>
              <Typography color="textSecondary">
                Rate: ${court.hourlyRate}/hour
              </Typography>
              <Button
                variant="contained"
                color="primary"
                onClick={() => handleCourtSelect(court)}
                className="mt-4"
              >
                Select Court
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default BookCourt; 