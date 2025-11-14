import React, { useState, useEffect } from 'react'
import {
  Typography,
  Paper,
  Box,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Card,
  CardContent,
  Alert,
  CircularProgress
} from '@mui/material'
import { Route as RouteIcon } from '@mui/icons-material'
import { graphService } from '../services/graphService'
import { City, GraphData, Distance } from '../types'

const GraphVisualization: React.FC = () => {
  const [cities, setCities] = useState<City[]>([])
  const [distances, setDistances] = useState<Distance[]>([])
  const [graphData, setGraphData] = useState<GraphData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [fromCity, setFromCity] = useState<number | ''>('')
  const [toCity, setToCity] = useState<number | ''>('')
  const [shortestPath, setShortestPath] = useState<{
    path: number[],
    totalDistance: number,
    cities: City[]
  } | null>(null)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const [citiesData, distancesData, graphDataResult] = await Promise.all([
        graphService.getAllCities(),
        graphService.getAllDistances(),
        graphService.getGraphData()
      ])
      
      setCities(citiesData)
      setDistances(distancesData)
      setGraphData(graphDataResult)
    } catch (err) {
      console.error('Error loading graph data:', err)
      setError('Failed to load graph data')
    } finally {
      setLoading(false)
    }
  }

  const handleFindShortestPath = async () => {
    if (fromCity === '' || toCity === '') return
    
    try {
      setError(null)
      const pathResult = await graphService.getShortestPath(fromCity as number, toCity as number)
      setShortestPath(pathResult)
    } catch (err) {
      console.error('Error finding shortest path:', err)
      setError('Failed to find shortest path')
      setShortestPath(null)
    }
  }

  const getCityName = (cityId: number) => {
    const city = cities.find(c => c.id === cityId)
    return city ? city.name : `City ${cityId}`
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
      <Typography variant="h4" component="h1" gutterBottom>
        Graph Visualization
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Shortest Path Finder */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Find Shortest Path
              </Typography>
              
              <Box sx={{ mb: 2 }}>
                <FormControl fullWidth margin="normal">
                  <InputLabel>From City</InputLabel>
                  <Select
                    value={fromCity}
                    onChange={(e) => setFromCity(e.target.value as number)}
                  >
                    {cities.map((city) => (
                      <MenuItem key={city.id} value={city.id}>
                        {city.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <FormControl fullWidth margin="normal">
                  <InputLabel>To City</InputLabel>
                  <Select
                    value={toCity}
                    onChange={(e) => setToCity(e.target.value as number)}
                  >
                    {cities.map((city) => (
                      <MenuItem key={city.id} value={city.id}>
                        {city.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <Button
                  variant="contained"
                  startIcon={<RouteIcon />}
                  onClick={handleFindShortestPath}
                  disabled={fromCity === '' || toCity === ''}
                  fullWidth
                  sx={{ mt: 2 }}
                >
                  Find Shortest Path
                </Button>
              </Box>

              {shortestPath && (
                <Box sx={{ mt: 2, p: 2, bgcolor: 'success.light', borderRadius: 1 }}>
                  <Typography variant="subtitle1" gutterBottom>
                    Shortest Path Found
                  </Typography>
                  <Typography variant="body2">
                    <strong>Route:</strong> {shortestPath.cities.map(city => city.name).join(' → ')}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Total Distance:</strong> {shortestPath.totalDistance} km
                  </Typography>
                  <Typography variant="body2">
                    <strong>Cities in Path:</strong> {shortestPath.cities.length}
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Graph Statistics */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Graph Statistics
              </Typography>
              
              {graphData && (
                <Box>
                  <Typography variant="body1" sx={{ mb: 1 }}>
                    <strong>Total Cities:</strong> {graphData.nodes.length}
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 1 }}>
                    <strong>Total Connections:</strong> {graphData.edges.length}
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 1 }}>
                    <strong>Average Connections per City:</strong>{' '}
                    {graphData.nodes.length > 0 
                      ? (graphData.edges.length / graphData.nodes.length * 2).toFixed(2)
                      : 0}
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Cities List */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Available Cities
              </Typography>
              
              <Box sx={{ maxHeight: 300, overflow: 'auto' }}>
                {cities.map((city) => (
                  <Box
                    key={city.id}
                    sx={{
                      p: 1,
                      mb: 1,
                      border: '1px solid #ddd',
                      borderRadius: 1
                    }}
                  >
                    <Typography variant="body1">
                      <strong>{city.name}</strong>
                    </Typography>
                    {city.description && (
                      <Typography variant="body2" color="textSecondary">
                        {city.description}
                      </Typography>
                    )}
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Distances List */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                City Distances
              </Typography>
              
              <Box sx={{ maxHeight: 300, overflow: 'auto' }}>
                {distances.map((distance) => (
                  <Box
                    key={distance.id}
                    sx={{
                      p: 1,
                      mb: 1,
                      border: '1px solid #ddd',
                      borderRadius: 1,
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}
                  >
                    <Typography variant="body2">
                      {getCityName(distance.fromCityId)} → {getCityName(distance.toCityId)}
                    </Typography>
                    <Typography variant="body2" color="primary">
                      {distance.distance} km
                    </Typography>
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  )
}

export default GraphVisualization