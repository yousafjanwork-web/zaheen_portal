/**
 * PrimaryQuizFlow.tsx — KG–Grade 5
 *
 * FULL FEATURE LIST:
 * ✅ Subject → Chapter selector (SubjectSkillSelector)
 * ✅ Resume: fetches /skill-info before starting → restores answered/correct/mastery
 * ✅ Progress bar shows answered/totalQuestions (e.g. 8/50 = 16%)
 * ✅ Header badge shows "8/50 answered"
 * ✅ Quiz continues from next unanswered question (API is stateful)
 * ✅ After 10 session questions OR API "completed" → green Submit Quiz button
 * ✅ Results screen uses GET /quiz-result for authoritative data
 * ✅ Try Again calls POST /reset-skill then restarts from Q1
 * ✅ Original KG design: 2×2 coloured grid, Rewards sidebar, stars/XP
 *
 * Place at: src/modules/courses/pages/PrimaryQuizFlow.tsx
 */

import React, { useCallback, useEffect, useRef, useState } from "react"
import axios from "axios"
import { useParams, useLocation } from "react-router-dom"
import { classIdFromSlug } from "@/config/classSlugs"
import SubjectSkillSelector, { Skill } from "../../assessments/pages/SubjectSkillSelector"

// ─── Types ────────────────────────────────────────────────────────────────────

interface QuizOption { id: number; option_text: string; image_url: string | null }

interface Question {
  id: number; skill_id: number; type: string; difficulty: string
  prompt: string; image_url: string | null; explanation_en: string | null
  options: QuizOption[]
}

interface NextResponse { success: boolean; status?: "completed"; data?: Question }

interface SubmitResult {
  correct: boolean; masteryScore: number; streak: number; message_en: string | null
  explanation?: { message_en: string | null } | null
}

interface SubmitResponse { success: boolean; data: SubmitResult }

interface SkillProgress {
  mastery_score: number
  total_attempted: number
  correct: number
  accuracy: number
  status: "not_started" | "progressing" | "mastered"
}

interface QuizResult {
  skill_id: number; skill_name: string; total_questions: number
  attempted: number; correct: number; wrong: number
  accuracy: number; mastery_score: number; status: string
  best_streak: number
  difficulty_breakdown: {
    easy:   { attempted: number; correct: number }
    medium: { attempted: number; correct: number }
    hard:   { attempted: number; correct: number }
  }
  last_attempted: string
}

// ─── Constants ────────────────────────────────────────────────────────────────

const BASE       = "https://api.zaheen.com.pk/v2"
const TIMER_SECS = 20
const SESSION_MAX = 10           // max questions per session before Submit button appears
const ACCENT     = "#2563eb"
const OPT_COLORS = ["#3b5bdb", "#0c8599", "#c2255c", "#2f9e44"]

// ─── Props ────────────────────────────────────────────────────────────────────

interface Props { studentId?: number; subjectId?: number; classId?: number }

// ─── Component ────────────────────────────────────────────────────────────────

const PrimaryQuizFlow: React.FC<Props> = ({ studentId: propId, subjectId: propSubjectId, classId: propClassId }) => {
  const { classSlug } = useParams<{ classSlug: string }>()
  const location = useLocation()
  const locationSubjectId = location.state?.subjectId as number | undefined
  const classId   = propClassId ?? (classSlug ? classIdFromSlug(classSlug) : undefined)
 const studentId = (propId ?? Number(localStorage.getItem("user_id"))) || 2

  // ── Phase ──────────────────────────────────────────────────────────────
  const [phase, setPhase] = useState<"select" | "quiz" | "done">("select")
  const [skill, setSkill] = useState<Skill | null>(null)

  // ── Quiz state ─────────────────────────────────────────────────────────
  const [question,      setQuestion]      = useState<Question | null>(null)
  const [loading,       setLoading]       = useState(false)
  const [loadError,     setLoadError]     = useState<string | null>(null)
  const [selected,      setSelected]      = useState<number | null>(null)
  const [pendingOption, setPendingOption] = useState<number | null>(null)
  const [textVal,       setTextVal]       = useState("")
  const [feedback,      setFeedback]      = useState<SubmitResult | null>(null)

  // ── Counters — restored from API on resume ─────────────────────────────
  const [mastery,    setMastery]    = useState(0)
  const [streak,     setStreak]     = useState(0)
  const [stars,      setStars]      = useState(0)
  const [xp,         setXp]         = useState(0)
  const [answered,   setAnswered]   = useState(0)   // total ever answered (API)
  const [correct,    setCorrect]    = useState(0)   // total ever correct (API)
  const [incorrect,  setIncorrect]  = useState(0)
  const [totalQ,     setTotalQ]     = useState(0)   // skill's total_questions
  const [sessionQ,   setSessionQ]   = useState(0)   // questions answered THIS session
  const [isLast,     setIsLast]     = useState(false)

  // ── UI ─────────────────────────────────────────────────────────────────
  const [timer,    setTimer]    = useState(TIMER_SECS)
  const [showStar, setShowStar] = useState(false)

  // ── Results ────────────────────────────────────────────────────────────
  const [quizResult,        setQuizResult]        = useState<QuizResult | null>(null)
  const [quizResultLoading, setQuizResultLoading] = useState(false)
  const [quizResultError,   setQuizResultError]   = useState<string | null>(null)
  const [resetting,         setResetting]         = useState(false)

  const startRef    = useRef(Date.now())
  const timerRef    = useRef<ReturnType<typeof setInterval> | null>(null)
  const autoNextRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // ── Countdown timer ────────────────────────────────────────────────────
  useEffect(() => {
    if (phase !== "quiz" || !question || feedback) return
    timerRef.current = setInterval(() => {
      setTimer(t => {
        if (t <= 1) {
          clearInterval(timerRef.current!)
          // time up: submit with no answer
          if (question) {
            axios.post(`${BASE}/api/quiz/adaptive/submit`, {
              userId: studentId, questionId: question.id, timeTaken: TIMER_SECS,
            }).catch(() => {})
          }
          setFeedback({ correct: false, masteryScore: mastery, streak: 0, message_en: "Time's up!" })
          setAnswered(a => a + 1); setIncorrect(i => i + 1); setStreak(0)
          setSessionQ(s => s + 1)
          return 0
        }
        return t - 1
      })
    }, 1000)
    return () => clearInterval(timerRef.current!)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [question, feedback, phase])

  // ── Auto-advance 1.5s after feedback (if not last question) ───────────
  useEffect(() => {
    if (!feedback || isLast || phase !== "quiz") return
    autoNextRef.current = setTimeout(() => handleNext(), 1500)
    return () => { if (autoNextRef.current) clearTimeout(autoNextRef.current) }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [feedback, isLast, phase])

  // ── Fetch authoritative result when quiz completes ─────────────────────
  async function fetchQuizResult(skillId: number) {
    setQuizResultLoading(true); setQuizResultError(null)
    try {
      const res = await axios.get<{ success: boolean; data: QuizResult }>(
        `${BASE}/api/quiz/adaptive/quiz-result`, { params: { skillId, userId: studentId } }
      )
      setQuizResult(res.data.data)
    } catch { setQuizResultError("Could not load results. Showing local stats.") }
    finally { setQuizResultLoading(false) }
  }

  // ── Reset skill on server then restart ─────────────────────────────────
  async function handleResetAndRetry() {
    if (!skill) return
    setResetting(true)
    try {
      await axios.post(`${BASE}/api/quiz/adaptive/reset-skill`, { userId: studentId, skillId: skill.id })
    } catch { /* non-fatal */ } finally { setResetting(false) }
    setAnswered(0); setCorrect(0); setIncorrect(0); setStars(0); setXp(0)
    setMastery(0); setStreak(0); setSessionQ(0); setIsLast(false)
    setQuizResult(null); setQuizResultError(null)
    setPhase("quiz"); loadNext(skill.id, 0)
  }

  // ── Load next question ─────────────────────────────────────────────────
  const loadNext = useCallback(async (skillId: number, currentSessionQ: number) => {
    if (autoNextRef.current) clearTimeout(autoNextRef.current)
    clearInterval(timerRef.current!)
    setLoading(true); setLoadError(null)
    setSelected(null); setPendingOption(null)
    setTextVal(""); setFeedback(null)
    setTimer(TIMER_SECS); setQuestion(null)
    startRef.current = Date.now()
    try {
      const res = await axios.get<NextResponse>(
        `${BASE}/api/quiz/adaptive/next-by-skill`,
        { params: { userId: studentId, skillId } }
      )
      if (res.data.status === "completed") {
        setPhase("done"); fetchQuizResult(skillId)
      } else if (res.data.data) {
        setQuestion(res.data.data)
        setIsLast(currentSessionQ + 1 >= SESSION_MAX)
      } else {
        setLoadError("Could not load question.")
      }
    } catch { setLoadError("Request failed. Check your connection.") }
    finally { setLoading(false) }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [studentId])

  // ── Start quiz: fetch progress first, restore counters, then load Q1 ──
  async function handleStart(s: Skill) {
    setSkill(s)
    setQuizResult(null); setQuizResultError(null)
    // Fetch existing progress from API
    let prev: SkillProgress | null = null
    try {
      const res = await axios.get<{ success: boolean; data: { user_progress: SkillProgress | null } }>(
        `${BASE}/api/quiz/adaptive/skill-info`, { params: { skillId: s.id, userId: studentId } }
      )
      prev = res.data?.data?.user_progress ?? null
    } catch { /* start fresh */ }

    // RESUME: restore counters from server
    setAnswered(prev?.total_attempted ?? 0)
    setCorrect(prev?.correct ?? 0)
    setIncorrect(prev ? prev.total_attempted - prev.correct : 0)
    setMastery(prev?.mastery_score ?? 0)
    setXp((prev?.correct ?? 0) * 10)
    setTotalQ(s.total_questions ?? 0)
    setStreak(0); setStars(0); setSessionQ(0); setIsLast(false)
    setPhase("quiz")
    loadNext(s.id, 0)
  }

  // ── Submit answer ──────────────────────────────────────────────────────
  async function doSubmit(optionId: number | null) {
    if (!question || feedback) return
    clearInterval(timerRef.current!)
    const timeTaken = Math.round((Date.now() - startRef.current) / 1000)
    const body: Record<string, unknown> = { userId: studentId, questionId: question.id, timeTaken }
    if (question.type === "text" || question.type === "numeric") {
      body.submittedAnswer = textVal
    } else {
      if (optionId !== null) body.selectedOptionId = optionId
    }
    try {
      const res = await axios.post<SubmitResponse>(`${BASE}/api/quiz/adaptive/submit`, body)
      const d = res.data.data
      setFeedback(d); setMastery(d.masteryScore); setStreak(d.streak)
      const newSessionQ = sessionQ + 1
      setSessionQ(newSessionQ)
      setAnswered(a => a + 1)
      if (d.correct) {
        setCorrect(c => c + 1); setXp(x => x + 10)
        if (d.streak >= 3) { setStars(s => s + 1); setShowStar(true); setTimeout(() => setShowStar(false), 1500) }
      } else {
        setIncorrect(i => i + 1)
      }
      if (newSessionQ >= SESSION_MAX) setIsLast(true)
    } catch { /* silent */ }
    finally { setPendingOption(null) }
  }

  function handleOptionClick(id: number) {
    if (feedback || pendingOption !== null) return
    setPendingOption(id); setSelected(id); doSubmit(id)
  }

  async function handleNext() {
    if (autoNextRef.current) clearTimeout(autoNextRef.current)
    if (isLast) { setPhase("done"); if (skill) fetchQuizResult(skill.id); return }
    if (!skill) return
    loadNext(skill.id, sessionQ)
  }

  const isText      = question?.type === "text" || question?.type === "numeric"
  // Progress bar: answered / totalQ (from API skill_info)
  const progressPct = totalQ > 0 ? Math.min(100, Math.round((answered / totalQ) * 100)) : 0

  // ── PHASE: select ──────────────────────────────────────────────────────
  if (phase === "select") {
    return (
      <SubjectSkillSelector
        defaultClassId={classId}
        defaultSubjectId={propSubjectId ?? locationSubjectId}
        variant="primary"
        studentId={studentId}
        onStart={handleStart}
      />
    )
  }

  // ── PHASE: done ────────────────────────────────────────────────────────
  if (phase === "done") {
    const localAcc = answered > 0 ? Math.round((correct / answered) * 100) : 0
    const displayAccuracy   = quizResult ? quizResult.accuracy.toFixed(0)       : localAcc
    const displayMastery    = quizResult ? quizResult.mastery_score.toFixed(0)   : mastery.toFixed(0)
    const displayCorrect    = quizResult ? quizResult.correct                    : correct
    const displayAttempted  = quizResult ? quizResult.attempted                  : answered
    const displayBestStreak = quizResult?.best_streak ?? streak
    const displayStatus     = quizResult?.status ?? (mastery >= 90 ? "mastered" : "progressing")
    const acc = Number(displayAccuracy)

    return (
      <div style={{ minHeight: "100vh", background: "#f0f4fa", display: "flex", alignItems: "center", justifyContent: "center", padding: 24, fontFamily: "'Nunito','Segoe UI',sans-serif" }}>
        <div style={{ background: "#fff", borderRadius: 24, boxShadow: "0 8px 40px rgba(0,0,0,0.12)", padding: "48px 36px", maxWidth: 480, width: "100%", textAlign: "center" }}>
          <div style={{ fontSize: 72, marginBottom: 10 }}>{acc >= 80 ? "🏆" : acc >= 50 ? "⭐" : "🌟"}</div>
          <h2 style={{ fontSize: 26, fontWeight: 900, color: ACCENT, margin: "0 0 6px" }}>
            {acc >= 80 ? "Amazing job!" : acc >= 50 ? "Well done!" : "Keep going!"}
          </h2>
          {displayStatus === "mastered" && (
            <span style={{ display: "inline-block", background: "#f0fdf4", color: "#16a34a", fontSize: 13, fontWeight: 700, padding: "4px 14px", borderRadius: 99, border: "1px solid #bbf7d0", marginBottom: 8 }}>
              🏆 Mastered!
            </span>
          )}
          <p style={{ color: "#6b7280", marginBottom: 24, fontSize: 15 }}>{skill?.name}</p>
          {quizResultLoading && <p style={{ color: "#9ca3af", fontSize: 14, marginBottom: 16 }}>Loading results…</p>}
          {quizResultError && <p style={{ color: "#f59e0b", fontSize: 13, marginBottom: 16 }}>{quizResultError}</p>}

          <div style={{ display: "flex", gap: 12, justifyContent: "center", marginBottom: 24 }}>
            {[{ emoji: "⭐", label: "Stars", value: stars }, { emoji: "⚡", label: "XP", value: xp }, { emoji: "🎯", label: "Accuracy", value: `${displayAccuracy}%` }].map(({ emoji, label, value }) => (
              <div key={label} style={{ flex: 1, background: "#eff6ff", borderRadius: 16, padding: "16px 8px" }}>
                <div style={{ fontSize: 26 }}>{emoji}</div>
                <p style={{ margin: "4px 0 0", fontWeight: 900, fontSize: 20, color: ACCENT }}>{value}</p>
                <p style={{ margin: "2px 0 0", fontSize: 12, color: "#9ca3af" }}>{label}</p>
              </div>
            ))}
          </div>

          {[
            { label: "Questions Answered", value: `${displayAttempted}${totalQ ? ` / ${totalQ}` : ""}` },
            { label: "Correct Answers",    value: displayCorrect },
            { label: "Mastery Score",      value: `${displayMastery}%` },
            { label: "Best Streak",        value: `🔥 ×${displayBestStreak}` },
          ].map(({ label, value }) => (
            <div key={label} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid #f3f4f6" }}>
              <span style={{ color: "#6b7280", fontSize: 14 }}>{label}</span>
              <span style={{ fontWeight: 700, color: ACCENT, fontSize: 14 }}>{value}</span>
            </div>
          ))}

          {quizResult?.difficulty_breakdown && (
            <div style={{ marginTop: 20, background: "#f8fafc", borderRadius: 12, padding: "16px 20px", textAlign: "left" }}>
              <p style={{ margin: "0 0 12px", fontWeight: 700, fontSize: 13, color: "#374151", textTransform: "uppercase", letterSpacing: 0.6 }}>Difficulty Breakdown</p>
              {(["easy", "medium", "hard"] as const).map(d => {
                const bd = quizResult.difficulty_breakdown[d]
                const dAcc = bd.attempted > 0 ? Math.round((bd.correct / bd.attempted) * 100) : 0
                const dColor = d === "easy" ? "#16a34a" : d === "hard" ? "#dc2626" : "#d97706"
                const dBg    = d === "easy" ? "#f0fdf4" : d === "hard" ? "#fef2f2" : "#fffbeb"
                return (
                  <div key={d} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                    <span style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", background: dBg, color: dColor, padding: "2px 10px", borderRadius: 6, minWidth: 52, textAlign: "center" }}>{d}</span>
                    <div style={{ flex: 1, background: "#e5e7eb", borderRadius: 99, height: 7, overflow: "hidden" }}>
                      <div style={{ height: 7, borderRadius: 99, background: dColor, width: `${dAcc}%`, transition: "width .5s" }} />
                    </div>
                    <span style={{ fontSize: 13, fontWeight: 700, color: dColor, minWidth: 40, textAlign: "right" }}>{bd.correct}/{bd.attempted}</span>
                  </div>
                )
              })}
            </div>
          )}

          <div style={{ display: "flex", gap: 12, marginTop: 24 }}>
            <button onClick={() => { setPhase("select"); setSkill(null) }}
              style={{ flex: 1, background: "#f3f4f6", color: "#374151", border: "none", borderRadius: 12, padding: 14, fontWeight: 700, fontSize: 15, cursor: "pointer" }}>
              New Quiz
            </button>
            <button onClick={handleResetAndRetry} disabled={resetting}
              style={{ flex: 1, background: ACCENT, color: "#fff", border: "none", borderRadius: 12, padding: 14, fontWeight: 700, fontSize: 15, cursor: resetting ? "not-allowed" : "pointer", opacity: resetting ? 0.7 : 1 }}>
              {resetting ? "Resetting…" : "Try Again 🔄"}
            </button>
          </div>
        </div>
      </div>
    )
  }

  // ── PHASE: quiz ─────────────────────────────────────────────────────────
  return (
    <div style={{ minHeight: "100vh", background: "#f0f4fa", fontFamily: "'Nunito','Segoe UI',sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&display=swap');
        .pqf-opt { transition: transform .1s, box-shadow .1s, opacity .15s; }
        .pqf-opt:hover:not(:disabled) { transform: translateY(-3px); box-shadow: 0 8px 24px rgba(0,0,0,0.18); }
        @media(max-width:768px){ .pqf-grid{ grid-template-columns:1fr !important; } .pqf-sidebar{ display:none !important; } }
        @keyframes fadeInUp { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
      `}</style>

      {showStar && (
        <div style={{ position: "fixed", top: "50%", left: "50%", transform: "translate(-50%,-50%)", fontSize: 96, zIndex: 300, pointerEvents: "none" }}>⭐</div>
      )}

      <div className="pqf-grid" style={{ maxWidth: 1100, margin: "0 auto", padding: "24px 16px 60px", display: "grid", gridTemplateColumns: "1fr 280px", gap: 20 }}>

        {/* ── LEFT ── */}
        <div>
          {/* Header */}
          <div style={{ background: "#fff", borderRadius: 16, padding: "16px 20px", marginBottom: 16, boxShadow: "0 2px 12px rgba(0,0,0,0.06)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div>
              <p style={{ margin: 0, fontSize: 11, color: "#9ca3af", textTransform: "uppercase", letterSpacing: 1 }}>Chapter Quiz</p>
              <h2 style={{ margin: "3px 0 0", fontSize: 18, fontWeight: 900, color: ACCENT }}>{skill?.name}</h2>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              {/* RESUME indicator */}
              <div style={{ background: "#eff6ff", borderRadius: 99, padding: "4px 14px", fontSize: 13, fontWeight: 700, color: ACCENT }}>
                {answered}{totalQ ? `/${totalQ}` : ""} answered
              </div>
              {/* Timer */}
              <div style={{ width: 52, height: 52, borderRadius: "50%", border: `4px solid ${timer <= 10 ? "#ef4444" : ACCENT}`, color: timer <= 10 ? "#ef4444" : ACCENT, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: 19, transition: "border-color .3s,color .3s" }}>
                {timer}
              </div>
            </div>
          </div>

          {/* Progress bar: based on answered / totalQ */}
          <div style={{ marginBottom: 20 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5, fontSize: 13, fontWeight: 700 }}>
              <span style={{ color: "#374151" }}>
                Progress {totalQ > 0 ? `— ${answered}/${totalQ} questions` : ""}
              </span>
              <span style={{ color: ACCENT }}>{xp} XP ⚡</span>
            </div>
            <div style={{ background: "#e5e7eb", borderRadius: 99, height: 10, overflow: "hidden" }}>
              <div style={{ height: 10, borderRadius: 99, background: `linear-gradient(90deg,${ACCENT},#60a5fa)`, width: `${progressPct}%`, transition: "width .5s ease" }} />
            </div>
            {totalQ > 0 && (
              <div style={{ fontSize: 11, color: "#9ca3af", marginTop: 3 }}>
                {totalQ - answered} questions remaining
              </div>
            )}
          </div>

          {/* Loading */}
          {loading && (
            <div style={{ background: "#fff", borderRadius: 18, padding: "64px 24px", textAlign: "center", boxShadow: "0 4px 20px rgba(0,0,0,0.07)" }}>
              <div style={{ fontSize: 44, marginBottom: 14 }}>⏳</div>
              <p style={{ color: "#9ca3af", fontSize: 17 }}>Loading your question…</p>
            </div>
          )}

          {/* Error */}
          {loadError && !loading && (
            <div style={{ background: "#fff", borderRadius: 18, padding: "48px 24px", textAlign: "center", boxShadow: "0 4px 20px rgba(0,0,0,0.07)" }}>
              <div style={{ fontSize: 44, marginBottom: 10 }}>⚠️</div>
              <p style={{ color: "#ef4444", fontWeight: 700, marginBottom: 16 }}>{loadError}</p>
              <button onClick={() => skill && loadNext(skill.id, sessionQ)}
                style={{ background: ACCENT, color: "#fff", border: "none", borderRadius: 10, padding: "11px 26px", fontWeight: 700, fontSize: 15, cursor: "pointer" }}>
                Retry
              </button>
            </div>
          )}

          {/* Question */}
          {!loading && !loadError && question && (
            <>
              <div style={{ background: "#fff", borderRadius: 20, boxShadow: "0 4px 24px rgba(37,99,235,0.10)", padding: "24px", marginBottom: 16 }}>
                {question.image_url && <img src={question.image_url} alt="" style={{ maxWidth: "100%", borderRadius: 12, marginBottom: 16 }} />}
                <p style={{ fontSize: 20, fontWeight: 800, color: "#111827", lineHeight: 1.5, margin: 0 }}>{question.prompt}</p>
              </div>

              {/* 2×2 option grid */}
              {!isText && (
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
                  {question.options.map((opt, i) => {
                    const isSel  = selected === opt.id
                    const isPend = pendingOption === opt.id
                    const hasFb  = !!feedback
                    const locked = pendingOption !== null || hasFb
                    let bg = OPT_COLORS[i % OPT_COLORS.length], opacity = 1, border = "2px solid transparent"
                    if (isPend && !hasFb) border = "3px solid rgba(255,255,255,0.9)"
                    if (hasFb) {
                      if (isSel) { bg = feedback!.correct ? "#16a34a" : "#dc2626"; border = `3px solid ${feedback!.correct ? "#bbf7d0" : "#fca5a5"}` }
                      else opacity = 0.28
                    }
                    return (
                      <button key={opt.id} className="pqf-opt"
                        onClick={() => handleOptionClick(opt.id)} disabled={locked}
                        style={{ background: bg, opacity, color: "#fff", border, borderRadius: 18, padding: "20px 16px", cursor: locked ? "default" : "pointer", textAlign: "left", fontFamily: "inherit" }}>
                        <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", background: "rgba(255,255,255,0.25)", borderRadius: "50%", width: 30, height: 30, fontWeight: 900, fontSize: 14, marginBottom: 10 }}>
                          {String.fromCharCode(65 + i)}
                        </div>
                        {opt.image_url && <img src={opt.image_url} alt="" style={{ width: "100%", borderRadius: 8, marginBottom: 8 }} />}
                        <p style={{ margin: 0, fontSize: 15, fontWeight: 700, lineHeight: 1.4 }}>{opt.option_text}</p>
                        {hasFb && isSel && <div style={{ marginTop: 8, fontSize: 22 }}>{feedback!.correct ? "✓" : "✗"}</div>}
                      </button>
                    )
                  })}
                </div>
              )}

              {/* Text / Numeric */}
              {isText && (
                <div style={{ background: "#fff", borderRadius: 16, padding: 20, marginBottom: 16, boxShadow: "0 4px 16px rgba(0,0,0,0.06)" }}>
                  <input type={question.type === "numeric" ? "number" : "text"} value={textVal}
                    onChange={e => setTextVal(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && !feedback && textVal.trim() && doSubmit(null)}
                    disabled={!!feedback || pendingOption !== null} placeholder="Type your answer…"
                    style={{ width: "100%", padding: "13px 16px", border: "2px solid #e5e7eb", borderRadius: 10, fontSize: 16, fontFamily: "inherit", outline: "none", boxSizing: "border-box", marginBottom: 12 }}
                  />
                  {!feedback && (
                    <button onClick={() => doSubmit(null)} disabled={!textVal.trim()}
                      style={{ background: ACCENT, color: "#fff", border: "none", borderRadius: 10, padding: "12px 28px", fontWeight: 700, fontSize: 15, cursor: "pointer" }}>
                      Submit Answer
                    </button>
                  )}
                </div>
              )}

              {/* Feedback */}
              {feedback && (
                <div style={{ background: feedback.correct ? "#f0fdf4" : "#fef2f2", border: `2px solid ${feedback.correct ? "#86efac" : "#fca5a5"}`, borderRadius: 16, padding: "16px 20px", animation: "fadeInUp .2s ease" }}>
                  <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
                    <div style={{ flex: 1 }}>
                      <p style={{ margin: 0, fontWeight: 900, fontSize: 17, color: feedback.correct ? "#166534" : "#991b1b" }}>
                        {feedback.message_en === "Time's up!" ? "⏰ Time's up! Moving on…" : feedback.correct ? "🎉 Correct! Great job!" : "❌ Not quite — you've got this!"}
                      </p>
                      {!feedback.correct && feedback.message_en !== "Time's up!" && (feedback.explanation?.message_en || question.explanation_en) && (
                        <p style={{ margin: "6px 0 0", fontSize: 14, color: "#374151" }}>
                          💡 {feedback.explanation?.message_en || question.explanation_en}
                        </p>
                      )}
                      {!isLast && <p style={{ margin: "8px 0 0", fontSize: 12, color: "#9ca3af" }}>Next question in 1.5s…</p>}
                    </div>
                    {/* DYNAMIC: green Submit Quiz on last, blue Next otherwise */}
                    <button onClick={handleNext}
                      style={{ background: isLast ? "#16a34a" : ACCENT, color: "#fff", border: "none", borderRadius: 12, padding: "12px 20px", fontWeight: 700, fontSize: 15, cursor: "pointer", flexShrink: 0, whiteSpace: "nowrap", boxShadow: isLast ? "0 4px 16px rgba(22,163,74,0.35)" : "none" }}>
                      {isLast ? "✅ Submit Quiz" : "Next →"}
                    </button>
                  </div>
                </div>
              )}

              {/* Stats bar */}
              <div style={{ display: "flex", gap: 10, marginTop: 14, flexWrap: "wrap" }}>
                {[
                  { label: "Answered",  value: totalQ > 0 ? `${answered}/${totalQ}` : answered },
                  { label: "Correct",   value: correct },
                  { label: "Incorrect", value: incorrect },
                ].map(({ label, value }) => (
                  <div key={label} style={{ background: "#fff", borderRadius: 10, padding: "8px 14px", textAlign: "center", boxShadow: "0 1px 6px rgba(0,0,0,0.06)" }}>
                    <p style={{ margin: 0, fontSize: 10, color: "#9ca3af" }}>{label}</p>
                    <p style={{ margin: "2px 0 0", fontWeight: 800, fontSize: 16, color: ACCENT }}>{value}</p>
                  </div>
                ))}
                <button onClick={() => { if (autoNextRef.current) clearTimeout(autoNextRef.current); setPhase("select") }}
                  style={{ background: "#fff", border: "1.5px solid #e5e7eb", borderRadius: 10, padding: "8px 16px", fontSize: 13, fontWeight: 600, color: "#6b7280", cursor: "pointer" }}>
                  ← Exit
                </button>
              </div>
            </>
          )}
        </div>

        {/* ── RIGHT SIDEBAR — original KG rewards design ── */}
        <div className="pqf-sidebar" style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ background: "#fff", borderRadius: 18, boxShadow: "0 2px 16px rgba(0,0,0,0.08)", overflow: "hidden" }}>
            <div style={{ background: ACCENT, padding: "14px 18px" }}>
              <p style={{ margin: 0, fontWeight: 900, fontSize: 15, color: "#fff" }}>Rewards</p>
            </div>
            <div style={{ padding: "16px 18px", display: "flex", gap: 12 }}>
              <div style={{ flex: 1, background: "#fff7ed", borderRadius: 14, padding: "14px 8px", textAlign: "center" }}>
                <div style={{ fontSize: 28, marginBottom: 4 }}>⭐</div>
                <p style={{ margin: 0, fontWeight: 900, fontSize: 22, color: "#b45309" }}>{stars}</p>
              </div>
              <div style={{ flex: 1, background: "#f0fdf4", borderRadius: 14, padding: "14px 8px", textAlign: "center" }}>
                <div style={{ fontSize: 28, marginBottom: 4 }}>⚡</div>
                <p style={{ margin: 0, fontWeight: 900, fontSize: 22, color: "#16a34a" }}>{xp}</p>
              </div>
            </div>
          </div>

          <div style={{ background: "#fff", borderRadius: 18, boxShadow: "0 2px 16px rgba(0,0,0,0.08)", padding: "20px 18px", textAlign: "center" }}>
            <div style={{ fontSize: 52, marginBottom: 10 }}>{mastery >= 90 ? "🏆" : mastery >= 50 ? "🎖️" : "📦"}</div>
            <p style={{ margin: "0 0 4px", fontWeight: 800, fontSize: 14, color: mastery >= 90 ? "#16a34a" : "#6b7280" }}>
              {mastery >= 90 ? "Mastered!" : "Locked"}
            </p>
            <p style={{ margin: 0, fontSize: 13, color: "#9ca3af" }}>
              {mastery >= 90 ? "You earned this badge!" : "Answer more questions to unlock!"}
            </p>
          </div>

          <div style={{ background: "#fff", borderRadius: 18, boxShadow: "0 2px 16px rgba(0,0,0,0.08)", padding: "18px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
              <p style={{ margin: 0, fontWeight: 800, fontSize: 14, color: "#374151" }}>Mastery</p>
              <p style={{ margin: 0, fontSize: 13, color: ACCENT, fontWeight: 700 }}>{mastery.toFixed(0)}%</p>
            </div>
            <div style={{ background: "#e5e7eb", borderRadius: 99, height: 10, overflow: "hidden" }}>
              <div style={{ height: 10, borderRadius: 99, background: ACCENT, width: `${mastery}%`, transition: "width .5s" }} />
            </div>
          </div>

          <div style={{ background: "#f0fdf4", borderRadius: 18, padding: "16px 18px", border: "1px solid #bbf7d0" }}>
            <p style={{ margin: "0 0 6px", fontWeight: 800, fontSize: 13, color: "#166634" }}>💡 Tip</p>
            <p style={{ margin: 0, fontSize: 13, color: "#374151", lineHeight: 1.5 }}>Get 3 correct in a row for a streak bonus! ⚡</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PrimaryQuizFlow