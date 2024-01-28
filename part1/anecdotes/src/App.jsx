import { useState } from 'react'

const Button = ({onClick, text}) => {
  return (
      <button onClick={onClick}>
        {text}
      </button>
  )
}

const App = () => {
  const anecdotes = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients.',
    'The only way to go fast, is to go well.'
  ]

  const [selected, setSelected] = useState(0)
  const [votes, setVotes] = useState(new Array(anecdotes.length).fill(0))
  const [mostVoted, setMostVoted] = useState(0)

  function getRandomNumber(min, max) {
    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.floor(Math.random() * (max - min + 1)) + min
  }

  function getMostVotedAnecdote(votes) {
    let argmax = votes.reduce((iMax, x, i, arr) => x > arr[iMax] ? i : iMax, 0)
    console.log('Index of max value', argmax)
    return (argmax)
  }

  const updateSelectedAnecdote = () => {
    let newSelected = getRandomNumber(0, anecdotes.length-1)
    console.log('Anecdote number', newSelected)
    setSelected(newSelected)
  }

  const updateVotes = () => {
    const newVotes = [...votes]
    newVotes[selected] += 1
    setVotes(newVotes)
    const newMostVoted = getMostVotedAnecdote(votes)
    setMostVoted(newMostVoted)
    console.log('votes cast', votes.reduce((accumulator, currentValue) => accumulator + currentValue,0))
    console.log('votes', votes)
    console.log('most voted', mostVoted)
  }

  return (
    <div>
      <h1>Anecdote of the day</h1>
      <p>{anecdotes[selected]}</p>
      <Button onClick={updateVotes} text='vote' />
      <Button onClick={updateSelectedAnecdote} text='next anecdote' />
      <h1>Anecdote with most votes</h1>
      <p>{anecdotes[mostVoted]}</p>
    </div>
  )
}

export default App