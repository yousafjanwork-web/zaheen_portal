/**
 * SubjectSkillSelector.tsx
 *
 * 3-step wizard — fully dynamic, no hardcoded IDs.
 *
 * Step 1 → GET /api/quiz/adaptive/subjects
 *           Shows all subjects that have quizzes.
 *           Subjects without quizzes are never returned by this API.
 *
 * Step 2 → GET /api/quiz/adaptive/skills-by-subject?subjectId=
 *           Shows all skills (chapters) for the chosen subject.
 *           has_questions = 1  → normal card, clickable
 *           has_questions = 0  → "Coming Soon" badge, not clickable
 *
 * Step 3 → User confirms → onStart(skill) fires → quiz begins
 *
 * Props
 * ─────
 *   variant    "primary" (KG–5, purple) | "secondary" (6–12, navy)
 *   onStart    callback with the chosen Skill object
 *
 * Place at: src/modules/assessments/pages/SubjectSkillSelector.tsx
 */

import React, { useEffect, useState } from "react"
import axios from "axios"

// ─── Types ────────────────────────────────────────────────────────────────────

export interface Subject {
  subject_id: number
  name_en: string
  name_ur: string | null
  description_en: string | null
  thumbnail: string | null
  total_skills: number
  total_questions: number
}

export interface Skill {
  id: number
  name: string
  name_ur: string | null
  description: string | null
  number_question: number | null
  subject_id: number
  subject_name: string
  subject_name_ur: string | null
  has_questions: 0 | 1
}

interface Props {
  variant?: "primary" | "secondary"
  onStart: (skill: Skill) => void
}

// ─── API ─────────────────────────────────────────────────────────────────────

const BASE = "https://api.zaheen.com.pk/v2"

async function fetchSubjects(): Promise<Subject[]> {
  const res = await axios.get<{ success: boolean; data: Subject[] }>(
    `${BASE}/api/quiz/adaptive/subjects`
  )
  if (!res.data.success) throw new Error("Failed to load subjects")
  return res.data.data ?? []
}

async function fetchSkills(subjectId: number): Promise<Skill[]> {
  const res = await axios.get<{ success: boolean; data: Skill[] }>(
    `${BASE}/api/quiz/adaptive/skills-by-subject`,
    { params: { subjectId } }
  )
  if (!res.data.success) throw new Error("Failed to load skills")
  return res.data.data ?? []
}

// ─── Thumbnail icon map ───────────────────────────────────────────────────────
// The API returns a "thumbnail" string like "BookOpen", "Sigma", "Atom" etc.
const ICON_MAP: Record<string, string> = {
  BookOpen:    "📖",
  Sigma:       "🔢",
  Calculator:  "🧮",
  Languages:   "✏️",
  Atom:        "⚛️",
  Leaf:        "🧬",
  TaskConical: "🧪",
  Cpu:         "💻",
  default:     "📚",
}
function getIcon(thumbnail: string | null): string {
  if (!thumbnail) return ICON_MAP.default
  return ICON_MAP[thumbnail] ?? ICON_MAP.default
}

// ─── Component ────────────────────────────────────────────────────────────────

const SubjectSkillSelector: React.FC<Props> = ({ variant = "secondary", onStart }) => {
  const isPrimary = variant === "primary"

  // colours
  const accent      = isPrimary ? "#7c3aed" : "#1e3a5f"
  const accentLight = isPrimary ? "#f5f3ff" : "#f0f4ff"
  const accentBorder= isPrimary ? "#ddd6fe" : "#c7d2fe"
  const bgPage      = isPrimary
    ? "linear-gradient(135deg, #fdf4ff 0%, #eff6ff 100%)"
    : "#f1f5f9"

  // step: "subjects" | "skills" | "confirm"
  const [step,            setStep]           = useState<"subjects" | "skills" | "confirm">("subjects")
  const [subjects,        setSubjects]       = useState<Subject[]>([])
  const [subjectsLoading, setSubjectsLoading]= useState(true)
  const [subjectsError,   setSubjectsError]  = useState<string | null>(null)

  const [selectedSubject, setSelectedSubject]= useState<Subject | null>(null)
  const [skills,          setSkills]         = useState<Skill[]>([])
  const [skillsLoading,   setSkillsLoading]  = useState(false)
  const [skillsError,     setSkillsError]    = useState<string | null>(null)

  const [selectedSkill,   setSelectedSkill]  = useState<Skill | null>(null)

  // ── Load subjects on mount
  useEffect(() => {
    setSubjectsLoading(true)
    fetchSubjects()
      .then(data => setSubjects(data))
      .catch(() => setSubjectsError("Could not load subjects. Please try again."))
      .finally(() => setSubjectsLoading(false))
  }, [])

  // ── When subject is tapped, load its skills
  async function handleSubjectSelect(subject: Subject) {
    setSelectedSubject(subject)
    setSelectedSkill(null)
    setSkillsError(null)
    setStep("skills")
    setSkillsLoading(true)
    try {
      const data = await fetchSkills(subject.subject_id)
      setSkills(data)
    } catch {
      setSkillsError("Could not load quizzes for this subject.")
    } finally {
      setSkillsLoading(false)
    }
  }

  function handleSkillSelect(skill: Skill) {
    if (!skill.has_questions) return  // Coming Soon — not clickable
    setSelectedSkill(skill)
    setStep("confirm")
  }

  // ── shared style helpers
  const card: React.CSSProperties = {
    background: isPrimary ? "#fffbf0" : "#ffffff",
    borderRadius: isPrimary ? 24 : 16,
    boxShadow: "0 4px 28px rgba(0,0,0,0.10)",
    padding: isPrimary ? "32px 28px" : "28px 24px",
    maxWidth: 580,
    margin: "0 auto",
    fontFamily: "'Segoe UI', system-ui, sans-serif",
  }

  const heading: React.CSSProperties = {
    fontSize: isPrimary ? 22 : 20,
    fontWeight: 800,
    color: accent,
    margin: "0 0 4px",
  }

  const subText: React.CSSProperties = {
    fontSize: 14,
    color: "#6b7280",
    margin: "0 0 20px",
  }

  const btnBack: React.CSSProperties = {
    background: "transparent",
    color: accent,
    border: `2px solid ${accent}`,
    borderRadius: 8,
    padding: "5px 14px",
    fontSize: 13,
    fontWeight: 600,
    cursor: "pointer",
  }

  const btnStart: React.CSSProperties = {
    background: accent,
    color: "#fff",
    border: "none",
    borderRadius: 12,
    padding: "14px",
    fontSize: 16,
    fontWeight: 700,
    cursor: "pointer",
    width: "100%",
    marginTop: 8,
  }

  // ── step indicator
  const steps = ["Choose Subject", "Pick Chapter", "Start Quiz"]
  const stepIndex = step === "subjects" ? 0 : step === "skills" ? 1 : 2

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div style={{ minHeight: "100vh", background: bgPage, padding: "28px 16px" }}>

      {/* Step breadcrumb */}
      <div style={{ display: "flex", alignItems: "center", maxWidth: 580, margin: "0 auto 24px", gap: 4 }}>
        {steps.map((label, i) => (
          <React.Fragment key={label}>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div style={{
                width: 28, height: 28, borderRadius: "50%",
                background: stepIndex >= i ? accent : "#e5e7eb",
                color: stepIndex >= i ? "#fff" : "#9ca3af",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 13, fontWeight: 700, flexShrink: 0,
              }}>
                {stepIndex > i ? "✓" : i + 1}
              </div>
              <span style={{
                fontSize: 13,
                fontWeight: stepIndex === i ? 700 : 400,
                color: stepIndex >= i ? "#374151" : "#9ca3af",
                whiteSpace: "nowrap",
              }}>
                {label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div style={{
                flex: 1, height: 2, minWidth: 16,
                background: stepIndex > i ? accent : "#e5e7eb",
                margin: "0 4px",
              }} />
            )}
          </React.Fragment>
        ))}
      </div>

      <div style={card}>

        {/* ══ STEP 1: SUBJECTS ══ */}
        {step === "subjects" && (
          <>
            <p style={heading}>{isPrimary ? "🎯 Choose a Subject" : "Choose a Subject"}</p>
            <p style={subText}>Select a subject to see available quizzes.</p>

            {subjectsLoading && (
              <div style={{ textAlign: "center", padding: "40px 0", color: "#9ca3af" }}>
                <div style={{ fontSize: 36, marginBottom: 12 }}>⏳</div>
                <p>Loading subjects…</p>
              </div>
            )}

            {subjectsError && (
              <div style={{ textAlign: "center", padding: "32px 0", color: "#ef4444" }}>
                <div style={{ fontSize: 36, marginBottom: 8 }}>⚠️</div>
                <p style={{ fontWeight: 600 }}>{subjectsError}</p>
                <button
                  onClick={() => { setSubjectsError(null); setSubjectsLoading(true); fetchSubjects().then(setSubjects).catch(() => setSubjectsError("Still can't connect. Please try again.")).finally(() => setSubjectsLoading(false)) }}
                  style={{ ...btnStart, width: "auto", padding: "10px 24px", marginTop: 16 }}
                >
                  Retry
                </button>
              </div>
            )}

            {!subjectsLoading && !subjectsError && subjects.length === 0 && (
              <div style={{ textAlign: "center", padding: "40px 0", color: "#6b7280" }}>
                <div style={{ fontSize: 48, marginBottom: 12 }}>📭</div>
                <p style={{ fontWeight: 600, fontSize: 16 }}>No quizzes available yet</p>
                <p style={{ fontSize: 14 }}>Check back soon — we're adding more every day!</p>
              </div>
            )}

            {!subjectsLoading && !subjectsError && subjects.length > 0 && (
              <div style={{
                display: "grid",
                gridTemplateColumns: isPrimary ? "1fr 1fr" : "1fr 1fr",
                gap: 12,
              }}>
                {subjects.map(subject => (
                  <button
                    key={subject.subject_id}
                    onClick={() => handleSubjectSelect(subject)}
                    style={{
                      background: "#fff",
                      border: `2px solid #e5e7eb`,
                      borderRadius: isPrimary ? 18 : 12,
                      padding: "16px 14px",
                      cursor: "pointer",
                      textAlign: "left",
                      transition: "border-color .15s, box-shadow .15s",
                      fontFamily: "inherit",
                    }}
                    onMouseEnter={e => {
                      (e.currentTarget as HTMLElement).style.borderColor = accent
                      ;(e.currentTarget as HTMLElement).style.boxShadow = `0 4px 16px ${accentLight}`
                    }}
                    onMouseLeave={e => {
                      (e.currentTarget as HTMLElement).style.borderColor = "#e5e7eb"
                      ;(e.currentTarget as HTMLElement).style.boxShadow = "none"
                    }}
                  >
                    <div style={{ fontSize: isPrimary ? 28 : 22, marginBottom: 8 }}>
                      {getIcon(subject.thumbnail)}
                    </div>
                    <p style={{ margin: 0, fontWeight: 700, fontSize: isPrimary ? 14 : 14, color: "#111827", lineHeight: 1.3 }}>
                      {subject.name_en}
                    </p>
                    {subject.name_ur && (
                      <p style={{ margin: "3px 0 0", fontSize: 12, color: "#9ca3af", direction: "rtl" }}>
                        {subject.name_ur}
                      </p>
                    )}
                    <p style={{ margin: "6px 0 0", fontSize: 12, color: accent, fontWeight: 600 }}>
                      {subject.total_skills} chapter{subject.total_skills !== 1 ? "s" : ""}
                    </p>
                  </button>
                ))}
              </div>
            )}
          </>
        )}

        {/* ══ STEP 2: SKILLS / CHAPTERS ══ */}
        {step === "skills" && selectedSubject && (
          <>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
              <p style={heading}>
                {isPrimary ? "📚 Pick a Chapter" : "Pick a Chapter"}
              </p>
              <button style={btnBack} onClick={() => { setStep("subjects"); setSelectedSkill(null) }}>
                ← Back
              </button>
            </div>

            {/* Subject summary badge */}
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              background: accentLight, borderRadius: 20,
              padding: "4px 12px", marginBottom: 16,
            }}>
              <span style={{ fontSize: 16 }}>{getIcon(selectedSubject.thumbnail)}</span>
              <span style={{ fontSize: 13, fontWeight: 600, color: accent }}>{selectedSubject.name_en}</span>
            </div>

            {skillsLoading && (
              <div style={{ textAlign: "center", padding: "40px 0", color: "#9ca3af" }}>
                <div style={{ fontSize: 36, marginBottom: 12 }}>⏳</div>
                <p>Loading chapters…</p>
              </div>
            )}

            {skillsError && (
              <div style={{ textAlign: "center", padding: "32px 0", color: "#ef4444" }}>
                <p style={{ fontWeight: 600 }}>{skillsError}</p>
              </div>
            )}

            {!skillsLoading && !skillsError && skills.length === 0 && (
              <div style={{ textAlign: "center", padding: "40px 0", color: "#6b7280" }}>
                <div style={{ fontSize: 48, marginBottom: 12 }}>📭</div>
                <p style={{ fontWeight: 600, fontSize: 16 }}>No chapters found</p>
              </div>
            )}

            {!skillsLoading && !skillsError && skills.length > 0 && (
              <div style={{ display: "flex", flexDirection: "column", gap: 10, maxHeight: 400, overflowY: "auto" }}>
                {skills.map((skill, i) => {
                  const available = skill.has_questions === 1
                  return (
                    <div
                      key={skill.id}
                      onClick={() => handleSkillSelect(skill)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 14,
                        padding: "14px 16px",
                        borderRadius: 12,
                        border: `2px solid ${available ? "#e5e7eb" : "#f3f4f6"}`,
                        background: available ? "#fafafa" : "#f9fafb",
                        cursor: available ? "pointer" : "default",
                        opacity: available ? 1 : 0.75,
                        transition: "border-color .15s, background .15s",
                      }}
                      onMouseEnter={e => {
                        if (available) {
                          (e.currentTarget as HTMLElement).style.borderColor = accent
                          ;(e.currentTarget as HTMLElement).style.background = accentLight
                        }
                      }}
                      onMouseLeave={e => {
                        if (available) {
                          (e.currentTarget as HTMLElement).style.borderColor = "#e5e7eb"
                          ;(e.currentTarget as HTMLElement).style.background = "#fafafa"
                        }
                      }}
                    >
                      {/* Chapter number */}
                      <div style={{
                        width: 38, height: 38, borderRadius: 10, flexShrink: 0,
                        background: available ? accent : "#e5e7eb",
                        color: available ? "#fff" : "#9ca3af",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontWeight: 700, fontSize: 15,
                      }}>
                        {i + 1}
                      </div>

                      {/* Name */}
                      <div style={{ flex: 1 }}>
                        <p style={{ margin: 0, fontWeight: 600, fontSize: 15, color: available ? "#111827" : "#6b7280" }}>
                          {skill.name}
                        </p>
                        {skill.name_ur && (
                          <p style={{ margin: "2px 0 0", fontSize: 12, color: "#9ca3af", direction: "rtl" }}>
                            {skill.name_ur}
                          </p>
                        )}
                      </div>

                      {/* Right badge */}
                      {available ? (
                        <span style={{
                          background: accentLight,
                          color: accent,
                          fontSize: 12, fontWeight: 700,
                          padding: "4px 10px", borderRadius: 20,
                          whiteSpace: "nowrap",
                        }}>
                          Start →
                        </span>
                      ) : (
                        <span style={{
                          background: "#f3f4f6",
                          color: "#9ca3af",
                          fontSize: 11, fontWeight: 700,
                          padding: "4px 10px", borderRadius: 20,
                          whiteSpace: "nowrap",
                        }}>
                          Coming Soon
                        </span>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </>
        )}

        {/* ══ STEP 3: CONFIRM ══ */}
        {step === "confirm" && selectedSkill && selectedSubject && (
          <>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
              <p style={heading}>{isPrimary ? "🚀 Ready to Start?" : "Ready to Start?"}</p>
              <button style={btnBack} onClick={() => { setStep("skills"); setSelectedSkill(null) }}>
                ← Back
              </button>
            </div>

            {/* Summary card */}
            <div style={{
              background: accentLight,
              border: `1.5px solid ${accentBorder}`,
              borderRadius: 14, padding: "20px 18px", marginBottom: 24,
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
                <span style={{ fontSize: 32 }}>{getIcon(selectedSubject.thumbnail)}</span>
                <div>
                  <p style={{ margin: 0, fontSize: 12, color: "#6b7280" }}>Subject</p>
                  <p style={{ margin: 0, fontWeight: 700, fontSize: 15, color: "#111827" }}>
                    {selectedSubject.name_en}
                  </p>
                </div>
              </div>

              {[
                { label: "Chapter", value: selectedSkill.name },
                { label: "Type", value: "Adaptive Quiz" },
                { label: "Engine", value: "Auto-adjusts difficulty based on your answers" },
              ].map(({ label, value }) => (
                <div key={label} style={{
                  display: "flex", justifyContent: "space-between", alignItems: "flex-start",
                  padding: "8px 0", borderTop: "1px solid " + accentBorder,
                }}>
                  <span style={{ fontSize: 13, color: "#6b7280", fontWeight: 500 }}>{label}</span>
                  <span style={{ fontSize: 13, color: "#111827", fontWeight: 700, textAlign: "right", maxWidth: "60%" }}>
                    {value}
                  </span>
                </div>
              ))}
            </div>

            <button style={btnStart} onClick={() => onStart(selectedSkill)}>
              {isPrimary ? "🚀 Start Quiz!" : "▶ Start Quiz"}
            </button>
          </>
        )}

      </div>
    </div>
  )
}

export default SubjectSkillSelector