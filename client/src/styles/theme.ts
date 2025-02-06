import { createTheme, alpha } from '@mui/material';

// Custom theme colors
export const pickleballColors = {
  court: {
    main: '#2C5282', // Primary court blue
    light: '#4299E1',
    dark: '#2A4365',
    contrastText: '#FFFFFF',
  },
  ball: {
    main: '#F6E05E', // Secondary ball yellow
    light: '#FAF089',
    dark: '#D69E2E',
    contrastText: '#1A202C',
  },
  accent: {
    main: '#48BB78', // Fresh green accent
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
      color: pickleballColors.court.main,
    },
    h2: {
      fontWeight: 600,
      letterSpacing: '-0.025em',
      color: pickleballColors.court.main,
    },
    h3: {
      fontWeight: 600,
      letterSpacing: '-0.025em',
      color: pickleballColors.court.main,
    },
    h4: {
      fontWeight: 600,
      color: pickleballColors.court.main,
    },
    h5: {
      fontWeight: 600,
      color: pickleballColors.court.main,
    },
    h6: {
      fontWeight: 600,
      color: pickleballColors.court.main,
    },
    button: {
      fontWeight: 600,
      textTransform: 'none',
    },
  },
  shape: {
    borderRadius: 8,
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
          borderRadius: 8,
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
          background: `linear-gradient(135deg, ${pickleballColors.court.main}, ${pickleballColors.court.dark})`,
          '&:hover': {
            background: `linear-gradient(135deg, ${pickleballColors.accent.main}, ${pickleballColors.accent.dark})`,
          },
        },
        outlined: {
          borderWidth: 2,
          borderColor: pickleballColors.court.main,
          color: pickleballColors.court.main,
          '&:hover': {
            borderWidth: 2,
            borderColor: pickleballColors.accent.main,
            color: pickleballColors.accent.main,
            backgroundColor: alpha(pickleballColors.accent.main, 0.1),
          },
        },
        text: {
          color: pickleballColors.court.main,
          '&:hover': {
            color: pickleballColors.accent.main,
            backgroundColor: alpha(pickleballColors.accent.main, 0.1),
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
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
            borderRadius: 8,
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            '& fieldset': {
              borderColor: alpha(pickleballColors.court.main, 0.3),
            },
            '&:hover fieldset': {
              borderColor: pickleballColors.accent.main,
            },
            '&.Mui-focused fieldset': {
              borderColor: pickleballColors.accent.main,
            },
            '&:hover': {
              transform: 'translateY(-2px)',
            },
            '&.Mui-focused': {
              transform: 'translateY(-2px)',
              boxShadow: `0 4px 12px ${alpha(pickleballColors.accent.main, 0.2)}`,
            },
          },
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        root: {
          '&.MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: alpha(pickleballColors.court.main, 0.3),
            },
            '&:hover fieldset': {
              borderColor: pickleballColors.accent.main,
            },
            '&.Mui-focused fieldset': {
              borderColor: pickleballColors.accent.main,
            },
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            transform: 'scale(1.05)',
          },
          '&.MuiChip-colorPrimary': {
            backgroundColor: alpha(pickleballColors.court.main, 0.1),
            color: pickleballColors.court.main,
          },
          '&.MuiChip-colorSecondary': {
            backgroundColor: alpha(pickleballColors.ball.main, 0.1),
            color: pickleballColors.ball.dark,
          },
          '&.MuiChip-colorSuccess': {
            backgroundColor: alpha(pickleballColors.accent.main, 0.1),
            color: pickleballColors.accent.main,
          },
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          '&.MuiAlert-standardSuccess': {
            backgroundColor: alpha(pickleballColors.accent.main, 0.1),
            color: pickleballColors.accent.dark,
            '& .MuiAlert-icon': {
              color: pickleballColors.accent.main,
            },
          },
          '&.MuiAlert-standardError': {
            '& .MuiAlert-icon': {
              color: pickleballColors.ball.main,
            },
          },
          '&.MuiAlert-standardInfo': {
            backgroundColor: alpha(pickleballColors.court.main, 0.1),
            color: pickleballColors.court.dark,
            '& .MuiAlert-icon': {
              color: pickleballColors.court.main,
            },
          },
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 12,
          backgroundImage: `linear-gradient(135deg, ${alpha(pickleballColors.background.paper, 0.98)}, ${alpha(pickleballColors.background.paper, 0.95)})`,
          backdropFilter: 'blur(8px)',
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            backgroundColor: alpha(pickleballColors.accent.main, 0.1),
            color: pickleballColors.accent.main,
            transform: 'translateX(4px)',
            '& .MuiListItemIcon-root': {
              color: pickleballColors.accent.main,
            },
          },
          '&.Mui-selected': {
            backgroundColor: alpha(pickleballColors.accent.main, 0.1),
            color: pickleballColors.accent.main,
            '& .MuiListItemIcon-root': {
              color: pickleballColors.accent.main,
            },
            '&:hover': {
              backgroundColor: alpha(pickleballColors.accent.main, 0.2),
            },
          },
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            backgroundColor: alpha(pickleballColors.accent.main, 0.1),
            color: pickleballColors.accent.main,
            transform: 'scale(1.1)',
          },
        },
      },
    },
  },
}); 