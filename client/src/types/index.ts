export type User = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  membershipLevel: string;
  role: UserRole;
  rating?: number;
  preferences?: Record<string, unknown>;
  isActive: boolean;
};

export enum UserRole {
  ADMIN = 'ADMIN',
  STAFF = 'STAFF',
  MEMBER = 'MEMBER',
  GUEST = 'GUEST'
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export type Court = {
  id: string;
  name: string;
  type: string;
  isIndoor: boolean;
  status: CourtStatus;
  maintenanceSchedule?: Record<string, unknown>;
  hourlyRate: number;
  peakHourRate: number;
};

export enum CourtStatus {
  AVAILABLE = 'AVAILABLE',
  OCCUPIED = 'OCCUPIED',
  MAINTENANCE = 'MAINTENANCE',
  CLOSED = 'CLOSED'
}

export type Booking = {
  id: string;
  courtId: string;
  userId: string;
  startTime: string;
  endTime: string;
  status: BookingStatus;
  paymentStatus: PaymentStatus;
  totalAmount: number;
  court?: Court;
  user?: User;
};

export enum BookingStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  CANCELLED = 'CANCELLED',
  COMPLETED = 'COMPLETED'
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  REFUNDED = 'REFUNDED'
}

export type Payment = {
  id: string;
  bookingId: string;
  userId: string;
  amount: number;
  status: PaymentStatus;
  paymentMethod: string;
  transactionId?: string;
  createdAt: string;
};

export type AuthResponse = {
  token: string;
  user: User;
};

export type ApiError = {
  message: string;
  code?: string;
  status?: number;
}; 