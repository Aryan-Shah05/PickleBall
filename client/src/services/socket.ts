import { io, Socket } from 'socket.io-client';
import { Booking, Court, CourtStatus } from '@/types';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'ws://localhost:4000';

class SocketService {
  private socket: Socket | null = null;
  private listeners: Map<string, Function[]> = new Map();

  connect(token: string): void {
    if (this.socket?.connected) return;

    this.socket = io(SOCKET_URL, {
      auth: {
        token,
      },
      transports: ['websocket'],
    });

    this.setupListeners();
  }

  private setupListeners(): void {
    if (!this.socket) return;

    this.socket.on('connect', () => {
      console.info('Socket connected');
    });

    this.socket.on('disconnect', () => {
      console.info('Socket disconnected');
    });

    this.socket.on('error', (error: Error) => {
      console.error('Socket error:', error);
    });

    // Court status updates
    this.socket.on('court:status', (data: { courtId: string; status: CourtStatus }) => {
      this.emit('courtStatus', data);
    });

    // Booking updates
    this.socket.on('booking:created', (booking: Booking) => {
      this.emit('bookingCreated', booking);
    });

    this.socket.on('booking:updated', (booking: Booking) => {
      this.emit('bookingUpdated', booking);
    });

    this.socket.on('booking:cancelled', (bookingId: string) => {
      this.emit('bookingCancelled', bookingId);
    });
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  on(event: string, callback: Function): void {
    const eventListeners = this.listeners.get(event) || [];
    eventListeners.push(callback);
    this.listeners.set(event, eventListeners);
  }

  off(event: string, callback: Function): void {
    const eventListeners = this.listeners.get(event) || [];
    const filteredListeners = eventListeners.filter((listener) => listener !== callback);
    this.listeners.set(event, filteredListeners);
  }

  private emit(event: string, data: unknown): void {
    const eventListeners = this.listeners.get(event) || [];
    eventListeners.forEach((listener) => listener(data));
  }

  // Court-related methods
  subscribeToCourtUpdates(courtId: string): void {
    this.socket?.emit('court:subscribe', courtId);
  }

  unsubscribeFromCourtUpdates(courtId: string): void {
    this.socket?.emit('court:unsubscribe', courtId);
  }

  // Booking-related methods
  subscribeToBookingUpdates(bookingId: string): void {
    this.socket?.emit('booking:subscribe', bookingId);
  }

  unsubscribeFromBookingUpdates(bookingId: string): void {
    this.socket?.emit('booking:unsubscribe', bookingId);
  }
}

export const socketService = new SocketService();