import { useState, useEffect } from 'react'

const Filter = ({ handler }) => <div>Search by name: <input onChange={handler} /></div>

const PersonForm = ({ addName, handlerName, handlerNumber }) =>
  <form onSubmit={addName}>
    <div>name: <input onChange={handlerName} /></div>
    <div>number: <input onChange={handlerNumber} /></div>
    <div><button type="submit">add</button></div>
  </form>


const Person = ({ person }) => <div>{person.name} {person.number}</div>

const Persons = ({ persons }) =>
  persons.map((person) => <Person key={person.id} person={person} />)


const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '040-123456', id: 1 },
    { name: 'Ada Lovelace', number: '39-44-5323523', id: 2 },
    { name: 'Dan Abramov', number: '12-43-234345', id: 3 },
    { name: 'Mary Poppendieck', number: '39-23-6423122', id: 4 }
  ])
  const [personsFilter, setPersonsFilter] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')

  useEffect(() => {
    setPersonsFilter(persons.filter(person =>
      person.name.toLowerCase().includes(filter.toLowerCase())))
  }, [filter, persons])

  const addName = (event) => {
    event.preventDefault()
    if (persons.some(person => person.name === newName))
      alert(`${newName} is already added to phonebook`)
    else
      setPersons(persons.concat({ name: newName, number: newNumber, id: persons.length + 1 }))
  }

  const handleNameChange = (event) => {
    console.log(event.target.value)
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    console.log(event.target.value)
    setNewNumber(event.target.value)
  }

  const handleFilterChange = (event) => {
    console.log(event.target.value)
    setFilter(event.target.value)
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter
        handler={handleFilterChange} />
      <h2>Add a new</h2>
      <PersonForm
        addName={addName}
        handlerName={handleNameChange}
        handlerNumber={handleNumberChange} />
      <h2>Numbers</h2>
      <Persons persons={personsFilter} />
    </div>
  )
}

export default App