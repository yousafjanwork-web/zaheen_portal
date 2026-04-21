import { useState, useCallback } from "react";

// ---------- Types ----------
interface Question {
  a: number;
  b: number;
  correct: number;
  options: number[];
}

interface FeedbackState {
  selected: number | null;
  isCorrect: boolean | null;
}

// ---------- Constants ----------
const TOTAL_ROUNDS = 8;
const BALLOON_COLORS = ["#ff7eb9", "#7afcff", "#feff9c", "#ff9248"];

// ---------- Speech Function ----------
const speak = (text: string) => {
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 1;
  utterance.pitch = 1.2; // Slightly higher pitch for the balloon theme
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(utterance);
};

// ---------- Question Generator ----------
function generateQuestion(): Question {
  const a = Math.floor(Math.random() * 12) + 1;
  const b = Math.floor(Math.random() * 12) + 1;
  const correct = a + b;

  const optionsSet = new Set<number>([correct]);
  while (optionsSet.size < 4) {
    const offset = Math.floor(Math.random() * 6) - 3;
    const fake = correct + offset;
    if (fake > 0 && !optionsSet.has(fake)) optionsSet.add(fake);
  }

  return {
    a,
    b,
    correct,
    options: [...Array.from(optionsSet)].sort(() => Math.random() - 0.5),
  };
}

// ---------- Main Game ----------
export default function BalloonPopGame() {
  const [questions] = useState<Question[]>(() =>
    Array.from({ length: TOTAL_ROUNDS }, generateQuestion),
  );
  const [qIndex, setQIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [results, setResults] = useState<boolean[]>([]);
  const [feedback, setFeedback] = useState<FeedbackState>({
    selected: null,
    isCorrect: null,
  });
  const [gameOver, setGameOver] = useState(false);

  const [hasRetried, setHasRetried] = useState<boolean>(false);
  const [showRetryButton, setShowRetryButton] = useState<boolean>(false);

  const current = questions[qIndex];
  const answered = feedback.selected !== null;

  const moveToNext = useCallback(
    (isCorrect: boolean) => {
      const next = qIndex + 1;
      setResults((r) => [...r, isCorrect]);
      if (next >= TOTAL_ROUNDS) {
        setGameOver(true);
      } else {
        setQIndex(next);
        setFeedback({ selected: null, isCorrect: null });
        setHasRetried(false);
        setShowRetryButton(false);
      }
    },
    [qIndex],
  );

  const handlePop = useCallback(
    (val: number) => {
      if (answered && !showRetryButton) return;

      const isCorrect = val === current.correct;
      setFeedback({ selected: val, isCorrect });

      if (isCorrect) {
        speak("Correct"); // Speech Trigger
        setScore((s) => s + 20);
        setShowRetryButton(false);
        setTimeout(() => moveToNext(true), 1000);
      } else {
        if (!hasRetried) {
          speak("Try again"); // Speech Trigger
          setShowRetryButton(true);
        } else {
          speak("Wrong"); // Speech Trigger
          setShowRetryButton(false);
          setTimeout(() => moveToNext(false), 1000);
        }
      }
    },
    [answered, current.correct, hasRetried, showRetryButton, moveToNext],
  );

  const handleRetry = () => {
    setHasRetried(true);
    setShowRetryButton(false);
    setFeedback({ selected: null, isCorrect: null });
  };

  const handleSkip = () => {
    moveToNext(false);
  };

  if (gameOver) {
    return (
      <div style={styles.screen}>
        <div style={styles.card}>
          <div style={{ fontSize: 60 }}>{score > 100 ? "🏆" : "🎈"}</div>
          <h2 style={styles.title}>Party Over!</h2>
          <p style={styles.subtitle}>You scored {score} points</p>
          <div style={styles.statsRow}>
            <div style={styles.statItem}>
              <b>{results.filter(Boolean).length}</b> Popped
            </div>
            <div style={styles.statItem}>
              <b>{results.filter((v) => !v).length}</b> Missed
            </div>
          </div>
          <button
            style={styles.restartBtn}
            onClick={() => window.location.reload()}
          >
            Play Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.screen}>
      <div style={styles.card}>
        <div style={styles.header}>
          <div style={styles.progressLabel}>
            Round {qIndex + 1}/{TOTAL_ROUNDS}
          </div>
          <div style={styles.scoreLabel}>Points: {score}</div>
        </div>

        <div
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "flex-end",
            marginBottom: 10,
          }}
        >
          <button onClick={handleSkip} style={styles.skipBtn}>
            Skip ⏭️
          </button>
        </div>

        <div style={styles.mathArea}>
          <h1 style={styles.equation}>
            {current.a} + {current.b} ={" "}
            <span style={styles.placeholder}>
              {feedback.isCorrect ? current.correct : "?"}
            </span>
          </h1>
        </div>

        <div style={styles.balloonGrid}>
          {current.options.map((val, i) => {
            const isThisSelected = feedback.selected === val;

            return (
              <div
                key={`${qIndex}-${val}`}
                onClick={() => handlePop(val)}
                style={{
                  ...styles.balloon,
                  background: BALLOON_COLORS[i],
                  transform:
                    answered && isThisSelected && feedback.isCorrect
                      ? "scale(0)"
                      : "scale(1)",
                  opacity:
                    answered && !isThisSelected && !showRetryButton ? 0.5 : 1,
                  border:
                    isThisSelected && !feedback.isCorrect
                      ? "4px solid #dc2626"
                      : "none",
                  boxShadow: `inset -10px -10px 0 rgba(0,0,0,0.1), 0 10px 20px rgba(0,0,0,0.1)`,
                  cursor: answered && !showRetryButton ? "default" : "pointer",
                }}
              >
                <span style={styles.balloonText}>{val}</span>
                <div style={styles.string} />
              </div>
            );
          })}
        </div>

        <div style={styles.messageBox}>
          {answered && (
            <div
              style={{
                color: feedback.isCorrect ? "#2ecc71" : "#e74c3c",
                fontWeight: 800,
                textTransform: "uppercase",
              }}
            >
              {feedback.isCorrect
                ? "POP! Perfect!"
                : showRetryButton
                  ? "Oops! Try again!"
                  : "Wrong"}
            </div>
          )}
        </div>

        {showRetryButton && (
          <button onClick={handleRetry} style={styles.retryBtn}>
            🔄 Try Again
          </button>
        )}
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  screen: {
    minHeight: "300px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "'Comic Sans MS', cursive, sans-serif",
    padding: "20px",
  },
  card: {
    width: "100%",
    maxWidth: "400px",
    background: "#fff",
    borderRadius: "30px",
    padding: "30px",
    textAlign: "center",
    boxShadow: "0 20px 40px rgba(0,0,0,0.05)",
    border: "4px solid #e0f2fe",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "10px",
  },
  progressLabel: { fontSize: "14px", color: "#7dd3fc", fontWeight: "bold" },
  scoreLabel: { fontSize: "14px", color: "#0ea5e9", fontWeight: "bold" },
  mathArea: {
    background: "#f8fafc",
    padding: "20px",
    borderRadius: "20px",
    marginBottom: "20px",
  },
  equation: { fontSize: "40px", margin: 0, color: "#1e293b" },
  placeholder: { color: "#38bdf8", borderBottom: "4px dashed #bae6fd" },
  balloonGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "30px",
    justifyItems: "center",
    padding: "10px",
  },
  balloon: {
    width: "80px",
    height: "100px",
    borderRadius: "50% 50% 50% 50% / 40% 40% 60% 60%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    transition: "all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
  },
  balloonText: { fontSize: "24px", fontWeight: "bold", color: "#334155" },
  string: {
    position: "absolute",
    bottom: "-20px",
    left: "50%",
    width: "2px",
    height: "20px",
    background: "#cbd5e1",
  },
  messageBox: {
    height: "40px",
    marginTop: "10px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  skipBtn: {
    background: "#1a237e",
    color: "white",
    border: "none",
    padding: "8px 16px",
    borderRadius: "10px",
    fontSize: "12px",
    fontWeight: "bold",
    cursor: "pointer",
  },
  retryBtn: {
    width: "100%",
    padding: "15px",
    marginTop: "15px",
    borderRadius: "15px",
    border: "none",
    background: "#b71c1c",
    color: "white",
    fontSize: "18px",
    fontWeight: "bold",
    cursor: "pointer",
    boxShadow: "0 4px 0 #7f1d1d",
  },
  title: { fontSize: "28px", color: "#0f172a", margin: "10px 0" },
  subtitle: { color: "#64748b", marginBottom: "20px" },
  statsRow: {
    display: "flex",
    justifyContent: "space-around",
    marginBottom: "30px",
  },
  statItem: { fontSize: "14px", color: "#475569" },
  restartBtn: {
    width: "100%",
    padding: "15px",
    borderRadius: "15px",
    border: "none",
    background: "#0ea5e9",
    color: "white",
    fontSize: "18px",
    fontWeight: "bold",
    cursor: "pointer",
    boxShadow: "0 4px 0 #0284c7",
  },
};
