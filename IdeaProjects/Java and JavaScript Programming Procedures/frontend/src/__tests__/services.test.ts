import { reservationService } from '../services/reservationService'
import { graphService } from '../services/graphService'

describe('Services', () => {
  test('services are defined', () => {
    expect(reservationService).toBeDefined()
    expect(graphService).toBeDefined()
  })

  test('services have required methods', () => {
    expect(typeof reservationService.getAllReservations).toBe('function')
    expect(typeof graphService.getAllCities).toBe('function')
    expect(typeof graphService.getAllDistances).toBe('function')
  })
})