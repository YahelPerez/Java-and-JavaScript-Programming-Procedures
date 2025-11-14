import React, { useState, useEffect } from 'react'
import {
  Typography,
  Grid,
  Card,
  CardContent,
  Box,
  CircularProgress,
  Alert
} from '@mui/material'
import {
  Event as EventIcon,
  LocationCity as CityIcon,
  TrendingUp as TrendingIcon,
  CheckCircle as CheckIcon
} from '@mui/icons-material'
import { reservationService } from '../services/reservationService'
import { graphService } from '../services/graphService'
import { Reservation, City, ReservationStatus } from '../types'

interface DashboardStats {
  totalReservations: number;
  confirmedReservations: number;
  totalCities: number;
  recentReservations: Reservation[];
}

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      setLoading(true)
      setError(null)

      const [reservations, cities] = await Promise.all([
        reservationService.getAllReservations(),
        graphService.getAllCities()
      ])

      const confirmedReservations = reservations.filter(
        r => r.status === ReservationStatus.CONFIRMED
      ).length

      const recentReservations = reservations
        .sort((a, b) => new Date(b.reservationDate).getTime() - new Date(a.reservationDate).getTime())
        .slice(0, 5)

      setStats({
        totalReservations: reservations.length,
        confirmedReservations,
        totalCities: cities.length,
        recentReservations
      })
    } catch (err) {
      console.error('Error loading dashboard data:', err)
      setError('Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    )
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        {error}
      </Alert>
    )
  }

  if (!stats) {
    return null
  }

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Dashboard
      </Typography>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <EventIcon color="primary" sx={{ mr: 2, fontSize: 40 }} />
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Total Reservations
                  </Typography>
                  <Typography variant="h5">
                    {stats.totalReservations}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <CheckIcon color="success" sx={{ mr: 2, fontSize: 40 }} />
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Confirmed Reservations
                  </Typography>
                  <Typography variant="h5">
                    {stats.confirmedReservations}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <CityIcon color="info" sx={{ mr: 2, fontSize: 40 }} />
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Total Cities
                  </Typography>
                  <Typography variant="h5">
                    {stats.totalCities}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <TrendingIcon color="secondary" sx={{ mr: 2, fontSize: 40 }} />
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Confirmation Rate
                  </Typography>
                  <Typography variant="h5">
                    {stats.totalReservations > 0 
                      ? Math.round((stats.confirmedReservations / stats.totalReservations) * 100) 
                      : 0}%
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Card>
        <CardContent>
          <Typography variant="h6" component="h2" gutterBottom>
            Recent Reservations
          </Typography>
          {stats.recentReservations.length === 0 ? (
            <Typography color="textSecondary">
              No reservations found
            </Typography>
          ) : (
            <Box>
              {stats.recentReservations.map((reservation) => (
                <Box
                  key={reservation.id}
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  py={1}
                  borderBottom="1px solid #eee"
                >
                  <Box>
                    <Typography variant="body1">
                      {reservation.customerName}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {reservation.reservationDate} - {reservation.numberOfGuests} guests
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      px: 2,
                      py: 0.5,
                      borderRadius: 1,
                      backgroundColor:
                        reservation.status === ReservationStatus.CONFIRMED
                          ? 'success.light'
                          : reservation.status === ReservationStatus.PENDING
                          ? 'warning.light'
                          : 'error.light',
                      color:
                        reservation.status === ReservationStatus.CONFIRMED
                          ? 'success.contrastText'
                          : reservation.status === ReservationStatus.PENDING
                          ? 'warning.contrastText'
                          : 'error.contrastText',
                    }}
                  >
                    <Typography variant="caption">
                      {reservation.status}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Box>
          )}
        </CardContent>
      </Card>
    </Box>
  )
}

export default Dashboard