import { createSlice } from '@reduxjs/toolkit'

const anecdoteSlice = createSlice({
  name: 'anecdotes',
  initialState: [],
  reducers: {
    addAnecdote(state, action) {
      state.push(action.payload)
    },
    voteForAnecdote(state, action) {
      const id = action.payload
      const anecdoteToChange = state.find(anecdote => anecdote.id === id)
      const changedAnecdote = { 
        ...anecdoteToChange, 
        votes: anecdoteToChange.votes + 1 
      }
      const newState = state.map(anecdote =>
        anecdote.id !== id ? anecdote : changedAnecdote 
      )
      return newState.sort((a, b) => b.votes - a.votes)  
    },
    setAnecdotes(state, action) {
      return action.payload
    }
  },
})

export const { addAnecdote, voteForAnecdote, setAnecdotes } = anecdoteSlice.actions
export default anecdoteSlice.reducer