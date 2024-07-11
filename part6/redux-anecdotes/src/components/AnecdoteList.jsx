import { useSelector, useDispatch } from 'react-redux'
import { addVote } from '../reducers/anecdoteReducer'
import { setNotification } from '../reducers/notificationReducer'

const AnecdoteList = () => {
    const anecdotes = useSelector(state => {
      return state.filter === '' ? state.anecdotes : state.anecdotes.filter(anecdote => anecdote.content.toLowerCase().includes(state.filter.toLowerCase()))
    })

    const dispatch = useDispatch()
  
    const vote = (id) => {
      dispatch(addVote(id))
      const votedAnecdote = anecdotes.filter(anecdote => anecdote.id === id)[0]
      dispatch(setNotification(`Voted for anecdote '${votedAnecdote.content}'`, 3000))
    }

    return (
      anecdotes.map(anecdote =>
          <div key={anecdote.id}>
            <div>
              {anecdote.content}
            </div>
            <div>
              has {anecdote.votes}
              <button onClick={() => vote(anecdote.id)}>vote</button>
            </div>
          </div>
      )
    )
}

export default AnecdoteList