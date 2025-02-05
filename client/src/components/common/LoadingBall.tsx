import React from 'react';
import { Box, keyframes } from '@mui/material';
import { pickleballColors } from '@/styles/theme';

const bounce = keyframes`
  0%, 100% {
    transform: translateY(0) rotate(0deg);
  }
  50% {
    transform: translateY(-20px) rotate(180deg);
  }
`;

const spin = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

interface LoadingBallProps {
  size?: number;
  color?: string;
}

export const LoadingBall: React.FC<LoadingBallProps> = ({
  size = 40,
  color = pickleballColors.ball.main,
}) => {
  return (
    <Box
      sx={{
        width: size,
        height: size,
        position: 'relative',
        animation: `${bounce} 1s ease-in-out infinite`,
      }}
    >
      <Box
        sx={{
          width: '100%',
          height: '100%',
          borderRadius: '50%',
          background: `linear-gradient(135deg, ${color}, ${pickleballColors.ball.light})`,
          position: 'relative',
          animation: `${spin} 1s linear infinite`,
          boxShadow: `0 4px 12px ${color}40`,
          '&::before': {
            content: '""',
            position: 'absolute',
            top: '10%',
            left: '10%',
            width: '80%',
            height: '80%',
            borderRadius: '50%',
            background: `linear-gradient(135deg, transparent, ${color}40)`,
          },
          '&::after': {
            content: '""',
            position: 'absolute',
            top: '20%',
            left: '20%',
            width: '20%',
            height: '20%',
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.8)',
            filter: 'blur(2px)',
          },
        }}
      />
    </Box>
  );
}; 