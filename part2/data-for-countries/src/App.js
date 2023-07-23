import { useState } from 'react';
import { useEffect } from 'react';
import axios from 'axios';

const Weather = ({ country }) => {
  const [weather, setWeather] = useState({});

  useEffect(() => {
    if (country) {
      axios
        .get(
          `https://api.openweathermap.org/data/2.5/weather?lat=${country.capitalInfo.latlng[0]}&lon=${country.capitalInfo.latlng[1]}&appid=${process.env.REACT_APP_API_KEY}`
        )
        .then((response) => {
          console.log(response);
          setWeather(response);
        });
    }
  }, [country]);

  return (
    <div>
      <h2>Weather in {country.capital}</h2>
      <div>temperature {weather.main.temp - 273} Celcius</div>
      <img
        src={`https://openweathermap.org/img/wn/${weather.weather.icon}@2x.png`}
        alt={weather.weather.description}
      />
      <div>wind {weather.wind.speed} m/s</div>
    </div>
  );
};

const Country = ({ country }) => {
  return (
    <div>
      <h1>{country.name.common}</h1>
      <div>capital {country.capital}</div>
      <div>area {country.area}</div>
      <h3>languages:</h3>
      <ul>
        {Object.values(country.languages).map((language) => (
          <li key={language}>{language}</li>
        ))}
      </ul>
      <img src={country.flags.png} alt={country.name.common} />
      <Weather country={country} />
    </div>
  );
};

const Countries = ({ countries }) => {
  if (countries.length > 10) {
    return <div>Too many matches, specify another filter</div>;
  } else if (countries.length === 1) return <Country country={countries[0]} />;
  else {
    return (
      <div>
        {countries.map((country) => (
          <div>
            <div key={country.name.common}>{country.name.common}</div>
          </div>
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

  const handleSearchChange = (event) => setSearch(event.target.value);

  const countriesToShow = countries.filter(
    (country) =>
      !country.name.common.toLowerCase().indexOf(search.toLowerCase())
  );

  return (
    <div>
      <label>
        find countries
        <input value={search} onChange={handleSearchChange} />
      </label>
      <Countries countries={countriesToShow} />
    </div>
  );
};

export default App;
