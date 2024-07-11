import { useDispatch } from 'react-redux'
import { createAnecdote } from '../reducers/anecdoteReducer'
import { setNotification, deleteNotification } from '../reducers/notificationReducer'

const AnecdoteForm = () => {
    const dispatch = useDispatch()

    const addAnecdote = async (event) => {
      event.preventDefault()
      const content = event.target.anecdote.value
      dispatch(createAnecdote(content))
			event.target.anecdote.value = ''
			dispatch(setNotification(`Created anecdote '${content}'`))
			setTimeout(() => {
					dispatch(deleteNotification())
			}, 5000)
    }

    return (
        <form onSubmit={addAnecdote}>
        <h2>create new</h2>
            <div>
                <input name='anecdote' />
            </div>
            <button type='submit'>create</button>
        </form>
    )
}

export default AnecdoteForm