import React, { useState, useEffect } from 'react'
import {
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
  Chip,
  IconButton,
  Alert,
  CircularProgress
} from '@mui/material'
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon
} from '@mui/icons-material'
import { reservationService } from '../services/reservationService'
import { graphService } from '../services/graphService'
import { Reservation, ReservationStatus, City } from '../types'

const Reservations: React.FC = () => {
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [cities, setCities] = useState<City[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingReservation, setEditingReservation] = useState<Reservation | null>(null)
  const [formData, setFormData] = useState({
    customerName: '',
    reservationDate: '',
    status: ReservationStatus.PENDING,
    cityId: '',
    numberOfGuests: ''
  })

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      setError(null)
      const [reservationsData, citiesData] = await Promise.all([
        reservationService.getAllReservations(),
        graphService.getAllCities()
      ])
      setReservations(reservationsData)
      setCities(citiesData)
    } catch (err) {
      console.error('Error loading data:', err)
      setError('Failed to load reservations data')
    } finally {
      setLoading(false)
    }
  }

  const getCityName = (cityId: number) => {
    const city = cities.find(c => c.id === cityId)
    return city ? city.name : `City ${cityId}`
  }

  const getStatusColor = (status: ReservationStatus) => {
    switch (status) {
      case ReservationStatus.CONFIRMED:
        return 'success'
      case ReservationStatus.PENDING:
        return 'warning'
      case ReservationStatus.CANCELLED:
        return 'error'
      default:
        return 'default'
    }
  }

  const handleOpenDialog = (reservation?: Reservation) => {
    if (reservation) {
      setEditingReservation(reservation)
      setFormData({
        customerName: reservation.customerName,
        reservationDate: reservation.reservationDate,
        status: reservation.status,
        cityId: reservation.cityId.toString(),
        numberOfGuests: reservation.numberOfGuests.toString()
      })
    } else {
      setEditingReservation(null)
      setFormData({
        customerName: '',
        reservationDate: new Date().toISOString().split('T')[0],
        status: ReservationStatus.PENDING,
        cityId: '',
        numberOfGuests: ''
      })
    }
    setDialogOpen(true)
  }

  const handleCloseDialog = () => {
    setDialogOpen(false)
    setEditingReservation(null)
  }

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = async () => {
    try {
      const reservationData = {
        customerName: formData.customerName,
        reservationDate: formData.reservationDate,
        status: formData.status,
        cityId: parseInt(formData.cityId),
        numberOfGuests: parseInt(formData.numberOfGuests)
      }

      if (editingReservation) {
        await reservationService.updateReservation(editingReservation.id!, reservationData)
      } else {
        await reservationService.createReservation(reservationData)
      }

      handleCloseDialog()
      loadData()
    } catch (err) {
      console.error('Error saving reservation:', err)
      setError('Failed to save reservation')
    }
  }

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this reservation?')) {
      try {
        await reservationService.deleteReservation(id)
        loadData()
      } catch (err) {
        console.error('Error deleting reservation:', err)
        setError('Failed to delete reservation')
      }
    }
  }

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    )
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1">
          Reservations
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Add Reservation
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Customer Name</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>City</TableCell>
              <TableCell>Guests</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {reservations.map((reservation) => (
              <TableRow key={reservation.id}>
                <TableCell>{reservation.id}</TableCell>
                <TableCell>{reservation.customerName}</TableCell>
                <TableCell>{reservation.reservationDate}</TableCell>
                <TableCell>{getCityName(reservation.cityId)}</TableCell>
                <TableCell>{reservation.numberOfGuests}</TableCell>
                <TableCell>
                  <Chip
                    label={reservation.status}
                    color={getStatusColor(reservation.status)}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <IconButton
                    size="small"
                    onClick={() => handleOpenDialog(reservation)}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    size="small"
                    color="error"
                    onClick={() => handleDelete(reservation.id!)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingReservation ? 'Edit Reservation' : 'Add New Reservation'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <TextField
              fullWidth
              label="Customer Name"
              value={formData.customerName}
              onChange={(e) => handleInputChange('customerName', e.target.value)}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Reservation Date"
              type="date"
              value={formData.reservationDate}
              onChange={(e) => handleInputChange('reservationDate', e.target.value)}
              margin="normal"
              InputLabelProps={{ shrink: true }}
            />
            <FormControl fullWidth margin="normal">
              <InputLabel>City</InputLabel>
              <Select
                value={formData.cityId}
                onChange={(e) => handleInputChange('cityId', e.target.value)}
              >
                {cities.map((city) => (
                  <MenuItem key={city.id} value={city.id.toString()}>
                    {city.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              fullWidth
              label="Number of Guests"
              type="number"
              value={formData.numberOfGuests}
              onChange={(e) => handleInputChange('numberOfGuests', e.target.value)}
              margin="normal"
            />
            <FormControl fullWidth margin="normal">
              <InputLabel>Status</InputLabel>
              <Select
                value={formData.status}
                onChange={(e) => handleInputChange('status', e.target.value)}
              >
                {Object.values(ReservationStatus).map((status) => (
                  <MenuItem key={status} value={status}>
                    {status}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editingReservation ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default Reservations