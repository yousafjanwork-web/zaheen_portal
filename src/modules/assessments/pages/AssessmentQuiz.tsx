import { useEffect, useState, useRef } from "react";

/* ---------------- TYPES ---------------- */

type Option = {
  id: number;
  option_text: string;
};

type Question = {
  id: number;
  type: "mcq" | "input";
  prompt: string;
  image_url?: string | null;
  options: Option[];
};

type Props = {
  studentId?: number;
  chapterId?: number;
};

function Quiz({ studentId = 2, chapterId = 105 }: Props) {
  const TOTAL_QUESTIONS = 10;

  const [question, setQuestion] = useState<Question | null>(null);
  const [selected, setSelected] = useState<Option | null>(null);
  const [inputAnswer, setInputAnswer] = useState<string>("");

  const [correctCount, setCorrectCount] = useState<number>(0);
  const [wrongCount, setWrongCount] = useState<number>(0);

  const [currentQ, setCurrentQ] = useState<number>(0);
  const [showResult, setShowResult] = useState<boolean>(false);
  const [status, setStatus] = useState<"correct" | "wrong" | null>(null);

  const [time, setTime] = useState<number>(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const [totalTime, setTotalTime] = useState<number>(0);

  const [explanation, setExplanation] = useState<string>("");
  const [loadingExplain, setLoadingExplain] = useState<boolean>(false);

  const hasSubmittedRef = useRef<boolean>(false);

  const isMCQ = question?.type === "mcq";
  const isInput = question?.type === "input";


  // 🎤 SPEAK
  const speak = () => {
    if (!question) return;

    window.speechSynthesis.cancel();

    let text = question.prompt;

    if (isMCQ) {
      text +=
        ". Options are: " +
        question.options.map((o) => o.option_text).join(", ");
    }

    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = "en-US";
    window.speechSynthesis.speak(utter);
  };

  // ⏱️ TIMER
  const startTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);

    timerRef.current = setInterval(() => {
      setTime((p) => p + 1);
        setTotalTime((p) => p + 1);
    }, 1000);
  };

  // 🔄 LOAD QUESTION
 function loadQuestion() {
  window.speechSynthesis.cancel();
  hasSubmittedRef.current = false;
  setExplanation("");

  setTime(0); // ✅ RESET TIMER FOR EACH QUESTION

  if (currentQ >= TOTAL_QUESTIONS) {
    setShowResult(true);
    if (timerRef.current) clearInterval(timerRef.current);
    return;
  }

  fetch(
    `https://zai.zaheen.com.pk/api/adaptive/next?studentId=${studentId}&chapterId=${chapterId}&t=${Date.now()}`
  )
    .then((res) => res.json())
    .then((data) => {
      const q = data?.question || data?.data || data;

      if (!q || q.finished) {
        setShowResult(true);
        if (timerRef.current) clearInterval(timerRef.current);
        return;
      }

      setQuestion({
        id: q.id,
        type: q.type,
        prompt: q.prompt,
        image_url: q.image_url || null,
        options: q.options || [],
      });

      setSelected(null);
      setInputAnswer("");

      startTimer(); // continues per question
    });
}
  useEffect(() => {
    loadQuestion();

    return () => {
      window.speechSynthesis.cancel();
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  // 📡 EXPLANATION
  const getExplanation = () => {
    if (!question) return;

    setLoadingExplain(true);
    setExplanation("");

    fetch(
      `https://zai.zaheen.com.pk/api/adaptive/explain?questionId=${question.id}`
    )
      .then((res) => res.json())
      .then((data) => {
        setExplanation(data?.explanation || "No explanation available.");
      })
      .finally(() => setLoadingExplain(false));
  };

  // 📤 SUBMIT
  function handleSubmit() {
    if (!question || hasSubmittedRef.current) return;

    hasSubmittedRef.current = true;
    window.speechSynthesis.cancel();

    let payload: any = {
      studentId,
      questionId: question.id,
    };

    if (isMCQ) payload.selectedOptionId = selected?.id;
    if (isInput) payload.answerText = inputAnswer;

    fetch("https://zai.zaheen.com.pk/api/adaptive/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then((res) => res.json())
      .then((data) => {
        const isCorrect =
          data.correct === true || data.is_correct === true;

        if (isCorrect) setCorrectCount((p) => p + 1);
        else setWrongCount((p) => p + 1);

        setStatus(isCorrect ? "correct" : "wrong");

        setTimeout(() => nextQuestion(), 700);
      });
  }

  const nextQuestion = () => {
    setStatus(null);

    const next = currentQ + 1;

    if (next >= TOTAL_QUESTIONS) {
      setShowResult(true);
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    setCurrentQ(next);
    loadQuestion();
  };

  /* ---------------- RESULT UI ---------------- */

  if (showResult) {
    const total = correctCount + wrongCount;
    const percent = total ? Math.round((correctCount / total) * 100) : 0;

    return (
      <div style={styles.resultWrapper}>
        <div style={styles.resultCard}>
          <div style={{ fontSize: 50 }}>🏆</div>

          <h1 style={styles.title}>Quiz Completed</h1>

          <div style={styles.grid}>
            <div style={styles.box}>✅ {correctCount}<br />Correct</div>
            <div style={styles.box}>❌ {wrongCount}<br />Wrong</div>
            <div style={styles.box}>📊 {percent}%<br />Score</div>
           <div style={styles.box}>⏱️ {totalTime}s<br />Total Time</div>
          </div>

          <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
            <button onClick={() => window.location.reload()} style={styles.primary}>
              🔄 Restart
            </button>

            <button onClick={() => window.history.back()} style={styles.secondary}>
              🚪 Exit
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!question) return <h3 style={{ textAlign: "center" }}>Loading...</h3>;

  const isDisabled =
    (isMCQ && !selected) || (isInput && !inputAnswer.trim());

  return (
    <div style={styles.wrapper}>
      {status && (
        <div
          style={{
            ...styles.banner,
            background: status === "correct" ? "#16a34a" : "#dc2626",
          }}
        >
          {status === "correct" ? "🎉 Correct" : "❌ Wrong"}
        </div>
      )}

      <div style={styles.topBar}>
        <div>Q {currentQ + 1}/{TOTAL_QUESTIONS}</div>
        <div>⏱️ {time}s</div>
      </div>

      <div style={styles.card}>
        <div style={styles.questionRow}>
          <h2>{question.prompt}</h2>
          <button onClick={speak}>🎤</button>
        </div>

        {question.image_url && (
          <img src={question.image_url} style={styles.image} />
        )}

        {isMCQ &&
          question.options.map((opt) => (
            <button
              key={opt.id}
              onClick={() => setSelected(opt)}
              style={{
                ...styles.option,
                background: selected?.id === opt.id ? "#3b82f6" : "#fff",
                color: selected?.id === opt.id ? "#fff" : "#000",
              }}
            >
              {opt.option_text}
            </button>
          ))}

        {isInput && (
          <input
            value={inputAnswer}
            onChange={(e) => setInputAnswer(e.target.value)}
            style={styles.input}
            placeholder="Answer..."
          />
        )}

        <button
          onClick={handleSubmit}
          disabled={isDisabled}
          style={{
            ...styles.button,
            background: isDisabled ? "#9ca3af" : "#2563eb",
          }}
        >
          Submit Answer
        </button>

        <button onClick={getExplanation} style={styles.explainBtn}>
          🧠 Explain Answer
        </button>

        {loadingExplain && <p>Loading explanation...</p>}

        {explanation && (
          <div style={styles.explainBox}>{explanation}</div>
        )}
      </div>
    </div>
  );
}

export default Quiz;

/* ---------------- STYLES (UNCHANGED) ---------------- */

const styles: any = {
  wrapper: { maxWidth: 700, margin: "30px auto", padding: 20 },
  card: { background: "#fff", padding: 20, borderRadius: 15 },
  topBar: { display: "flex", justifyContent: "space-between" },
  questionRow: { display: "flex", justifyContent: "space-between" },
  option: {
    width: "100%",
    padding: 14,
    marginTop: 10,
    borderRadius: 10,
    border: "1px solid #ddd",
    cursor: "pointer",
  },
  input: { width: "100%", padding: 12, marginTop: 10, borderRadius: 10 },
  button: {
    marginTop: 20,
    width: "100%",
    padding: 14,
    borderRadius: 10,
    color: "#fff",
    border: "none",
  },
  explainBtn: {
    marginTop: 10,
    width: "100%",
    padding: 12,
    borderRadius: 10,
    background: "#f59e0b",
    color: "#fff",
    border: "none",
  },
  explainBox: {
    marginTop: 10,
    padding: 12,
    background: "#fef3c7",
    borderRadius: 10,
  },
  banner: {
    position: "fixed",
    top: 80,
    left: "50%",
    transform: "translateX(-50%)",
    padding: "10px 20px",
    color: "#fff",
    borderRadius: 10,
  },
  resultWrapper: {
    height: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#f3f4f6",
  },
  resultCard: {
    background: "#fff",
    padding: 30,
    borderRadius: 20,
    textAlign: "center",
    width: 420,
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 10,
    marginTop: 20,
  },
  box: {
    background: "#f9fafb",
    padding: 15,
    borderRadius: 12,
  },
  primary: {
    flex: 1,
    padding: 12,
    background: "#2563eb",
    color: "#fff",
    border: "none",
    borderRadius: 10,
  },
  secondary: {
    flex: 1,
    padding: 12,
    background: "#6b7280",
    color: "#fff",
    border: "none",
    borderRadius: 10,
  },
};