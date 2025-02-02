import { motion } from 'framer-motion';
import { styled } from '@mui/material/styles';
import { Box, CircularProgress } from '@mui/material';

// Page transition variants
export const pageVariants = {
  initial: {
    opacity: 0,
    y: 20
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.6, -0.05, 0.01, 0.99]
    }
  },
  exit: {
    opacity: 0,
    y: -20
  }
};

// Stagger children animation
export const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

// Fade up animation for items
export const fadeUpVariant = {
  initial: {
    opacity: 0,
    y: 20
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.6, -0.05, 0.01, 0.99]
    }
  }
};

// Styled motion components
export const MotionBox = styled(motion(Box))`
  will-change: transform;
  transform: translateZ(0);
  backface-visibility: hidden;
`;

// Loading spinner with animation
export const LoadingSpinner = () => (
  <Box
    sx={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '200px'
    }}
  >
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        duration: 0.5,
        ease: [0.6, -0.05, 0.01, 0.99]
      }}
    >
      <CircularProgress />
    </motion.div>
  </Box>
);

// Swipe animation for calendar
export const calendarSwipeVariants = {
  initial: { x: "100%" },
  animate: { x: 0 },
  exit: { x: "-100%" },
  transition: {
    type: "spring",
    stiffness: 300,
    damping: 30
  }
};

// Hover animation for cards
export const CardContainer = styled(motion.div)`
  cursor: pointer;
  transform-origin: center center;
  
  &:hover {
    transform: translateY(-4px) rotate(0.5deg);
  }
`;

// Time slot animation
export const TimeSlotContainer = styled(motion.div)`
  scroll-snap-align: center;
  -webkit-overflow-scrolling: touch;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    height: 2px;
    background: currentColor;
    transform: scaleX(0);
    transition: transform 0.2s ease;
  }
  
  &.selected::after {
    transform: scaleX(1);
  }
`;

// Layout animation wrapper
export const AnimatedLayout = styled(motion.div)`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
  transition: all 0.3s ease;
  
  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (min-width: 1024px) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

// Page wrapper with animations
export const PageWrapper = ({ children }: { children: React.ReactNode }) => (
  <motion.div
    initial="initial"
    animate="animate"
    exit="exit"
    variants={pageVariants}
  >
    {children}
  </motion.div>
);

// Accessibility wrapper that respects user preferences
export const AccessibleAnimationWrapper = styled(motion.div)`
  @media (prefers-reduced-motion: reduce) {
    * {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
      scroll-behavior: auto !important;
    }
  }
`; 