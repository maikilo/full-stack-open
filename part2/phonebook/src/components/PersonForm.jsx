/* const PersonForm = ({props}) => {
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
 */

const PersonForm = ({addContact, newName, newNumber, handleNameChange, handleNumberChange}) => {
    return (
        <form onSubmit={addContact}>
            <div>
                name: <input value={newName} onChange={({ target }) => handleNameChange(target.value)} />
            </div>
            <div>
                number: <input value={newNumber} onChange={({ target }) => handleNumberChange(target.value)} />
            </div>
            <div>
                <button type="submit">add</button>
            </div>
        </form>
    )
}


export default PersonForm
    