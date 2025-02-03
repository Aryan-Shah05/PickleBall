import { io, Socket } from 'socket.io-client';
import { Booking, Court, CourtStatus } from '@/types';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:4000';

type SocketEventMap = {
  'court:subscribe': string;
  'court:unsubscribe': string;
  'booking:subscribe': string;
  'booking:unsubscribe': string;
  'booking:update': Booking;
  'court:update': Court;
};

type SocketEventCallback<T> = (data: T) => void;

class SocketService {
  private socket: Socket | null = null;
  private listeners: Map<keyof SocketEventMap, SocketEventCallback<any>[]> = new Map();

  connect() {
    if (!this.socket) {
      this.socket = io(SOCKET_URL, {
        transports: ['websocket'],
        autoConnect: true,
      });

      this.socket.on('connect_error', (error) => {
        console.error('Socket connection error:', error);
      });
    }
    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  on<K extends keyof SocketEventMap>(event: K, callback: SocketEventCallback<SocketEventMap[K]>): void {
    const eventListeners = this.listeners.get(event) || [];
    eventListeners.push(callback);
    this.listeners.set(event, eventListeners);
  }

  off<K extends keyof SocketEventMap>(event: K, callback: SocketEventCallback<SocketEventMap[K]>): void {
    const eventListeners = this.listeners.get(event) || [];
    const filteredListeners = eventListeners.filter((listener) => listener !== callback);
    this.listeners.set(event, filteredListeners);
  }

  private emit<K extends keyof SocketEventMap>(event: K, data: SocketEventMap[K]): void {
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

  onBookingUpdate(callback: SocketEventCallback<Booking>): void {
    this.socket?.on('booking:update', callback);
  }

  offBookingUpdate(callback: SocketEventCallback<Booking>): void {
    this.socket?.off('booking:update', callback);
  }
}

export default new SocketService();