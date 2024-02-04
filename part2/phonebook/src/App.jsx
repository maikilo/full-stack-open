import { useState, useEffect } from 'react'
import axios from "axios";

const ContactInfo = ({name, number, filter}) => {
    if (name.toLowerCase().includes(filter)) {
        return (
            <p>{name} {number}</p>
        )
    }
}

const ContactList = ({persons, filter}) => {
    return (
        <div>
            {persons.map(person =>
                    <ContactInfo key={person.id} name={person.name} number={person.number} filter={filter} />)}
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

const App = () => {
    const [persons, setPersons] = useState([])
    // const [persons, setPersons] = useState(data)
    const [newName, setNewName] = useState('')
    const [newNumber, setNewNumber] = useState('')
    const [newFilter, setNewFilter] = useState('')

    useEffect(() => {
        console.log('effect')
        axios.get('http://localhost:3001/persons').then(response => {
            console.log('promise fulfilled')
            setPersons(response.data)
        })
    }, [])
    console.log('persons', persons)

    const addContact = (event) => {
        event.preventDefault()
        console.log('User trying to add new contact', newName)
        console.log('Persons in list', persons.map(person => person.name))

        const namesList = persons.map(person => person.name.toLowerCase())

        if (namesList.includes(newName.toLowerCase())) {
            alert(`${newName} is already in the list`)
        } else {
            console.log('Name is not in the list, adding it to the list')
            const newPerson = { name: newName, number: newNumber, id: persons.length + 1 }
            setPersons(persons.concat(newPerson))
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
          <Filter eventHandlerFn={handleFilterChange} />

          <h3>Add new contact</h3>
          <PersonForm props={{addContact, handleNumberChange, handleNameChange}} />

          <h3>Numbers</h3>
          <ContactList persons={persons} filter={newFilter}/>
      </div>
    )
}

export default App