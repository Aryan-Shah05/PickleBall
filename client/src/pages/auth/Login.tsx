import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Link,
  InputAdornment,
  IconButton,
  Alert,
  Container,
  Grid,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { api } from '../../api/api';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await api.post('/auth/login', formData);
      const { data } = response;
      
      if (data.status === 'success' && data.data.token) {
        localStorage.setItem('token', data.data.token);
        localStorage.setItem('user', JSON.stringify(data.data.user));
        navigate('/dashboard');
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (err: any) {
      console.error('Login error:', err);
      setError(
        err.response?.data?.message ||
        err.message ||
        'Failed to connect to the server. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Card sx={{ maxWidth: 400, width: '90%', py: 2 }}>
          <CardContent>
            <Box
              component="form"
              onSubmit={handleSubmit}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 3,
              }}
            >
              <Box sx={{ textAlign: 'center', mb: 2 }}>
                <Typography variant="h4" component="h1" gutterBottom>
                  Welcome Back
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Sign in to continue to PickleBall
                </Typography>
              </Box>

              {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {error}
                </Alert>
              )}

              <TextField
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                fullWidth
                required
                autoComplete="email"
              />

              <TextField
                label="Password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={handleChange}
                fullWidth
                required
                autoComplete="current-password"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <Button
                type="submit"
                variant="contained"
                size="large"
                disabled={loading}
                sx={{ mt: 2 }}
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </Button>

              <Grid container>
                <Grid item xs>
                  <Link href="/forgot-password" variant="body2">
                    Forgot password?
                  </Link>
                </Grid>
                <Grid item>
                  <Link href="/register" variant="body2">
                    {"Don't have an account? Sign Up"}
                  </Link>
                </Grid>
              </Grid>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
}; 