/**
 * AssessmentQuiz.tsx  —  Grades 6–8 & 9–12
 *
 * HOW GRADE-SPECIFIC QUESTIONS WORK:
 *   Each grade group has its own chapterId in ADAPTIVE_GRADE_CHAPTER_IDS.
 *   The adaptive engine uses chapterId to serve questions from that
 *   grade's chapter only.
 *
 *   grades-6-8  → chapterId 1  → Grade 6–8 questions
 *   grades-9-12 → chapterId 2  → Grade 9–12 questions
 *
 *   Pass the right chapterId from your router:
 *     import { ADAPTIVE_GRADE_CHAPTER_IDS } from "@/services/quizApi";
 *     <AssessmentQuiz chapterId={ADAPTIVE_GRADE_CHAPTER_IDS["grades-6-8"]} />
 *
 * SESSION PERSISTENCE:
 *   Correct/wrong counts and question index survive navigation.
 *   They are stored in sessionStorage keyed by userId + chapterId.
 *   Clicking "Restart" clears the session completely.
 *
 * API ENDPOINTS USED:
 *   GET  /api/quiz/adaptive/next?userId=&chapterId=
 *   POST /api/quiz/adaptive/submit
 *   GET  /api/quiz/adaptive/skills?userId=&chapterId=
 */

import React, { useEffect, useRef, useState } from "react";
import {
  getNextAdaptiveQuestion,
  submitAdaptiveAnswer,
  getSkillProgress,
  ADAPTIVE_GRADE_CHAPTER_IDS,
  SubmitResult,
  SkillProgress,
  AdaptiveQuestion,
} from "../../shared/services/quizApi";

/* ─────────────── TYPES ─────────────── */
type QType = "mcq" | "mcq_multi" | "input";

interface QuizQuestion {
  id: number;
  type: QType;
  difficulty?: string;
  prompt: string;
  image_url?: string | null;
  explanation_en?: string | null;
  explanation_ur?: string | null;
  options: { id: number; option_text: string; image_url?: string | null }[];
}

interface SessionState {
  correct: number;
  wrong: number;
  qIndex: number;
  answeredMap: Record<number, "correct" | "wrong">;
  elapsedTime: number;
}

interface Props {
  studentId?: number;
  chapterId?: number;
}

/* ─────────────── SESSION STORAGE ─────────────── */
function sessionKey(userId: number, chapterId: number) {
  return `zaheen_quiz_${userId}_${chapterId}`;
}

function loadSession(userId: number, chapterId: number): SessionState {
  try {
    const raw = sessionStorage.getItem(sessionKey(userId, chapterId));
    if (raw) return JSON.parse(raw) as SessionState;
  } catch { /* ignore */ }
  return { correct: 0, wrong: 0, qIndex: 0, answeredMap: {}, elapsedTime: 0 };
}

function saveSession(userId: number, chapterId: number, s: SessionState) {
  try {
    sessionStorage.setItem(sessionKey(userId, chapterId), JSON.stringify(s));
  } catch { /* ignore */ }
}

function clearSession(userId: number, chapterId: number) {
  try {
    sessionStorage.removeItem(sessionKey(userId, chapterId));
  } catch { /* ignore */ }
}

/* ─────────────── HELPERS ─────────────── */
function fmt(s: number) {
  return `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
}

function toQType(raw: string): QType {
  if (raw === "mcq_multi") return "mcq_multi";
  if (raw === "numeric" || raw === "text") return "input";
  return "mcq";
}

/* ─────────────── ICONS ─────────────── */
const Icons = {
  Speaker: () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
      <path d="M15.54 8.46a5 5 0 010 7.07" />
    </svg>
  ),
  ChevronRight: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <polyline points="9 18 15 12 9 6" />
    </svg>
  ),
  Bulb: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M9 21h6M12 3a6 6 0 016 6c0 2.22-1.21 4.16-3 5.2V17H9v-2.8A6 6 0 0112 3z" />
    </svg>
  ),
  Timer: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
    </svg>
  ),
  Fire: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style={{ color: "#f97316" }}>
      <path d="M12 23c-4.97 0-9-4.03-9-9 0-4.17 2.84-7.67 6.75-8.72-.61 1.36-.75 2.86-.38 4.28C10.9 8.05 12 6 12 6c0 0 4 3.5 4 7 0 .78-.14 1.52-.39 2.2.33-.14.68-.28 1-.48.09.42.14.85.14 1.28C16.75 19.8 14.48 23 12 23z" />
    </svg>
  ),
  Home: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  ),
  Chart: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="18" y1="20" x2="18" y2="10" />
      <line x1="12" y1="20" x2="12" y2="4" />
      <line x1="6" y1="20" x2="6" y2="14" />
    </svg>
  ),
};

/* ─────────────── SMALL COMPONENTS ─────────────── */
function DifficultyBadge({ level }: { level?: string }) {
  if (!level) return null;
  const map: Record<string, { bg: string; color: string; label: string }> = {
    easy:   { bg: "#dcfce7", color: "#15803d", label: "Easy" },
    medium: { bg: "#fef3c7", color: "#92400e", label: "Medium" },
    hard:   { bg: "#fee2e2", color: "#b91c1c", label: "Hard" },
  };
  const cfg = map[level] ?? { bg: "#f1f5f9", color: "#475569", label: level };
  return (
    <span style={{ ...S.diffBadge, background: cfg.bg, color: cfg.color }}>
      {cfg.label}
    </span>
  );
}

function MasteryBar({ pct, status }: { pct: number; status: string }) {
  const color = status === "mastered" ? "#22c55e" : pct > 40 ? "#f59e0b" : "#64748b";
  return (
    <div style={{ height: 6, background: "#e2e8f0", borderRadius: 99, overflow: "hidden" }}>
      <div style={{ height: "100%", width: `${pct}%`, background: color, borderRadius: 99, transition: "width 0.4s ease" }} />
    </div>
  );
}

function LoadingDots() {
  return (
    <div style={{ display: "flex", gap: 6, alignItems: "center", padding: "20px 0" }}>
      {[0, 1, 2].map((i) => (
        <div key={i} style={{ width: 8, height: 8, borderRadius: "50%", background: "#2563eb", animation: `bounce 1s ease ${i * 0.15}s infinite` }} />
      ))}
      <style>{`@keyframes bounce{0%,80%,100%{transform:scale(0.6)}40%{transform:scale(1)}}`}</style>
    </div>
  );
}

function NavItem({ icon, label, onClick }: { icon: React.ReactNode; label: string; onClick: () => void }) {
  const [hover, setHover] = useState(false);
  return (
    <button
      style={{ ...S.navItem, background: hover ? "rgba(37,99,235,0.08)" : "transparent", color: hover ? "#2563eb" : "#1e293b" }}
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {icon} {label}
    </button>
  );
}

function StatBox({ value, label, color, bg }: { value: any; label: string; color: string; bg: string }) {
  return (
    <div style={{ background: bg, borderRadius: 12, padding: "14px 10px", textAlign: "center" }}>
      <div style={{ fontSize: 26, fontWeight: 900, color }}>{value}</div>
      <div style={{ fontSize: 12, color: "#64748b", marginTop: 3 }}>{label}</div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════════════════════ */
export default function AssessmentQuiz({ studentId = 2, chapterId = 1 }: Props) {

  // Rehydrate session so counts survive navigation
  const init = loadSession(studentId, chapterId);

  const [question,     setQuestion]    = useState<QuizQuestion | null>(null);
  const [loading,      setLoading]     = useState(true);

  // Persisted session state
  const [correct,      setCorrect]     = useState(init.correct);
  const [wrong,        setWrong]       = useState(init.wrong);
  const [qIndex,       setQIndex]      = useState(init.qIndex);
  const [answeredMap,  setAnsweredMap] = useState<Record<number, "correct" | "wrong">>(init.answeredMap);
  const [elapsedTime,  setElapsedTime] = useState(init.elapsedTime);

  // Per-question answer state (reset each question)
  const [selected,     setSelected]    = useState<{ id: number; option_text: string } | null>(null);
  const [multiSel,     setMultiSel]    = useState<number[]>([]);
  const [inputVal,     setInputVal]    = useState("");
  const [submitted,    setSubmitted]   = useState(false);
  const [result,       setResult]      = useState<SubmitResult | null>(null);

  // UI state
  const [streak,       setStreak]      = useState(0);
  const [showResult,   setShowResult]  = useState(false);
  const [showExplain,  setShowExplain] = useState(false);
  const [streakBanner, setStreakBanner]= useState<string | null>(null);
  const [masteryScore, setMasteryScore]= useState(0);
  const [skills,       setSkills]      = useState<SkillProgress[]>([]);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Persist session whenever it changes
  useEffect(() => {
    saveSession(studentId, chapterId, { correct, wrong, qIndex, answeredMap, elapsedTime });
  }, [correct, wrong, qIndex, answeredMap, elapsedTime, studentId, chapterId]);

  // Timer
  useEffect(() => {
    timerRef.current = setInterval(() => setElapsedTime((p) => p + 1), 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, []);

  // On mount: load next question (server continues from its position)
  useEffect(() => {
    loadQuestion();
    fetchSkills();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function fetchSkills() {
    const data = await getSkillProgress(studentId, chapterId);
    setSkills(data);
  }

  async function loadQuestion() {
    setLoading(true);
    setSubmitted(false);
    setSelected(null);
    setMultiSel([]);
    setInputVal("");
    setResult(null);
    setShowExplain(false);
    setQuestion(null);

    try {
      const json = await getNextAdaptiveQuestion(studentId, chapterId);

      if (json?.status === "completed") {
        setShowResult(true);
        if (timerRef.current) clearInterval(timerRef.current);
        return;
      }

      const d = json.data!;
      setQuestion({
        id:             d.id,
        type:           toQType(d.type),
        difficulty:     d.difficulty,
        prompt:         d.prompt,
        image_url:      d.image_url ?? null,
        explanation_en: d.explanation_en ?? null,
        explanation_ur: d.explanation_ur ?? null,
        options:        d.options ?? [],
      });
    } catch (e) {
      console.error("loadQuestion:", e);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit() {
    if (!question || submitted) return;
    setSubmitted(true);

    const payload: any = { userId: studentId, questionId: question.id, timeTaken: elapsedTime };
    if (question.type === "mcq")       payload.selectedOptionId  = selected?.id;
    if (question.type === "mcq_multi") payload.selectedOptionIds = multiSel;
    if (question.type === "input")     payload.submittedAnswer   = inputVal;

    try {
      const res = await submitAdaptiveAnswer(payload);
      setResult(res);
      setMasteryScore(res.masteryScore);

      if (res.correct) {
        setCorrect((p) => p + 1);
        setStreak(res.streak);
        setAnsweredMap((p) => ({ ...p, [qIndex]: "correct" }));
        if (res.streak >= 3 && res.message_en) {
          setStreakBanner(res.message_en);
          setTimeout(() => setStreakBanner(null), 3000);
        }
      } else {
        setWrong((p) => p + 1);
        setStreak(0);
        setAnsweredMap((p) => ({ ...p, [qIndex]: "wrong" }));
      }
      fetchSkills();
    } catch (e) {
      console.error("submit:", e);
      setSubmitted(false);
    }
  }

  function handleNext() {
    window.speechSynthesis?.cancel();
    setQIndex((i) => i + 1);
    loadQuestion();
  }

  function handleRestart() {
    clearSession(studentId, chapterId);
    setShowResult(false);
    setCorrect(0); setWrong(0); setQIndex(0);
    setAnsweredMap({}); setElapsedTime(0); setStreak(0); setMasteryScore(0);
    loadQuestion();
  }

  function speak() {
    if (!question) return;
    window.speechSynthesis?.cancel();
    let text = question.prompt;
    if (question.type === "mcq")
      text += ". Options: " + question.options.map((o) => o.option_text).join(", ");
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "en-US";
    window.speechSynthesis.speak(u);
  }

  const canSubmit =
    !submitted &&
    ((question?.type === "mcq"       && selected !== null) ||
     (question?.type === "mcq_multi" && multiSel.length > 0) ||
     (question?.type === "input"     && inputVal.trim() !== ""));

  /* ── RESULT SCREEN ── */
  if (showResult) {
    const total = correct + wrong;
    const pct   = total ? Math.round((correct / total) * 100) : 0;
    return (
      <div style={{ ...S.page, alignItems: "center", justifyContent: "center" }}>
        <div style={S.resultCard}>
          <div style={{ fontSize: 56, marginBottom: 8 }}>🏆</div>
          <h2 style={S.resultTitle}>Assessment Complete!</h2>
          <p style={{ color: "#64748b", fontSize: 14, margin: "0 0 22px" }}>Great effort. Here's how you did:</p>
          <div style={S.resultGrid}>
            <StatBox value={correct}          label="✅ Correct" color="#15803d" bg="#dcfce7" />
            <StatBox value={wrong}            label="❌ Wrong"   color="#b91c1c" bg="#fee2e2" />
            <StatBox value={`${pct}%`}        label="📊 Score"  color="#1a2f5e" bg="#eff4ff" />
            <StatBox value={fmt(elapsedTime)} label="⏱ Time"   color="#1a2f5e" bg="#f8fafc" />
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <button style={S.btnPrimary}    onClick={handleRestart}>🔄 Restart</button>
            <button style={S.btnSecondary}  onClick={() => window.history.back()}>🚪 Exit</button>
          </div>
        </div>
      </div>
    );
  }

  /* ── QUIZ SCREEN ── */
  return (
    <div style={S.page}>
      {streakBanner && (
        <div style={S.streakBanner}><Icons.Fire /> {streakBanner}</div>
      )}

      <div style={S.layout}>
        {/* LEFT SIDEBAR */}
        <aside style={S.leftAside}>
          <div style={S.navCard}>
            <NavItem icon={<Icons.Home />}  label="Home"        onClick={() => window.history.back()} />
            <NavItem icon={<Icons.Chart />} label="My Progress" onClick={() => {}} />
          </div>
        </aside>

        {/* MAIN */}
        <main style={S.main}>
          {/* Topbar */}
          <div style={S.topbar}>
            <div>
              <div style={S.topbarTitle}>Skill Assessment</div>
              <div style={S.topbarSub}>Chapter {chapterId}</div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              {streak >= 3 && (
                <span style={S.streakChip}><Icons.Fire /> {streak} streak</span>
              )}
              <span style={S.timerChip}><Icons.Timer /> {fmt(elapsedTime)}</span>
            </div>
          </div>

          {/* Q label + session summary */}
          <div style={S.qLabelRow}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={S.qLabel}>QUESTION {qIndex + 1}</span>
              <DifficultyBadge level={question?.difficulty} />
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <span style={{ fontSize: 12, color: "#15803d", fontWeight: 700 }}>✅ {correct}</span>
              <span style={{ fontSize: 12, color: "#b91c1c", fontWeight: 700 }}>❌ {wrong}</span>
              <span style={S.ptsBadge}>1.5 pts</span>
            </div>
          </div>

          {/* Question card */}
          <div style={S.questionCard}>
            {loading ? (
              <LoadingDots />
            ) : question ? (
              <>
                <div style={S.qTextRow}>
                  <p style={S.qText}>{question.prompt}</p>
                  <button style={S.speakBtn} onClick={speak} title="Read aloud">
                    <Icons.Speaker />
                  </button>
                </div>

                {question.image_url && (
                  <img src={question.image_url} alt="" style={{ width: "100%", borderRadius: 10, marginBottom: 12 }} />
                )}

                <p style={S.qHint}>
                  {question.type === "mcq_multi" ? "Select all that apply."
                    : question.type === "input"  ? "Type your answer below."
                    : "Choose the best answer."}
                </p>

                {/* MCQ */}
                {question.type === "mcq" && question.options.map((opt) => {
                  const isSel  = selected?.id === opt.id;
                  const isCorr = result?.correct && isSel;
                  const isWrng = !result?.correct && submitted && isSel;
                  return (
                    <button
                      key={opt.id}
                      style={S.optBtn(isSel, isCorr ?? false, isWrng ?? false)}
                      onClick={() => { if (!submitted) setSelected(opt); }}
                      disabled={submitted}
                    >
                      <div style={S.optCircle(isSel)}>
                        {isSel && <div style={S.optDot} />}
                      </div>
                      {opt.option_text}
                    </button>
                  );
                })}

                {/* MCQ multi */}
                {question.type === "mcq_multi" && question.options.map((opt) => {
                  const isSel = multiSel.includes(opt.id);
                  return (
                    <button
                      key={opt.id}
                      style={S.optBtn(isSel, false, false)}
                      onClick={() => {
                        if (submitted) return;
                        setMultiSel((p) => p.includes(opt.id) ? p.filter((x) => x !== opt.id) : [...p, opt.id]);
                      }}
                      disabled={submitted}
                    >
                      <div style={{ ...S.optCircle(isSel), borderRadius: 4 }}>
                        {isSel && <div style={{ ...S.optDot, borderRadius: 2 }} />}
                      </div>
                      {opt.option_text}
                    </button>
                  );
                })}

                {/* Input */}
                {question.type === "input" && (
                  <input
                    style={S.inputField}
                    value={inputVal}
                    onChange={(e) => setInputVal(e.target.value)}
                    placeholder="Type your answer here…"
                    disabled={submitted}
                    onKeyDown={(e) => { if (e.key === "Enter" && canSubmit) handleSubmit(); }}
                  />
                )}

                {/* Feedback */}
                {submitted && result && (
                  <div style={S.feedbackBanner(result.correct ? "correct" : "wrong")}>
                    {result.correct
                      ? `🎉 Correct! Mastery: ${result.masteryScore.toFixed(0)}%`
                      : `❌ Incorrect. Keep going! Mastery: ${result.masteryScore.toFixed(0)}%`}
                  </div>
                )}

                {/* Explanation — only returned by API on wrong answer */}
                {showExplain && submitted && (
                  <div style={S.explainBox}>
                    {(() => {
                      const exp =
                        result?.explanation?.message_en ||
                        question.explanation_en ||
                        question.explanation_ur;
                      return exp
                        ? <><span style={{ fontWeight: 700 }}>💡 Explanation: </span>{exp}</>
                        : "💡 No explanation available for this question yet.";
                    })()}
                  </div>
                )}

                {/* Buttons */}
                <div style={S.btnRow}>
                  <button style={S.btnSubmit(!canSubmit)} onClick={handleSubmit} disabled={!canSubmit}>
                    Submit
                  </button>
                  <button style={S.btnNext(!submitted)} onClick={handleNext} disabled={!submitted}>
                    Next <Icons.ChevronRight />
                  </button>
                  <button
                    style={S.btnExplain(!submitted)}
                    onClick={() => setShowExplain((p) => !p)}
                    disabled={!submitted}
                  >
                    <Icons.Bulb /> {showExplain ? "Hide" : "Explain"}
                  </button>
                </div>
              </>
            ) : (
              <p style={{ color: "#dc2626", fontSize: 13.5 }}>
                Failed to load question. Please check your connection.
              </p>
            )}
          </div>

          {/* Mini navigator */}
          <div style={S.miniNav}>
            {Array.from(
              { length: Math.max(qIndex + 1, Object.keys(answeredMap).length + 1) },
              (_, i) => {
                const st = answeredMap[i];
                return (
                  <div
                    key={i}
                    style={{
                      width: 28, height: 28, borderRadius: 7,
                      fontSize: 11, fontWeight: 600,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      background: i === qIndex ? "#1a2f5e" : st === "correct" ? "#dcfce7" : st === "wrong" ? "#fee2e2" : "#f1f5f9",
                      color: i === qIndex ? "#fff" : st === "correct" ? "#15803d" : st === "wrong" ? "#b91c1c" : "#64748b",
                      border: `1.5px solid ${i === qIndex ? "#1a2f5e" : st === "correct" ? "#86efac" : st === "wrong" ? "#fca5a5" : "#e2e8f0"}`,
                    }}
                  >
                    {i + 1}
                  </div>
                );
              }
            )}
          </div>
        </main>

        {/* RIGHT SIDEBAR */}
        <aside style={S.rightAside}>
          {masteryScore > 0 && (
            <div style={S.masteryCard}>
              <div style={S.sideCardTitle}>Current Mastery</div>
              <div style={{ fontSize: 28, fontWeight: 900, color: "#1a2f5e", margin: "4px 0 8px" }}>
                {masteryScore.toFixed(0)}%
              </div>
              <MasteryBar
                pct={masteryScore}
                status={masteryScore >= 90 ? "mastered" : masteryScore > 0 ? "progressing" : "not_started"}
              />
            </div>
          )}

          <div style={S.scoreCard}>
            <div style={S.sideCardTitle}>Session Score</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginTop: 10 }}>
              <div style={{ textAlign: "center", background: "#dcfce7", borderRadius: 10, padding: "10px 6px" }}>
                <div style={{ fontSize: 22, fontWeight: 900, color: "#15803d" }}>{correct}</div>
                <div style={{ fontSize: 11, color: "#166534", fontWeight: 600 }}>Correct</div>
              </div>
              <div style={{ textAlign: "center", background: "#fee2e2", borderRadius: 10, padding: "10px 6px" }}>
                <div style={{ fontSize: 22, fontWeight: 900, color: "#b91c1c" }}>{wrong}</div>
                <div style={{ fontSize: 11, color: "#991b1b", fontWeight: 600 }}>Wrong</div>
              </div>
            </div>
          </div>

          {skills.length > 0 && (
            <div style={S.skillsCard}>
              <div style={S.sideCardTitle}>Skills Progress</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 10 }}>
                {skills.map((sk) => (
                  <div key={sk.skillId}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, fontWeight: 600, color: "#1e293b", marginBottom: 4 }}>
                      <span>Skill #{sk.skillId}</span>
                      <span style={{ color: sk.status === "mastered" ? "#15803d" : "#64748b" }}>
                        {sk.masteryScore.toFixed(0)}%
                      </span>
                    </div>
                    <MasteryBar pct={sk.masteryScore} status={sk.status} />
                    <div style={{ fontSize: 10.5, color: "#94a3b8", marginTop: 3 }}>
                      {sk.attemptedQuestions}/{sk.totalQuestions} attempted
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}

/* ─────────────── STYLES ─────────────── */
const S: any = {
  page:        { minHeight: "100vh", background: "#f4f6fb", fontFamily: "'DM Sans','Segoe UI',sans-serif", display: "flex", flexDirection: "column" as const, position: "relative" as const, padding: "0 0 40px" },
  layout:      { display: "grid", gridTemplateColumns: "180px 1fr 220px", gap: 20, maxWidth: 1200, width: "100%", margin: "0 auto", padding: "20px 20px 0", alignItems: "flex-start" },
  topbar:      { background: "#fff", border: "1px solid #e2e8f0", borderRadius: 12, padding: "12px 18px", display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 },
  topbarTitle: { fontSize: 15, fontWeight: 700, color: "#1e293b" },
  topbarSub:   { fontSize: 11, color: "#94a3b8", marginTop: 1 },
  timerChip:   { display: "flex", alignItems: "center", gap: 5, background: "#eff6ff", color: "#2563eb", fontSize: 13, fontWeight: 700, padding: "5px 10px", borderRadius: 8 },
  streakChip:  { display: "flex", alignItems: "center", gap: 5, background: "#fff7ed", color: "#c2410c", fontSize: 13, fontWeight: 700, padding: "5px 10px", borderRadius: 8 },
  streakBanner:{ position: "fixed" as const, top: 16, left: "50%", transform: "translateX(-50%)", background: "#fff7ed", border: "2px solid #fed7aa", borderRadius: 12, color: "#c2410c", fontWeight: 700, fontSize: 14, padding: "10px 20px", display: "flex", alignItems: "center", gap: 8, zIndex: 999, boxShadow: "0 4px 20px rgba(0,0,0,0.12)" },
  leftAside:   { paddingTop: 0 },
  navCard:     { background: "#fff", border: "1px solid #e2e8f0", borderRadius: 12, padding: "12px 8px", display: "flex", flexDirection: "column" as const, gap: 4 },
  navItem:     { display: "flex", alignItems: "center", gap: 8, padding: "9px 10px", borderRadius: 8, fontSize: 13.5, fontWeight: 500, border: "none", cursor: "pointer", textAlign: "left" as const, width: "100%", fontFamily: "inherit", transition: "all 0.15s" },
  main:        { display: "flex", flexDirection: "column" as const, gap: 0 },
  qLabelRow:   { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 },
  qLabel:      { fontSize: 12, fontWeight: 700, color: "#2563eb", letterSpacing: "0.4px" },
  ptsBadge:    { background: "#eff4ff", color: "#2563eb", fontSize: 11, padding: "3px 9px", borderRadius: 6, fontWeight: 700 },
  diffBadge:   { fontSize: 11, fontWeight: 700, padding: "2px 9px", borderRadius: 6 },
  questionCard:{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 14, padding: "20px 20px 16px" },
  qTextRow:    { display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 10, marginBottom: 4 },
  qText:       { fontSize: 17, fontWeight: 700, lineHeight: 1.5, color: "#1e293b", flex: 1, margin: 0 },
  speakBtn:    { background: "none", border: "1px solid #e2e8f0", borderRadius: 8, padding: 6, cursor: "pointer", color: "#64748b", display: "flex", alignItems: "center", flexShrink: 0 },
  qHint:       { fontSize: 12.5, color: "#94a3b8", margin: "0 0 14px" },
  optBtn: (sel: boolean, corr: boolean, wrng: boolean) => ({ width: "100%", padding: "11px 14px", marginBottom: 8, background: corr ? "#f0fdf4" : wrng ? "#fef2f2" : sel ? "#eff4ff" : "#fff", border: `1.5px solid ${corr ? "#86efac" : wrng ? "#fca5a5" : sel ? "#2563eb" : "#e2e8f0"}`, borderRadius: 10, cursor: "pointer", textAlign: "left" as const, fontSize: 14, fontFamily: "inherit", color: corr ? "#15803d" : wrng ? "#b91c1c" : sel ? "#2563eb" : "#1e293b", fontWeight: sel || corr || wrng ? 600 : 400, transition: "all 0.15s", display: "flex", alignItems: "center", gap: 10 }),
  optCircle: (sel: boolean) => ({ width: 17, height: 17, borderRadius: "50%", border: `2px solid ${sel ? "#2563eb" : "#d1d5db"}`, background: sel ? "#2563eb" : "transparent", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }),
  optDot:      { width: 7, height: 7, borderRadius: "50%", background: "#fff" },
  inputField:  { width: "100%", padding: "11px 14px", border: "1.5px solid #e2e8f0", borderRadius: 10, fontSize: 14, fontFamily: "inherit", color: "#1e293b", background: "#fff", outline: "none", marginBottom: 8, boxSizing: "border-box" as const },
  feedbackBanner: (s: "correct"|"wrong") => ({ padding: "10px 14px", borderRadius: 10, fontSize: 13.5, fontWeight: 700, marginTop: 10, marginBottom: 4, background: s === "correct" ? "#f0fdf4" : "#fef2f2", border: `1px solid ${s === "correct" ? "#86efac" : "#fca5a5"}`, color: s === "correct" ? "#15803d" : "#b91c1c" }),
  explainBox:  { marginTop: 10, padding: "12px 14px", background: "#fffbeb", border: "1px solid #fde68a", borderRadius: 10, fontSize: 13.5, color: "#92400e", lineHeight: 1.6 },
  btnRow:      { display: "flex", gap: 8, marginTop: 14, alignItems: "center" },
  btnSubmit: (dis: boolean) => ({ padding: "9px 18px", background: dis ? "#9ca3af" : "#2563eb", color: "#fff", border: "none", borderRadius: 8, fontSize: 13.5, fontWeight: 700, cursor: dis ? "not-allowed" : "pointer", fontFamily: "inherit" }),
  btnNext:   (dis: boolean) => ({ padding: "9px 14px", background: "#fff", color: dis ? "#9ca3af" : "#1e293b", border: "1.5px solid #e2e8f0", borderRadius: 8, fontSize: 13.5, fontWeight: 700, cursor: dis ? "not-allowed" : "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", gap: 4, opacity: dis ? 0.5 : 1 }),
  btnExplain:(dis: boolean) => ({ padding: "9px 14px", background: dis ? "#f4f6fb" : "#fffbeb", color: dis ? "#9ca3af" : "#92400e", border: `1.5px solid ${dis ? "#e2e8f0" : "#fde68a"}`, borderRadius: 8, fontSize: 13.5, fontWeight: 700, cursor: dis ? "not-allowed" : "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", gap: 4, marginLeft: "auto" }),
  miniNav:     { display: "flex", flexWrap: "wrap" as const, gap: 6, marginTop: 14 },
  rightAside:  { display: "flex", flexDirection: "column" as const, gap: 14, position: "sticky" as const, top: 20 },
  masteryCard: { background: "#fff", border: "1px solid #e2e8f0", borderRadius: 12, padding: 14 },
  scoreCard:   { background: "#fff", border: "1px solid #e2e8f0", borderRadius: 12, padding: 14 },
  skillsCard:  { background: "#fff", border: "1px solid #e2e8f0", borderRadius: 12, padding: 14 },
  sideCardTitle:{ fontSize: 11.5, fontWeight: 700, color: "#94a3b8", letterSpacing: "0.5px", textTransform: "uppercase" as const },
  resultCard:  { background: "#fff", padding: 36, borderRadius: 20, border: "1px solid #e2e8f0", maxWidth: 400, width: "100%", display: "flex", flexDirection: "column" as const, alignItems: "center", gap: 4 },
  resultTitle: { fontSize: 24, fontWeight: 900, color: "#1a2f5e", margin: "0 0 4px" },
  resultGrid:  { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, width: "100%", margin: "0 0 20px" },
  btnPrimary:  { padding: "11px 22px", background: "#2563eb", color: "#fff", border: "none", borderRadius: 9, fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" },
  btnSecondary:{ padding: "11px 22px", background: "#fff", color: "#1e293b", border: "1.5px solid #e2e8f0", borderRadius: 9, fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" },
};