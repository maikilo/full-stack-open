import { useState } from 'react'


const Button = ({onClick, text}) => {
  return (
      <button onClick={onClick}>
        {text}
      </button>
  )
}

const StatisticLine = ({text, value}) => {
  return (
    <tr>
      <td>{text}</td>
      <td>{value}</td>
    </tr>
  )
}

const Statistics = ({good, neutral, bad}) => {
  if (good + neutral + bad <= 0) {
    return (
        <>
          <p>No feedback given</p>
        </>
    )
  } else {
    return (
        <table>
          <tbody>
          <StatisticLine text='good' value={good}/>
          <StatisticLine text='neutral' value={neutral}/>
          <StatisticLine text='bad' value={bad}/>
          <StatisticLine text='all' value={good + neutral + bad}/>
          <StatisticLine text='average' value={(good * 1 + neutral * 0 + bad * -1) / (good + neutral + bad)}/>
          <StatisticLine text='positive' value={good / (good + neutral + bad) * 100 + '%'}/>
          </tbody>
        </table>
  )
  }
}

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const increaseGood = () => setGood(good + 1);
  const increaseNeutral = () => setNeutral(neutral + 1);
  const increaseBad = () => setBad(bad + 1);

  return (
      <div>

        <h1>give feedback</h1>
        <Button onClick={increaseGood} text='good'/>
        <Button onClick={increaseNeutral} text='neutral'/>
        <Button onClick={increaseBad} text='bad'/>

        <h1>statistics</h1>
        <Statistics good={good} neutral={neutral} bad={bad}/>

      </div>
  )
}

export default App