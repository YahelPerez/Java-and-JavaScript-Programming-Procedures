import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { 
  Box, 
  Tabs, 
  Tab,
  Paper
} from '@mui/material'
import {
  Dashboard as DashboardIcon,
  Event as ReservationsIcon,
  LocationCity as CitiesIcon,
  AccountTree as GraphIcon
} from '@mui/icons-material'

const Navigation: React.FC = () => {
  const location = useLocation()
  const navigate = useNavigate()
  
  const currentTab = location.pathname

  const handleTabChange = (_event: React.SyntheticEvent, newValue: string) => {
    navigate(newValue)
  }

  return (
    <Paper elevation={1} sx={{ mb: 3 }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs 
          value={currentTab} 
          onChange={handleTabChange}
          aria-label="navigation tabs"
          variant="fullWidth"
        >
          <Tab 
            icon={<DashboardIcon />} 
            label="Dashboard" 
            value="/dashboard" 
          />
          <Tab 
            icon={<ReservationsIcon />} 
            label="Reservations" 
            value="/reservations" 
          />
          <Tab 
            icon={<CitiesIcon />} 
            label="Cities" 
            value="/cities" 
          />
          <Tab 
            icon={<GraphIcon />} 
            label="Graph" 
            value="/graph" 
          />
        </Tabs>
      </Box>
    </Paper>
  )
}

export default Navigation