import React from 'react';
import { Box, Tooltip, keyframes } from '@mui/material';
import { pickleballColors } from '@/styles/theme';

const pulse = keyframes`
  0%, 100% {
    transform: scale(1);
    opacity: 0.8;
  }
  50% {
    transform: scale(1.05);
    opacity: 1;
  }
`;

interface CourtDiagramProps {
  isAvailable?: boolean;
  isSelected?: boolean;
  onClick?: () => void;
  width?: number | string;
  height?: number | string;
}

export const CourtDiagram: React.FC<CourtDiagramProps> = ({
  isAvailable = true,
  isSelected = false,
  onClick,
  width = 300,
  height = 150,
}) => {
  const getCourtColor = () => {
    if (!isAvailable) return '#CBD5E1';
    if (isSelected) return pickleballColors.accent.main;
    return pickleballColors.court.main;
  };

  return (
    <Tooltip
      title={isAvailable ? 'Click to select court' : 'Court not available'}
      arrow
    >
      <Box
        onClick={isAvailable ? onClick : undefined}
        sx={{
          width,
          height,
          position: 'relative',
          cursor: isAvailable ? 'pointer' : 'not-allowed',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          transform: isSelected ? 'scale(1.02)' : 'scale(1)',
          '&:hover': isAvailable
            ? {
                transform: 'scale(1.05)',
                '& .court-lines': {
                  opacity: 1,
                },
              }
            : {},
        }}
      >
        {/* Court Base */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: getCourtColor(),
            borderRadius: 2,
            boxShadow: isSelected
              ? `0 8px 24px ${pickleballColors.accent.main}40`
              : '0 4px 12px rgba(0, 0, 0, 0.1)',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: `linear-gradient(135deg, ${
                isAvailable ? 'rgba(255, 255, 255, 0.1)' : 'transparent'
              }, transparent)`,
              borderRadius: 'inherit',
            },
          }}
        />

        {/* Court Lines */}
        <Box
          className="court-lines"
          sx={{
            position: 'absolute',
            top: '10%',
            left: '10%',
            right: '10%',
            bottom: '10%',
            opacity: 0.8,
            transition: 'opacity 0.3s ease-in-out',
          }}
        >
          {/* Center Line */}
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: 0,
              right: 0,
              height: 2,
              backgroundColor: 'white',
              transform: 'translateY(-50%)',
            }}
          />

          {/* Non-Volley Zone Lines */}
          <Box
            sx={{
              position: 'absolute',
              top: '30%',
              bottom: '30%',
              left: '20%',
              width: 2,
              backgroundColor: 'white',
            }}
          />
          <Box
            sx={{
              position: 'absolute',
              top: '30%',
              bottom: '30%',
              right: '20%',
              width: 2,
              backgroundColor: 'white',
            }}
          />
          <Box
            sx={{
              position: 'absolute',
              top: '30%',
              left: '20%',
              right: '20%',
              height: 2,
              backgroundColor: 'white',
            }}
          />
          <Box
            sx={{
              position: 'absolute',
              bottom: '30%',
              left: '20%',
              right: '20%',
              height: 2,
              backgroundColor: 'white',
            }}
          />
        </Box>

        {/* Availability Indicator */}
        {isAvailable && !isSelected && (
          <Box
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
              width: 12,
              height: 12,
              borderRadius: '50%',
              backgroundColor: pickleballColors.accent.main,
              animation: `${pulse} 2s ease-in-out infinite`,
              boxShadow: `0 0 12px ${pickleballColors.accent.main}80`,
            }}
          />
        )}
      </Box>
    </Tooltip>
  );
}; 