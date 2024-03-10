/* const Filter = ({eventHandlerFn}) => {
    return (
        <div>
            filter shown with: <input onChange={eventHandlerFn}/>
        </div>
    )
} */

const Filter = ({filter, handleFilterChange}) => {
    return (
        <div>
            filter shown with: 
            <input value={filter} onChange={({ event }) => handleFilterChange(event.target.value)} />
        </div>
    )
}

export default Filter
    