import { useState, useEffect } from 'react'
import axios from 'axios'
const baseUrl = 'https://studies.cs.helsinki.fi/restcountries/'
import countryService from "./services/countries.js"


const Notification = ({ message }) => {
    console.log("message", message)
    if (message === null) {
        return null
    }
    return (
        <div>
            {message}
        </div>
    )
}

const Country = ({country}) => {
    console.log(country)
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

const CountryList = ({countries, filter}) => {
    console.log("You're in CountryList!")
    // console.log("countries", countries)
    const filteredCountries = countries.filter(country => country.name.common.toLowerCase().includes(filter))
    console.log("filtered", filteredCountries)

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
            {filteredCountries.map((row, idx) => <p key={idx}>{row.name.common}</p>)}
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
    const [message, setMessage] = useState("")
    const [selectedCountry, setSelectedCountry] = useState({})

    useEffect(() => {
        console.log('effect')
        countryService
            .getAll()
            .then(response => {
                setCountries(response.data)
            })
            .catch(error => {
                console.log('Failed', error)
            })
        // console.log('countries', countries)
        // setMessage("Too many matches, specify a filter")
    }, [])

    const handleFilterChange = (event) => {
        setFilter(event.target.value.toLowerCase())
        console.log('New filter', filter)
    }

    return (
      <div>
          <h1>Countries</h1>
          <Filter eventHandlerFn={handleFilterChange} />
          <Notification message={message} />
          <CountryList countries={countries} filter={filter} setSelectedCountry={setSelectedCountry}/>
      </div>
    )
}

export default App
