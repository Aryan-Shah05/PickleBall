import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Stack,
  Alert,
  CircularProgress,
  Divider,
  Grid
} from '@mui/material';
import { api } from '../api/api';

interface UserProfile {
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  membershipLevel?: string;
  role?: string;
}

export const Profile: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phoneNumber: ''
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await api.get('/users/me');
      console.log('Profile response:', response.data); // Debug log
      
      // Handle both possible response structures
      const userData = response.data.data || response.data;
      
      if (!userData) {
        throw new Error('No user data received');
      }

      // Ensure we have the required data
      if (!userData.email || !userData.firstName || !userData.lastName) {
        throw new Error('Incomplete user data received');
      }

      // Set profile with all available data
      setProfile({
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        phoneNumber: userData.phoneNumber || '',
        membershipLevel: userData.membershipLevel || 'Standard',
        role: userData.role || 'Member'
      });

      // Update form data
      setFormData({
        firstName: userData.firstName,
        lastName: userData.lastName,
        phoneNumber: userData.phoneNumber || ''
      });

      console.log('Profile set:', userData); // Debug log
    } catch (err: any) {
      console.error('Profile fetch error:', err); // Debug log
      setError(err.message || err.response?.data?.message || 'Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      await api.patch('/users/me', formData);
      setSuccess('Profile updated successfully');
      await fetchProfile();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update profile');
    }
  };

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
        My Profile
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Account Information
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              <Stack spacing={2}>
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Email
                  </Typography>
                  <Typography>{profile?.email || 'N/A'}</Typography>
                </Box>

                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Membership Level
                  </Typography>
                  <Typography sx={{ textTransform: 'capitalize' }}>
                    {profile?.membershipLevel?.toLowerCase() || 'Standard'}
                  </Typography>
                </Box>

                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Account Type
                  </Typography>
                  <Typography sx={{ textTransform: 'capitalize' }}>
                    {profile?.role?.toLowerCase() || 'Member'}
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Personal Information
              </Typography>
              <Divider sx={{ mb: 2 }} />

              <form onSubmit={handleSubmit}>
                <Stack spacing={2}>
                  <TextField
                    label="First Name"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    fullWidth
                    required
                  />

                  <TextField
                    label="Last Name"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    fullWidth
                    required
                  />

                  <TextField
                    label="Phone Number"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    fullWidth
                    placeholder="Optional"
                  />

                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    size="large"
                  >
                    Update Profile
                  </Button>
                </Stack>
              </form>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}; 