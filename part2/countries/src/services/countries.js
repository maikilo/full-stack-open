import axios from 'axios'
const baseUrl = 'https://studies.cs.helsinki.fi/restcountries/'

const getAll = () => {
  return axios.get(`${baseUrl}/api/all`)
}

const getCountry = (commonName) => {
  return axios.get(`${baseUrl}/name/api/${commonName}`)
}

export default {
    getAll: getAll,
    getCountry: getCountry,
}