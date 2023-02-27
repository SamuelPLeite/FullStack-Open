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

const StatisticLine = ({ text, value }) => <tr><td>{text}</td><td>{value}</td></tr>

const Statistics = ({ good, neutral, bad }) => {
  const all = good + neutral + bad
  let avg = 0
  let pst = 0

  if (all !== 0) {
    avg = ((good - bad) / all).toPrecision(5)
    pst = (100 * good / all).toPrecision(5)
  }
  return (
    <div>
      <h1>statistics</h1>
      {all !== 0 ?
        <table>
          <tbody>
            <StatisticLine text='good' value={good} />
            <StatisticLine text='neutral' value={neutral} />
            <StatisticLine text='bad' value={bad} />
            <StatisticLine text='all' value={all} />
            <StatisticLine text='average' value={avg} />
            <StatisticLine text='positive' value={`${pst} %`} />
          </tbody>
        </table> : 'No feedback given'
      }
    </div>
  )
}

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
      <Statistics good={good} neutral={neutral} bad={bad} />
    </div>
  )
}

export default App
