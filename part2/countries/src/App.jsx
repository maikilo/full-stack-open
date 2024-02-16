import { useState, useEffect } from 'react'
import axios from 'axios'
const baseUrl = 'https://studies.cs.helsinki.fi/restcountries/'
import countryService from "./services/countries.js"


const Country = ({country}) => {
    console.log(country)
    if (country === null) {
        return null
    }
    const languages = country.languages
    return (
        <div>
            <h2>{country.name.common}</h2>
            <p>capital {country.capital}</p>
            <p>area {country.area}</p>
            <h4>languages:</h4>
            <ul>
                {Object.values(languages).map((lang, idx) => <li key={idx}>{lang}</li>)}
            </ul>
            <img width="300" height="200" src={country.flags.svg}/>
        </div>
    )
}

const CountryList = ({filteredCountries, handleClick}) => {
    console.log("You're in CountryList!")
    // console.log("countries", countries)

    if (filteredCountries.length == 1) {
        const oneCountry = filteredCountries[0]
        console.log('Selected', oneCountry)
        return (<Country country={oneCountry} />)
    }

    if (filteredCountries.length > 10) {
        return (
            <div>
                <p>Too many countries, specify a filter</p>
            </div>
        )
    }

    return (
        <div>
            {filteredCountries.map((row, idx) =>
                <p key={idx}>
                    {row.name.common} <button key={idx} onClick={() => handleClick(row)}>show</button>
                </p>
            )}
        </div>
    )
}

const Filter = ({eventHandlerFn}) => {
    return (
        <div>
            find countries: <input onChange={eventHandlerFn}/>
        </div>
    )
}

function App() {
    const [countries, setCountries] = useState([])
    const [filter, setFilter] = useState("")
    const [filteredCountries, setFilteredCountries] = useState([])
    const [selectedCountry, setSelectedCountry] = useState(null)

    useEffect(() => {
        console.log('effect')
        countryService
            .getAll()
            .then(response => {
                setCountries(response.data)
                setFilteredCountries(response.data)
            })
            .catch(error => {
                console.log('Failed', error)
            })
    }, [])

    const handleFilterChange = (event) => {
        setFilter(event.target.value.toLowerCase())
        console.log('New filter', filter)
        const newFilteredCountries = countries.filter(country => country.name.common.toLowerCase().includes(filter))
        setFilteredCountries(newFilteredCountries)
        setSelectedCountry(null)
        console.log("filtered", filteredCountries)
    }

    const handleClick = (country) => {
        console.log('button clicked')
        setSelectedCountry(country)
    }

    return (
      <div>
          <h1>Countries</h1>
          <Filter eventHandlerFn={handleFilterChange} />
          <Country country={selectedCountry} />
          <CountryList filteredCountries={filteredCountries} handleClick={handleClick}/>
      </div>
    )
}

export default App
