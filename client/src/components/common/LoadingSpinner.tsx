import React from 'react';
import { Box, Typography, keyframes } from '@mui/material';
import { SportsTennis } from '@mui/icons-material';

// Keyframe animations
const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const bounce = keyframes`
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-10px) rotate(180deg); }
`;

const slideIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

interface LoadingSpinnerProps {
  message?: string;
  size?: number;
  minHeight?: string | number;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  message = 'Loading...', 
  size = 60,
  minHeight = '80vh'
}) => (
  <Box 
    display="flex" 
    flexDirection="column" 
    alignItems="center" 
    justifyContent="center" 
    minHeight={minHeight}
    gap={2}
  >
    <Box
      sx={{
        position: 'relative',
        width: size,
        height: size,
        '&::before': {
          content: '""',
          position: 'absolute',
          width: '100%',
          height: '100%',
          borderRadius: '50%',
          border: '3px solid',
          borderColor: '#F6E05E20',
          borderTopColor: '#F6E05E',
          animation: `${spin} 1s linear infinite`,
        },
      }}
    >
      <SportsTennis 
        sx={{ 
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          color: '#F6E05E',
          fontSize: size / 2,
          animation: `${bounce} 2s ease-in-out infinite`,
        }} 
      />
    </Box>
    <Typography 
      variant="body1" 
      sx={{ 
        color: '#F6E05E',
        animation: `${slideIn} 0.5s ease-out`,
        fontWeight: 500,
      }}
    >
      {message}
    </Typography>
  </Box>
); 