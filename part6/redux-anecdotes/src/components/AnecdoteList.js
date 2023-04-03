import { useSelector, useDispatch } from "react-redux"
import { voteAnecdote } from "../reducers/anecdoteReducer"
import { setNotification, removeNotification } from "../reducers/notificationReducer"

const AnecdoteList = () => {
  const anecdotes = useSelector(({ filter, anecdotes }) => anecdotes.filter(anec =>
    anec.content.toLowerCase().includes(filter.toLowerCase())))
  const dispatch = useDispatch()

  const vote = (id, content) => {
    console.log('vote', id)
    dispatch(voteAnecdote(id))

    dispatch(setNotification(`Voted for '${content}'.`))
    setTimeout(() => {
      dispatch(removeNotification())
    }, 5000)
  }

  return (
    anecdotes.sort((a, b) => b.votes - a.votes).map(anecdote =>
      <div key={anecdote.id}>
        <div>
          {anecdote.content}
        </div>
        <div>
          has {anecdote.votes}
          <button onClick={() => vote(anecdote.id, anecdote.content)}>vote</button>
        </div>
      </div>
    )
  )
}

export default AnecdoteList