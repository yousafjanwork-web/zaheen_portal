/**
 * PrimaryQuizFlow.tsx — KG–Grade 5
 *
 * Child-friendly adaptive quiz.
 *
 * API flow:
 *   STEP 1  GET  /api/quiz/adaptive/subjects          → subject cards
 *   STEP 2  GET  /api/quiz/adaptive/skills-by-subject → chapter list
 *   STEP 3  GET  /api/quiz/adaptive/next-by-skill     → first question
 *   STEP 4  POST /api/quiz/adaptive/submit            → result
 *   STEP 5  Repeat 3-4 until { status: "completed" } → results screen
 *
 * Design: colourful 2×2 option grid, star + XP rewards, countdown timer.
 *
 * Place at:  src/modules/courses/pages/PrimaryQuizFlow.tsx
 * Import:    import SubjectSkillSelector from "../../assessments/pages/SubjectSkillSelector"
 */

import React, { useCallback, useEffect, useRef, useState } from "react"
import axios from "axios"
import SubjectSkillSelector, { Skill } from "../../assessments/pages/SubjectSkillSelector"

// ─── API types ────────────────────────────────────────────────────────────────

interface QuizOption {
  id: number
  option_text: string
  image_url: string | null
}

interface Question {
  id: number
  skill_id: number
  type: string
  difficulty: string
  prompt: string
  image_url: string | null
  explanation_en: string | null
  options: QuizOption[]
}

interface NextResponse {
  success: boolean
  status?: "completed"
  data?: Question
}

interface SubmitResult {
  correct: boolean
  masteryScore: number
  streak: number
  message_en: string | null
  explanation?: { message_en: string | null } | null
}

interface SubmitResponse {
  success: boolean
  data: SubmitResult
}

// ─── Constants ────────────────────────────────────────────────────────────────

const BASE          = "https://api.zaheen.com.pk/v2"
const TIMER_SECONDS = 45
const ACCENT        = "#7c3aed"

// Each option gets a distinct background colour
const OPT_COLORS = ["#4f46e5", "#0891b2", "#d97706", "#be185d"]

// ─── Props ────────────────────────────────────────────────────────────────────

interface Props {
  studentId?: number
}

// ─── Component ────────────────────────────────────────────────────────────────

const PrimaryQuizFlow: React.FC<Props> = ({ studentId: propId }) => {
  const studentId = (propId ?? Number(sessionStorage.getItem("studentId"))) || 2

  const [phase,     setPhase]     = useState<"select" | "quiz" | "done">("select")
  const [skill,     setSkill]     = useState<Skill | null>(null)

  // quiz state
  const [question,   setQuestion]   = useState<Question | null>(null)
  const [loading,    setLoading]    = useState(false)
  const [loadError,  setLoadError]  = useState<string | null>(null)
  const [selected,   setSelected]   = useState<number | null>(null)
  const [textVal,    setTextVal]    = useState("")
  const [feedback,   setFeedback]   = useState<SubmitResult | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [mastery,    setMastery]    = useState(0)
  const [streak,     setStreak]     = useState(0)
  const [stars,      setStars]      = useState(0)
  const [xp,         setXp]         = useState(0)
  const [answered,   setAnswered]   = useState(0)
  const [correct,    setCorrect]    = useState(0)
  const [timer,      setTimer]      = useState(TIMER_SECONDS)
  const [showStar,   setShowStar]   = useState(false)

  const startRef = useRef<number>(Date.now())
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // ── countdown timer ──────────────────────────────────────────────────────
  useEffect(() => {
    if (phase !== "quiz" || !question || feedback) return
    timerRef.current = setInterval(() => {
      setTimer(t => {
        if (t <= 1) { clearInterval(timerRef.current!); submitAnswer(null); return 0 }
        return t - 1
      })
    }, 1000)
    return () => clearInterval(timerRef.current!)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [question, feedback, phase])

  // ── load next question ───────────────────────────────────────────────────
  const loadNext = useCallback(async (skillId: number) => {
    clearInterval(timerRef.current!)
    setLoading(true)
    setLoadError(null)
    setSelected(null)
    setTextVal("")
    setFeedback(null)
    setTimer(TIMER_SECONDS)
    setQuestion(null)
    startRef.current = Date.now()

    try {
      const res = await axios.get<NextResponse>(
        `${BASE}/api/quiz/adaptive/next-by-skill`,
        { params: { userId: studentId, skillId } }
      )
      if (res.data.status === "completed") {
        setPhase("done")
      } else if (res.data.data) {
        setQuestion(res.data.data)
      } else {
        setLoadError("Could not load question.")
      }
    } catch {
      setLoadError("Could not load question. Please check your connection.")
    } finally {
      setLoading(false)
    }
  }, [studentId])

  function handleStart(s: Skill) {
    setSkill(s)
    setAnswered(0); setCorrect(0); setMastery(0); setStreak(0); setStars(0); setXp(0)
    setPhase("quiz")
    loadNext(s.id)
  }

  // ── submit ───────────────────────────────────────────────────────────────
  async function submitAnswer(optionId: number | null) {
    if (!question || submitting || feedback) return
    clearInterval(timerRef.current!)
    setSubmitting(true)

    const timeTaken = Math.round((Date.now() - startRef.current) / 1000)
    const body: Record<string, unknown> = { userId: studentId, questionId: question.id, timeTaken }

    const qType = question.type
    if (qType === "mcq" || qType === "choice_buttons") {
      if (optionId !== null) body.selectedOptionId = optionId
    } else if (qType === "mcq_multi") {
      // handled separately
    } else {
      body.submittedAnswer = textVal
    }

    try {
      const res = await axios.post<SubmitResponse>(`${BASE}/api/quiz/adaptive/submit`, body)
      const d = res.data.data
      setFeedback(d)
      setMastery(d.masteryScore)
      setStreak(d.streak)
      setAnswered(a => a + 1)
      if (d.correct) {
        setCorrect(c => c + 1)
        setXp(x => x + 10)
        if (d.streak >= 3) {
          setStars(s => s + 1)
          setShowStar(true)
          setTimeout(() => setShowStar(false), 1500)
        }
      }
    } catch (err) {
      console.error("Submit failed:", err)
    } finally {
      setSubmitting(false)
    }
  }

  function handleOptionClick(optId: number) {
    if (feedback || submitting) return
    setSelected(optId)
    submitAnswer(optId)
  }

  function handleNext() {
    if (skill) loadNext(skill.id)
  }

  const masteryLabel = mastery >= 90 ? "🏆 Mastered!" : mastery >= 50 ? "📈 Progressing" : "🌱 Just started"
  const isText = question?.type === "text" || question?.type === "numeric"

  // ═══════════════════════════════════════════════════════════════════════════
  // PHASE: select
  // ═══════════════════════════════════════════════════════════════════════════
  if (phase === "select") {
    return <SubjectSkillSelector variant="primary" onStart={handleStart} />
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // PHASE: done
  // ═══════════════════════════════════════════════════════════════════════════
  if (phase === "done") {
    const accuracy = answered > 0 ? Math.round((correct / answered) * 100) : 0
    return (
      <div style={{ minHeight: "100vh", background: "linear-gradient(135deg,#fdf4ff,#eff6ff)", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
        <div style={{ background: "#fff", borderRadius: 28, boxShadow: "0 12px 48px rgba(0,0,0,0.12)", padding: "48px 36px", maxWidth: 420, width: "100%", textAlign: "center" }}>
          <div style={{ fontSize: 80, marginBottom: 8 }}>{accuracy >= 80 ? "🏆" : accuracy >= 50 ? "⭐" : "🌟"}</div>
          <h2 style={{ fontSize: 28, fontWeight: 800, color: ACCENT, margin: "0 0 6px" }}>
            {accuracy >= 80 ? "Amazing job!" : accuracy >= 50 ? "Well done!" : "Keep going!"}
          </h2>
          <p style={{ color: "#6b7280", marginBottom: 24 }}>{skill?.name}</p>

          <div style={{ display: "flex", gap: 12, justifyContent: "center", marginBottom: 28 }}>
            {[
              { emoji: "⭐", label: "Stars",    value: stars },
              { emoji: "⚡", label: "XP",       value: xp },
              { emoji: "🎯", label: "Accuracy", value: `${accuracy}%` },
            ].map(({ emoji, label, value }) => (
              <div key={label} style={{ flex: 1, background: "#faf5ff", borderRadius: 16, padding: "16px 8px" }}>
                <div style={{ fontSize: 28 }}>{emoji}</div>
                <p style={{ margin: "4px 0 0", fontWeight: 800, fontSize: 20, color: ACCENT }}>{value}</p>
                <p style={{ margin: "2px 0 0", fontSize: 12, color: "#9ca3af" }}>{label}</p>
              </div>
            ))}
          </div>

          <div style={{ display: "flex", gap: 12 }}>
            <button onClick={() => { setPhase("select"); setSkill(null) }}
              style={{ flex: 1, background: "#f3f4f6", color: "#374151", border: "none", borderRadius: 14, padding: 14, fontWeight: 700, fontSize: 15, cursor: "pointer" }}>
              New Quiz
            </button>
            <button onClick={() => { setAnswered(0); setCorrect(0); setStars(0); setXp(0); setMastery(0); setStreak(0); setPhase("quiz"); if (skill) loadNext(skill.id) }}
              style={{ flex: 1, background: ACCENT, color: "#fff", border: "none", borderRadius: 14, padding: 14, fontWeight: 700, fontSize: 15, cursor: "pointer" }}>
              Try Again! 🔄
            </button>
          </div>
        </div>
      </div>
    )
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // PHASE: quiz
  // ═══════════════════════════════════════════════════════════════════════════
  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg,#fdf4ff,#eff6ff)", padding: "20px 16px", fontFamily: "'Segoe UI', system-ui, sans-serif" }}>

      {/* Star burst */}
      {showStar && (
        <div style={{ position: "fixed", top: "50%", left: "50%", transform: "translate(-50%,-50%)", fontSize: 96, zIndex: 200, pointerEvents: "none" }}>
          ⭐
        </div>
      )}

      <div style={{ maxWidth: 680, margin: "0 auto" }}>

        {/* Top bar */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
          {/* Stars & XP */}
          <div style={{ display: "flex", gap: 8 }}>
            <span style={{ background: "#fef3c7", color: "#b45309", borderRadius: 99, padding: "6px 14px", fontWeight: 700, fontSize: 15 }}>⭐ {stars}</span>
            <span style={{ background: "#ede9fe", color: ACCENT, borderRadius: 99, padding: "6px 14px", fontWeight: 700, fontSize: 15 }}>⚡ {xp} XP</span>
          </div>

          {/* Countdown */}
          <div style={{ width: 56, height: 56, borderRadius: "50%", background: timer <= 10 ? "#fee2e2" : "#ede9fe", border: `4px solid ${timer <= 10 ? "#ef4444" : ACCENT}`, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 20, color: timer <= 10 ? "#ef4444" : ACCENT }}>
            {timer}
          </div>

          {/* Streak */}
          <div style={{ minWidth: 80, textAlign: "right" }}>
            {streak >= 3 && (
              <span style={{ background: "#fff7ed", color: "#c2410c", borderRadius: 99, padding: "6px 14px", fontWeight: 700, fontSize: 15 }}>🔥 ×{streak}</span>
            )}
          </div>
        </div>

        {/* Mastery bar */}
        <div style={{ marginBottom: 14 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
            <span style={{ fontSize: 13, color: ACCENT, fontWeight: 600 }}>{skill?.name}</span>
            <span style={{ fontSize: 13, color: "#9ca3af" }}>{masteryLabel} — {mastery.toFixed(0)}%</span>
          </div>
          <div style={{ background: "#e9d5ff", borderRadius: 99, height: 12 }}>
            <div style={{ height: 12, borderRadius: 99, background: `linear-gradient(90deg, ${ACCENT}, #a78bfa)`, width: `${mastery}%`, transition: "width .6s ease" }} />
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div style={{ textAlign: "center", padding: "60px 0" }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>⏳</div>
            <p style={{ color: "#9ca3af", fontSize: 18 }}>Loading your question…</p>
          </div>
        )}

        {/* Error */}
        {loadError && !loading && (
          <div style={{ background: "#fff", borderRadius: 20, padding: "40px 24px", textAlign: "center", boxShadow: "0 4px 20px rgba(0,0,0,0.08)" }}>
            <div style={{ fontSize: 48, marginBottom: 8 }}>⚠️</div>
            <p style={{ color: "#ef4444", fontWeight: 600, marginBottom: 16 }}>{loadError}</p>
            <button onClick={() => skill && loadNext(skill.id)} style={{ background: ACCENT, color: "#fff", border: "none", borderRadius: 12, padding: "12px 28px", fontWeight: 700, fontSize: 15, cursor: "pointer" }}>
              Try Again
            </button>
          </div>
        )}

        {/* Question */}
        {!loading && !loadError && question && (
          <>
            {/* Question card */}
            <div style={{ background: "#fff", borderRadius: 24, boxShadow: "0 8px 32px rgba(124,58,237,0.12)", padding: "24px", marginBottom: 14 }}>
              {question.image_url && (
                <img src={question.image_url} alt="" style={{ maxWidth: "100%", borderRadius: 12, marginBottom: 16 }} />
              )}
              <p style={{ fontSize: 20, fontWeight: 700, color: "#1f2937", lineHeight: 1.5, margin: 0 }}>
                {question.prompt}
              </p>
            </div>

            {/* MCQ options — 2×2 grid */}
            {!isText && (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 14 }}>
                {question.options.map((opt, i) => {
                  const isSel  = selected === opt.id
                  const hasFb  = !!feedback
                  let bg       = OPT_COLORS[i % OPT_COLORS.length]
                  let opacity  = 1

                  if (hasFb) {
                    if (isSel) bg = feedback!.correct ? "#22c55e" : "#ef4444"
                    else opacity = 0.35
                  }

                  return (
                    <button key={opt.id} onClick={() => handleOptionClick(opt.id)} disabled={hasFb || submitting}
                      style={{ background: bg, opacity, color: "#fff", border: "none", borderRadius: 18, padding: "18px 14px", cursor: hasFb ? "default" : "pointer", textAlign: "left", transition: "opacity .2s, transform .1s", transform: isSel && !hasFb ? "scale(0.97)" : "scale(1)", fontFamily: "inherit" }}>
                      <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", background: "rgba(255,255,255,0.25)", borderRadius: "50%", width: 30, height: 30, fontWeight: 800, fontSize: 14, marginBottom: 10 }}>
                        {String.fromCharCode(65 + i)}
                      </div>
                      {opt.image_url && <img src={opt.image_url} alt="" style={{ width: "100%", borderRadius: 8, marginBottom: 8 }} />}
                      <p style={{ margin: 0, fontSize: 15, fontWeight: 600, lineHeight: 1.4 }}>{opt.option_text}</p>
                      {hasFb && isSel && <div style={{ marginTop: 8, fontSize: 22 }}>{feedback!.correct ? "✓" : "✗"}</div>}
                    </button>
                  )
                })}
              </div>
            )}

            {/* Text / Numeric */}
            {isText && (
              <div style={{ background: "#fff", borderRadius: 18, padding: 20, marginBottom: 14, boxShadow: "0 4px 16px rgba(0,0,0,0.06)" }}>
                <input
                  type={question.type === "numeric" ? "number" : "text"}
                  value={textVal}
                  onChange={e => setTextVal(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && !feedback && textVal.trim() && submitAnswer(null)}
                  disabled={!!feedback || submitting}
                  placeholder="Type your answer…"
                  style={{ width: "100%", padding: "14px 16px", border: "2px solid #e9d5ff", borderRadius: 12, fontSize: 16, fontFamily: "inherit", outline: "none", boxSizing: "border-box", marginBottom: 12 }}
                />
                {!feedback && (
                  <button onClick={() => submitAnswer(null)} disabled={!textVal.trim() || submitting}
                    style={{ background: ACCENT, color: "#fff", border: "none", borderRadius: 12, padding: "12px 28px", fontWeight: 700, fontSize: 15, cursor: !textVal.trim() ? "not-allowed" : "pointer", opacity: !textVal.trim() ? 0.5 : 1 }}>
                    Submit
                  </button>
                )}
              </div>
            )}

            {/* Feedback strip */}
            {feedback && (
              <div style={{ background: feedback.correct ? "#f0fdf4" : "#fef2f2", border: `2px solid ${feedback.correct ? "#86efac" : "#fca5a5"}`, borderRadius: 16, padding: "16px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
                <div style={{ flex: 1 }}>
                  <p style={{ margin: 0, fontWeight: 800, fontSize: 17, color: feedback.correct ? "#166534" : "#991b1b" }}>
                    {feedback.correct ? "🎉 Correct! Great job!" : "❌ Not quite — you've got this!"}
                  </p>
                  {!feedback.correct && (feedback.explanation?.message_en || question.explanation_en) && (
                    <p style={{ margin: "6px 0 0", fontSize: 14, color: "#374151" }}>
                      💡 {feedback.explanation?.message_en || question.explanation_en}
                    </p>
                  )}
                </div>
                <button onClick={handleNext}
                  style={{ background: ACCENT, color: "#fff", border: "none", borderRadius: 12, padding: "12px 20px", fontWeight: 700, fontSize: 15, cursor: "pointer", flexShrink: 0 }}>
                  Next →
                </button>
              </div>
            )}
          </>
        )}

        {/* Footer */}
        <div style={{ display: "flex", gap: 10, justifyContent: "center", marginTop: 12, flexWrap: "wrap" }}>
          {[
            { label: "Answered", value: answered, emoji: "📝" },
            { label: "Correct",  value: correct,  emoji: "✅" },
          ].map(({ label, value, emoji }) => (
            <div key={label} style={{ background: "rgba(255,255,255,0.85)", borderRadius: 12, padding: "8px 18px", textAlign: "center" }}>
              <span style={{ fontSize: 13, color: "#9ca3af" }}>{emoji} {label}: </span>
              <span style={{ fontWeight: 700, color: ACCENT }}>{value}</span>
            </div>
          ))}
          <button onClick={() => setPhase("select")}
            style={{ background: "rgba(255,255,255,0.85)", border: "none", borderRadius: 12, padding: "8px 18px", fontSize: 13, fontWeight: 600, color: "#6b7280", cursor: "pointer" }}>
            ← Exit
          </button>
        </div>
      </div>
    </div>
  )
}

export default PrimaryQuizFlow