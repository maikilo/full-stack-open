import { useState, useEffect } from 'react'
import contactService from "./services/persons.js"
import Filter from "./components/Filter.jsx"
import PersonForm from "./components/PersonForm.jsx"
import ContactList from "./components/ContactList.jsx"
import Notification from './components/Notification.jsx'


const App = () => {
    const [persons, setPersons] = useState([])
    const [newName, setNewName] = useState('')
    const [newNumber, setNewNumber] = useState('')
    const [filter, setFilter] = useState('')
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

    const updatePerson = (person) => {
        const ok = window.confirm(`${newName} is already added to phonebook, replace the number?`)
        if (ok) {
          
          contactService
          .updateContact(person.id, {...person, number: newNumber})
          .then((updatedPerson) => {
            setPersons(persons.map(p => p.id !== person.id ? p :updatedPerson ))
            setNotification(`Updated contact ${newName}`)
            setTimeout(() => {
                setNotification(null)
            }, 4000)
          })
          .catch(error => {
            console.log('Failed to delete', error)
            setPersons(persons.filter(p => p.id !== person.id))
            setError(`Information of ${newName} has already been removed from server`)
            setTimeout(() => {
                setNotification(null)
            }, 4000)
          })

          cleanForm()
        }
    }

    const addContact = (event) => {
        event.preventDefault()
        console.log('User trying to add new contact', newName)
        console.log('Persons in list', persons.map(person => person.name))
        const person = persons.find(p => p.name === newName)

        if (person) {
            updatePerson(person)
            return
        }

        contactService.createContact({
            name: newName,
            number: newNumber
        })
        .then(createdPerson => {
            setPersons(persons.concat(createdPerson))
            setNotification(`Added ${newName}`)
            setTimeout(() => {
                setNotification(null)
            }, 4000)
        })
        cleanForm()
    }

    const removeContact = (person) => {
        if (confirm(`Delete ${person.name} from phonebook?`)) {
            contactService
                .deleteContact(person.id)
                .then(response => {
                    setPersons(persons.filter(p => p.id !== person.id))
                    setNotification(`Deleted contact ${person.name}`)
                    setTimeout(() => {
                        setNotification(null)
                    }, 4000)
                })
                .catch(error => {
                    console.log('Failed to delete', error)
                })
        }
    }

    const handleNameChange = (value) => {
        setNewName(value)
        console.log('New name', newName)
    }

    const handleNumberChange = (value) => {
        setNewNumber(value)
        console.log('New number', newNumber)
    }

    const handleFilterChange = (value) => {
        setFilter(value.toLowerCase())
        console.log('New filter', filter)
    }

    const cleanForm = () => {
        setNewName('')
        setNewNumber('') 
    }

    const byFilterField = p => p.name.toLowerCase().includes(filter.toLowerCase())
    const personsToShow = filter ? persons.filter(byFilterField) : persons

    return (
      <div>
          <h2>Phonebook</h2>
          <Notification message={notification} type={'notification'}/>
          <Notification message={error} type={'error'} />
          <Filter filter={filter} handleFilterChange={handleFilterChange} />

          <h3>Add new contact</h3>
          <PersonForm 
            addContact={addContact}
            newName={newName}
            newNumber={newNumber}
            handleNameChange={handleNameChange}
            handleNumberChange={handleNumberChange}
          />

          <h3>Numbers</h3>
          <ContactList 
            persons={personsToShow}
            removeContact={removeContact}
          />
      </div>
    )
}

export default App