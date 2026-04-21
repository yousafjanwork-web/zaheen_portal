import { useState, useCallback } from "react";

// ---------- Types ----------
interface Question {
  sequence: (number | string)[];
  correct: number;
  choices: number[];
}

interface FeedbackState {
  selected: number | null;
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
const TOTAL_ROUNDS = 10;
const CHOICE_COLORS = ["#ff7eb9", "#7afcff", "#feff9c", "#ff9248"];

// ---------- Speech Function ----------
const speak = (text: string) => {
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 1;
  utterance.pitch = 1.1;
  window.speechSynthesis.cancel(); // Stop current speech before starting new
  window.speechSynthesis.speak(utterance);
};

// ---------- Question Generator ----------
function generateQuestion(): Question {
  const start = Math.floor(Math.random() * 20) + 1;
  const step =
    (Math.floor(Math.random() * 5) + 1) * (Math.random() > 0.5 ? 1 : -1);
  const missingIndex = Math.floor(Math.random() * 4);

  const fullSequence = [
    start,
    start + step,
    start + 2 * step,
    start + 3 * step,
  ];

  const correct = fullSequence[missingIndex];
  const sequence: (number | string)[] = [...fullSequence];
  sequence[missingIndex] = "?";

  const distractors = new Set<number>();
  while (distractors.size < 3) {
    const diff =
      (Math.floor(Math.random() * 5) + 1) * (Math.random() > 0.5 ? 1 : -1);
    const val = correct + diff;
    if (val !== correct) distractors.add(val);
  }

  const choices = shuffle([correct, ...Array.from(distractors)]);

  return { sequence, correct, choices };
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
  const medal = pct === 100 ? "👑" : pct >= 70 ? "🌟" : pct >= 40 ? "👍" : "📚";

  return (
    <div style={styles.screen}>
      <div style={styles.card}>
        <div style={{ fontSize: 56, marginBottom: 4 }}>{medal}</div>
        <h2 style={styles.resultTitle}>
          {pct === 100 ? "Sequence Master!" : "Game Over!"}
        </h2>
        <p style={styles.resultSub}>Your sequence solving stats</p>

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

        <button onClick={onRestart} style={styles.restartBtn}>
          🔄 Play Again
        </button>
      </div>
    </div>
  );
}

// ---------- Main Game ----------
export default function MissingNumberGame() {
  const [questions] = useState<Question[]>(() =>
    Array.from({ length: TOTAL_ROUNDS }, generateQuestion),
  );
  const [qIndex, setQIndex] = useState(0);
  const [feedback, setFeedback] = useState<FeedbackState>({
    selected: null,
    isCorrect: null,
  });
  const [score, setScore] = useState(0);
  const [results, setResults] = useState<boolean[]>([]);
  const [gameOver, setGameOver] = useState(false);

  const [hasRetried, setHasRetried] = useState(false);
  const [showRetryButton, setShowRetryButton] = useState(false);

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

  const handleSelect = useCallback(
    (num: number) => {
      if (answered && !showRetryButton) return;

      const isCorrect = num === current.correct;
      setFeedback({ selected: num, isCorrect });

      if (isCorrect) {
        speak("Correct"); // Speech Trigger
        setScore((s) => s + 15);
        setShowRetryButton(false);
        setTimeout(() => moveToNext(true), 1200);
      } else {
        if (!hasRetried) {
          speak("Try again"); // Speech Trigger
          setShowRetryButton(true);
        } else {
          speak("Wrong"); // Speech Trigger
          setShowRetryButton(false);
          setTimeout(() => moveToNext(false), 1200);
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
    const correctCount = results.filter(Boolean).length;
    return (
      <ResultCard
        score={score}
        correct={correctCount}
        incorrect={results.length - correctCount}
        total={TOTAL_ROUNDS}
        onRestart={() => window.location.reload()}
      />
    );
  }

  return (
    <div style={styles.screen}>
      <div style={styles.card}>
        <div style={styles.header}>
          <span style={styles.levelBadge}>
            Round {qIndex + 1}/{TOTAL_ROUNDS}
          </span>
          <span style={styles.scoreLabel}>⭐ {score}</span>
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
                      ? "#7c3aed"
                      : "#e2e8f0",
              }}
            />
          ))}
        </div>

        <p style={styles.instruction}>Find the missing number in the pattern</p>

        <div style={styles.sequenceRow}>
          {current.sequence.map((num, i) => (
            <div key={i} style={num === "?" ? styles.blankBox : styles.numBox}>
              {num === "?" && answered && feedback.isCorrect
                ? current.correct
                : num}
            </div>
          ))}
        </div>

        <div style={styles.feedbackRow}>
          {answered && (
            <span
              style={{
                ...styles.feedbackMsg,
                color: feedback.isCorrect ? "#16a34a" : "#e11d48",
              }}
            >
              {feedback.isCorrect
                ? "✨ Correct!"
                : showRetryButton
                  ? "Try again"
                  : "Wrong"}
            </span>
          )}
        </div>

        <div style={styles.choicesGrid}>
          {current.choices.map((choice, i) => (
            <button
              key={choice}
              onClick={() => handleSelect(choice)}
              disabled={answered && !showRetryButton}
              style={{
                ...styles.choiceBtn,
                background: CHOICE_COLORS[i],
                ...(answered && choice === current.correct
                  ? styles.btnCorrect
                  : {}),
                ...(answered &&
                choice === feedback.selected &&
                !feedback.isCorrect
                  ? styles.btnWrong
                  : {}),
                ...(answered &&
                !showRetryButton &&
                choice !== current.correct &&
                choice !== feedback.selected
                  ? styles.btnDim
                  : {}),
              }}
            >
              {choice}
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
    minHeight: "400px",
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "1rem",
    fontFamily: "sans-serif",
  },
  card: {
    width: "100%",
    maxWidth: 420,
    background: "#fff",
    borderRadius: 24,
    border: "2px solid #f1f5f9",
    padding: "1.5rem",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    boxShadow: "0 10px 25px -5px rgba(0,0,0,0.1)",
  },
  header: {
    width: "100%",
    display: "flex",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  levelBadge: {
    background: "#f5f3ff",
    color: "#7c3aed",
    padding: "4px 12px",
    borderRadius: 99,
    fontSize: 12,
    fontWeight: 700,
  },
  scoreLabel: { fontSize: 14, fontWeight: 700, color: "#64748b" },
  dotsRow: { display: "flex", gap: 6, marginBottom: 20 },
  dot: { width: 10, height: 10, borderRadius: "50%", transition: "0.3s" },
  instruction: {
    fontSize: 11,
    color: "#94a3b8",
    fontWeight: 700,
    textTransform: "uppercase",
    marginBottom: 20,
  },
  sequenceRow: { display: "flex", gap: 10, marginBottom: 24 },
  numBox: {
    fontSize: 28,
    fontWeight: 800,
    color: "#1e293b",
    width: 55,
    height: 65,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#f8fafc",
    borderRadius: 12,
  },
  blankBox: {
    fontSize: 28,
    fontWeight: 800,
    color: "#7c3aed",
    width: 55,
    height: 65,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#f5f3ff",
    border: "2px dashed #c4b5fd",
    borderRadius: 12,
  },
  feedbackRow: { height: 30, marginBottom: 15 },
  feedbackMsg: { fontSize: 16, fontWeight: 900, textTransform: "capitalize" },
  choicesGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 12,
    width: "100%",
  },
  choiceBtn: {
    fontSize: 22,
    fontWeight: 700,
    padding: "15px",
    borderRadius: 16,
    border: "none",
    color: "#334155",
    cursor: "pointer",
    transition: "0.2s",
  },
  btnCorrect: { background: "#dcfce7 !important", color: "#15803d" },
  btnWrong: {
    background: "#fee2e2 !important",
    color: "#b91c1c",
    border: "2px solid #ef4444",
  },
  btnDim: { opacity: 0.3 },
  skipBtn: {
    background: "#1e293b",
    color: "white",
    border: "none",
    padding: "6px 12px",
    borderRadius: 8,
    fontSize: "11px",
    fontWeight: "bold",
    cursor: "pointer",
  },
  retryBtn: {
    width: "100%",
    padding: "16px",
    marginTop: "15px",
    background: "#e11d48",
    color: "#fff",
    border: "none",
    borderRadius: 16,
    fontSize: 16,
    fontWeight: 800,
    cursor: "pointer",
    boxShadow: "0 4px 0 #9f1239",
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
    marginBottom: 25,
  },
  statBox: {
    padding: "15px 5px",
    borderRadius: 16,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  statNum: { fontSize: 24, fontWeight: 900 },
  statLabel: { fontSize: 10, fontWeight: 700, textTransform: "uppercase" },
  restartBtn: {
    width: "100%",
    padding: "16px",
    background: "#7c3aed",
    color: "#fff",
    border: "none",
    borderRadius: 16,
    fontSize: 16,
    fontWeight: 800,
    cursor: "pointer",
  },
};
