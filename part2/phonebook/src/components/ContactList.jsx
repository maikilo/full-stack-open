const ContactInfo = ({person, filter, action}) => {
    if (person.name.toLowerCase().includes(filter)) {
        return (
            <p>
                {person.name} {person['number']} <button key={person.id} onClick={() => action(person.id)}>delete</button>
            </p>
        )
    }
}

const ContactList = ({persons, filter, removeContact}) => {
    return (
        <div>
            {persons.map(person => <ContactInfo key={person.id} person={person} filter={filter} action={removeContact}/>)}
        </div>
    )
}

export default ContactList
    