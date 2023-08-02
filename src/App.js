import React from "react";
import './App.css';
import Die from "./Die";
import { nanoid } from "nanoid";
import Confetti from "react-confetti";

export default function App() {
  const [dice, setDice] = React.useState(allNewDice());
  const [tenzies, setTenzies] = React.useState(false);
  const [rollCount, setRollCount] = React.useState(0);
  const [startTime, setStartTime] = React.useState(null);
  const [endTime, setEndTime] = React.useState(null);
  const [bestTime, setBestTime] = React.useState(() => {
    const storedBestTime = parseInt(localStorage.getItem("bestTime"));
    return Number.isNaN(storedBestTime) ? null : storedBestTime;
  });

  React.useEffect(() => {
    const allHeld = dice.every((die) => die.isHeld);
    const firstValue = dice[0].value;
    const allSameValue = dice.every((die) => die.value === firstValue);
    if (allHeld && allSameValue && !tenzies && endTime === null) {
        // Stop the timer when the player wins the game
        setEndTime(new Date());
        setTenzies(true);
    }
  }, [dice, endTime, tenzies]);

    React.useEffect(() => {
    if (tenzies && endTime !== null) {
        // Calculate the elapsed time in milliseconds
        const elapsedMilliseconds = endTime - startTime;

        // Check if it's a new best time
        if (bestTime === null || elapsedMilliseconds < bestTime) {
        setBestTime(elapsedMilliseconds);
        storeBestTime(elapsedMilliseconds);
        alert("Congratulations! You've achieved a new best time!");
        }
    }
    }, [endTime, startTime, bestTime, tenzies]);

    // function handleWin() {
    //     // Calculate the elapsed time in milliseconds
    //     const elapsedMilliseconds = endTime - startTime;

    //     // Check if it's a new best time
    //     if (bestTime === null || elapsedMilliseconds < bestTime) {
    //         setBestTime(elapsedMilliseconds);
    //         storeBestTime(elapsedMilliseconds);
    //         alert("Congratulations! You've achieved a new best time!");
    //     }
    // }

  function generateNewDie() {
    return {
      value: Math.ceil(Math.random() * 6),
      isHeld: false,
      id: nanoid(),
    };
  }

  function allNewDice() {
    const newDice = [];
    for (let i = 0; i < 10; i++) {
      newDice.push(generateNewDie());
    }
    return newDice;
  }

  function rollDice() {
      if (!tenzies) {
        setDice((oldDice) =>
        oldDice.map((die) => {
            return die.isHeld ? die : generateNewDie();
        })
        );
        setRollCount((prevRollCount) => prevRollCount + 1);

        // Start the timer when the first winning combination is achieved
        if (!tenzies && endTime === null) {
        setStartTime(new Date());
        }
    } else {
        setTenzies(false);
        setDice(allNewDice());
        setRollCount(0);
        setStartTime(null);
        setEndTime(null);
    }
  }

  function holdDice(id) {
    setDice((oldDice) =>
      oldDice.map((die) => {
        return die.id === id ? { ...die, isHeld: !die.isHeld } : die;
      })
    );
  }

  function storeBestTime(timeInMilliseconds) {
    localStorage.setItem("bestTime", timeInMilliseconds);
  }

  function clearBestTime() {
    localStorage.removeItem("bestTime");
    setBestTime(null);
  }

  // Calculate the elapsed time in milliseconds
  const elapsedMilliseconds =
    startTime !== null && endTime !== null ? endTime - startTime : null;

  const diceElements = dice.map((die) => (
    <Die
      key={die.id}
      value={die.value}
      isHeld={die.isHeld}
      holdDice={() => holdDice(die.id)}
    />
  ));

  return (
    <main>
      {tenzies && <Confetti />}
      <h1 className="title">Tenzies</h1>
      <p>Roll Count: {rollCount}</p>
      {tenzies && elapsedMilliseconds !== null && (
        <p>
          Elapsed Time: {elapsedMilliseconds} {elapsedMilliseconds !== 1 ? "milliseconds" : "millisecond"}
        </p>
      )}
      <p className="instructions">
        Roll until all dice are the same. Click each die to freeze it at its current value between rolls.
      </p>
      {bestTime !== null ? (
        <div className="time-container">
            <p>
            Best Time: {bestTime}{" "}
            {bestTime !== 1 ? "milliseconds" : "millisecond"}
            </p>
            <button className="clear-time"  onClick={clearBestTime}>Clear Time</button>
        </div>
        ) : (
        <p>Best Time: N/A</p>
        )}
      <div className="dice-container">{diceElements}</div>
      <button className="roll-dice" onClick={rollDice}>
        {tenzies ? "New Game" : "Roll"}
      </button>
    </main>
  );
}
