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
    <div>
      <Toolbar>
        <Typography variant="h6" noWrap component="div" sx={{ fontWeight: 600 }}>
          PickleBall
        </Typography>
      </Toolbar>
      <List>
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
                backgroundColor: 'primary.light',
                transform: 'translateX(4px)',
                '& .MuiListItemIcon-root, & .MuiListItemText-primary': {
                  color: 'white',
                },
              },
              '&.Mui-selected': {
                backgroundColor: 'primary.main',
                '& .MuiListItemIcon-root, & .MuiListItemText-primary': {
                  color: 'white',
                },
                '&:hover': {
                  backgroundColor: 'primary.dark',
                },
              },
            }}
          >
            <ListItemIcon sx={{ color: 'inherit' }}>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItemButton>
        ))}
      </List>
    </div>
  );

  const userInitials = user ? `${user.firstName?.[0] || ''}${user.lastName?.[0] || ''}` : '';

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        elevation={1}
        sx={{
          width: '100%',
          bgcolor: 'background.paper',
          borderBottom: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          {isMobile ? (
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ color: 'text.primary' }}
            >
              <MenuIcon />
            </IconButton>
          ) : (
            <Typography variant="h6" component="div" sx={{ 
              color: 'primary.main', 
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: 1
            }}>
              <SportsTennis /> PickleBall
            </Typography>
          )}

          {!isMobile && (
            <Stack direction="row" spacing={1} sx={{ ml: 4 }}>
              {navigationItems.map((item) => (
                <Button
                  key={item.text}
                  startIcon={item.icon}
                  onClick={() => navigate(item.path)}
                  sx={{
                    color: location.pathname === item.path ? 'primary.main' : 'text.primary',
                    borderRadius: 2,
                    px: 2,
                    py: 1,
                    transition: 'all 0.2s ease-in-out',
                    position: 'relative',
                    '&::after': {
                      content: '""',
                      position: 'absolute',
                      bottom: 0,
                      left: '50%',
                      width: location.pathname === item.path ? '100%' : '0%',
                      height: '2px',
                      bgcolor: 'primary.main',
                      transition: 'all 0.2s ease-in-out',
                      transform: 'translateX(-50%)',
                    },
                    '&:hover': {
                      backgroundColor: 'action.hover',
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
              transition: 'transform 0.2s ease-in-out',
              '&:hover': {
                transform: 'scale(1.05)',
              },
            }}
          >
            {user ? (
              <Avatar 
                sx={{ 
                  width: 35, 
                  height: 35, 
                  bgcolor: 'primary.main',
                  color: 'white',
                  fontWeight: 600,
                  boxShadow: 2,
                }}
              >
                {userInitials}
              </Avatar>
            ) : (
              <AccountCircle />
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
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                  backgroundColor: 'error.lighter',
                  color: 'error.main',
                  transform: 'translateX(4px)',
                }
              }}
            >
              <ExitToApp />
              Sign out
            </MenuItem>
          </Menu>
        </Toolbar>
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
              borderRight: '1px solid',
              borderColor: 'divider',
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
        }}
      >
        {children}
      </Box>
    </Box>
  );
}; 