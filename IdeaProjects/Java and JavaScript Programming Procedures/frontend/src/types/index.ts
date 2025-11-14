// Type definitions for Reservation system
export interface Reservation {
  id?: number;
  customerName: string;
  reservationDate: string;
  status: ReservationStatus;
  cityId: number;
  numberOfGuests: number;
}

export enum ReservationStatus {
  CONFIRMED = 'CONFIRMED',
  PENDING = 'PENDING',
  CANCELLED = 'CANCELLED'
}

// Type definitions for Graph system
export interface City {
  id: number;
  name: string;
  description?: string;
  coordinates?: {
    x: number;
    y: number;
  };
}

export interface Distance {
  id?: number;
  fromCityId: number;
  toCityId: number;
  distance: number;
  fromCity?: City;
  toCity?: City;
}

export interface GraphEdge {
  source: number;
  target: number;
  weight: number;
}

export interface GraphData {
  nodes: City[];
  edges: GraphEdge[];
}

// API Response types
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

export interface PaginatedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}