import { useState } from 'react'

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const clickGood = () => setGood(good + 1)
  const clickNeutral = () => setNeutral(neutral + 1)
  const clickBad = () => setBad(bad + 1)

  const Button = ({ onClick, text }) =>
    <button onClick={onClick}>{text}</button>

  const Buttons = () => (
    <>
      <Button onClick={clickGood} text='good' />
      <Button onClick={clickNeutral} text='neutral' />
      <Button onClick={clickBad} text='bad' />
    </>
  )

  const Header = () => (
    <header>
      <h1>give feedback</h1>
    </header>
  )

  const Stats = () => (
    <div>
      <h1>statistics</h1>
      good {good} <br></br>
      neutral {neutral} <br></br>
      bad {bad} <br></br>
    </div>
  )

  return (
    <div>
      <Header />
      <Buttons />
      <Stats />
    </div>
  )
}

export default App
