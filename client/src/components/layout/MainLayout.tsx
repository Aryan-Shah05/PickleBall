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
  LocationOn,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { api } from '../../api/api';
import useAuthStore from '@/store/auth';
import { pickleballColors } from '@/styles/theme';

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
    { 
      text: 'Location', 
      icon: <LocationOn />, 
      path: 'https://www.google.com/maps/place/PicklPark/@21.1555839,72.7798215,14z/data=!4m6!3m5!1s0x3be053efda7e1361:0x70b85a550cb5d1c3!8m2!3d21.1444004!4d72.7840529!16s%2Fg%2F11lnkhjkrq?entry=tts&g_ep=EgoyMDI1MDEyOS4xIPu8ASoASAFQAw%3D%3D',
      external: true 
    },
  ];

  const drawer = (
    <Box>
      <Toolbar 
        sx={{ 
          background: `linear-gradient(135deg, #34495E 0%, #2c3e50 100%)`,
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
            },
            color: '#F6E05E',
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
            onClick={() => item.external ? window.open(item.path, '_blank') : navigate(item.path)}
            selected={!item.external && location.pathname === item.path}
            sx={{
              borderRadius: '2px',
              mx: 1,
              transition: 'all 0.2s ease-in-out',
              '&:hover': {
                backgroundColor: `#48BB7820`,
                transform: 'translateX(4px)',
                '& .MuiListItemIcon-root': {
                  color: '#48BB78',
                },
                '& .MuiListItemText-root': {
                  color: '#48BB78',
                },
              },
              '&.Mui-selected': {
                backgroundColor: `#48BB7820`,
                '& .MuiListItemIcon-root': {
                  color: '#48BB78',
                },
                '& .MuiListItemText-root': {
                  color: '#48BB78',
                },
                '&:hover': {
                  backgroundColor: `#48BB7830`,
                },
              },
            }}
          >
            <ListItemIcon sx={{ 
              color: location.pathname === item.path ? '#48BB78' : 'inherit',
              transition: 'color 0.2s ease-in-out',
            }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText 
              primary={item.text}
              sx={{
                color: location.pathname === item.path ? '#48BB78' : 'inherit',
                transition: 'color 0.2s ease-in-out',
              }}
            />
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
      bgcolor: pickleballColors.background.default,
      backgroundImage: pickleballColors.background.pattern,
    }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          ml: { sm: `${drawerWidth}px` },
          bgcolor: 'rgba(255, 255, 255, 0.5)',
          backdropFilter: 'blur(12px)',
          borderRadius: '12px',
          m: { xs: 0, sm: 2 },
          width: { xs: '100%', sm: `calc(100% - 32px)` },
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.03)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
          '& .MuiToolbar-root': {
            borderRadius: 'inherit',
          },
        }}
      >
        <Container maxWidth="xl">
          <Toolbar sx={{ 
            justifyContent: 'space-between', 
            px: { xs: 1, sm: 2 },
            minHeight: '64px',
          }}>
            {/* Left side - Logo */}
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center',
              flexShrink: 0,
            }}>
              {isMobile && (
                <IconButton
                  aria-label="open drawer"
                  edge="start"
                  onClick={handleDrawerToggle}
                  sx={{ mr: 2, color: '#34495E' }}
                >
                  <MenuIcon />
                </IconButton>
              )}
              <Typography 
                variant="h6" 
                component={Box}
                onClick={() => navigate('/dashboard')}
                sx={{ 
                  color: '#2C5282', 
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  cursor: 'pointer',
                  '&:hover': {
                    color: '#48BB78',
                  },
                }}
              >
                <SportsTennis sx={{ 
                  color: '#2C5282',
                  animation: 'bounce 2s infinite',
                  '@keyframes bounce': {
                    '0%, 100%': { transform: 'rotate(0deg) scale(1)' },
                    '50%': { transform: 'rotate(180deg) scale(1.1)' },
                  },
                  '&:hover': {
                    color: '#48BB78',
                  },
                }} />
                PickleBall
              </Typography>
            </Box>

            {/* Right side - Navigation and Profile */}
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center',
              gap: 2,
              ml: 'auto'
            }}>
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
                          color: location.pathname === item.path ? '#48BB78' : '#2C5282',
                          transition: 'all 0.3s ease-in-out',
                          transform: location.pathname === item.path ? 'scale(1.1)' : 'scale(1)',
                        }}>
                          {item.icon}
                        </Box>
                      }
                      onClick={() => item.external ? window.open(item.path, '_blank') : navigate(item.path)}
                      sx={{
                        color: location.pathname === item.path ? '#48BB78' : '#2C5282',
                        borderRadius: '12px',
                        px: 2,
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
                          height: '2px',
                          background: `linear-gradient(90deg, #48BB78 0%, #48BB7880 100%)`,
                          transition: 'all 0.3s ease-in-out',
                          transform: 'translateX(-50%)',
                          borderRadius: '12px',
                        },
                        '&:hover': {
                          backgroundColor: `#48BB7810`,
                          transform: 'translateY(-2px)',
                          color: '#48BB78',
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
                      background: `linear-gradient(135deg, #2C5282 0%, #48BB78 100%)`,
                      color: 'white',
                      fontWeight: 600,
                      boxShadow: `0 2px 12px #2C528240`,
                      border: `2px solid ${pickleballColors.background.paper}`,
                    }}
                  >
                    {userInitials}
                  </Avatar>
                ) : (
                  <AccountCircle sx={{ color: pickleballColors.court.main, fontSize: 32 }} />
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
                    borderRadius: '2px',
                    minWidth: 180,
                    bgcolor: 'rgba(255, 255, 255, 0.8)',
                    backdropFilter: 'blur(8px)',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      right: 14,
                      width: 10,
                      height: 10,
                      bgcolor: 'rgba(255, 255, 255, 0.8)',
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
                    borderRadius: '2px',
                    transition: 'all 0.3s ease-in-out',
                    '&:hover': {
                      backgroundColor: `#48BB7815`,
                      color: '#48BB78',
                      transform: 'translateX(4px)',
                    }
                  }}
                >
                  <ExitToApp />
                  Sign out
                </MenuItem>
              </Menu>
            </Box>
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
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.03)',
              background: 'rgba(255, 255, 255, 0.5)',
              backdropFilter: 'blur(12px)',
              borderRadius: { xs: 0, sm: '0 2px 2px 0' },
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
          mt: { xs: 7, sm: 9 },
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
              radial-gradient(circle at 20% 20%, ${pickleballColors.court.main}10 0%, transparent 50%),
              radial-gradient(circle at 80% 80%, ${pickleballColors.ball.main}10 0%, transparent 50%)
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