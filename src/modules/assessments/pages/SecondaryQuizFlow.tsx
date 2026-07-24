/**
 * SecondaryQuizFlow.tsx — Grade 6–12
 *
 * Full quiz flow:
 *   SubjectSkillSelector → Quiz Engine (next-by-skill / submit loop)
 *
 * API flow:
 *   STEP 1  GET  /api/quiz/adaptive/subjects          → subject cards
 *   STEP 2  GET  /api/quiz/adaptive/skills-by-subject → chapter list
 *   STEP 3  GET  /api/quiz/adaptive/next-by-skill     → first question
 *   STEP 4  POST /api/quiz/adaptive/submit            → result
 *   STEP 5  Repeat 3-4 until { status: "completed" } → results screen
 *
 * Place at: src/modules/assessments/pages/SecondaryQuizFlow.tsx
 */

import React, { useCallback, useEffect, useRef, useState } from "react"
import axios from "axios"
import SubjectSkillSelector, { Skill } from "./SubjectSkillSelector"

// ─── API types ────────────────────────────────────────────────────────────────

interface QuizOption {
  id: number
  option_text: string
  image_url: string | null
}

interface Question {
  id: number
  skill_id: number
  type: string          // "mcq" | "mcq_multi" | "text" | "numeric"
  difficulty: string
  prompt: string
  image_url: string | null
  explanation_en: string | null
  explanation_ur: string | null
  options: QuizOption[]
}

interface NextResponse {
  success: boolean
  status?: "completed"
  message?: string
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
const TIMER_SECONDS = 60
const ACCENT        = "#1e3a5f"
const GREEN         = "#22c55e"
const RED           = "#ef4444"

// ─── Props ────────────────────────────────────────────────────────────────────

interface Props {
  studentId?: number
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function diffColor(d: string) {
  if (d === "easy")   return { color: "#166534", bg: "#f0fdf4" }
  if (d === "hard")   return { color: "#991b1b", bg: "#fef2f2" }
  return { color: "#92400e", bg: "#fffbeb" }
}

// ─── Component ────────────────────────────────────────────────────────────────

const SecondaryQuizFlow: React.FC<Props> = ({ studentId: propId }) => {
  const studentId = (propId ?? Number(sessionStorage.getItem("studentId"))) || 2

  // phases
  const [phase,   setPhase]   = useState<"select" | "quiz" | "done">("select")
  const [skill,   setSkill]   = useState<Skill | null>(null)

  // quiz state
  const [question,   setQuestion]   = useState<Question | null>(null)
  const [loading,    setLoading]    = useState(false)
  const [loadError,  setLoadError]  = useState<string | null>(null)
  const [selected,   setSelected]   = useState<number | null>(null)       // single MCQ
  const [multiSel,   setMultiSel]   = useState<number[]>([])              // multi MCQ
  const [textVal,    setTextVal]    = useState("")                         // text/numeric
  const [feedback,   setFeedback]   = useState<SubmitResult | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [mastery,    setMastery]    = useState(0)
  const [streak,     setStreak]     = useState(0)
  const [answered,   setAnswered]   = useState(0)
  const [correct,    setCorrect]    = useState(0)
  const [timer,      setTimer]      = useState(TIMER_SECONDS)
  const [streakMsg,  setStreakMsg]  = useState<string | null>(null)
  const [showExplain,setShowExplain]= useState(false)

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
    setMultiSel([])
    setTextVal("")
    setFeedback(null)
    setShowExplain(false)
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
        setLoadError("Unexpected response from server.")
      }
    } catch (err: any) {
      const msg = err?.response?.data?.message ?? "Could not load question. Check your connection."
      setLoadError(msg)
    } finally {
      setLoading(false)
    }
  }, [studentId])

  // ── start quiz ───────────────────────────────────────────────────────────
  function handleStart(s: Skill) {
    setSkill(s)
    setAnswered(0); setCorrect(0); setMastery(0); setStreak(0)
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
      body.selectedOptionIds = multiSel
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
      if (d.correct) setCorrect(c => c + 1)
      if (d.streak >= 3 && d.message_en) {
        setStreakMsg(d.message_en)
        setTimeout(() => setStreakMsg(null), 3000)
      }
    } catch (err: any) {
      // show generic error without blocking user
      console.error("Submit failed:", err?.response?.data ?? err)
    } finally {
      setSubmitting(false)
    }
  }

  function handleOptionClick(optId: number) {
    if (feedback || submitting) return
    if (question?.type === "mcq_multi") {
      setMultiSel(p => p.includes(optId) ? p.filter(x => x !== optId) : [...p, optId])
    } else {
      setSelected(optId)
      submitAnswer(optId)
    }
  }

  function handleMultiSubmit() {
    if (multiSel.length === 0 || feedback || submitting) return
    submitAnswer(null)
  }

  function handleTextSubmit() {
    if (!textVal.trim() || feedback || submitting) return
    submitAnswer(null)
  }

  function handleNext() {
    if (skill) loadNext(skill.id)
  }

  // ── timer colour
  const timerColor = timer <= 10 ? RED : timer <= 20 ? "#f59e0b" : ACCENT

  // ═══════════════════════════════════════════════════════════════════════════
  // PHASE: select
  // ═══════════════════════════════════════════════════════════════════════════
  if (phase === "select") {
    return <SubjectSkillSelector variant="secondary" onStart={handleStart} />
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // PHASE: done
  // ═══════════════════════════════════════════════════════════════════════════
  if (phase === "done") {
    const accuracy = answered > 0 ? Math.round((correct / answered) * 100) : 0
    return (
      <div style={{ minHeight: "100vh", background: "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
        <div style={{ background: "#fff", borderRadius: 20, boxShadow: "0 8px 40px rgba(0,0,0,0.12)", padding: "48px 40px", maxWidth: 460, width: "100%", textAlign: "center" }}>
          <div style={{ fontSize: 64, marginBottom: 12 }}>🎉</div>
          <h2 style={{ fontSize: 26, fontWeight: 800, color: ACCENT, margin: "0 0 6px" }}>Quiz Complete!</h2>
          <p style={{ color: "#6b7280", marginBottom: 28 }}>{skill?.name}</p>

          {[
            { label: "Mastery Score", value: `${mastery.toFixed(0)}%` },
            { label: "Accuracy",      value: `${accuracy}%`           },
            { label: "Score",         value: `${correct} / ${answered} correct` },
          ].map(({ label, value }) => (
            <div key={label} style={{ display: "flex", justifyContent: "space-between", padding: "12px 0", borderBottom: "1px solid #f3f4f6" }}>
              <span style={{ color: "#6b7280", fontSize: 15 }}>{label}</span>
              <span style={{ fontWeight: 700, color: ACCENT, fontSize: 15 }}>{value}</span>
            </div>
          ))}

          <div style={{ display: "flex", gap: 12, marginTop: 28, justifyContent: "center" }}>
            <button
              onClick={() => { setPhase("select"); setSkill(null) }}
              style={{ background: "#f3f4f6", color: "#374151", border: "none", borderRadius: 10, padding: "12px 24px", fontWeight: 600, cursor: "pointer", fontSize: 14 }}
            >
              New Quiz
            </button>
            <button
              onClick={() => { setAnswered(0); setCorrect(0); setMastery(0); setStreak(0); setPhase("quiz"); if (skill) loadNext(skill.id) }}
              style={{ background: ACCENT, color: "#fff", border: "none", borderRadius: 10, padding: "12px 24px", fontWeight: 600, cursor: "pointer", fontSize: 14 }}
            >
              Retry Chapter
            </button>
          </div>
        </div>
      </div>
    )
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // PHASE: quiz
  // ═══════════════════════════════════════════════════════════════════════════
  const isMulti   = question?.type === "mcq_multi"
  const isText    = question?.type === "text" || question?.type === "numeric"
  const isMcq     = !isMulti && !isText

  return (
    <div style={{ minHeight: "100vh", background: "#f1f5f9", padding: "24px 16px", fontFamily: "'Segoe UI', system-ui, sans-serif" }}>

      {/* Streak banner */}
      {streakMsg && (
        <div style={{ position: "fixed", top: 20, left: "50%", transform: "translateX(-50%)", background: "#f59e0b", color: "#fff", borderRadius: 12, padding: "12px 28px", fontWeight: 700, fontSize: 16, boxShadow: "0 4px 20px rgba(245,158,11,0.4)", zIndex: 200, whiteSpace: "nowrap" }}>
          🔥 {streakMsg}
        </div>
      )}

      <div style={{ maxWidth: 720, margin: "0 auto" }}>

        {/* Header */}
        <div style={{ background: "#fff", borderRadius: 16, padding: "14px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", boxShadow: "0 2px 12px rgba(0,0,0,0.07)", marginBottom: 16 }}>
          <div>
            <p style={{ margin: 0, fontSize: 11, color: "#9ca3af", textTransform: "uppercase", letterSpacing: 1 }}>Chapter</p>
            <p style={{ margin: "2px 0 0", fontWeight: 700, fontSize: 15, color: ACCENT }}>{skill?.name}</p>
          </div>

          {/* Countdown */}
          <div style={{ width: 54, height: 54, borderRadius: "50%", border: `4px solid ${timerColor}`, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 18, color: timerColor, transition: "border-color .3s, color .3s" }}>
            {timer}
          </div>

          {/* Mastery + streak */}
          <div style={{ textAlign: "right" }}>
            <p style={{ margin: 0, fontSize: 11, color: "#9ca3af" }}>Mastery</p>
            <p style={{ margin: "2px 0 0", fontWeight: 800, fontSize: 18, color: ACCENT }}>{mastery.toFixed(0)}%</p>
            {streak >= 3 && <p style={{ margin: "2px 0 0", fontSize: 12, color: "#f59e0b" }}>🔥 ×{streak}</p>}
          </div>
        </div>

        {/* Mastery bar */}
        <div style={{ background: "#e5e7eb", borderRadius: 99, height: 6, marginBottom: 16 }}>
          <div style={{ height: 6, borderRadius: 99, background: `linear-gradient(90deg, ${ACCENT}, #3b82f6)`, width: `${mastery}%`, transition: "width .5s ease" }} />
        </div>

        {/* Question card */}
        {loading && (
          <div style={{ background: "#fff", borderRadius: 18, padding: "60px 24px", textAlign: "center", color: "#9ca3af", boxShadow: "0 4px 24px rgba(0,0,0,0.07)" }}>
            <div style={{ fontSize: 36, marginBottom: 12 }}>⏳</div>
            <p style={{ fontSize: 16 }}>Loading question…</p>
          </div>
        )}

        {loadError && !loading && (
          <div style={{ background: "#fff", borderRadius: 18, padding: "40px 24px", textAlign: "center", boxShadow: "0 4px 24px rgba(0,0,0,0.07)" }}>
            <div style={{ fontSize: 36, marginBottom: 8 }}>⚠️</div>
            <p style={{ color: RED, fontWeight: 600, marginBottom: 16 }}>{loadError}</p>
            <button onClick={() => skill && loadNext(skill.id)} style={{ background: ACCENT, color: "#fff", border: "none", borderRadius: 10, padding: "10px 24px", fontWeight: 600, cursor: "pointer" }}>
              Try Again
            </button>
          </div>
        )}

        {!loading && !loadError && question && (
          <div style={{ background: "#fff", borderRadius: 18, boxShadow: "0 4px 24px rgba(0,0,0,0.09)", padding: "28px 24px", marginBottom: 16 }}>

            {/* Difficulty badge */}
            {question.difficulty && (() => {
              const dc = diffColor(question.difficulty)
              return (
                <span style={{ display: "inline-block", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, color: dc.color, background: dc.bg, borderRadius: 6, padding: "3px 10px", marginBottom: 14 }}>
                  {question.difficulty}
                </span>
              )
            })()}

            {/* Prompt */}
            <p style={{ fontSize: 19, fontWeight: 700, color: "#111827", lineHeight: 1.55, marginBottom: 24, margin: "0 0 24px" }}>
              {question.prompt}
            </p>

            {question.image_url && (
              <img src={question.image_url} alt="" style={{ maxWidth: "100%", borderRadius: 10, marginBottom: 20 }} />
            )}

            {/* ── MCQ single ── */}
            {isMcq && (
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {question.options.map((opt, i) => {
                  const isSel = selected === opt.id
                  const hasFb = !!feedback
                  let bg = "#f9fafb", border = "#e5e7eb", color = "#374151"
                  if (hasFb && isSel) {
                    if (feedback!.correct) { bg = "#f0fdf4"; border = GREEN;  color = "#166534" }
                    else                   { bg = "#fef2f2"; border = RED;    color = "#991b1b" }
                  } else if (!hasFb && isSel) {
                    bg = "#eff6ff"; border = "#3b82f6"; color = "#1e40af"
                  }
                  return (
                    <button key={opt.id} onClick={() => handleOptionClick(opt.id)} disabled={!!hasFb || submitting}
                      style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 16px", borderRadius: 12, border: `2px solid ${border}`, background: bg, color, fontWeight: 500, fontSize: 15, textAlign: "left", cursor: hasFb ? "default" : "pointer", transition: "all .15s", fontFamily: "inherit" }}>
                      <span style={{ width: 30, height: 30, borderRadius: "50%", flexShrink: 0, background: hasFb && isSel ? (feedback!.correct ? GREEN : RED) : ACCENT, color: "#fff", fontWeight: 700, fontSize: 13, display: "flex", alignItems: "center", justifyContent: "center" }}>
                        {String.fromCharCode(65 + i)}
                      </span>
                      <span style={{ flex: 1 }}>{opt.option_text}</span>
                      {opt.image_url && <img src={opt.image_url} alt="" style={{ width: 48, borderRadius: 6 }} />}
                      {hasFb && isSel && <span style={{ fontSize: 18, marginLeft: "auto" }}>{feedback!.correct ? "✓" : "✗"}</span>}
                    </button>
                  )
                })}
              </div>
            )}

            {/* ── MCQ multi ── */}
            {isMulti && (
              <>
                <p style={{ fontSize: 13, color: "#6b7280", marginBottom: 12 }}>Select all that apply</p>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {question.options.map((opt, i) => {
                    const isSel = multiSel.includes(opt.id)
                    const hasFb = !!feedback
                    return (
                      <button key={opt.id} onClick={() => { if (!hasFb && !submitting) setMultiSel(p => p.includes(opt.id) ? p.filter(x => x !== opt.id) : [...p, opt.id]) }}
                        disabled={hasFb}
                        style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 16px", borderRadius: 12, border: `2px solid ${isSel ? ACCENT : "#e5e7eb"}`, background: isSel ? "#eff6ff" : "#f9fafb", cursor: hasFb ? "default" : "pointer", textAlign: "left", fontFamily: "inherit", fontSize: 15 }}>
                        <span style={{ width: 22, height: 22, borderRadius: 6, border: `2px solid ${isSel ? ACCENT : "#d1d5db"}`, background: isSel ? ACCENT : "transparent", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 13, fontWeight: 700 }}>
                          {isSel ? "✓" : ""}
                        </span>
                        <span style={{ flex: 1, color: "#374151" }}>{opt.option_text}</span>
                      </button>
                    )
                  })}
                </div>
                {!feedback && (
                  <button onClick={handleMultiSubmit} disabled={multiSel.length === 0 || submitting}
                    style={{ marginTop: 16, background: ACCENT, color: "#fff", border: "none", borderRadius: 10, padding: "12px 28px", fontWeight: 700, fontSize: 15, cursor: multiSel.length === 0 ? "not-allowed" : "pointer", opacity: multiSel.length === 0 ? 0.5 : 1 }}>
                    Submit
                  </button>
                )}
              </>
            )}

            {/* ── Text / Numeric ── */}
            {isText && (
              <div>
                <input
                  type={question.type === "numeric" ? "number" : "text"}
                  value={textVal}
                  onChange={e => setTextVal(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && handleTextSubmit()}
                  disabled={!!feedback || submitting}
                  placeholder="Type your answer…"
                  style={{ width: "100%", padding: "12px 16px", border: "2px solid #e5e7eb", borderRadius: 10, fontSize: 16, fontFamily: "inherit", outline: "none", boxSizing: "border-box", marginBottom: 12 }}
                />
                {!feedback && (
                  <button onClick={handleTextSubmit} disabled={!textVal.trim() || submitting}
                    style={{ background: ACCENT, color: "#fff", border: "none", borderRadius: 10, padding: "12px 28px", fontWeight: 700, fontSize: 15, cursor: !textVal.trim() ? "not-allowed" : "pointer", opacity: !textVal.trim() ? 0.5 : 1 }}>
                    Submit
                  </button>
                )}
              </div>
            )}

            {/* Feedback strip */}
            {feedback && (
              <div style={{ marginTop: 20, padding: 16, borderRadius: 12, background: feedback.correct ? "#f0fdf4" : "#fef2f2", border: `1px solid ${feedback.correct ? "#bbf7d0" : "#fecaca"}` }}>
                <p style={{ margin: 0, fontWeight: 700, color: feedback.correct ? "#166534" : "#991b1b", fontSize: 16 }}>
                  {feedback.correct ? "✓ Correct!" : "✗ Incorrect"}
                </p>

                {/* Explanation (only on wrong) */}
                {!feedback.correct && (
                  <button onClick={() => setShowExplain(p => !p)}
                    style={{ marginTop: 8, background: "none", border: "none", color: "#92400e", fontSize: 13, fontWeight: 600, cursor: "pointer", padding: 0 }}>
                    {showExplain ? "Hide explanation ▲" : "Show explanation ▼"}
                  </button>
                )}
                {!feedback.correct && showExplain && (
                  <p style={{ margin: "8px 0 0", color: "#374151", fontSize: 14, lineHeight: 1.6 }}>
                    {feedback.explanation?.message_en || question.explanation_en || "No explanation available yet."}
                  </p>
                )}

                <button onClick={handleNext}
                  style={{ marginTop: 14, background: ACCENT, color: "#fff", border: "none", borderRadius: 10, padding: "10px 24px", fontWeight: 700, fontSize: 14, cursor: "pointer" }}>
                  Next Question →
                </button>
              </div>
            )}
          </div>
        )}

        {/* Stats footer */}
        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          {[
            { label: "Answered", value: answered },
            { label: "Correct",  value: correct },
            { label: "Accuracy", value: answered ? `${Math.round((correct / answered) * 100)}%` : "—" },
          ].map(({ label, value }) => (
            <div key={label} style={{ background: "#fff", borderRadius: 12, padding: "10px 20px", textAlign: "center", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
              <p style={{ margin: 0, fontSize: 11, color: "#9ca3af" }}>{label}</p>
              <p style={{ margin: "2px 0 0", fontWeight: 800, fontSize: 18, color: ACCENT }}>{value}</p>
            </div>
          ))}
          <button onClick={() => setPhase("select")}
            style={{ background: "#fff", border: "1.5px solid #e5e7eb", borderRadius: 12, padding: "10px 18px", fontSize: 13, fontWeight: 600, color: "#6b7280", cursor: "pointer" }}>
            ← Exit Quiz
          </button>
        </div>
      </div>
    </div>
  )
}

export default SecondaryQuizFlow