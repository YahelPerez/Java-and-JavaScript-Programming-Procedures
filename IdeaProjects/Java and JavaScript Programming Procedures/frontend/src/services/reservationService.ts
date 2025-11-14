import axios from 'axios'
import { Reservation, ReservationStatus } from '../types'

// Mock data for demo
const mockReservations: Reservation[] = [
  {
    id: 1,
    customerName: 'Juan Pérez',
    reservationDate: '2025-12-15',
    status: ReservationStatus.CONFIRMED,
    cityId: 1,
    numberOfGuests: 4
  },
  {
    id: 2,
    customerName: 'María González',
    reservationDate: '2025-12-20',
    status: ReservationStatus.PENDING,
    cityId: 2,
    numberOfGuests: 2
  },
  {
    id: 3,
    customerName: 'Carlos Rodríguez',
    reservationDate: '2025-12-25',
    status: ReservationStatus.CONFIRMED,
    cityId: 3,
    numberOfGuests: 6
  },
  {
    id: 4,
    customerName: 'Ana Martínez',
    reservationDate: '2025-11-30',
    status: ReservationStatus.CANCELLED,
    cityId: 4,
    numberOfGuests: 3
  },
  {
    id: 5,
    customerName: 'Luis Hernández',
    reservationDate: '2025-12-10',
    status: ReservationStatus.CONFIRMED,
    cityId: 5,
    numberOfGuests: 8
  }
]

const reservationAPI = axios.create({
  baseURL: 'http://localhost:8080/api/reservations',
  headers: {
    'Content-Type': 'application/json',
  },
})

export const reservationService = {
  // Get all reservations
  getAllReservations: async (): Promise<Reservation[]> => {
    try {
      const response = await reservationAPI.get('/')
      return response.data
    } catch (error) {
      console.warn('API not available, using mock data')
      return mockReservations
    }
  },

  // Get reservation by ID
  getReservationById: async (id: number): Promise<Reservation> => {
    const response = await reservationAPI.get(`/${id}`)
    return response.data
  },

  // Create new reservation
  createReservation: async (reservation: Omit<Reservation, 'id'>): Promise<Reservation> => {
    const response = await reservationAPI.post('/', reservation)
    return response.data
  },

  // Update reservation
  updateReservation: async (id: number, reservation: Partial<Reservation>): Promise<Reservation> => {
    const response = await reservationAPI.put(`/${id}`, reservation)
    return response.data
  },

  // Delete reservation
  deleteReservation: async (id: number): Promise<void> => {
    await reservationAPI.delete(`/${id}`)
  },

  // Get reservations by status
  getReservationsByStatus: async (status: ReservationStatus): Promise<Reservation[]> => {
    const response = await reservationAPI.get(`/status/${status}`)
    return response.data
  },

  // Get reservations by city
  getReservationsByCity: async (cityId: number): Promise<Reservation[]> => {
    const response = await reservationAPI.get(`/city/${cityId}`)
    return response.data
  }
}