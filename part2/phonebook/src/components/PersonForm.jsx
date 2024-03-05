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

export default PersonForm
    