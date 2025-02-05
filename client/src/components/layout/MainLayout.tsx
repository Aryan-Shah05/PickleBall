import React, { useState } from 'react';
import {
  AppBar,
  Box,
  CssBaseline,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme,
  Avatar,
  Menu,
  MenuItem,
  Stack,
  Button,
  Fade,
  Container,
} from '@mui/material';
import {
  Menu as MenuIcon,
  SportsTennis,
  Dashboard,
  EventNote,
  ExitToApp,
  AccountCircle,
  CurrencyRupee,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { api } from '../../api/api';
import useAuthStore from '@/store/auth';

// Pickleball theme colors
const pickleballTheme = {
  court: '#2ecc71', // Pickleball court green
  courtLight: '#a8e6cf', // Light court color
  ball: '#f39c12',  // Pickleball yellow/orange
  paddle: '#8e44ad', // Paddle purple
  net: '#2c3e50',   // Net dark blue
  accent: '#e74c3c', // Energetic red accent
  background: 'rgba(255, 255, 255, 0.9)', // Translucent white
  backgroundDark: 'rgba(44, 62, 80, 0.95)', // Translucent dark
};

const drawerWidth = 240;

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { user } = useAuthStore();
  
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    try {
      await api.post('/auth/logout');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      navigate('/login');
    }
  };

  const navigationItems = [
    { text: 'Dashboard', icon: <Dashboard />, path: '/dashboard' },
    { text: 'Book Court', icon: <SportsTennis />, path: '/book' },
    { text: 'My Bookings', icon: <EventNote />, path: '/bookings' },
  ];

  const drawer = (
    <Box>
      <Toolbar 
        sx={{ 
          background: `linear-gradient(135deg, ${pickleballTheme.court} 0%, ${pickleballTheme.net} 100%)`,
          color: 'white',
        }}
      >
        <Typography variant="h6" noWrap component="div" sx={{ 
          fontWeight: 600,
          display: 'flex',
          alignItems: 'center',
          gap: 1,
        }}>
          <SportsTennis sx={{ 
            animation: 'bounce 2s infinite',
            '@keyframes bounce': {
              '0%, 100%': { transform: 'rotate(0deg)' },
              '50%': { transform: 'rotate(180deg)' },
            }
          }} />
          PickleBall
        </Typography>
      </Toolbar>
      <List sx={{ 
        background: '#f8f9fa',
        height: '100%',
        '& .MuiListItemButton-root': {
          my: 0.5,
        }
      }}>
        {navigationItems.map((item) => (
          <ListItemButton
            key={item.text}
            onClick={() => navigate(item.path)}
            selected={location.pathname === item.path}
            sx={{
              borderRadius: 1,
              mx: 1,
              transition: 'all 0.2s ease-in-out',
              '&:hover': {
                backgroundColor: `${pickleballTheme.court}20`,
                transform: 'translateX(4px)',
                '& .MuiListItemIcon-root': {
                  color: pickleballTheme.court,
                },
              },
              '&.Mui-selected': {
                backgroundColor: `${pickleballTheme.court}40`,
                '& .MuiListItemIcon-root': {
                  color: pickleballTheme.court,
                },
                '&:hover': {
                  backgroundColor: `${pickleballTheme.court}50`,
                },
              },
            }}
          >
            <ListItemIcon sx={{ 
              color: location.pathname === item.path ? pickleballTheme.court : 'inherit',
              transition: 'color 0.2s ease-in-out',
            }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItemButton>
        ))}
      </List>
    </Box>
  );

  const userInitials = user ? `${user.firstName?.[0] || ''}${user.lastName?.[0] || ''}` : '';

  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column', 
      minHeight: '100vh',
      bgcolor: pickleballTheme.courtLight,
      backgroundImage: 'linear-gradient(120deg, rgba(168, 230, 207, 0.2) 0%, rgba(46, 204, 113, 0.1) 100%)',
    }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          width: '100%',
          bgcolor: pickleballTheme.background,
          backdropFilter: 'blur(10px)',
          borderBottom: '2px solid',
          borderColor: pickleballTheme.court,
          boxShadow: `0 4px 20px ${pickleballTheme.court}20`,
        }}
      >
        <Container maxWidth="xl">
          <Toolbar sx={{ justifyContent: 'space-between', px: { xs: 1, sm: 2 } }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              {isMobile && (
                <IconButton
                  aria-label="open drawer"
                  edge="start"
                  onClick={handleDrawerToggle}
                  sx={{ mr: 2, color: pickleballTheme.paddle }}
                >
                  <MenuIcon />
                </IconButton>
              )}
              <Typography variant="h6" component="div" sx={{ 
                color: pickleballTheme.paddle, 
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}>
                <SportsTennis sx={{ 
                  color: pickleballTheme.ball,
                  animation: 'bounce 2s infinite',
                  '@keyframes bounce': {
                    '0%, 100%': { transform: 'rotate(0deg) scale(1)' },
                    '50%': { transform: 'rotate(180deg) scale(1.1)' },
                  }
                }} />
                PickleBall
              </Typography>
            </Box>

            {!isMobile && (
              <Stack 
                direction="row" 
                spacing={2} 
                sx={{ 
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                {navigationItems.map((item) => (
                  <Button
                    key={item.text}
                    startIcon={
                      <Box sx={{ 
                        color: location.pathname === item.path ? pickleballTheme.ball : pickleballTheme.paddle,
                        transition: 'all 0.3s ease-in-out',
                        transform: location.pathname === item.path ? 'scale(1.1)' : 'scale(1)',
                      }}>
                        {item.icon}
                      </Box>
                    }
                    onClick={() => navigate(item.path)}
                    sx={{
                      color: location.pathname === item.path ? pickleballTheme.court : pickleballTheme.paddle,
                      borderRadius: 2,
                      px: 3,
                      py: 1,
                      transition: 'all 0.3s ease-in-out',
                      position: 'relative',
                      fontWeight: 600,
                      '&::after': {
                        content: '""',
                        position: 'absolute',
                        bottom: 0,
                        left: '50%',
                        width: location.pathname === item.path ? '100%' : '0%',
                        height: '3px',
                        background: `linear-gradient(90deg, ${pickleballTheme.court} 0%, ${pickleballTheme.ball} 100%)`,
                        transition: 'all 0.3s ease-in-out',
                        transform: 'translateX(-50%)',
                        borderRadius: '4px',
                      },
                      '&:hover': {
                        backgroundColor: `${pickleballTheme.court}15`,
                        transform: 'translateY(-2px)',
                        '&::after': {
                          width: '100%',
                        },
                      },
                    }}
                  >
                    {item.text}
                  </Button>
                ))}
              </Stack>
            )}

            <IconButton
              onClick={handleMenu}
              size="small"
              sx={{
                transition: 'all 0.3s ease-in-out',
                '&:hover': {
                  transform: 'scale(1.1) rotate(5deg)',
                },
              }}
            >
              {user ? (
                <Avatar 
                  sx={{ 
                    width: 38, 
                    height: 38, 
                    background: `linear-gradient(135deg, ${pickleballTheme.court} 0%, ${pickleballTheme.paddle} 100%)`,
                    color: 'white',
                    fontWeight: 600,
                    boxShadow: `0 2px 12px ${pickleballTheme.court}40`,
                    border: `2px solid ${pickleballTheme.background}`,
                  }}
                >
                  {userInitials}
                </Avatar>
              ) : (
                <AccountCircle sx={{ color: pickleballTheme.paddle, fontSize: 32 }} />
              )}
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleClose}
              TransitionComponent={Fade}
              transformOrigin={{ horizontal: 'right', vertical: 'top' }}
              anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
              PaperProps={{
                elevation: 2,
                sx: {
                  overflow: 'visible',
                  filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.15))',
                  mt: 1.5,
                  borderRadius: 2,
                  minWidth: 180,
                  bgcolor: pickleballTheme.background,
                  backdropFilter: 'blur(10px)',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    right: 14,
                    width: 10,
                    height: 10,
                    bgcolor: pickleballTheme.background,
                    transform: 'translateY(-50%) rotate(45deg)',
                    zIndex: 0,
                  },
                },
              }}
            >
              <MenuItem 
                onClick={() => { handleClose(); handleLogout(); }}
                sx={{ 
                  py: 1.5,
                  px: 2,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.5,
                  borderRadius: 1,
                  transition: 'all 0.3s ease-in-out',
                  '&:hover': {
                    backgroundColor: `${pickleballTheme.accent}15`,
                    color: pickleballTheme.accent,
                    transform: 'translateX(4px)',
                  }
                }}
              >
                <ExitToApp />
                Sign out
              </MenuItem>
            </Menu>
          </Toolbar>
        </Container>
      </AppBar>

      {isMobile && (
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
              borderRight: 'none',
              boxShadow: '4px 0 20px rgba(0,0,0,0.1)',
              background: pickleballTheme.background,
              backdropFilter: 'blur(10px)',
            },
          }}
        >
          {drawer}
        </Drawer>
      )}

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: '100%',
          mt: 8,
          minHeight: '100vh',
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: `
              radial-gradient(circle at 20% 20%, ${pickleballTheme.court}10 0%, transparent 50%),
              radial-gradient(circle at 80% 80%, ${pickleballTheme.ball}10 0%, transparent 50%)
            `,
            pointerEvents: 'none',
          }
        }}
      >
        {children}
      </Box>
    </Box>
  );
}; 