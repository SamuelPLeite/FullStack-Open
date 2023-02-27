import { useState } from 'react'

const Button = ({ onClick, text }) =>
  <button onClick={onClick}>{text}</button>

const App = () => {
  const anecdotes = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 10 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients.',
    'The only way to go fast, is to go well.'
  ]

  const [selected, setSelected] = useState(0)
  const [votes, setVotes] = useState(new Array(anecdotes.length).fill(0))
  const [mostVotes, setMostVotes] = useState(0)

  const nextAnecdote = () => {
    let newSelected = 0
    do
      newSelected = Math.floor(Math.random() * anecdotes.length)
    while (newSelected === selected) // logic to make sure 'next anecdote' always shows a new one
    setSelected(newSelected)
  }

  const voteAnecdote = () => {
    const votesCopy = [...votes]
    votesCopy[selected] += 1
    if (votesCopy[selected] > votes[mostVotes])
      setMostVotes(selected)
    setVotes(votesCopy)
  }

  return (
    <div>
      <h1>Anecdote of the Day</h1>
      <p>{anecdotes[selected]}</p>
      <p>has {votes[selected]} votes</p>
      <Button text='vote' onClick={voteAnecdote} />
      <Button text='next anecdote' onClick={nextAnecdote} />
      <h1>Anecdote with most votes</h1>
      <p>{anecdotes[mostVotes]}</p>
      <p>has {votes[mostVotes]} votes</p>
    </div>
  )
}

export default App
