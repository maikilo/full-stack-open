import { changeFilter } from '../reducers/filterReducer'
import { useDispatch } from 'react-redux'


const Filter = () => {
    const dispatch = useDispatch()
    const handleChange = (event) => {
        event.preventDefault()
        const filter = event.target.value
        console.log('New filter', filter)
        dispatch(changeFilter(filter))
    }

    const style = {
      marginBottom: 10
    }
  
    return (
      <div style={style}>
        filter <input name='filter' onChange={handleChange} />
      </div>
    )
  }
  
  export default Filter