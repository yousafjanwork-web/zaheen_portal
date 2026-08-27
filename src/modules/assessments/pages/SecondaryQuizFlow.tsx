/**
 * SecondaryQuizFlow.tsx — Grade 6–12
 *
 * RESUME SUPPORT:
 *   When user starts a quiz, /skill-info is fetched first.
 *   answered, correct, mastery, qIndex are all restored from API.
 *   The API's next-by-skill is stateful — it returns the next
 *   unanswered question automatically.
 *
 * SUBJECT DEEP-LINK:
 *   If the grade overview page navigates to /grade-9/quiz with
 *   router state { subjectId: 42 }, the selector jumps straight
 *   to that subject's skill list — no need to pick a subject again.
 *   The grade overview page should use:
 *     navigate(`/grade-9/quiz`, { state: { subjectId: subject.subject_id } })
 *
 * SUBMIT:
 *   "Next Question" changes to "✅ Submit Quiz" after 10 session
 *   questions OR when API returns { status: "completed" }.
 *
 * TRY AGAIN:
 *   POST /reset-skill clears server state, then restarts from Q1.
 *
 * Place at: src/modules/assessments/pages/SecondaryQuizFlow.tsx
 */

import React, { useCallback, useEffect, useRef, useState } from "react"
import axios from "axios"
import { useParams, useLocation } from "react-router-dom"
import { classIdFromSlug } from "@/config/classSlugs"
import SubjectSkillSelector, { Skill } from "./SubjectSkillSelector"

// ─── Types ────────────────────────────────────────────────────────────────────

interface QuizOption { id: number; option_text: string; image_url: string | null }

interface Question {
  id: number; skill_id: number; type: string; difficulty: string
  prompt: string; image_url: string | null
  explanation_en: string | null; explanation_ur: string | null
  options: QuizOption[]
}

interface NextResponse { success: boolean; status?: "completed"; message?: string; data?: Question }

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

// ─── Constants ────────────────────────────────────────────────────────────────

const BASE   = "https://api.zaheen.com.pk/v2"
const MAX_Q  = 10
const ACCENT = "#1e3a5f"
const GREEN  = "#22c55e"
const RED    = "#ef4444"

// ─── Props ────────────────────────────────────────────────────────────────────

interface Props { studentId?: number; defaultClassId?: number; defaultSubjectId?: number }

// ─── Component ────────────────────────────────────────────────────────────────

const SecondaryQuizFlow: React.FC<Props> = ({
  studentId: propId,
  defaultClassId: propClassId,
  defaultSubjectId: propSubjectId,
}) => {
  // ── Route params: read classSlug from URL (e.g. /grade-9/quiz → "grade-9") ─
  const { classSlug } = useParams<{ classSlug: string }>()
  const location = useLocation()

  // subjectId deep-link: prop → router state → undefined
  // Router state is set by the grade overview page when clicking a subject's Quiz button:
  //   navigate(`/grade-${n}/quiz`, { state: { subjectId: subject.subject_id } })
  const locationSubjectId = (location.state as { subjectId?: number } | null)?.subjectId
  const defaultSubjectId  = propSubjectId ?? locationSubjectId

  // classId: prop → URL slug → undefined
  const defaultClassId = propClassId ?? (classSlug ? classIdFromSlug(classSlug) : undefined)

const studentId = (propId ?? Number(localStorage.getItem("user_id"))) || 2

  const [phase,      setPhase]      = useState<"select" | "quiz" | "done">("select")
  const [skill,      setSkill]      = useState<Skill | null>(null)
  const [question,   setQuestion]   = useState<Question | null>(null)
  const [loading,    setLoading]    = useState(false)
  const [loadError,  setLoadError]  = useState<string | null>(null)
  const [selected,   setSelected]   = useState<number | null>(null)
  const [multiSel,   setMultiSel]   = useState<number[]>([])
  const [textVal,    setTextVal]    = useState("")
  const [feedback,   setFeedback]   = useState<SubmitResult | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [streakMsg,  setStreakMsg]  = useState<string | null>(null)
  const [showExpl,   setShowExpl]   = useState(false)

  // ── RESUME: restored from /skill-info ───────────────────────────────────
  const [mastery,   setMastery]   = useState(0)
  const [streak,    setStreak]    = useState(0)
  const [answered,  setAnswered]  = useState(0)
  const [correct,   setCorrect]   = useState(0)
  const [elapsed,   setElapsed]   = useState(0)
  const [navStatus, setNavStatus] = useState<(boolean | undefined)[]>([])
  const [qIndex,    setQIndex]    = useState(0)
  const [sessionQ,  setSessionQ]  = useState(0)
  const [isLast,    setIsLast]    = useState(false)

  const elapsedRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const startRef   = useRef(Date.now())

  useEffect(() => {
    if (phase !== "quiz") return
    elapsedRef.current = setInterval(() => setElapsed(e => e + 1), 1000)
    return () => clearInterval(elapsedRef.current!)
  }, [phase])

  const fmtTime = (s: number) => {
    const m   = Math.floor(s / 60).toString().padStart(2, "0")
    const sec = (s % 60).toString().padStart(2, "0")
    return `${m}:${sec}`
  }

  const loadNext = useCallback(async (skillId: number, currentSessionQ: number) => {
    setLoading(true); setLoadError(null)
    setSelected(null); setMultiSel([]); setTextVal("")
    setFeedback(null); setShowExpl(false); setQuestion(null)
    startRef.current = Date.now()
    try {
      const res = await axios.get<NextResponse>(
        `${BASE}/api/quiz/adaptive/next-by-skill`,
        { params: { userId: studentId, skillId } }
      )
      if (res.data.status === "completed") {
        clearInterval(elapsedRef.current!); setIsLast(true); setPhase("done")
      } else if (res.data.data) {
        setQuestion(res.data.data)
        setIsLast(currentSessionQ + 1 >= MAX_Q)
      } else {
        setLoadError("Unexpected server response.")
      }
    } catch (err: any) {
      setLoadError(err?.response?.data?.message ?? "Failed to load question. Check your connection.")
    } finally {
      setLoading(false)
    }
  }, [studentId])

  // ── handleStart: restores progress from API then starts quiz ────────────
  function handleStart(s: Skill, initialProgress?: SkillProgress) {
    setSkill(s)
    const prev = initialProgress
    const prevAnswered = prev?.total_attempted ?? 0
    const prevCorrect  = prev?.correct ?? 0
    setAnswered(prevAnswered)
    setCorrect(prevCorrect)
    setMastery(prev?.mastery_score ?? 0)
    setStreak(0)
    setElapsed(0)
    setSessionQ(0)
    setIsLast(false)
    setNavStatus(Array(prevAnswered).fill(undefined))
    setQIndex(prevAnswered)
    setPhase("quiz")
    loadNext(s.id, 0)
  }

  async function doSubmit(optionId: number | null) {
    if (!question || submitting || feedback) return
    setSubmitting(true)
    const timeTaken = Math.round((Date.now() - startRef.current) / 1000)
    const body: Record<string, unknown> = { userId: studentId, questionId: question.id, timeTaken }
    if (question.type === "mcq_multi")                                body.selectedOptionIds = multiSel
    else if (question.type === "text" || question.type === "numeric") body.submittedAnswer   = textVal
    else if (optionId !== null)                                       body.selectedOptionId  = optionId

    try {
      const res = await axios.post<SubmitResponse>(`${BASE}/api/quiz/adaptive/submit`, body)
      const d = res.data.data
      setFeedback(d); setMastery(d.masteryScore); setStreak(d.streak)
      const isCorrectAnswer = d.correct
      const newSessionQ = sessionQ + 1
      setSessionQ(newSessionQ)
      setAnswered(a => a + 1)
      if (isCorrectAnswer) setCorrect(c => c + 1)
      setNavStatus(prev => { const n = [...prev]; n[qIndex] = isCorrectAnswer; return n })
      if (d.streak >= 3 && d.message_en) {
        setStreakMsg(d.message_en); setTimeout(() => setStreakMsg(null), 3000)
      }
      if (newSessionQ >= MAX_Q) setIsLast(true)
    } catch (err: any) {
      console.error("Submit error:", err?.response?.data ?? err)
    } finally {
      setSubmitting(false)
    }
  }

  function handleOptionClick(id: number) {
    if (feedback || submitting) return
    if (question?.type === "mcq_multi") {
      setMultiSel(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id])
    } else {
      setSelected(id); doSubmit(id)
    }
  }

  function handleNext() {
    if (isLast) { setPhase("done") }
    else if (skill) { setQIndex(i => i + 1); loadNext(skill.id, sessionQ) }
  }

  const isMulti = question?.type === "mcq_multi"
  const isText  = question?.type === "text" || question?.type === "numeric"
  const isMcq   = !isMulti && !isText

  // ── PHASE: select ─────────────────────────────────────────────────────────
  if (phase === "select") {
    return (
      <SubjectSkillSelector
        variant="secondary"
        defaultClassId={defaultClassId}
        defaultSubjectId={defaultSubjectId}
        studentId={studentId}
        onStart={(s) => {
          axios.get<{ success: boolean; data: { user_progress: SkillProgress | null } }>(
            `${BASE}/api/quiz/adaptive/skill-info`,
            { params: { skillId: s.id, userId: studentId } }
          ).then(r => handleStart(s, r.data?.data?.user_progress ?? undefined))
            .catch(() => handleStart(s, undefined))
        }}
      />
    )
  }

  // ── PHASE: done ───────────────────────────────────────────────────────────
  if (phase === "done") {
    const acc = answered > 0 ? Math.round((correct / answered) * 100) : 0
    return (
      <div style={{ minHeight: "100vh", background: "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center", padding: 24, fontFamily: "'Segoe UI',system-ui,sans-serif" }}>
        <div style={{ background: "#fff", borderRadius: 20, boxShadow: "0 8px 40px rgba(0,0,0,0.12)", padding: "48px 40px", maxWidth: 460, width: "100%", textAlign: "center" }}>
          <div style={{ fontSize: 64, marginBottom: 12 }}>🎉</div>
          <h2 style={{ fontSize: 26, fontWeight: 800, color: ACCENT, margin: "0 0 6px" }}>Quiz Complete!</h2>
          <p style={{ color: "#6b7280", marginBottom: 28 }}>{skill?.name}</p>
          {[
            { label: "Mastery Score",  value: `${mastery.toFixed(0)}%` },
            { label: "Accuracy",       value: `${acc}%` },
            { label: "Total Answered", value: answered },
            { label: "Correct",        value: correct },
            { label: "Time",           value: fmtTime(elapsed) },
          ].map(({ label, value }) => (
            <div key={label} style={{ display: "flex", justifyContent: "space-between", padding: "11px 0", borderBottom: "1px solid #f3f4f6" }}>
              <span style={{ color: "#6b7280", fontSize: 15 }}>{label}</span>
              <span style={{ fontWeight: 700, color: ACCENT, fontSize: 15 }}>{value}</span>
            </div>
          ))}
          <div style={{ display: "flex", gap: 12, marginTop: 28 }}>
            <button
              onClick={() => { setPhase("select"); setSkill(null) }}
              style={{ flex: 1, background: "#f3f4f6", color: "#374151", border: "none", borderRadius: 10, padding: "12px 0", fontWeight: 600, cursor: "pointer", fontSize: 14 }}
            >
              New Quiz
            </button>
            <button
              onClick={async () => {
                if (!skill) return
                await axios.post(`${BASE}/api/quiz/adaptive/reset-skill`, { userId: studentId, skillId: skill.id }).catch(() => {})
                setAnswered(0); setCorrect(0); setMastery(0); setStreak(0)
                setElapsed(0); setSessionQ(0); setQIndex(0); setNavStatus([]); setIsLast(false)
                setPhase("quiz"); loadNext(skill.id, 0)
              }}
              style={{ flex: 1, background: ACCENT, color: "#fff", border: "none", borderRadius: 10, padding: "12px 0", fontWeight: 600, cursor: "pointer", fontSize: 14 }}
            >
              Try Again 🔄
            </button>
          </div>
        </div>
      </div>
    )
  }

  // ── PHASE: quiz — Grade 6–12 design ──────────────────────────────────────
  const navCount = Math.max(qIndex + 1, answered + 1)

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc", fontFamily: "'Segoe UI',system-ui,sans-serif" }}>
      <style>{`.sqf-opt{transition:border-color .15s,background .15s}.sqf-opt:hover:not(:disabled){border-color:${ACCENT}!important;background:#eff6ff!important}`}</style>

      {streakMsg && (
        <div style={{ position: "fixed", top: 20, left: "50%", transform: "translateX(-50%)", background: "#f59e0b", color: "#fff", borderRadius: 12, padding: "12px 28px", fontWeight: 700, fontSize: 16, boxShadow: "0 4px 20px rgba(245,158,11,0.4)", zIndex: 200, whiteSpace: "nowrap" }}>
          🔥 {streakMsg}
        </div>
      )}

      {/* Top header */}
      <div style={{ background: "#fff", borderBottom: "1px solid #e5e7eb", padding: "14px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
        <div>
          <p style={{ margin: 0, fontWeight: 800, fontSize: 16, color: ACCENT }}>Skill Assessment</p>
          <p style={{ margin: "2px 0 0", fontSize: 13, color: "#6b7280" }}>Section 1: Multiple Choice Questions</p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ background: "#eff6ff", color: ACCENT, borderRadius: 20, padding: "5px 14px", fontWeight: 700, fontSize: 13 }}>
            {answered} answered
          </div>
          <div style={{ background: "#eff6ff", color: ACCENT, borderRadius: 20, padding: "5px 14px", fontWeight: 700, fontSize: 13 }}>
            Skill #{skill?.id ?? "—"}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "28px 16px 60px", display: "grid", gridTemplateColumns: "1fr 300px", gap: 20 }}>

        {/* LEFT */}
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <span style={{ fontWeight: 800, fontSize: 14, color: ACCENT, textTransform: "uppercase", letterSpacing: 0.6 }}>
              Question {qIndex + 1}
              {sessionQ > 0 && <span style={{ fontWeight: 500, color: "#9ca3af", fontSize: 12, marginLeft: 8 }}>(Session: {sessionQ}/{MAX_Q})</span>}
            </span>
            <span style={{ fontWeight: 700, fontSize: 13, color: "#6b7280" }}>1.5 Points</span>
          </div>

          {loading && (
            <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #e5e7eb", padding: "48px 24px", textAlign: "center", color: "#9ca3af" }}>
              <div style={{ fontSize: 36, marginBottom: 12 }}>⏳</div>
              <p>Loading question…</p>
            </div>
          )}

          {loadError && !loading && (
            <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #fecaca", padding: "36px 24px", textAlign: "center" }}>
              <p style={{ color: RED, fontWeight: 600, marginBottom: 16 }}>{loadError}</p>
              <button onClick={() => skill && loadNext(skill.id, sessionQ)}
                style={{ background: ACCENT, color: "#fff", border: "none", borderRadius: 10, padding: "10px 24px", fontWeight: 700, cursor: "pointer" }}>
                Try Again
              </button>
            </div>
          )}

          {!loading && !loadError && question && (
            <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #e5e7eb", overflow: "hidden", marginBottom: 16 }}>
              {question.difficulty && (
                <div style={{ background: "#f8fafc", padding: "8px 20px", borderBottom: "1px solid #f1f5f9" }}>
                  <span style={{
                    fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.8,
                    color: question.difficulty === "easy" ? "#166534" : question.difficulty === "hard" ? "#991b1b" : "#92400e",
                    background: question.difficulty === "easy" ? "#f0fdf4" : question.difficulty === "hard" ? "#fef2f2" : "#fffbeb",
                    padding: "2px 10px", borderRadius: 6,
                  }}>
                    {question.difficulty}
                  </span>
                </div>
              )}

              <div style={{ padding: "24px 24px 20px" }}>
                {question.image_url && <img src={question.image_url} alt="" style={{ maxWidth: "100%", borderRadius: 10, marginBottom: 16 }} />}
                <p style={{ fontSize: 17, fontWeight: 700, color: "#111827", lineHeight: 1.6, margin: "0 0 24px" }}>
                  {question.prompt}
                </p>

                {isMcq && (
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    {question.options.map((opt, i) => {
                      const isSel = selected === opt.id
                      const hasFb = !!feedback
                      let bg = "#fff", border = "#e5e7eb", color = "#374151"
                      if (hasFb && isSel) {
                        if (feedback!.correct) { bg="#f0fdf4"; border=GREEN; color="#166534" }
                        else                   { bg="#fef2f2"; border=RED;   color="#991b1b" }
                      } else if (!hasFb && isSel) {
                        bg="#eff6ff"; border="#3b82f6"; color="#1e40af"
                      }
                      return (
                        <button key={opt.id} className="sqf-opt"
                          onClick={() => handleOptionClick(opt.id)} disabled={!!hasFb || submitting}
                          style={{ display:"flex", alignItems:"center", gap:14, padding:"13px 16px", borderRadius:10, border:`2px solid ${border}`, background:bg, color, fontWeight:500, fontSize:15, textAlign:"left", cursor:hasFb?"default":"pointer", fontFamily:"inherit" }}>
                          <span style={{ width:30, height:30, borderRadius:"50%", flexShrink:0, background:hasFb&&isSel?(feedback!.correct?GREEN:RED):ACCENT, color:"#fff", fontWeight:700, fontSize:13, display:"flex", alignItems:"center", justifyContent:"center" }}>
                            {String.fromCharCode(65+i)}
                          </span>
                          <span style={{ flex:1 }}>{opt.option_text}</span>
                          {opt.image_url && <img src={opt.image_url} alt="" style={{ width:44, borderRadius:6 }} />}
                          {hasFb && isSel && <span style={{ fontSize:16 }}>{feedback!.correct?"✓":"✗"}</span>}
                        </button>
                      )
                    })}
                  </div>
                )}

                {isMulti && (
                  <>
                    <p style={{ fontSize:13, color:"#6b7280", marginBottom:10 }}>Select all that apply</p>
                    <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
                      {question.options.map(opt => {
                        const isSel = multiSel.includes(opt.id)
                        const hasFb = !!feedback
                        return (
                          <button key={opt.id}
                            onClick={() => { if(!hasFb&&!submitting) setMultiSel(p=>p.includes(opt.id)?p.filter(x=>x!==opt.id):[...p,opt.id]) }}
                            disabled={hasFb}
                            style={{ display:"flex", alignItems:"center", gap:12, padding:"13px 16px", borderRadius:10, border:`2px solid ${isSel?ACCENT:"#e5e7eb"}`, background:isSel?"#eff6ff":"#fff", cursor:hasFb?"default":"pointer", textAlign:"left", fontFamily:"inherit", fontSize:15 }}>
                            <span style={{ width:22, height:22, borderRadius:6, border:`2px solid ${isSel?ACCENT:"#d1d5db"}`, background:isSel?ACCENT:"transparent", display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", fontSize:13, fontWeight:700, flexShrink:0 }}>
                              {isSel?"✓":""}
                            </span>
                            <span style={{ flex:1, color:"#374151" }}>{opt.option_text}</span>
                          </button>
                        )
                      })}
                    </div>
                    {!feedback && (
                      <button onClick={() => doSubmit(null)} disabled={multiSel.length===0||submitting}
                        style={{ marginTop:16, background:ACCENT, color:"#fff", border:"none", borderRadius:10, padding:"11px 28px", fontWeight:700, fontSize:15, cursor:multiSel.length===0?"not-allowed":"pointer", opacity:multiSel.length===0?0.5:1 }}>
                        Submit
                      </button>
                    )}
                  </>
                )}

                {isText && (
                  <div>
                    <input type={question.type==="numeric"?"number":"text"} value={textVal}
                      onChange={e=>setTextVal(e.target.value)}
                      onKeyDown={e=>e.key==="Enter"&&!feedback&&textVal.trim()&&doSubmit(null)}
                      disabled={!!feedback||submitting} placeholder="Type your answer…"
                      style={{ width:"100%", padding:"12px 16px", border:"2px solid #e5e7eb", borderRadius:10, fontSize:16, fontFamily:"inherit", outline:"none", boxSizing:"border-box", marginBottom:12 }}
                    />
                    {!feedback && (
                      <button onClick={()=>doSubmit(null)} disabled={!textVal.trim()||submitting}
                        style={{ background:ACCENT, color:"#fff", border:"none", borderRadius:10, padding:"11px 28px", fontWeight:700, fontSize:15, cursor:!textVal.trim()?"not-allowed":"pointer", opacity:!textVal.trim()?0.5:1 }}>
                        Submit
                      </button>
                    )}
                  </div>
                )}

                {feedback && (
                  <div style={{ marginTop:20, padding:16, borderRadius:12, background:feedback.correct?"#f0fdf4":"#fef2f2", border:`1px solid ${feedback.correct?"#bbf7d0":"#fecaca"}` }}>
                    <p style={{ margin:0, fontWeight:700, color:feedback.correct?"#166534":"#991b1b", fontSize:15 }}>
                      {feedback.correct?"✓ Correct!":"✗ Incorrect"}
                    </p>
                    {!feedback.correct && (
                      <button onClick={()=>setShowExpl(p=>!p)}
                        style={{ marginTop:6, background:"none", border:"none", color:"#92400e", fontSize:13, fontWeight:600, cursor:"pointer", padding:0 }}>
                        {showExpl?"Hide explanation ▲":"Show explanation ▼"}
                      </button>
                    )}
                    {!feedback.correct && showExpl && (
                      <p style={{ margin:"8px 0 0", color:"#374151", fontSize:14, lineHeight:1.6 }}>
                        {feedback.explanation?.message_en || question.explanation_en || "No explanation available yet."}
                      </p>
                    )}
                    <button onClick={handleNext}
                      style={{ marginTop:14, background:isLast?"#16a34a":ACCENT, color:"#fff", border:"none", borderRadius:10, padding:"10px 24px", fontWeight:700, fontSize:14, cursor:"pointer", boxShadow:isLast?"0 4px 16px rgba(22,163,74,0.35)":"none" }}>
                      {isLast ? "✅ Submit Quiz" : "Next Question →"}
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Bottom stats */}
          <div style={{ display:"flex", gap:10, flexWrap:"wrap" }}>
            {[
              { label:"Total Answered", value:answered },
              { label:"Correct",        value:correct },
              { label:"Mastery",        value:`${mastery.toFixed(0)}%` },
            ].map(({label,value}) => (
              <div key={label} style={{ background:"#fff", borderRadius:10, padding:"8px 18px", textAlign:"center", border:"1px solid #e5e7eb" }}>
                <p style={{ margin:0, fontSize:11, color:"#9ca3af" }}>{label}</p>
                <p style={{ margin:"2px 0 0", fontWeight:800, fontSize:17, color:ACCENT }}>{value}</p>
              </div>
            ))}
            <button onClick={()=>setPhase("select")}
              style={{ background:"#fff", border:"1.5px solid #e5e7eb", borderRadius:10, padding:"8px 16px", fontSize:13, fontWeight:600, color:"#6b7280", cursor:"pointer" }}>
              ← Exit Quiz
            </button>
          </div>
        </div>

        {/* RIGHT SIDEBAR */}
        <div style={{ display:"flex", flexDirection:"column", gap:16 }}>

          {/* Time Elapsed */}
          <div style={{ background:"#fff", borderRadius:16, border:"1px solid #e5e7eb", padding:"20px", textAlign:"center", boxShadow:"0 2px 12px rgba(0,0,0,0.06)" }}>
            <p style={{ margin:"0 0 8px", fontSize:12, fontWeight:700, color:"#6b7280", textTransform:"uppercase", letterSpacing:0.8 }}>Time Elapsed</p>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:8, marginBottom:4 }}>
              <span style={{ fontSize:18 }}>⏱️</span>
              <span style={{ fontWeight:900, fontSize:28, color:ACCENT, fontVariantNumeric:"tabular-nums" }}>{fmtTime(elapsed)}</span>
            </div>
            {streak >= 3 && <p style={{ margin:0, fontSize:13, color:"#f59e0b", fontWeight:700 }}>🔥 Streak ×{streak}</p>}
          </div>

          {/* Question Navigator */}
          <div style={{ background:"#fff", borderRadius:16, border:"1px solid #e5e7eb", padding:"18px", boxShadow:"0 2px 12px rgba(0,0,0,0.06)" }}>
            <h3 style={{ margin:"0 0 14px", fontSize:14, fontWeight:800, color:"#111827" }}>Question Navigator</h3>
            <div style={{ display:"flex", gap:6, marginBottom:14, flexWrap:"wrap" }}>
              {[{color:"#22c55e",label:"Correct"},{color:"#ef4444",label:"Wrong"},{color:"#d1d5db",label:"Previous"}].map(({color,label})=>(
                <div key={label} style={{ display:"flex", alignItems:"center", gap:4, fontSize:12, color:"#6b7280" }}>
                  <div style={{ width:10, height:10, borderRadius:"50%", background:color }} />{label}
                </div>
              ))}
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(5,1fr)", gap:6 }}>
              {Array.from({ length: navCount }).map((_,i) => {
                const status    = navStatus[i]
                const isCurrent = i === qIndex
                let bg="#f1f5f9", color="#6b7280", border="1px solid #e5e7eb"
                if (i < (answered - sessionQ)) {
                  bg="#e5e7eb"; color="#6b7280"; border="1px solid #d1d5db"
                }
                if (status === true)  { bg="#dcfce7"; color="#166534"; border="1px solid #86efac" }
                if (status === false) { bg="#fee2e2"; color="#991b1b"; border="1px solid #fca5a5" }
                if (isCurrent)        { bg=ACCENT;   color="#fff";    border=`1px solid ${ACCENT}` }
                return (
                  <div key={i} style={{ width:"100%", aspectRatio:"1", borderRadius:8, background:bg, color, border, display:"flex", alignItems:"center", justifyContent:"center", fontWeight:700, fontSize:12 }}>
                    {i+1}
                  </div>
                )
              })}
            </div>
          </div>

          {/* Mastery bar */}
          <div style={{ background:"#fff", borderRadius:16, border:"1px solid #e5e7eb", padding:"18px", boxShadow:"0 2px 12px rgba(0,0,0,0.06)" }}>
            <div style={{ display:"flex", justifyContent:"space-between", marginBottom:8 }}>
              <span style={{ fontSize:13, fontWeight:700, color:"#374151" }}>Mastery</span>
              <span style={{ fontSize:13, fontWeight:800, color:ACCENT }}>{mastery.toFixed(0)}%</span>
            </div>
            <div style={{ background:"#e5e7eb", borderRadius:99, height:8, overflow:"hidden" }}>
              <div style={{ height:8, borderRadius:99, background:`linear-gradient(90deg,${ACCENT},#3b82f6)`, width:`${mastery}%`, transition:"width .5s" }} />
            </div>
            <p style={{ margin:"8px 0 0", fontSize:12, color:"#9ca3af" }}>
              {mastery>=90?"🏆 Mastered!":mastery>=50?"📈 Progressing":"🌱 Just started"}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SecondaryQuizFlow