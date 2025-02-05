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
  ];

  const drawer = (
    <Box>
      <Toolbar 
        sx={{ 
          background: `linear-gradient(135deg, ${pickleballColors.court.main} 0%, ${pickleballColors.court.dark} 100%)`,
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
                backgroundColor: `${pickleballColors.court.main}20`,
                transform: 'translateX(4px)',
                '& .MuiListItemIcon-root': {
                  color: pickleballColors.court.main,
                },
              },
              '&.Mui-selected': {
                backgroundColor: `${pickleballColors.court.main}40`,
                '& .MuiListItemIcon-root': {
                  color: pickleballColors.court.main,
                },
                '&:hover': {
                  backgroundColor: `${pickleballColors.court.main}50`,
                },
              },
            }}
          >
            <ListItemIcon sx={{ 
              color: location.pathname === item.path ? pickleballColors.court.main : 'inherit',
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
      bgcolor: pickleballColors.background.default,
      backgroundImage: pickleballColors.background.pattern,
    }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          ml: { sm: `${drawerWidth}px` },
          bgcolor: pickleballColors.background.paper,
          backdropFilter: 'blur(10px)',
          borderRadius: { xs: 0, sm: 3 },
          m: { xs: 0, sm: 2 },
          width: { xs: '100%', sm: `calc(100% - 32px)` },
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
          border: `1px solid ${pickleballColors.court.main}20`,
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
                  sx={{ mr: 2, color: pickleballColors.court.main }}
                >
                  <MenuIcon />
                </IconButton>
              )}
              <Typography 
                variant="h6" 
                component={Box}
                onClick={() => navigate('/dashboard')}
                sx={{ 
                  color: pickleballColors.court.main, 
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  cursor: 'pointer',
                  '&:hover': {
                    color: pickleballColors.accent.main,
                  },
                }}
              >
                <SportsTennis sx={{ 
                  color: pickleballColors.ball.main,
                  animation: 'bounce 2s infinite',
                  '@keyframes bounce': {
                    '0%, 100%': { transform: 'rotate(0deg) scale(1)' },
                    '50%': { transform: 'rotate(180deg) scale(1.1)' },
                  }
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
                  spacing={1}
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
                          color: location.pathname === item.path ? pickleballColors.ball.main : pickleballColors.court.main,
                          transition: 'all 0.3s ease-in-out',
                          transform: location.pathname === item.path ? 'scale(1.1)' : 'scale(1)',
                        }}>
                          {item.icon}
                        </Box>
                      }
                      onClick={() => navigate(item.path)}
                      sx={{
                        color: location.pathname === item.path ? pickleballColors.court.main : pickleballColors.court.main,
                        borderRadius: 2,
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
                          height: '3px',
                          background: `linear-gradient(90deg, ${pickleballColors.court.main} 0%, ${pickleballColors.ball.main} 100%)`,
                          transition: 'all 0.3s ease-in-out',
                          transform: 'translateX(-50%)',
                          borderRadius: '4px',
                        },
                        '&:hover': {
                          backgroundColor: `${pickleballColors.court.main}15`,
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
                      background: `linear-gradient(135deg, ${pickleballColors.court.main} 0%, ${pickleballColors.accent.main} 100%)`,
                      color: 'white',
                      fontWeight: 600,
                      boxShadow: `0 2px 12px ${pickleballColors.court.main}40`,
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
                    borderRadius: 2,
                    minWidth: 180,
                    bgcolor: pickleballColors.background.paper,
                    backdropFilter: 'blur(10px)',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      right: 14,
                      width: 10,
                      height: 10,
                      bgcolor: pickleballColors.background.paper,
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
                      backgroundColor: `${pickleballColors.accent.main}15`,
                      color: pickleballColors.accent.main,
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
              boxShadow: '4px 0 24px rgba(0,0,0,0.1)',
              background: pickleballColors.background.paper,
              backdropFilter: 'blur(10px)',
              borderRadius: { xs: 0, sm: '0 24px 24px 0' },
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