import { createSlice } from '@reduxjs/toolkit'
import anecdoteService from '../services/anecdotes'

const anecdoteSlice = createSlice({
  name: 'anecdotes',
  initialState: [],
  reducers: {
    appendAnecdote(state, action) {
      state.push(action.payload)
    },
    setAnecdotes(state, action) {
      const anecdotes = action.payload
      return [...anecdotes].sort((a, b) => b.votes - a.votes)
    }
  },
})

export const { voteForAnecdote, setAnecdotes, appendAnecdote } = anecdoteSlice.actions

export const initializeAnecdotes = () => {
  return async dispatch => {
    const anecdotes = await anecdoteService.getAll()
    dispatch(setAnecdotes(anecdotes))
  }
}

export const createAnecdote = content => {
  return async dispatch => {
    const newAnecdote = await anecdoteService.postAnecdote(content)
    dispatch(appendAnecdote(newAnecdote))
  }
}

export const addVote = (votedId) => {
  return async dispatch => {
    const anecdotes = await anecdoteService.getAll()
    const votedAnecdote = anecdotes.filter(anecdote => anecdote.id === votedId)[0]
    const updatedAnecdote = await anecdoteService.updateAnecdote(votedId, { 
      ...votedAnecdote, 
      votes: votedAnecdote.votes + 1 
    })
    dispatch(setAnecdotes(anecdotes.map(anecdote => anecdote.id !== votedId ? anecdote : updatedAnecdote)))
  }
}

export default anecdoteSlice.reducer