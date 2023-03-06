const LanguageList = ({ languages }) => (
    <>
        <h3>Languages</h3>
        <ul>
            {Object.entries(languages).map(language =>
                <li key={language[0]}>{language[1]}</li>)}
        </ul>
    </>
)

const Flag = ({ flags }) => (
    <img src={flags.png} alt={flags.alt}></img>
)

const Weather = ({ city, weatherData }) => (
    <>
        <h3>Weather in {city}</h3>
        <div>Temperature: {(weatherData.temp - 273.15).toPrecision(4)} °C</div>
        <img src={`https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`}
            alt={weatherData.weather[0].description}></img>
        <div>Wind Speed: {weatherData.wind_speed} m/s</div>
    </>
)

const CountryDisplay = ({ country, weather }) => (
    <>
        <h2>{country.name.common}</h2>
        <div>Capital: {country.capital}</div>
        <div>Area: {country.area}</div>
        <LanguageList languages={country.languages} />
        <Flag flags={country.flags} />
        {weather ? <Weather city={country.capital} weatherData={weather} /> :
            <div>Loading weather information...</div>}
    </>
)

export default CountryDisplay