import { useState } from 'react'

const Header = () => (
  <header>
    <h1>give feedback</h1>
  </header>
)

const Button = ({ onClick, text }) =>
  <button onClick={onClick}>{text}</button>

const Buttons = ({ clickGood, clickNeutral, clickBad }) => (
  <>
    <Button onClick={clickGood} text='good' />
    <Button onClick={clickNeutral} text='neutral' />
    <Button onClick={clickBad} text='bad' />
  </>
)

const Stats = ({ good, neutral, bad }) => (
  <div>
    <h1>statistics</h1>
    good {good} <br></br>
    neutral {neutral} <br></br>
    bad {bad} <br></br>
  </div>
)

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const clickGood = () => setGood(good + 1)
  const clickNeutral = () => setNeutral(neutral + 1)
  const clickBad = () => setBad(bad + 1)

  return (
    <div>
      <Header />
      <Buttons clickGood={clickGood} clickNeutral={clickNeutral} clickBad={clickBad} />
      <Stats good={good} neutral={neutral} bad={bad} />
    </div>
  )
}

export default App
