const Filter = ({filter, handleFilterChange}) => {
    return (
        <div>
            filter shown with: 
            <input value={filter} onChange={({ target }) => handleFilterChange(target.value)} />
        </div>
    )
}

export default Filter
    