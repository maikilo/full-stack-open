import { useState, useEffect } from 'react'
import contactService from "./services/persons.js"
import Filter from "./components/Filter.jsx"
import PersonForm from "./components/PersonForm.jsx"
import ContactList from "./components/ContactList.jsx"
import Notification from './components/Notification.jsx'
import {render} from "react-dom";


const App = () => {
    const [persons, setPersons] = useState([])
    // const [persons, setPersons] = useState(data)
    const [newName, setNewName] = useState('')
    const [newNumber, setNewNumber] = useState('')
    const [newFilter, setNewFilter] = useState('')
    const [notification, setNotification] = useState(null)
    const [error, setError] = useState(null)

    useEffect(() => {
        console.log('effect')
        contactService
            .getAll()
            .then(response => {
            setPersons(response.data)
        })
    }, [])

    const addContact = (event) => {
        event.preventDefault()
        console.log('User trying to add new contact', newName)
        console.log('Persons in list', persons.map(person => person.name))

        const namesList = persons.map(person => person.name.toLowerCase())

        if (namesList.includes(newName.toLowerCase())) {

            if (confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)) {
                const oldPerson = persons.filter((person) => person.name.toLowerCase() == newName.toLowerCase())[0]
                const updatedPerson = { id: oldPerson.id, name: oldPerson.name, number: newNumber}
                const updatedPersons = persons.map((person) => person.name.toLowerCase() == newName.toLowerCase() ? updatedPerson : person)

                contactService
                .updateContact(oldPerson.id, updatedPerson)
                .then(response => {
                    console.log(response)
                    setPersons(updatedPersons)
                    setNotification(`Updated contact ${newName}`)
                    setTimeout(() => {
                        setNotification(null)
                    }, 4000)
                })
                .catch(error => {
                    console.log('Failed to delete', error)
                    setError(`Information of ${newName} has already been removed from server`)
                    setTimeout(() => {
                        setNotification(null)
                    }, 4000)
                })



            }

        } else {

            console.log('Name is not in the list, adding it to the list')
            const newPerson = { id: persons.length + 1, name: newName, number: newNumber}

            contactService
                .createContact(newPerson)
                .then(response => {
                    console.log(response)
                    setPersons(persons.concat(newPerson))
                })

            setNotification(`Added ${newName}`)
            setTimeout(() => {
                setNotification(null)
            }, 4000)
        }
    }

    const removeContact = (idToDel) => {
        const personToDelete = persons.filter((person) => person.id == idToDel)
        console.log(personToDelete[0])

        if (confirm(`Delete ${personToDelete[0].name}?`)) {
            const filteredPersons = persons.filter((person) => person.id != idToDel)
            console.log('Filtered persons', filteredPersons)
            const reindexedPersons = []
            filteredPersons.forEach((person, i) => {
                person = {id: i + 1, name: person.name, number: person.number}
                console.log(person)
                reindexedPersons[i] = person
            })
            console.log('Reindexed persons', reindexedPersons)

            contactService
                .deleteContact(idToDel)
                .then(response => {
                    console.log(response)
                    setPersons(reindexedPersons)
                    console.log('Successfully deleted.')
                })
                .catch(error => {
                    console.log('Failed to delete', error)
                })
        }
    }

    const handleNameChange = (event) => {
        setNewName(event.target.value)
        console.log('New name', newName)
    }

    const handleNumberChange = (event) => {
        setNewNumber(event.target.value)
        console.log('New number', newNumber)
    }

    const handleFilterChange = (event) => {
        setNewFilter(event.target.value.toLowerCase())
        console.log('New filter', newFilter)
    }

    return (
      <div>
          <h2>Phonebook</h2>
          <Notification message={notification} type={'notification'}/>
          <Notification message={error} type={'error'} />
          <Filter eventHandlerFn={handleFilterChange} />

          <h3>Add new contact</h3>
          <PersonForm props={{addContact, handleNumberChange, handleNameChange}} />

          <h3>Numbers</h3>
          <ContactList persons={persons} filter={newFilter} onClickFn={removeContact}/>
      </div>
    )
}

export default App