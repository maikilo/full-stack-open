import { useDispatch } from 'react-redux'
import { addAnecdote } from '../reducers/anecdoteReducer'
import { setNotification, deleteNotification } from '../reducers/notificationReducer'

const AnecdoteForm = () => {
    const dispatch = useDispatch()
    
    const createAnecdote = (event) => {
        event.preventDefault()
        const content = event.target.anecdote.value
        dispatch(addAnecdote(content))
        event.target.anecdote.value = ''
        dispatch(setNotification(`Created anecdote '${content}'`))
        setTimeout(() => {
            dispatch(deleteNotification())
        }, 5000)
    }

    return (
        <form onSubmit={createAnecdote}>
        <h2>create new</h2>
            <div>
                <input name='anecdote' />
            </div>
            <button type='submit'>create</button>
        </form>
    )
}

export default AnecdoteForm