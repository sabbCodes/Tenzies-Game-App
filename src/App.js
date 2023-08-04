import React, { useState, useEffect } from "react";
import "./App.css";
import Die from "./Die";
import { nanoid } from "nanoid";
import Confetti from "react-confetti";
import Popup from "./Popup";
import useWindowSize from 'react-use/lib/useWindowSize';

export default function App() {
  const [dice, setDice] = useState(allNewDice());
  const [tenzies, setTenzies] = useState(false);
  const [rollCount, setRollCount] = useState(0);
  const [isRolling, setIsRolling] = useState(false);
  const [showClearTimePopup, setShowClearTimePopup] = useState(false);
  const [showWinPopup, setShowWinPopup] = useState(false);

  useEffect(() => {
    const allHeld = dice.every(die => die.isHeld);
    const firstValue = dice[0].value;
    const allSameValue = dice.every(die => die.value === firstValue);

    if (allHeld && allSameValue && !tenzies) {
      setTenzies(true);
      setShowWinPopup(true);
    };
  }, [dice, tenzies]);

  useEffect(() => {
    const heldDice = dice.filter(die => die.isHeld && die.hasOwnProperty('value'));
    checkHeldDice(heldDice);
  }, [dice]);

  function generateNewDie() {
    return {
      value: Math.ceil(Math.random() * 6),
      isHeld: false,
      id: nanoid(),
    };
  };

  function allNewDice() {
    const newDice = [];
    for (let i = 0; i < 10; i++) {
      newDice.push(generateNewDie());
    }
    return newDice;
  };

  function rollDice() {
    // Check if it's a new game or a roll
    const isNewGame = tenzies;

    // Check if at least one die is held
    const isAnyDieHeld = dice.some(die => die.isHeld);

    if (isNewGame && isAnyDieHeld) {
      setRollCount(1);
      setTenzies(false);
      setDice(allNewDice());
      setShowWinPopup(false);
      setShowClearTimePopup(false);
      setIsRolling(false);
      return;
    }

    // Update dice state
    setDice(oldDice =>
      oldDice.map(die => {
        if (die.isHeld) return die;
        return { ...die, isRolling: true, value: Math.ceil(Math.random() * 6) };
      })
    );

    setRollCount(prevRollCount => (isNewGame ? 1 : prevRollCount + 1));
    setTenzies(isNewGame ? false : tenzies);
    setIsRolling(!isNewGame);

    const allHeld = dice.every(die => die.isHeld);
    const firstValue = dice[0].value;
    const allSameValue = dice.every(die => die.value === firstValue);

    if (allHeld && allSameValue && !tenzies) {
      setTenzies(true);
      setShowWinPopup(true);
    };
  };

  function checkHeldDice(heldDice) {
    if (heldDice.length === 0) {
      setShowClearTimePopup(false); // Reset the popup if no dice are selected
      return;
    };

    const firstValue = heldDice[0].value;
    const allSameValue = heldDice.every(die => die.value === firstValue);
    if (!allSameValue) {
      setShowClearTimePopup(true);
    } else {
      setShowClearTimePopup(false);
    };
  };

  function holdDice(id) {
    setDice(oldDice =>
      oldDice.map(die => {
        return die.id === id ? { ...die, isHeld: !die.isHeld } : die;
      })
    );
  };

  function handleDieHoldChange(isHeld, id) {
    setDice(oldDice =>
      oldDice.map(die => {
        if (die.id === id) {
          const updatedDie = { ...die, isHeld };
          if (isHeld && !die.hasOwnProperty('value')) {
            // Generate a random value for held dice if it doesn't have a value
            updatedDie.value = Math.ceil(Math.random() * 6);
          }
          return updatedDie;
        }
        return die;
      })
    );
  };

  // For Confetti
  const { width, height } = useWindowSize();

  return (
    <section>
      {tenzies && (
        <Confetti
          width={width}
          height={height}
          numberOfPieces={700}
        />
      )}
      <main>
        <h1 className="title">Tenzies</h1>
        <p>Roll Count: {rollCount}</p>
        <p className="instructions">
          Roll until all dice are the same. Click each die to freeze it at its current value between rolls.
        </p>
        {showClearTimePopup && (
          <Popup
            message="Warning: All held dice must have the same value!"
            onClose={() => setShowClearTimePopup(false)}
            style={{ color: "red" }}
          />
        )}
        {showWinPopup && (
          <Popup
            message="Yayyy!! You Won!!!🥳🥳"
            onClose={() => setShowWinPopup(false)}
            style={{ color: "#1cb026" }}
          />
        )}
        <div className="dice-container">
          {dice.map(die => (
            <Die
              key={die.id}
              value={die.value}
              isHeld={die.isHeld}
              isRolling={isRolling && !die.isHeld}
              holdDice={() => holdDice(die.id)}
              onAnimationComplete={() => setIsRolling(false)}
              onHoldChange={isHeld => handleDieHoldChange(isHeld, die.id)}
            />
          ))}
        </div>
        <button className="roll-dice" onClick={rollDice}>
          {tenzies ? "New Game" : "Roll"}
        </button>
      </main>
    </section>
  );
}

