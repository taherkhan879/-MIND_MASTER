import { useState, useEffect, useRef } from "react";
import "./App.css";

const levels = {
  Easy: { size: 3, time: 30 },
  Medium: { size: 4, time: 40 },
  Hard: { size: 5, time: 25 },
  Expert: { size: 6, time: 30 },
};

const defaultRecords = {
  Easy: { bestScore: 0, bestTime: null },
  Medium: { bestScore: 0, bestTime: null },
  Hard: { bestScore: 0, bestTime: null },
  Expert: { bestScore: 0, bestTime: null },
  gamesPlayed: 0,
  gamesWon: 0,
};

function App() {
  const [numbers, setNumbers] = useState([]);
  const [level, setLevel] = useState("Hard");
  const [target, setTarget] = useState(1);
  const [score, setScore] = useState(0);
  const [time, setTime] = useState(25);
  const [clickedNumbers, setClickedNumbers] = useState([]);
  const [wrongNumber, setWrongNumber] = useState(null);

  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [gameWon, setGameWon] = useState(false);

  const [records, setRecords] = useState(() => {
    try {
      const saved = JSON.parse(
        localStorage.getItem("mindMasterRecords")
      );

      return saved
        ? { ...defaultRecords, ...saved }
        : defaultRecords;
    } catch {
      return defaultRecords;
    }
  });

  const gameRecorded = useRef(false);

  const totalNumbers = levels[level].size ** 2;

  // Save records whenever they change
  useEffect(() => {
    localStorage.setItem(
      "mindMasterRecords",
      JSON.stringify(records)
    );
  }, [records]);

  // Update personal records
  const saveRecord = (finalScore, won, elapsedTime) => {
    if (gameRecorded.current) return;

    gameRecorded.current = true;

    setRecords((prev) => {
      const updated = {
        ...prev,

        [level]: {
          bestScore: Math.max(
            prev[level].bestScore,
            finalScore
          ),

          bestTime:
            won &&
            (prev[level].bestTime === null ||
              elapsedTime < prev[level].bestTime)
              ? elapsedTime
              : prev[level].bestTime,
        },

        gamesPlayed: prev.gamesPlayed + 1,

        gamesWon: prev.gamesWon + (won ? 1 : 0),
      };

      return updated;
    });
  };

  // Countdown timer
  useEffect(() => {
    if (!gameStarted || gameOver || gameWon) return;

    if (time <= 0) {
      saveRecord(score, false, levels[level].time);

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
    const total = levels[level].size ** 2;

    const shuffled = Array.from(
      { length: total },
      (_, i) => i + 1
    ).sort(() => Math.random() - 0.5);

    gameRecorded.current = false;

    setNumbers(shuffled);
    setTarget(1);
    setScore(0);
    setTime(levels[level].time);
    setClickedNumbers([]);
    setWrongNumber(null);

    setGameOver(false);
    setGameWon(false);
    setGameStarted(true);
  };

  // Change difficulty
  const changeLevel = (newLevel) => {
    if (gameStarted) return;

    setLevel(newLevel);
    setTime(levels[newLevel].time);
    setNumbers([]);
    setScore(0);
    setTarget(1);
    setClickedNumbers([]);
    setGameOver(false);
    setGameWon(false);
  };

  // Number clicking
  const handleNumberClick = (num) => {
    if (!gameStarted || gameOver || gameWon) return;

    if (num === target) {
      const newScore = score + 1;

      setClickedNumbers((prev) => [...prev, num]);
      setScore(newScore);

      if (num === totalNumbers) {
        const elapsedTime = levels[level].time - time;

        saveRecord(newScore, true, elapsedTime);

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

  // Accuracy calculation
  const accuracy =
    score === 0 ? 0 : Math.round((score / totalNumbers) * 100);

  return (
    <div className="game-container">

      <h1>MIND MASTER 🧠</h1>

      <p>
        Test Your Focus. Challenge Your Brain. Beat the Clock!
      </p>

      {/* Difficulty Selection */}

      {!gameStarted && (
        <div className="level-selection">

          <h3>SELECT DIFFICULTY</h3>

          <div className="level-buttons">

            {Object.keys(levels).map((item) => (
              <button
                key={item}
                className={`level-btn ${
                  level === item ? "active-level" : ""
                }`}
                onClick={() => changeLevel(item)}
              >
                {item}
              </button>
            ))}

          </div>
        </div>
      )}

      {/* Personal Records */}

      {!gameStarted && (
        <div className="records-container">

          <h2>🏆 PERSONAL RECORDS</h2>

          <div className="records-grid">

            <div className="record-card">
              <h3>Games Played</h3>
              <h2>{records.gamesPlayed}</h2>
            </div>

            <div className="record-card">
              <h3>Games Won</h3>
              <h2>{records.gamesWon}</h2>
            </div>

            <div className="record-card">
              <h3>Best Score</h3>
              <h2>
                {records[level].bestScore}/{totalNumbers}
              </h2>
            </div>

            <div className="record-card">
              <h3>Best Time</h3>
              <h2>
                {records[level].bestTime === null
                  ? "--"
                  : `${records[level].bestTime}s`}
              </h2>
            </div>

          </div>
        </div>
      )}

      {/* Game Information */}

      <div className="game-info">

        <div>
          <h3>TIME</h3>
          <h2>{time}s</h2>
        </div>

        <div>
          <h3>TARGET</h3>
          <h2>
            {target > totalNumbers ? "DONE" : target}
          </h2>
        </div>

        <div>
          <h3>SCORE</h3>
          <h2>
            {score}/{totalNumbers}
          </h2>
        </div>

      </div>

      {/* Number Grid */}

      <div
        className="number-grid"
        style={{
          gridTemplateColumns: `repeat(${levels[level].size}, 1fr)`,
        }}
      >

        {numbers.map((num) => (
          <button
            key={num}
            className={`number-box ${
              clickedNumbers.includes(num) ? "correct" : ""
            } ${wrongNumber === num ? "wrong" : ""}`}
            onClick={() => handleNumberClick(num)}
            disabled={
              !gameStarted || clickedNumbers.includes(num)
            }
          >
            {num}
          </button>
        ))}

      </div>

      {/* Start Button */}

      {!gameStarted && !gameOver && !gameWon && (
        <button className="start-btn" onClick={startGame}>
          START GAME
        </button>
      )}

      {/* Game Over */}

      {gameOver && (
        <div className="result">

          <h2>⏰ TIME UP!</h2>

          <h1>
            {score >= totalNumbers * 0.8
              ? "🏆 EXCELLENT!"
              : score >= totalNumbers * 0.4
              ? "⭐ GOOD!"
              : score >= 1
              ? "💪 KEEP TRYING!"
              : "😅 TRY AGAIN!"}
          </h1>

          <p>Your Score: {score}/{totalNumbers}</p>

          <p>Accuracy: {accuracy}%</p>

          <button className="start-btn" onClick={startGame}>
            PLAY AGAIN
          </button>

        </div>
      )}

      {/* Victory Screen */}

      {gameWon && (
        <div className="result">

          <h2>🎉 YOU WON!</h2>

          <h1>🏆 PERFECT PERFORMANCE!</h1>

          <p>
            Congratulations! Your Score: {score}/{totalNumbers}
          </p>

          <p>Accuracy: 100%</p>

          <p>Completion Time: {levels[level].time - time}s</p>

          <button className="start-btn" onClick={startGame}>
            PLAY AGAIN
          </button>

        </div>
      )}

    </div>
  );
}

export default App;
