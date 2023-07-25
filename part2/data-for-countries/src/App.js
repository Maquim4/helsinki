import axios from 'axios';
import { useState, useEffect } from 'react';

const Country = ({ country }) => {
  const [weather, setWeather] = useState(null);

  useEffect(() => {
    const API_KEY = process.env.REACT_APP_API_KEY;
    const lat = country.capitalInfo.latlng[0];
    const lon = country.capitalInfo.latlng[1];
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`;
    axios.get(url).then(({ data }) => {
      setWeather(data);
    });
  }, [country]);

  if (!weather) {
    return null;
  }

  return (
    <div>
      <h2>{country.name.common}</h2>
      <div>capital {country.capital}</div>
      <div>area {country.area}</div>
      <h4>languages:</h4>
      <ul>
        {Object.values(country.languages).map((language) => (
          <li key={language}>{language}</li>
        ))}
      </ul>
      <img src={country.flags.png} alt={country.name.common} />
      <h4>Weather in {country.capital}</h4>
      <div>temperature {weather.main.temp} Celcius</div>
      <img
        src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
        alt={weather.weather.description}
      />
      <div>wind {weather.wind.speed} m/s</div>
    </div>
  );
};

const Countries = ({ countries, showCountry }) => {
  if (countries.length > 10) {
    return <div>Too many matches, specify another filter</div>;
  } else if (countries.length === 1) return <Country country={countries[0]} />;
  else {
    return (
      <div>
        {countries.map((country) => (
          <p key={country.fifa}>
            {country.name.common}
            <button onClick={() => showCountry(country.name.common)}>
              show
            </button>
          </p>
        ))}
      </div>
    );
  }
};

const App = () => {
  const [search, setSearch] = useState('');
  const [countries, setCountries] = useState([]);

  useEffect(() => {
    axios
      .get(`https://studies.cs.helsinki.fi/restcountries/api/all`)
      .then((response) => {
        setCountries(response.data);
      });
  }, []);

  const countriesToShow = countries.filter(
    (country) =>
      !country.name.common.toLowerCase().indexOf(search.toLowerCase())
  );

  return (
    <div>
      <label>
        find countries
        <input
          value={search}
          onChange={({ target }) => setSearch(target.value)}
        />
      </label>
      <Countries countries={countriesToShow} showCountry={setSearch} />
    </div>
  );
};

export default App;
