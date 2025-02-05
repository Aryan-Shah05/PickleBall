import { createTheme, alpha } from '@mui/material';

// Custom theme colors
export const pickleballColors = {
  court: {
    main: '#2C5282', // Court blue
    light: '#4299E1',
    dark: '#2A4365',
    contrastText: '#FFFFFF',
  },
  ball: {
    main: '#F6E05E', // Ball yellow
    light: '#FAF089',
    dark: '#D69E2E',
    contrastText: '#1A202C',
  },
  accent: {
    main: '#48BB78', // Fresh green
    light: '#9AE6B4',
    dark: '#2F855A',
    contrastText: '#FFFFFF',
  },
  background: {
    default: '#F7FAFC',
    paper: '#FFFFFF',
    pattern: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0C13.4315 0 0 13.4315 0 30C0 46.5685 13.4315 60 30 60C46.5685 60 60 46.5685 60 30C60 13.4315 46.5685 0 30 0ZM30 45C21.7157 45 15 38.2843 15 30C15 21.7157 21.7157 15 30 15C38.2843 15 45 21.7157 45 30C45 38.2843 38.2843 45 30 45Z' fill='%232C5282' fill-opacity='0.05'/%3E%3C/svg%3E")`,
  },
};

// Animation keyframes
export const pickleballAnimations = {
  bounce: {
    '0%, 100%': {
      transform: 'translateY(0)',
    },
    '50%': {
      transform: 'translateY(-10px)',
    },
  },
  spin: {
    '0%': {
      transform: 'rotate(0deg)',
    },
    '100%': {
      transform: 'rotate(360deg)',
    },
  },
  pulse: {
    '0%, 100%': {
      opacity: 1,
      transform: 'scale(1)',
    },
    '50%': {
      opacity: 0.8,
      transform: 'scale(0.95)',
    },
  },
  slideUp: {
    '0%': {
      opacity: 0,
      transform: 'translateY(20px)',
    },
    '100%': {
      opacity: 1,
      transform: 'translateY(0)',
    },
  },
};

// Create theme
export const theme = createTheme({
  palette: {
    primary: pickleballColors.court,
    secondary: pickleballColors.ball,
    success: pickleballColors.accent,
    background: pickleballColors.background,
  },
  typography: {
    fontFamily: '"Inter", "system-ui", "-apple-system", sans-serif',
    h1: {
      fontWeight: 700,
      letterSpacing: '-0.025em',
    },
    h2: {
      fontWeight: 600,
      letterSpacing: '-0.025em',
    },
    h3: {
      fontWeight: 600,
      letterSpacing: '-0.025em',
    },
    h4: {
      fontWeight: 600,
    },
    h5: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 600,
    },
    button: {
      fontWeight: 600,
      textTransform: 'none',
    },
  },
  shape: {
    borderRadius: 2,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundImage: pickleballColors.background.pattern,
          backgroundAttachment: 'fixed',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 2,
          padding: '10px 24px',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
          },
          '&:active': {
            transform: 'translateY(0)',
          },
        },
        contained: {
          backgroundImage: `linear-gradient(135deg, ${pickleballColors.court.main}, ${pickleballColors.court.dark})`,
        },
        outlined: {
          borderWidth: 2,
          '&:hover': {
            borderWidth: 2,
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 2,
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 12px 24px rgba(0, 0, 0, 0.12)',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 2,
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            '&:hover': {
              transform: 'translateY(-2px)',
            },
            '&.Mui-focused': {
              transform: 'translateY(-2px)',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
            },
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backdropFilter: 'blur(8px)',
          backgroundColor: 'rgba(255, 255, 255, 0.7)',
          borderBottom: `1px solid rgba(0, 0, 0, 0.1)`,
          borderRadius: 2,
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: alpha(pickleballColors.court.dark, 0.95),
          backdropFilter: 'blur(4px)',
          borderRadius: 2,
          padding: '8px 12px',
          fontSize: '0.875rem',
        },
        arrow: {
          color: alpha(pickleballColors.court.dark, 0.95),
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 2,
          transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            transform: 'scale(1.05)',
          },
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 2,
          backgroundImage: `linear-gradient(135deg, ${alpha(pickleballColors.background.paper, 0.98)}, ${alpha(pickleballColors.background.paper, 0.95)})`,
          backdropFilter: 'blur(8px)',
        },
      },
    },
  },
}); 