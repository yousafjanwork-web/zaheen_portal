import { useState, useCallback } from "react";

// ---------- Types ----------
type Operator = "+" | "-" | "×" | "÷";

interface Question {
  a: number;
  b: number;
  op: Operator;
  result: number;
  choices: Operator[];
}

interface FeedbackState {
  selected: Operator | null;
  isCorrect: boolean | null;
}

interface ResultCardProps {
  score: number;
  correct: number;
  incorrect: number;
  total: number;
  onRestart: () => void;
}

// ---------- Constants ----------
const TOTAL_ROUNDS = 8;
const ALL_OPS: Operator[] = ["+", "-", "×", "÷"];

// ---------- Speech Function ----------
const speak = (text: string) => {
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 1;
  utterance.pitch = 1;
  window.speechSynthesis.cancel(); // Stop current speech before starting new
  window.speechSynthesis.speak(utterance);
};

// ---------- Question Generator ----------
function generateQuestion(): Question {
  const op = ALL_OPS[Math.floor(Math.random() * ALL_OPS.length)];
  let a: number;
  let b: number;
  let result: number;

  if (op === "+") {
    a = Math.floor(Math.random() * 20) + 1;
    b = Math.floor(Math.random() * 20) + 1;
    result = a + b;
  } else if (op === "-") {
    a = Math.floor(Math.random() * 20) + 5;
    b = Math.floor(Math.random() * (a - 1)) + 1;
    result = a - b;
  } else if (op === "×") {
    a = Math.floor(Math.random() * 10) + 1;
    b = Math.floor(Math.random() * 10) + 1;
    result = a * b;
  } else {
    b = Math.floor(Math.random() * 9) + 1;
    result = Math.floor(Math.random() * 10) + 1;
    a = b * result;
  }

  const distractors = ALL_OPS.filter((o) => o !== op);
  const choices: Operator[] = shuffle([op, ...distractors.slice(0, 3)]);

  return { a, b, op, result, choices };
}

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

// ---------- Result Card ----------
function ResultCard({
  score,
  correct,
  incorrect,
  total,
  onRestart,
}: ResultCardProps) {
  const pct = Math.round((correct / total) * 100);
  const medal = pct === 100 ? "🥇" : pct >= 70 ? "🥈" : pct >= 40 ? "🥉" : "💪";

  return (
    <div style={styles.screen}>
      <div style={styles.card}>
        <div style={{ fontSize: 56, marginBottom: 4, lineHeight: 1 }}>
          {medal}
        </div>
        <h2 style={styles.resultTitle}>
          {pct === 100
            ? "Perfect Score!"
            : pct >= 70
              ? "Great Job!"
              : pct >= 40
                ? "Keep Practicing!"
                : "Try Again!"}
        </h2>
        <p style={styles.resultSub}>Here's how you did</p>
        <div style={styles.statsGrid}>
          <div
            style={{
              ...styles.statBox,
              background: "#f0fdf4",
              border: "1.5px solid #bbf7d0",
            }}
          >
            <span style={{ ...styles.statNum, color: "#16a34a" }}>
              {correct}
            </span>
            <span style={{ ...styles.statLabel, color: "#4ade80" }}>
              Correct
            </span>
          </div>
          <div
            style={{
              ...styles.statBox,
              background: "#fff1f2",
              border: "1.5px solid #fecdd3",
            }}
          >
            <span style={{ ...styles.statNum, color: "#e11d48" }}>
              {incorrect}
            </span>
            <span style={{ ...styles.statLabel, color: "#fb7185" }}>Wrong</span>
          </div>
          <div
            style={{
              ...styles.statBox,
              background: "#f5f3ff",
              border: "1.5px solid #ddd6fe",
            }}
          >
            <span style={{ ...styles.statNum, color: "#7c3aed" }}>{score}</span>
            <span style={{ ...styles.statLabel, color: "#a78bfa" }}>Score</span>
          </div>
        </div>
        <div style={styles.accuracyWrap}>
          <div style={styles.accuracyHeader}>
            <span style={styles.accuracyLabel}>Accuracy</span>
            <span style={styles.accuracyPct}>{pct}%</span>
          </div>
          <div style={styles.barTrack}>
            <div
              style={{
                ...styles.barFill,
                width: `${pct}%`,
                background:
                  pct >= 70 ? "#22c55e" : pct >= 40 ? "#f59e0b" : "#ef4444",
              }}
            />
          </div>
        </div>
        <button onClick={onRestart} style={styles.restartBtn}>
          🔄 Play Again
        </button>
      </div>
    </div>
  );
}

// ---------- Main Game ----------
export default function OperatorGame() {
  const [questions, setQuestions] = useState<Question[]>(() =>
    Array.from({ length: TOTAL_ROUNDS }, generateQuestion),
  );
  const [qIndex, setQIndex] = useState<number>(0);
  const [feedback, setFeedback] = useState<FeedbackState>({
    selected: null,
    isCorrect: null,
  });
  const [score, setScore] = useState<number>(0);
  const [results, setResults] = useState<boolean[]>([]);
  const [gameOver, setGameOver] = useState<boolean>(false);

  // New States for Skip and Retry
  const [hasRetried, setHasRetried] = useState<boolean>(false);
  const [showRetryButton, setShowRetryButton] = useState<boolean>(false);

  const current: Question = questions[qIndex];

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

  const handleSelect = useCallback(
    (op: Operator): void => {
      if (feedback.selected !== null && !showRetryButton) return;

      const isCorrect = op === current.op;
      setFeedback({ selected: op, isCorrect });

      if (isCorrect) {
        speak("Correct"); // <--- Speck functionality
        setScore((s) => s + 10);
        setShowRetryButton(false);
        setTimeout(() => moveToNext(true), 1200);
      } else {
        if (!hasRetried) {
          speak("Try again"); // <--- Speck functionality
          setShowRetryButton(true);
        } else {
          speak("Wrong"); // <--- Speck functionality
          setShowRetryButton(false);
          setTimeout(() => moveToNext(false), 1200);
        }
      }
    },
    [feedback.selected, current.op, hasRetried, showRetryButton, moveToNext],
  );

  const handleRetry = () => {
    setHasRetried(true);
    setShowRetryButton(false);
    setFeedback({ selected: null, isCorrect: null });
  };

  const handleSkip = () => {
    moveToNext(false); // Treat skip as incorrect or just neutral
  };

  const handleRestart = (): void => {
    window.location.reload();
  };

  if (gameOver) {
    const correct = results.filter(Boolean).length;
    return (
      <ResultCard
        score={score}
        correct={correct}
        incorrect={results.length - correct}
        total={TOTAL_ROUNDS}
        onRestart={handleRestart}
      />
    );
  }

  const { a, b, result, choices } = current;
  const { selected, isCorrect } = feedback;
  const answered = selected !== null;

  const getButtonStyle = (op: Operator): React.CSSProperties => {
    const base = styles.opBtn;
    if (!answered) return base;
    if (op === current.op) return { ...base, ...styles.opBtnCorrect };
    if (op === selected) return { ...base, ...styles.opBtnWrong };
    return { ...base, ...styles.opBtnDim };
  };

  return (
    <div style={styles.screen}>
      <div style={styles.card}>
        <div style={styles.header}>
          <span style={styles.levelBadge}>
            Q {qIndex + 1}/{TOTAL_ROUNDS}
          </span>
          <span style={styles.scoreLabel}>⭐ {score}</span>
        </div>

        <div style={styles.dotsRow}>
          {Array.from({ length: TOTAL_ROUNDS }).map((_, i) => (
            <div
              key={i}
              style={{
                ...styles.dot,
                background:
                  i < results.length
                    ? results[i]
                      ? "#22c55e"
                      : "#ef4444"
                    : i === qIndex
                      ? "#1a237e"
                      : "#e2e8f0",
              }}
            />
          ))}
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

        <p style={styles.instruction}>Which operator completes the equation?</p>

        <div style={styles.equation}>
          <span style={styles.num}>{a}</span>
          <span style={styles.blank}>{isCorrect ? current.op : "?"}</span>
          <span style={styles.num}>{b}</span>
          <span style={styles.equals}>=</span>
          <span style={styles.num}>{result}</span>
        </div>

        <div style={styles.feedbackRow}>
          {answered && (
            <span
              style={{
                ...styles.feedbackMsg,
                color: isCorrect ? "#16a34a" : "#e11d48",
              }}
            >
              {isCorrect
                ? "✨ Correct!"
                : showRetryButton
                  ? "Oops! Try one more time."
                  : `❌ It was ${current.op}`}
            </span>
          )}
        </div>

        <div style={styles.choicesGrid}>
          {choices.map((op) => (
            <button
              key={op}
              onClick={() => handleSelect(op)}
              disabled={answered && !showRetryButton}
              style={getButtonStyle(op)}
            >
              {op}
            </button>
          ))}
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

// ---------- Styles ----------
const styles: Record<string, React.CSSProperties> = {
  screen: {
    minHeight: "300px",
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "1rem",
    fontFamily: "'Trebuchet MS', 'Segoe UI', sans-serif",
    background: "transparent",
  },
  card: {
    width: "100%",
    maxWidth: 400,
    background: "#ffffff",
    borderRadius: 20,
    boxShadow: "0 6px 0 #cbd5e1",
    border: "2px solid #e2e8f0",
    padding: "1.25rem 1.25rem 1.5rem",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  header: {
    width: "100%",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  levelBadge: {
    background: "#1a237e",
    color: "#fff",
    padding: "4px 12px",
    borderRadius: 99,
    fontSize: 12,
    fontWeight: 700,
  },
  scoreLabel: { fontSize: 14, fontWeight: 700, color: "#475569" },
  dotsRow: {
    display: "flex",
    justifyContent: "center",
    gap: 6,
    marginBottom: 16,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: "50%",
    transition: "background 0.3s",
  },
  instruction: {
    fontSize: 13,
    color: "#64748b",
    fontWeight: 700,
    marginBottom: 15,
    textAlign: "center",
  },
  equation: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    marginBottom: 10,
  },
  num: { fontSize: 42, fontWeight: 900, color: "#0f172a", lineHeight: 1 },
  blank: {
    fontSize: 34,
    fontWeight: 900,
    color: "#1a237e",
    background: "#f1f5f9",
    border: "3px dashed #1a237e",
    borderRadius: 12,
    width: 54,
    height: 54,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  equals: { fontSize: 32, fontWeight: 700, color: "#94a3b8" },
  feedbackRow: {
    height: 30,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  feedbackMsg: { fontSize: 15, fontWeight: 800 },
  choicesGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 12,
    width: "100%",
  },
  opBtn: {
    fontSize: 32,
    fontWeight: 900,
    padding: "16px 0",
    borderRadius: 16,
    border: "none",
    background: "#1a237e",
    color: "#ffffff",
    boxShadow: "0 4px 0 #0d123e",
    cursor: "pointer",
    width: "100%",
  },
  opBtnCorrect: { background: "#16a34a", boxShadow: "0 4px 0 #15803d" },
  opBtnWrong: { background: "#dc2626", boxShadow: "0 4px 0 #991b1b" },
  opBtnDim: { background: "#475569", opacity: 0.6 },
  skipBtn: {
    background: "#334155",
    color: "white",
    border: "none",
    padding: "6px 12px",
    borderRadius: 8,
    fontSize: 12,
    fontWeight: 700,
    cursor: "pointer",
  },
  retryBtn: {
    marginTop: 20,
    width: "100%",
    padding: "14px",
    background: "#b71c1c",
    color: "white",
    border: "none",
    borderRadius: 16,
    fontSize: 18,
    fontWeight: 900,
    boxShadow: "0 4px 0 #7f1d1d",
    cursor: "pointer",
  },
  resultTitle: {
    fontSize: 24,
    fontWeight: 900,
    color: "#1e293b",
    margin: "10px 0",
  },
  resultSub: { fontSize: 14, color: "#64748b", marginBottom: 20 },
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr 1fr",
    gap: 10,
    width: "100%",
    marginBottom: 20,
  },
  statBox: {
    borderRadius: 14,
    padding: "12px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  statNum: { fontSize: 28, fontWeight: 900 },
  statLabel: { fontSize: 11, fontWeight: 700, textTransform: "uppercase" },
  accuracyWrap: {
    width: "100%",
    background: "#f1f5f9",
    borderRadius: 14,
    padding: "15px",
    marginBottom: 20,
  },
  accuracyHeader: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  accuracyLabel: { fontSize: 11, fontWeight: 700, color: "#64748b" },
  accuracyPct: { fontSize: 14, fontWeight: 900 },
  barTrack: {
    height: 10,
    background: "#e2e8f0",
    borderRadius: 99,
    overflow: "hidden",
  },
  barFill: { height: "100%", transition: "width 0.8s ease" },
  restartBtn: {
    width: "100%",
    padding: "16px",
    background: "#1a237e",
    color: "#fff",
    border: "none",
    borderRadius: 16,
    fontSize: 16,
    fontWeight: 900,
    boxShadow: "0 4px 0 #0d123e",
    cursor: "pointer",
  },
};
