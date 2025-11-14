import { render, screen, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import Dashboard from '../pages/Dashboard'

// Mock the services
jest.mock('../services/reservationService', () => ({
  reservationService: {
    getAllReservations: jest.fn().mockResolvedValue([
      {
        id: 1,
        customerName: 'Test Customer',
        reservationDate: '2025-12-15',
        status: 'CONFIRMED',
        cityId: 1,
        numberOfGuests: 4
      }
    ])
  }
}))

jest.mock('../services/graphService', () => ({
  graphService: {
    getAllCities: jest.fn().mockResolvedValue([
      { id: 1, name: 'Test City', description: 'Test Description' }
    ])
  }
}))

const renderWithRouter = (component: React.ReactElement) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  )
}

describe('Dashboard Component', () => {
  test('renders dashboard component', () => {
    renderWithRouter(<Dashboard />)
    // Just check that the dashboard renders without crashing
    expect(document.body).toBeInTheDocument()
  })

  test('displays basic structure', async () => {
    renderWithRouter(<Dashboard />)
    await waitFor(() => {
      // Check for any MUI elements that should be present
      const muiElements = document.querySelectorAll('[class*="Mui"]')
      expect(muiElements.length).toBeGreaterThan(0)
    })
  })
})