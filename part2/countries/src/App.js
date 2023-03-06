import { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import CountryDisplay from './components/CountryDisplay'

const Filter = ({ handler }) => <div>Find countries: <input onChange={handler} /></div>

const CountryList = ({ countries, filter, handleShow }) => {
  if (filter.length === 0)
    return (<div>Try searching for a country.</div>)
  if (countries.length > 10)
    return (<div>Too many matches, make your filter more specific.</div>)
  else
    return (
      countries.map(country =>
        <div key={country.ccn3}>
          {country.name.common}
          <button onClick={() => handleShow(country.name.common)}>Show</button>
        </div>)
    )
}

const App = () => {
  const [countries, setCountries] = useState([])
  const [filter, setFilter] = useState('')
  const [filteredCountries, setFilteredCountries] = useState([])
  const [weather, setWeather] = useState(null)
  const [capitalGeo, setCapitalGeo] = useState([])

  const initialRender = useRef(true);
  const api_key = process.env.REACT_APP_API_KEY

  useEffect(() => {
    axios
      .get('https://restcountries.com/v3.1/all')
      .then(response => {
        setCountries(response.data)
      })
  }, [])

  useEffect(() => {
    const countriesCopy = countries.filter(country =>
      country.name.common.toLowerCase().includes(filter.toLowerCase()))
    setFilteredCountries(countriesCopy)
    if (countriesCopy.length === 1 && capitalGeo !== countriesCopy[0].capitalInfo.latlng) {
      setCapitalGeo(countriesCopy[0].capitalInfo.latlng)
      setWeather(null)
    }
  }, [filter, countries])

  useEffect(() => {
    if (initialRender.current)
      initialRender.current = false
    else
      getWeather(capitalGeo)
  }, [capitalGeo])

  const handleFilterChange = (event) =>
    setFilter(event.target.value)

  const handleShow = (name) => {
    setFilter(name)
  }

  const getWeather = (cityGeo) => {
    const [lat, lng] = cityGeo
    axios
      .get(`https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lng}&appid=${api_key}`)
      .then(response => {
        console.log(response.data.current)
        setWeather(response.data.current)
      })
  }

  return (
    <>
      <h1>Countries</h1>
      <Filter handler={handleFilterChange} />
      {countries.length > 0 ? (
        filteredCountries.length === 0 ?
          <div>No matches, try a different filter.</div> : (
            filteredCountries.length > 1 ?
              <CountryList countries={filteredCountries}
                filter={filter} handleShow={handleShow} /> :
              <CountryDisplay country={filteredCountries[0]} weather={weather} />)) :
        <div>Loading data...</div>}
    </>
  )
}

export default App