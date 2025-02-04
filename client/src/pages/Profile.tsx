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
    lastName: ''
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await api.get('/users/me');
      console.log('Profile response:', response.data);
      
      const userData = response.data.data || response.data;
      
      if (!userData || !userData.email) {
        throw new Error('No user data received');
      }

      // Set default values if data is missing
      const userProfile = {
        email: userData.email,
        firstName: userData.firstName || '',
        lastName: userData.lastName || '',
        membershipLevel: userData.membershipLevel || 'Standard',
        role: userData.role || 'Member'
      };

      setProfile(userProfile);

      // Update form data
      setFormData({
        firstName: userProfile.firstName,
        lastName: userProfile.lastName
      });

      console.log('Profile set:', userProfile);
    } catch (err: any) {
      console.error('Profile fetch error:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Failed to load profile';
      setError(errorMessage === 'Incomplete user data received' ? 'Please update your profile information' : errorMessage);
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

    if (!formData.firstName.trim() || !formData.lastName.trim()) {
      setError('Please fill in both first name and last name');
      return;
    }

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
                    error={!formData.firstName.trim()}
                    helperText={!formData.firstName.trim() ? 'First name is required' : ''}
                  />

                  <TextField
                    label="Last Name"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    fullWidth
                    required
                    error={!formData.lastName.trim()}
                    helperText={!formData.lastName.trim() ? 'Last name is required' : ''}
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