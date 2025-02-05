import React from 'react';
import { Box, Typography, LinearProgress } from '@mui/material';
import { pickleballColors } from '@/styles/theme';

interface ProgressScoreProps {
  currentStep: number;
  totalSteps: number;
  label?: string;
}

export const ProgressScore: React.FC<ProgressScoreProps> = ({
  currentStep,
  totalSteps,
  label,
}) => {
  const progress = (currentStep / totalSteps) * 100;

  return (
    <Box sx={{ width: '100%' }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 1,
        }}
      >
        {label && (
          <Typography
            variant="body2"
            sx={{
              color: pickleballColors.court.main,
              fontWeight: 600,
            }}
          >
            {label}
          </Typography>
        )}
        <Typography
          variant="body2"
          sx={{
            color: pickleballColors.court.main,
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: 0.5,
          }}
        >
          <Box
            component="span"
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 24,
              height: 24,
              borderRadius: '50%',
              backgroundColor: pickleballColors.court.main,
              color: pickleballColors.court.contrastText,
              fontSize: '0.75rem',
              fontWeight: 700,
            }}
          >
            {currentStep}
          </Box>
          <Box component="span" sx={{ opacity: 0.5 }}>
            /
          </Box>
          <Box component="span" sx={{ opacity: 0.7 }}>
            {totalSteps}
          </Box>
        </Typography>
      </Box>

      <Box sx={{ position: 'relative' }}>
        <LinearProgress
          variant="determinate"
          value={progress}
          sx={{
            height: 8,
            borderRadius: 4,
            backgroundColor: `${pickleballColors.court.light}20`,
            '& .MuiLinearProgress-bar': {
              borderRadius: 4,
              backgroundImage: `linear-gradient(90deg, ${pickleballColors.court.main}, ${pickleballColors.accent.main})`,
            },
          }}
        />

        {/* Progress Points */}
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: 0,
            right: 0,
            transform: 'translateY(-50%)',
            display: 'flex',
            justifyContent: 'space-between',
            padding: '0 4px',
          }}
        >
          {Array.from({ length: totalSteps }).map((_, index) => {
            const isCompleted = index < currentStep;
            const isCurrent = index === currentStep - 1;

            return (
              <Box
                key={index}
                sx={{
                  width: 16,
                  height: 16,
                  borderRadius: '50%',
                  backgroundColor: isCompleted
                    ? pickleballColors.accent.main
                    : pickleballColors.court.light,
                  border: `2px solid ${
                    isCurrent
                      ? pickleballColors.accent.main
                      : isCompleted
                      ? pickleballColors.accent.light
                      : 'white'
                  }`,
                  transform: isCurrent ? 'scale(1.2)' : 'scale(1)',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  boxShadow: isCurrent
                    ? `0 0 0 4px ${pickleballColors.accent.main}20`
                    : 'none',
                  zIndex: isCurrent ? 2 : 1,
                }}
              />
            );
          })}
        </Box>
      </Box>
    </Box>
  );
}; 