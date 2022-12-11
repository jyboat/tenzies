import React from "react"
import Die from "./components/Die"
import { nanoid } from 'nanoid'
import Confetti from "react-confetti"

export default function App() {

  const [dice, setDice] = React.useState(generateAllDice())
  const [tenzies, setTenzies] = React.useState(false)
  const [rollCount, setRollCount] = React.useState(0)

  const [isActive, setIsActive] = React.useState(false)
  const [second, setSecond] = React.useState(0)
  const [minute, setMinute] = React.useState(0)

  function formatHighScore() {
    return `${(minute.toString()).length == 1 ? `0${minute}` : `${minute}}`}:${(second.toString()).length == 1 ? `0${second}` : `${second}`}`
  }

  React.useEffect(() => {
    if (second == 60) {
      setSecond(0)
      setMinute(minute => minute + 1)
    }
    if (minute > 99) {
      setIsActive(false);
      alert('Congrats on finding the secret interaction 😉')
      window.location.reload()
    }
  }, [second])

  React.useEffect(() => {
    let interval = null;

    if (isActive) {
      interval = setInterval(() => {
        setSecond(second => second + 1);
      }, 1000);

    } else {
      clearInterval(interval);
    }
    return () => {
      clearInterval(interval);
    }
  }, [isActive]);

  React.useEffect(() => {
    const allHeld = dice.every(die => die.isHeld)
    const firstValue = dice[0].value
    const sameNumber = dice.every(die => die.value === firstValue)

    if (allHeld && sameNumber) {
      setTenzies(true)
      setIsActive(false);

      const highScore = localStorage.getItem('highscore')
      const currentScore = minute * 60 + second

      if (highScore == null && currentScore !== 0) {
        localStorage.setItem('highscore', formatHighScore())
      } else if (highScore !== null) {
        const highScoreInSeconds = highScore.split("")[0] * 60 + highScore.split("")[1] * 60 + highScore.split("")[3] * 10 + highScore.split("")[4] * 1
        if (currentScore < highScoreInSeconds) {
          localStorage.setItem('highscore', formatHighScore())
        }
      }
    }
  }, [dice])

  function generateNewDie() {
    return {
      id: nanoid(),
      value: Math.floor((Math.random() * 6) + 1),
      isHeld: false
    }
  }

  function generateAllDice() {
    const diceArray = []
    for (let i = 0; i < 10; i++) {
      diceArray.push(generateNewDie())
    }
    return diceArray
  }

  function rollDice() {
    if (!tenzies) {
      setDice(oldDice => oldDice.map(die => {
        return die.isHeld ? { ...die } : generateNewDie()
      }))
      setRollCount(oldCount => oldCount + 1)
    } else {
      setTenzies(false)
      setRollCount(0)
      setDice(generateAllDice)
      setSecond(0);
    }
  }

  function handleDieClick(id) {
    setDice(oldDice => oldDice.map(die => {
      return die.id === id ? { ...die, isHeld: !die.isHeld } : die
    }))
    setIsActive(true);
  }


  const diceElements = dice.map(die => {
    return <Die key={die.id} value={die.value} handleDieClick={() => handleDieClick(die.id)} isHeld={die.isHeld} />
  })

  return (
    <div id="container">
      {tenzies && <Confetti width={window.innerWidth} height={window.innerHeight - 1} />}

      <div id="text-container">
        <p id="title">Tenzies</p>
        <p id="instructions">Roll until all dice are the same. Click each die to freeze it at its current value between rolls.</p>
      </div>
      <div id="timer">
        {(minute.toString()).length == 1 ? `0${minute}` : `${minute}`} : {(second.toString()).length == 1 ? `0${second}` : `${second}`}
      </div>

      <div id="dice-container">
        {diceElements}
      </div>
      <div id="highscore">
        {localStorage.getItem('highscore') == null ? "Be the first to set a highscore!" : `Highscore to beat: ${localStorage.getItem('highscore')}`}
      </div>

      <button id="roll-btn" onClick={rollDice}>{tenzies ? "New Game" : "Roll"}</button>
      <p id="roll-count">{rollCount < 2 ? `${rollCount} roll` : `${rollCount} rolls`}</p>
    </div>
  )
}
