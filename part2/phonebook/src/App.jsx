import { useState, useEffect } from 'react'
import contactService from "./services/persons.js"
import {render} from "react-dom";

const ContactInfo = ({person, filter, action}) => {
    if (person.name.toLowerCase().includes(filter)) {
        return (
            <p>
                {person.name} {person['number']} <button key={person.id} onClick={() => action(person.id)}>delete</button>
            </p>
        )
    }
}

const ContactList = ({persons, filter, onClickFn}) => {
    return (
        <div>
            {persons.map(person => <ContactInfo key={person.id} person={person} filter={filter} action={onClickFn}/>)}
        </div>
    )
}

const PersonForm = ({props}) => {
    return (
        <form onSubmit={props.addContact}>
            <div>
                name: <input onChange={props.handleNameChange}/>
            </div>
            <div>
                number: <input onChange={props.handleNumberChange}/>
            </div>
            <div>
                <button type="submit">add</button>
            </div>
        </form>
    )
}

const Filter = ({eventHandlerFn}) => {
    return (
        <div>
            filter shown with: <input onChange={eventHandlerFn}/>
        </div>
    )
}

const Notification = ({ message }) => {
  if (message === null) {
    return null
  }
  return (
    <div className='notification'>
      {message}
    </div>
  )
}

const Error = ({ message }) => {
  if (message === null) {
    return null
  }
  return (
    <div className='error'>
      {message}
    </div>
  )
}

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
          <Notification message={notification}/>
          <Error message={error} />
          <Filter eventHandlerFn={handleFilterChange} />

          <h3>Add new contact</h3>
          <PersonForm props={{addContact, handleNumberChange, handleNameChange}} />

          <h3>Numbers</h3>
          <ContactList persons={persons} filter={newFilter} onClickFn={removeContact}/>
      </div>
    )
}

export default App