import React, { useEffect, useState } from "react";

const sounds = {
  correct: new Audio("/sounds/correct.mp3"),
  wrong: new Audio("/sounds/wrong.mp3"),
};

const getRangeByGrade = (grade) => {
  switch (grade) {
    case "KG":
      return [1, 9];
    case "KG1":
      return [10, 99];
    case "KG2":
      return [20, 99];
    default:
      return [1, 9];
  }
};

const getRandom = (min, max) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

export default function MathGame({ grade = "KG" }) {
  const [question, setQuestion] = useState("");
  const [correct, setCorrect] = useState(null);
  const [options, setOptions] = useState([]);
  const [score, setScore] = useState(0);
  const [time, setTime] = useState(30);
  const [animate, setAnimate] = useState("");

  useEffect(() => {
    generateQuestion();
  }, [grade]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTime((t) => {
        if (t <= 1) {
          clearInterval(timer);
          alert("Game Over! Score: " + score);
          return 0;
        }
        return t - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [score]);

  const generateQuestion = () => {
    const [min, max] = getRangeByGrade(grade);

    let a = getRandom(min, max);
    let b = getRandom(min, max);

    // Optional: ensure carry for KG2
    if (grade === "KG2" && (a % 10 + b % 10 < 10)) {
      b = getRandom(10, 99);
    }

    const ans = a + b;
    setCorrect(ans);
    setQuestion(`${a} + ${b}`);

    let opts = new Set([ans]);

    while (opts.size < 4) {
      let fake = ans + getRandom(-10, 10);
      if (fake > 0) opts.add(fake);
    }

    setOptions([...opts].sort(() => Math.random() - 0.5));
  };

  const handleClick = (val) => {
    if (val === correct) {
      sounds.correct.currentTime = 0;
      sounds.correct.play();

      setScore((s) => s + 10);
      setAnimate("correct");
    } else {
      sounds.wrong.currentTime = 0;
      sounds.wrong.play();

      setScore((s) => s - 5);
      setAnimate("wrong");
    }

    setTimeout(() => {
      setAnimate("");
      generateQuestion();
    }, 500);
  };

  return (
    <div style={styles.container}>
      <div style={styles.topBar}>
        <div>⏱ {time}s</div>
        <div>⭐ {score}</div>
      </div>

      <div
        style={{
          ...styles.board,
          ...(animate === "correct" && styles.correctAnim),
          ...(animate === "wrong" && styles.wrongAnim),
        }}
      >
        <h1 style={styles.question}>{question} = ?</h1>

        <div style={styles.options}>
          {options.map((opt, i) => (
            <button
              key={i}
              style={styles.option}
              onClick={() => handleClick(opt)}
            >
              {opt}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

/* 🎨 Styles */

const styles = {
  container: {
    padding: 20,
    fontFamily: "Comic Sans MS, sans-serif",
    background: "linear-gradient(to bottom, #FFE066, #FFD6E0)",
    minHeight: "100vh",
  },
  topBar: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
  board: {
    background: "#4CAF50",
    borderRadius: 20,
    padding: 20,
    textAlign: "center",
    color: "#fff",
    boxShadow: "0 10px 20px rgba(0,0,0,0.2)",
  },
  question: {
    fontSize: "2.5rem",
    marginBottom: 20,
  },
  options: {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: 15,
  },
  option: {
    padding: 20,
    fontSize: 22,
    borderRadius: 15,
    border: "none",
    background: "#fff",
    color: "#333",
    cursor: "pointer",
    transition: "0.2s",
  },
  correctAnim: {
    background: "#2ecc71",
    transform: "scale(1.05)",
  },
  wrongAnim: {
    background: "#e74c3c",
    transform: "shake 0.3s",
  },
};