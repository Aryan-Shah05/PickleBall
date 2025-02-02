import { createTheme } from '@mui/material/styles';
import { alpha } from '@mui/material/styles';

declare module '@mui/material/styles' {
  interface Palette {
    tertiary: Palette['primary'];
  }
  interface PaletteOptions {
    tertiary?: PaletteOptions['primary'];
  }
}

export const theme = createTheme({
  palette: {
    primary: {
      main: '#3B82F6',
      light: '#60A5FA',
      dark: '#2563EB',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#10B981',
      light: '#34D399',
      dark: '#059669',
      contrastText: '#FFFFFF',
    },
    tertiary: {
      main: '#F59E0B',
      light: '#FBBF24',
      dark: '#D97706',
      contrastText: '#FFFFFF',
    },
    text: {
      primary: '#1E293B',
      secondary: '#64748B',
    },
    background: {
      default: '#F8FAFC',
      paper: '#FFFFFF',
    },
  },
  typography: {
    fontFamily: 'Inter, system-ui, sans-serif',
    h1: {
      fontFamily: '"Clash Display", Inter, system-ui, sans-serif',
      fontWeight: 600,
      fontSize: 'clamp(2rem, 5vw, 4rem)',
      lineHeight: 1.1,
    },
    h2: {
      fontFamily: '"Clash Display", Inter, system-ui, sans-serif',
      fontWeight: 600,
      fontSize: 'clamp(1.5rem, 4vw, 3rem)',
      lineHeight: 1.2,
    },
    h3: {
      fontFamily: '"Clash Display", Inter, system-ui, sans-serif',
      fontWeight: 600,
      fontSize: 'clamp(1.25rem, 3vw, 2.25rem)',
      lineHeight: 1.3,
    },
    body1: {
      fontSize: 'clamp(1rem, 2vw, 1.125rem)',
      lineHeight: 1.6,
    },
    button: {
      fontWeight: 500,
      textTransform: 'none',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '10px 24px',
          transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          },
          '&:active': {
            transform: 'translateY(0px)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            transform: 'translateY(-4px) rotate(0.5deg)',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'linear-gradient(to bottom, #F8FAFC, #F1F5F9)',
        },
        elevation1: {
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)',
        },
        elevation2: {
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
        },
        elevation4: {
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backdropFilter: 'blur(8px)',
          backgroundColor: alpha('#FFFFFF', 0.8),
        },
      },
    },
  },
  shape: {
    borderRadius: 8,
  },
}); 