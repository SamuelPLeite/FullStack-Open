import AnecdoteForm from './components/AnecdoteForm'
import Notification from './components/Notification'
import { useQuery, useMutation, useQueryClient } from 'react-query'
import { getAnecdotes, updateAnecdote } from './requests'
import { useNotificationDispatch } from './NotificationContext'

const App = () => {
  const queryClient = useQueryClient()
  const dispatch = useNotificationDispatch()

  const result = useQuery('anecdotes', getAnecdotes,
    {
      retry: 1
    })
  const updateAnecdoteMutation = useMutation(updateAnecdote, {
    onSuccess: () => {
      queryClient.invalidateQueries('anecdotes')
    },
  })

  const handleVote = (anecdote) => {
    updateAnecdoteMutation.mutate({ ...anecdote, votes: anecdote.votes + 1 })

    dispatch({ type: 'SET', payload: `Voted for '${anecdote.content}' anecdote.` })
    setTimeout(() => {
      dispatch({ type: 'REMOVE' })
    }, 5000)
  }

  if (result.isLoading) {
    return <span>Loading...</span>
  }

  if (result.isError)
    return <span>Anecdote service not available due to server problems.</span>

  const anecdotes = result.data

  return (
    <div>
      <h3>Anecdote app</h3>

      <Notification />
      <AnecdoteForm />

      {anecdotes.map(anecdote =>
        <div key={anecdote.id} style={{ marginBottom: 7 }}>
          <div>
            {anecdote.content}
          </div>
          <div>
            has {anecdote.votes}
            <button onClick={() => handleVote(anecdote)} style={{ marginLeft: 5 }}>vote</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
