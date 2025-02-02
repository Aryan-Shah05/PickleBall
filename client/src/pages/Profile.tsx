import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  Grid,
  Box,
  Avatar,
  Alert
} from '@mui/material';
import { MotionBox, fadeUpVariant, staggerContainer, LoadingSpinner } from '../components/animations';
import { userService } from '../api/user.service';

interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
  avatar?: string;
}

const MotionCard = motion(Card);

export const Profile = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState<UserProfile | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await userService.getProfile();
        setProfile(data);
        setFormData(data);
      } catch (error) {
        setError('Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (formData) {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData) return;

    try {
      const updatedProfile = await userService.updateProfile(formData);
      setProfile(updatedProfile);
      setSuccess('Profile updated successfully');
      setEditing(false);
      setTimeout(() => setSuccess(null), 3000);
    } catch (error) {
      setError('Failed to update profile');
      setTimeout(() => setError(null), 3000);
    }
  };

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
        <Typography variant="h4" gutterBottom>My Profile</Typography>
      </motion.div>

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

      <MotionCard
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <CardContent>
          <Grid container spacing={3}>
            <Grid item xs={12} md={4} sx={{ textAlign: 'center' }}>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, damping: 15 }}
              >
                <Avatar
                  src={profile?.avatar}
                  sx={{ width: 120, height: 120, margin: '0 auto 16px' }}
                />
              </motion.div>
            </Grid>
            <Grid item xs={12} md={8}>
              <Box component="form" onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="First Name"
                      name="firstName"
                      value={formData?.firstName || ''}
                      onChange={handleInputChange}
                      disabled={!editing}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Last Name"
                      name="lastName"
                      value={formData?.lastName || ''}
                      onChange={handleInputChange}
                      disabled={!editing}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Email"
                      name="email"
                      value={formData?.email || ''}
                      onChange={handleInputChange}
                      disabled={!editing}
                      type="email"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                      {!editing ? (
                        <Button
                          variant="contained"
                          onClick={() => setEditing(true)}
                        >
                          Edit Profile
                        </Button>
                      ) : (
                        <>
                          <Button
                            variant="outlined"
                            onClick={() => {
                              setEditing(false);
                              setFormData(profile);
                            }}
                          >
                            Cancel
                          </Button>
                          <Button
                            variant="contained"
                            type="submit"
                          >
                            Save Changes
                          </Button>
                        </>
                      )}
                    </Box>
                  </Grid>
                </Grid>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </MotionCard>
    </MotionBox>
  );
}; 