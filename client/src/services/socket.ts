import { io, Socket } from 'socket.io-client';
import { Booking, Court } from '@/types';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:4000';

interface ServerToClientEvents {
  'booking:update': (data: Booking) => void;
  'court:update': (data: Court) => void;
  'connect_error': (error: Error) => void;
}

interface ClientToServerEvents {
  'court:subscribe': (courtId: string) => void;
  'court:unsubscribe': (courtId: string) => void;
  'booking:subscribe': (bookingId: string) => void;
  'booking:unsubscribe': (bookingId: string) => void;
}

type SocketEventCallback<T> = (data: T) => void;

class SocketService {
  private socket: Socket<ServerToClientEvents, ClientToServerEvents> | null = null;
  private listeners: Map<keyof ServerToClientEvents, Function[]> = new Map();

  connect(): Socket<ServerToClientEvents, ClientToServerEvents> | null {
    if (!this.socket) {
      this.socket = io(SOCKET_URL, {
        transports: ['websocket'],
        autoConnect: true,
      });

      this.socket.on('connect_error', (error: Error) => {
        console.error('Socket connection error:', error);
      });
    }
    return this.socket;
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  on<K extends keyof ServerToClientEvents>(event: K, callback: SocketEventCallback<ServerToClientEvents[K]>): void {
    const eventListeners = this.listeners.get(event) || [];
    eventListeners.push(callback);
    this.listeners.set(event, eventListeners);
  }

  off<K extends keyof ServerToClientEvents>(event: K, callback: SocketEventCallback<ServerToClientEvents[K]>): void {
    const eventListeners = this.listeners.get(event) || [];
    const filteredListeners = eventListeners.filter((listener) => listener !== callback);
    this.listeners.set(event, filteredListeners);
  }

  private emit<K extends keyof ServerToClientEvents>(event: K, data: ServerToClientEvents[K]): void {
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

  onBookingUpdate(callback: (booking: Booking) => void): void {
    this.socket?.on('booking:update', callback);
  }

  offBookingUpdate(callback: (booking: Booking) => void): void {
    this.socket?.off('booking:update', callback);
  }
}

export default new SocketService();