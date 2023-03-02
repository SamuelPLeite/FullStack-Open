import { useState, useEffect } from 'react'
import personService from './services/persons'

const Filter = ({ handler }) => <div>Search by name: <input onChange={handler} /></div>

const PersonForm = ({ addPerson, handlerName, handlerNumber }) =>
  <form onSubmit={addPerson}>
    <div>name: <input onChange={handlerName} /></div>
    <div>number: <input onChange={handlerNumber} /></div>
    <div><button type="submit">add</button></div>
  </form>

const Person = ({ person, handleDelete }) => (
  <div>
    {person.name} {person.number}
    <button onClick={() => handleDelete(person.id, person.name)}>delete</button>
  </div>
)

const Persons = ({ persons, handleDelete }) =>
  persons.map((person) => <Person key={person.id}
    person={person} handleDelete={handleDelete} />)

const App = () => {
  const [persons, setPersons] = useState([])
  const [personsFilter, setPersonsFilter] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')

  useEffect(() => {
    personService
      .getAll()
      .then(initialPersons => {
        console.log('persons data fetched')
        setPersons(initialPersons)
      })
  }, [])

  useEffect(() => {
    setPersonsFilter(persons.filter(person =>
      person.name.toLowerCase().includes(filter.toLowerCase())))
  }, [filter, persons])

  const addPerson = (event) => {
    event.preventDefault()
    const personObject = {
      name: newName,
      number: newNumber
    }

    const findPerson = persons.find(person => person.name === newName)
    if (findPerson) {
      if (findPerson.number === newNumber)
        alert(`${newName} is already added to phonebook`)
      else
        if (window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`))
          personService
            .update(findPerson.id, personObject)
            .then(updatedPerson => {
              console.log(updatedPerson)
              setPersons(persons.map(person => person.id !== findPerson.id ? person : updatedPerson))
            })
    }
    else
      personService
        .create(personObject)
        .then(returnedPerson => {
          console.log(returnedPerson)
          setPersons(persons.concat(returnedPerson))
        })
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

  const handleDeletePerson = (id, name) => {
    if (window.confirm(`Delete ${name}?`)) {
      console.log(id)
      personService
        .remove(id)
        .then(() => {
          const newPersons = persons.filter(person => person.id !== id)
          setPersons(newPersons)
        })
    }
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter
        handler={handleFilterChange} />
      <h2>Add a new</h2>
      <PersonForm
        addPerson={addPerson}
        handlerName={handleNameChange}
        handlerNumber={handleNumberChange} />
      <h2>Numbers</h2>
      <Persons persons={personsFilter} handleDelete={handleDeletePerson} />
    </div>
  )
}

export default App