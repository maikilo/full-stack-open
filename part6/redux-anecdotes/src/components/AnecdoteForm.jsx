import { useDispatch } from 'react-redux'
import { addAnecdote } from '../reducers/anecdoteReducer'
import { setNotification, deleteNotification } from '../reducers/notificationReducer'
import anecdoteService from '../services/anecdotes'


const AnecdoteForm = () => {
    const dispatch = useDispatch()

    const createAnecdote = async (event) => {
      event.preventDefault()
      const content = event.target.anecdote.value
      const anecdote = await anecdoteService.postAnecdote(content)
      dispatch(addAnecdote(anecdote))
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