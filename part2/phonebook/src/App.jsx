import { useState } from 'react'

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
    const [persons, setPersons] = useState([
        {name: 'Arto Hellas', number: '040-123456', id: 1},
        {name: 'Ada Lovelace', number: '39-44-5323523', id: 2},
        {name: 'Dan Abramov', number: '12-43-234345', id: 3},
        {name: 'Mary Poppendieck', number: '39-23-6423122', id: 4 },
    ])
    const [newName, setNewName] = useState('')
    const [newNumber, setNewNumber] = useState('')
    const [newFilter, setNewFilter] = useState('')

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

          <h2>Add new contact</h2>
          <PersonForm props={{addContact, handleNumberChange, handleNameChange}} />

          <h2>Numbers</h2>
          <ContactList persons={persons} filter={newFilter}/>
      </div>
    )
}

export default App