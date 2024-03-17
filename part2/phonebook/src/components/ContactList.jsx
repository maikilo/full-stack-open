const ContactList = ({persons, removeContact}) => {
    return (
        <div>
            {persons.map(person => 
            <p key={person.id}>
                {person.name} {person.number} 
                <button onClick={() => removeContact(person)}>
                    delete
                </button>
            </p>
            )}
        </div>
    )
}

export default ContactList
    