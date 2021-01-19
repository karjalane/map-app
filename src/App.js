import { React, useState, useEffect, useCallback } from 'react'
import axios from 'axios'
import MapContainer from './components/MapContainer'
import LocationTable from './components/LocationTable'

const locationsAPI = 'https://fakerapi.it/api/v1/addresses'

const App = () => {
  const [locations, setLocations] = useState([])

  const loadLocations = useCallback(() => {
    axios.get(`${locationsAPI}`)
      .then((res) => {
        setLocations(res.data)
      })
  }, [])

  useEffect(() => {
    loadLocations()
  }, [loadLocations])

  return (
    <div className="App">
      <MapContainer locations={ locations.data } />
      <LocationTable data={ locations.data } />
    </div>
  )
}

export default App