import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import App from '../App'

const theme = createTheme()

const renderWithProviders = (component: React.ReactElement) => {
  return render(
    <MemoryRouter initialEntries={['/dashboard']}>
      <ThemeProvider theme={theme}>
        {component}
      </ThemeProvider>
    </MemoryRouter>
  )
}

describe('App Component', () => {
  test('renders main application', () => {
    renderWithProviders(<App />)
    expect(screen.getByText('Reservation Graph System')).toBeInTheDocument()
  })

  test('renders application structure', () => {
    renderWithProviders(<App />)
    const appElement = document.querySelector('.MuiBox-root')
    expect(appElement).toBeInTheDocument()
  })
})