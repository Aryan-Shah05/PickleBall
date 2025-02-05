import React from 'react';
import { Box, Typography, IconButton, keyframes } from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { pickleballColors } from '@/styles/theme';

const slideIn = keyframes`
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
`;

const slideOut = keyframes`
  from {
    transform: translateX(0);
    opacity: 1;
  }
  to {
    transform: translateX(100%);
    opacity: 0;
  }
`;

interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'info' | 'warning';
  onClose: () => void;
  isClosing?: boolean;
}

const getToastColors = (type: ToastProps['type']) => {
  switch (type) {
    case 'success':
      return {
        bg: pickleballColors.accent.main,
        border: pickleballColors.accent.dark,
        text: pickleballColors.accent.contrastText,
      };
    case 'error':
      return {
        bg: '#EF4444',
        border: '#DC2626',
        text: '#FFFFFF',
      };
    case 'warning':
      return {
        bg: pickleballColors.ball.main,
        border: pickleballColors.ball.dark,
        text: pickleballColors.ball.contrastText,
      };
    default:
      return {
        bg: pickleballColors.court.main,
        border: pickleballColors.court.dark,
        text: pickleballColors.court.contrastText,
      };
  }
};

export const Toast: React.FC<ToastProps> = ({
  message,
  type = 'info',
  onClose,
  isClosing = false,
}) => {
  const colors = getToastColors(type);

  return (
    <Box
      sx={{
        position: 'fixed',
        bottom: 24,
        right: 24,
        minWidth: 300,
        maxWidth: 400,
        backgroundColor: colors.bg,
        borderRadius: 2,
        boxShadow: `0 8px 16px ${colors.bg}40`,
        padding: 2,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 2,
        animation: `${isClosing ? slideOut : slideIn} 0.3s cubic-bezier(0.4, 0, 0.2, 1)`,
        border: `2px solid ${colors.border}`,
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `linear-gradient(135deg, ${colors.bg}20, transparent)`,
          borderRadius: 'inherit',
          pointerEvents: 'none',
        },
      }}
    >
      <Typography
        variant="body1"
        sx={{
          color: colors.text,
          fontWeight: 500,
          flex: 1,
          textShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
        }}
      >
        {message}
      </Typography>
      <IconButton
        size="small"
        onClick={onClose}
        sx={{
          color: colors.text,
          opacity: 0.8,
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            opacity: 1,
            transform: 'rotate(90deg)',
          },
        }}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
    </Box>
  );
}; 