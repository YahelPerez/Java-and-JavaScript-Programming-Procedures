import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { Container, AppBar, Toolbar, Typography, Box } from '@mui/material'
import Navigation from './components/Navigation'
import Dashboard from './pages/Dashboard'
import Reservations from './pages/Reservations'
import Cities from './pages/Cities'
import GraphVisualization from './pages/GraphVisualization'

function App() {
  return (
    <div>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Reservation Graph System
            </Typography>
          </Toolbar>
        </AppBar>
        
        <Navigation />
        
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/reservations" element={<Reservations />} />
            <Route path="/cities" element={<Cities />} />
            <Route path="/graph" element={<GraphVisualization />} />
          </Routes>
        </Container>
      </Box>
    </div>
  )
}

export default App