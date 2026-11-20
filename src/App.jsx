import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [numbers, setNumbers] = useState([]);
  const [target, setTarget] = useState(1);
  const [score, setScore] = useState(0);
  const [time, setTime] = useState(25);
  const [clickedNumbers, setClickedNumbers] = useState([]);
  const [wrongNumber, setWrongNumber] = useState(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [gameWon, setGameWon] = useState(false);

  // Countdown timer
  useEffect(() => {
    if (!gameStarted || gameOver || gameWon) return;

    if (time === 0) {
      setGameOver(true);
      setGameStarted(false);
      return;
    }

    const timer = setTimeout(() => {
      setTime((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [gameStarted, time, gameOver, gameWon]);

  // Start game
  const startGame = () => {
    const shuffled = Array.from({ length: 25 }, (_, i) => i + 1)
      .sort(() => Math.random() - 0.5);

    setNumbers(shuffled);
    setTarget(1);
    setScore(0);
    setTime(25);
    setClickedNumbers([]);
    setWrongNumber(null);
    setGameOver(false);
    setGameWon(false);
    setGameStarted(true);
  };

  // Number clicking
  const handleNumberClick = (num) => {
    if (!gameStarted || gameOver || gameWon) return;

    if (num === target) {
      setClickedNumbers((prev) => [...prev, num]);
      setScore((prev) => prev + 1);

      if (num === 25) {
        setGameWon(true);
        setGameStarted(false);
      } else {
        setTarget((prev) => prev + 1);
      }

    } else {
      setWrongNumber(num);

      setTimeout(() => {
        setWrongNumber(null);
      }, 400);
    }
  };

  return (
    <div className="game-container">

      <h1>MIND GAME 🧠</h1>
      <p>Test Your Focus. Challenge Your Brain. Beat the Clock!</p>

      <div className="game-info">

        <div>
          <h3>TIME</h3>
          <h2>{time}s</h2>
        </div>

        <div>
          <h3>TARGET</h3>
          <h2>{target > 25 ? "DONE" : target}</h2>
        </div>

        <div>
          <h3>SCORE</h3>
          <h2>{score}/25</h2>
        </div>

      </div>

      <div className="number-grid">

        {numbers.map((num) => (
          <button
            key={num}
            className={`number-box ${
              clickedNumbers.includes(num) ? "correct" : ""
            } ${wrongNumber === num ? "wrong" : ""}`}
            onClick={() => handleNumberClick(num)}
            disabled={!gameStarted || clickedNumbers.includes(num)}
          >
            {num}
          </button>
        ))}

      </div>

      {!gameStarted && !gameOver && !gameWon && (
        <button className="start-btn" onClick={startGame}>
          START GAME
        </button>
      )}

      {gameOver && (
  <div className="result">
    <h2>⏰ TIME UP!</h2>
    <h1>
      {score >= 20
        ? "🏆 EXCELLENT!"
        : score >= 10
        ? "⭐ GOOD!"
        : score >= 1
        ? "💪 KEEP TRYING!"
        : "😅 TRY AGAIN!"}
    </h1>

    <p>Your Score: {score}/25</p>

    <button className="start-btn" onClick={startGame}>
      PLAY AGAIN
    </button>
  </div>
)}

      {gameWon && (
        <div className="result">
          <h2>🎉 YOU WON!</h2>
          <p>Congratulations! Your Score: {score}/25</p>
          <button className="start-btn" onClick={startGame}>
            PLAY AGAIN
          </button>
        </div>
      )}

    </div>
  );
}

export default App;