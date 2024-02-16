import axios from 'axios'
const baseUrl = 'http://localhost:3001/persons'

const getAll = () => {
  return axios.get(baseUrl)
}

const getContact = (id) => {
  return axios.get(`${baseUrl}/${id}`)
}

const createContact = newObject => {
  return axios.post(baseUrl, newObject)
}

const updateContact = (id, newObject) => {
  return axios.put(`${baseUrl}/${id}`, newObject)
}

const deleteContact = (id) => {
    return axios.delete(`${baseUrl}/${id}`)
}

export default {
    getAll: getAll,
    getContact: getContact,
    createContact: createContact,
    updateContact: updateContact,
    deleteContact: deleteContact
}