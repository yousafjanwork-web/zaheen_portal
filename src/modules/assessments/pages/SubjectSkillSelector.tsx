import React, { useEffect, useState } from "react"
import axios from "axios"
import { getLanguage } from "@/modules/shared/i18n"

import enTranslations from "@/modules/shared/i18n/en.json"
import urTranslations from "@/modules/shared/i18n/ur.json"

const translations: Record<string, any> = { en: enTranslations, ur: urTranslations }

const getNestedValue = (obj: any, key: string): string => {
  const value = key.split(".").reduce((acc: any, part: string) => acc?.[part], obj)
  return typeof value === "string" ? value : key
}

const useT = () => {
  const lang = getLanguage()
  const dict = translations[lang] ?? translations.en
  return (key: string, vars?: Record<string, string>) => {
    let result = getNestedValue(dict, key)
    if (vars) {
      Object.entries(vars).forEach(([k, v]) => {
        result = result.replace(new RegExp(`{{${k}}}`, "g"), v)
      })
    }
    return result
  }
}

export interface Skill {
  id: number
  name: string
  name_ur: string | null
  description: string | null
  number_question: number | null
  total_questions: number | null
  subject_id: number
  subject_name: string
  subject_name_ur: string | null
  has_questions: 0 | 1
}

interface Class {
  id: number
  name: string
  urdu_name: string | null
  thumbnail: string | null
}

interface Subject {
  subject_id: number
  name_en: string
  name_ur: string | null
  description_en: string | null
  thumbnail: string
  total_skills: number
  total_questions: number
  class_id: number
}

type SkillStatus = "not_started" | "progressing" | "mastered"

interface SkillProgress {
  mastery_score: number
  total_attempted: number
  correct: number
  accuracy: number
  status: SkillStatus
}

// Enriched with authoritative total_questions from /skill-info response body
// (not from the skills-by-subject list, which can be stale/null for secondary skills)
interface SkillProgressEnriched extends SkillProgress {
  api_total_questions: number | null
}

interface Props {
  defaultClassId?:   number
  defaultSubjectId?: number
  variant?: "primary" | "secondary"
  onStart: (skill: Skill) => void
  studentId?: number
}

const BASE = "https://api.zaheen.com.pk/v2"

const SUBJECT_CONFIG: Record<string, { gradient: string; iconBg: string; emoji: string }> = {
  BookOpen:    { gradient: "linear-gradient(135deg,#667eea 0%,#764ba2 100%)", iconBg: "rgba(255,255,255,0.25)", emoji: "📖" },
  Sigma:       { gradient: "linear-gradient(135deg,#f093fb 0%,#f5576c 100%)", iconBg: "rgba(255,255,255,0.25)", emoji: "📐" },
  Languages:   { gradient: "linear-gradient(135deg,#4facfe 0%,#00f2fe 100%)", iconBg: "rgba(255,255,255,0.25)", emoji: "🗣️" },
  Calculator:  { gradient: "linear-gradient(135deg,#43e97b 0%,#38f9d7 100%)", iconBg: "rgba(255,255,255,0.25)", emoji: "🧮" },
  Atom:        { gradient: "linear-gradient(135deg,#fa709a 0%,#fee140 100%)", iconBg: "rgba(255,255,255,0.25)", emoji: "⚗️" },
  Leaf:        { gradient: "linear-gradient(135deg,#a8edea 0%,#fed6e3 100%)", iconBg: "rgba(255,255,255,0.25)", emoji: "🌿" },
  TaskConical: { gradient: "linear-gradient(135deg,#a18cd1 0%,#fbc2eb 100%)", iconBg: "rgba(255,255,255,0.25)", emoji: "📋" },
  Cpu:         { gradient: "linear-gradient(135deg,#0fd850 0%,#f9f047 100%)", iconBg: "rgba(255,255,255,0.25)", emoji: "💻" },
}
const DEFAULT_CONFIG = {
  gradient: "linear-gradient(135deg,#6366f1 0%,#8b5cf6 100%)",
  iconBg:   "rgba(255,255,255,0.25)",
  emoji:    "📚",
}

function getSubjectConfig(thumbnail: string) {
  return SUBJECT_CONFIG[thumbnail] ?? DEFAULT_CONFIG
}

function classEmoji(name: string): string {
  const n = name.toLowerCase()
  if (n.includes("kindergarten") || n.includes("kg")) return "🧒"
  if (n.includes("12")) return "🏫"
  if (n.includes("11")) return "🎓"
  if (n.includes("10")) return "🔟"
  if (n.includes("1"))  return "1️⃣"
  if (n.includes("2"))  return "2️⃣"
  if (n.includes("3"))  return "3️⃣"
  if (n.includes("4"))  return "4️⃣"
  if (n.includes("5"))  return "5️⃣"
  if (n.includes("6"))  return "6️⃣"
  if (n.includes("7"))  return "7️⃣"
  if (n.includes("8"))  return "8️⃣"
  if (n.includes("9"))  return "9️⃣"
  return "📚"
}

function gradeUrl(className: string): string {
  const n = className.toLowerCase().trim()
  if (n.includes("kindergarten") || n.includes("kg")) return "/kg"
  const match = n.match(/(\d+)/)
  if (match) return `/grade-${match[1]}`
  return `/${n.replace(/\s+/g, "-")}`
}

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');

  .sss-root * { box-sizing: border-box; }

  .sss-root {
    font-family: 'Inter', 'Segoe UI', system-ui, sans-serif;
  }

  .sss-root.sss-rtl {
    direction: rtl;
    font-family: 'Noto Nastaliq Urdu', 'Jameel Noori Nastaleeq', 'Arial Unicode MS', 'Inter', sans-serif;
  }

  .subject-card {
    position: relative;
    border-radius: 20px;
    overflow: hidden;
    cursor: pointer;
    transition: transform 0.22s cubic-bezier(.34,1.56,.64,1), box-shadow 0.22s ease;
    box-shadow: 0 4px 20px rgba(0,0,0,0.08);
  }
  .subject-card:hover {
    transform: translateY(-6px) scale(1.02);
    box-shadow: 0 16px 48px rgba(0,0,0,0.18);
  }
  .subject-card:active { transform: translateY(-2px) scale(1.00); }

  .class-card {
    border-radius: 16px;
    cursor: pointer;
    transition: transform 0.18s cubic-bezier(.34,1.56,.64,1), box-shadow 0.18s ease, border-color 0.15s;
    background: #fff;
    border: 2px solid #e5e7eb;
  }
  .class-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 32px rgba(0,0,0,0.12);
  }

  /* ── skill row: base ── */
  .skill-row {
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 16px 18px;
    border-radius: 16px;
    border: 2px solid #e5e7eb;
    background: #fafafa;
    cursor: pointer;
    transition: border-color 0.15s, background 0.15s, transform 0.15s, box-shadow 0.15s;
    position: relative;
  }
  .skill-row.available:hover {
    border-color: var(--accent);
    background: var(--accent-light);
    transform: translateX(4px);
    box-shadow: 0 4px 16px rgba(0,0,0,0.08);
  }
  .sss-rtl .skill-row.available:hover { transform: translateX(-4px); }
  .skill-row.unavailable { opacity: 0.5; cursor: default; }

  /* ── COMPLETED card: always green border ── */
  .skill-row.completed {
    border-color: #22c55e !important;
    background: #f0fdf4 !important;
  }
  .skill-row.completed:hover {
    border-color: #16a34a !important;
    background: #dcfce7 !important;
    transform: translateX(4px);
    box-shadow: 0 4px 16px rgba(34,197,94,0.20);
  }
  .sss-rtl .skill-row.completed:hover { transform: translateX(-4px); }

  /* ── IN-PROGRESS card: blue border ── */
  .skill-row.progressing {
    border-color: #93c5fd !important;
    background: #eff6ff !important;
  }
  .skill-row.progressing:hover {
    border-color: #3b82f6 !important;
    background: #dbeafe !important;
    transform: translateX(4px);
    box-shadow: 0 4px 16px rgba(59,130,246,0.15);
  }
  .sss-rtl .skill-row.progressing:hover { transform: translateX(-4px); }

  .bc-pill {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 5px 14px;
    border-radius: 99px;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    border: none;
    transition: background 0.15s, color 0.15s;
  }
  .bc-pill.clickable {
    background: rgba(255,255,255,0.9);
    color: var(--accent);
    box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  }
  .bc-pill.clickable:hover { background: var(--accent-light); }
  .bc-pill.static { background: var(--accent-light); color: var(--accent); }
  .bc-sep { color: #9ca3af; font-size: 16px; line-height: 1; }

  @keyframes sss-spin { to { transform: rotate(360deg); } }
  .sss-spinner {
    width: 36px; height: 36px;
    border: 3px solid #e5e7eb;
    border-top-color: var(--accent);
    border-radius: 50%;
    animation: sss-spin 0.7s linear infinite;
    margin: 0 auto 12px;
  }

  /* ── progress bar in skill row ── */
  .skill-progress-bar-wrap {
    height: 5px;
    background: #e5e7eb;
    border-radius: 99px;
    overflow: hidden;
    margin-top: 6px;
  }
  .skill-progress-bar-fill {
    height: 100%;
    border-radius: 99px;
    transition: width 0.5s ease;
  }
`

const SubjectSkillSelector: React.FC<Props> = ({
  defaultClassId,
  defaultSubjectId,
  variant = "secondary",
  onStart,
  studentId,
}) => {
  const t      = useT()
  const lang   = getLanguage()
  const isUrdu = lang === "ur"
  const isRTL  = isUrdu

  const userId = (studentId ?? Number(sessionStorage.getItem("studentId"))) || 2

  const localClassName   = (c: Class)   => (isUrdu && c.urdu_name) ? c.urdu_name : c.name
  const localSubjectName = (s: Subject) => (isUrdu && s.name_ur)   ? s.name_ur   : s.name_en
  const localSkillName   = (sk: Skill)  => (isUrdu && sk.name_ur)  ? sk.name_ur  : sk.name

  const isPrimary    = variant === "primary"
  const accent       = isPrimary ? "#7c3aed" : "#1e3a5f"
  const accentLight  = isPrimary ? "#f5f3ff" : "#eff6ff"
  const accentBorder = isPrimary ? "#ddd6fe" : "#bfdbfe"
  const pageBg       = "#f7f8fc"

  const effectiveClassId = defaultClassId

  type Step = "classes" | "subjects" | "skills" | "confirm"

  const [step, setStep] = useState<Step>(() => {
    if (defaultSubjectId) return "skills"
    if (effectiveClassId) return "subjects"
    return "classes"
  })

  const [classes,         setClasses]         = useState<Class[]>([])
  const [classesLoading,  setClassesLoading]  = useState(!effectiveClassId)
  const [classesError,    setClassesError]    = useState<string | null>(null)
  const [activeClass,     setActiveClass]     = useState<Class | null>(null)

  const [subjects,        setSubjects]        = useState<Subject[]>([])
  const [subjectsLoading, setSubjectsLoading] = useState(!!effectiveClassId && !defaultSubjectId)
  const [subjectsError,   setSubjectsError]   = useState<string | null>(null)
  const [activeSubject,   setActiveSubject]   = useState<Subject | null>(null)

  const [skills,        setSkills]        = useState<Skill[]>([])
  const [skillsLoading, setSkillsLoading] = useState(!!defaultSubjectId)
  const [skillsError,   setSkillsError]   = useState<string | null>(null)
  const [picked,        setPicked]        = useState<Skill | null>(null)

  const [skillProgressMap, setSkillProgressMap] = useState<Record<number, SkillProgressEnriched>>({})
  const [progressLoading,  setProgressLoading]  = useState(false)

  // ── Helper: resolve authoritative total questions for a skill ─────────────
  // Priority: api_total_questions from /skill-info (most accurate, includes
  // secondary quiz skills that may have null in the skills-by-subject list)
  // → skill.total_questions → skill.number_question → 0
  function resolveTotal(skillId: number, skill: Skill): number {
    const progress = skillProgressMap[skillId]
    return progress?.api_total_questions
      ?? skill.total_questions
      ?? skill.number_question
      ?? 0
  }

  // ── Helper: completion is based on total_attempted >= total_questions ──────
  // NOT mastery_score — a student might finish all questions with low accuracy
  function isSkillCompleted(skillId: number, skill: Skill): boolean {
    const progress = skillProgressMap[skillId]
    if (!progress) return false
    const totalQ = resolveTotal(skillId, skill)
    return totalQ > 0 && progress.total_attempted >= totalQ
  }

  // ── Helper: completion percentage based on questions attempted, not mastery ─
  function completionPct(skillId: number, skill: Skill): number {
    const progress = skillProgressMap[skillId]
    if (!progress) return 0
    const totalQ = resolveTotal(skillId, skill)
    if (totalQ === 0) return 0
    return Math.min(100, Math.round((progress.total_attempted / totalQ) * 100))
  }

  // Inject CSS once
  useEffect(() => {
    const id = "sss-styles"
    if (!document.getElementById(id)) {
      const s = document.createElement("style")
      s.id = id
      s.textContent = CSS
      document.head.appendChild(s)
    }
  }, [])

  // ── Fetch classes ──────────────────────────────────────────────────────────
  useEffect(() => {
    if (effectiveClassId) {
      ;(async () => {
        try {
          const res = await axios.get<{ success: boolean; data: Class[] }>(
            `${BASE}/api/quiz/adaptive/classes`
          )
          const fetched = res.data.data ?? []
          setClasses(fetched)
          const match = fetched.find(c => c.id === effectiveClassId)
          if (match) setActiveClass(match)
        } catch { /* silent */ }
      })()
      return
    }
    ;(async () => {
      setClassesLoading(true); setClassesError(null)
      try {
        const res = await axios.get<{ success: boolean; data: Class[] }>(
          `${BASE}/api/quiz/adaptive/classes`
        )
        setClasses(res.data.data ?? [])
      } catch {
        setClassesError(t("subjectSkillSelector.errors.classes"))
      } finally {
        setClassesLoading(false)
      }
    })()
  }, [effectiveClassId])

  // ── Fetch subjects when classId is known ───────────────────────────────────
  useEffect(() => {
    if (!effectiveClassId || defaultSubjectId) return
    setStep("subjects")
    loadSubjects(effectiveClassId)
  }, [effectiveClassId, defaultSubjectId])

  // ── Fetch skills when subjectId is known ───────────────────────────────────
  useEffect(() => {
    if (!defaultSubjectId) return
    setStep("skills")
    loadSkills(defaultSubjectId)
  }, [defaultSubjectId])

  async function loadSubjects(classId: number) {
    setSubjectsLoading(true); setSubjectsError(null); setSubjects([])
    try {
      const res = await axios.get<{ success: boolean; data: Subject[] }>(
        `${BASE}/api/quiz/adaptive/subjects-by-class`,
        { params: { classId } }
      )
      setSubjects(res.data.data ?? [])
    } catch {
      setSubjectsError(t("subjectSkillSelector.errors.subjects"))
    } finally {
      setSubjectsLoading(false)
    }
  }

  async function loadSkills(subjectId: number) {
    setSkillsLoading(true); setSkillsError(null); setSkills([])
    setSkillProgressMap({})
    try {
      const res = await axios.get<{ success: boolean; data: Skill[] }>(
        `${BASE}/api/quiz/adaptive/skills-by-subject`,
        { params: { subjectId } }
      )
      const fetched = res.data.data ?? []
      setSkills(fetched)
      fetchAllProgress(fetched)
    } catch {
      setSkillsError(t("subjectSkillSelector.errors.skills"))
    } finally {
      setSkillsLoading(false)
    }
  }

  // ── Fetch /skill-info for each available skill in parallel ─────────────────
  // skill-info returns both top-level total_questions AND user_progress.
  // We store both: api_total_questions is the authoritative question count
  // (the skills-by-subject list can return null/wrong values for secondary skills).
  async function fetchAllProgress(skillList: Skill[]) {
    const available = skillList.filter(s => s.has_questions === 1)
    if (available.length === 0) return

    setProgressLoading(true)
    const results = await Promise.allSettled(
      available.map(s =>
        axios.get<{
          success: boolean
          data: {
            skill_id: number
            skill_name: string
            total_questions: number | null
            user_progress: SkillProgress | null
          }
        }>(
          `${BASE}/api/quiz/adaptive/skill-info`,
          { params: { skillId: s.id, userId } }
        )
      )
    )
    const map: Record<number, SkillProgressEnriched> = {}
    results.forEach((r, i) => {
      if (r.status === "fulfilled") {
        const body     = r.value.data?.data
        const progress = body?.user_progress
        // Always store an entry so we have api_total_questions even for
        // students who haven't started yet (progress will be null in that case)
        const apiTotal = body?.total_questions ?? null
        if (progress) {
          map[available[i].id] = { ...progress, api_total_questions: apiTotal }
        } else if (apiTotal !== null) {
          // No progress yet but we know the real total — store a placeholder
          // so resolveTotal() can use it without any user_progress entry
          map[available[i].id] = {
            mastery_score: 0,
            total_attempted: 0,
            correct: 0,
            accuracy: 0,
            status: "not_started",
            api_total_questions: apiTotal,
          }
        }
      }
    })
    setSkillProgressMap(map)
    setProgressLoading(false)
  }

  function handleClassPick(c: Class) {
    setActiveClass(c); setStep("subjects"); loadSubjects(c.id)
  }

  function handleSubjectPick(s: Subject) {
    setActiveSubject(s); setStep("skills"); loadSkills(s.subject_id)
  }

  const cssVars = { "--accent": accent, "--accent-light": accentLight } as React.CSSProperties

  const wrap: React.CSSProperties = {
    minHeight: "100vh",
    background: pageBg,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "40px 20px 80px",
    direction: isRTL ? "rtl" : "ltr",
    ...cssVars,
  }

  // ── Global loading shield ──────────────────────────────────────────────────
  const isInitializing =
    (!!effectiveClassId && !defaultSubjectId && subjectsLoading) ||
    (!!defaultSubjectId && skillsLoading)

  if (isInitializing) {
    return (
      <div style={{ minHeight: "100vh", background: pageBg, display: "flex", alignItems: "center", justifyContent: "center", ...cssVars }}>
        <style>{CSS}</style>
        <div style={{ textAlign: "center" }}>
          <div className="sss-spinner" />
          <p style={{ color: "#9ca3af", fontSize: 14, margin: 0 }}>
            {t("subjectSkillSelector.loading.subjects")}
          </p>
        </div>
      </div>
    )
  }

  // ── Sub-components ─────────────────────────────────────────────────────────

  function Breadcrumb() {
    if (!activeClass) return null
    return (
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 24, flexWrap: "wrap" }}>
        <button
          className="bc-pill clickable"
          onClick={() => { window.location.href = gradeUrl(activeClass.name) }}
        >
          {classEmoji(activeClass.name)} {localClassName(activeClass)}
        </button>
        {activeSubject && (
          <>
            <span className="bc-sep">›</span>
            <button
              className="bc-pill clickable"
              onClick={() => { setStep("subjects"); setActiveSubject(null) }}
            >
              {localSubjectName(activeSubject)}
            </button>
          </>
        )}
      </div>
    )
  }

  function LoadingSpinner({ text }: { text: string }) {
    return (
      <div style={{ textAlign: "center", padding: "60px 0" }}>
        <div className="sss-spinner" />
        <p style={{ color: "#9ca3af", fontSize: 14, margin: 0 }}>{text}</p>
      </div>
    )
  }

  function ErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
    return (
      <div style={{ textAlign: "center", padding: "48px 0" }}>
        <div style={{ fontSize: 48, marginBottom: 12 }}>⚠️</div>
        <p style={{ color: "#ef4444", fontWeight: 600, marginBottom: 16 }}>{message}</p>
        <button
          onClick={onRetry}
          style={{ background: accent, color: "#fff", border: "none", borderRadius: 12, padding: "11px 28px", fontSize: 14, fontWeight: 700, cursor: "pointer" }}
        >
          {t("subjectSkillSelector.actions.tryAgain")}
        </button>
      </div>
    )
  }

  function PageHeader({ icon, title, subtitle }: { icon: string; title: string; subtitle?: string }) {
    return (
      <div style={{ textAlign: "center", marginBottom: 32 }}>
        <div style={{ fontSize: 40, marginBottom: 10, lineHeight: 1 }}>{icon}</div>
        <h1 style={{ fontSize: 30, fontWeight: 900, color: accent, margin: "0 0 8px", letterSpacing: isRTL ? "0" : "-0.5px", lineHeight: 1.15 }}>
          {title}
        </h1>
        {subtitle && (
          <p style={{ fontSize: 14, color: "#6b7280", margin: 0, fontWeight: 500 }}>{subtitle}</p>
        )}
      </div>
    )
  }

  // ── Status badge: Completed (green) | In Progress (blue) | nothing ─────────
  function SkillStatusBadge({ skillId, skill }: { skillId: number; skill: Skill }) {
    const progress  = skillProgressMap[skillId]
    if (!progress || progress.status === "not_started") return null

    const completed = isSkillCompleted(skillId, skill)

    if (completed) {
      return (
        <span style={{
          display: "inline-flex", alignItems: "center", gap: 5,
          background: "#22c55e", color: "#fff",
          fontSize: 11, fontWeight: 800,
          padding: "5px 12px", borderRadius: 99,
          whiteSpace: "nowrap", flexShrink: 0,
          boxShadow: "0 2px 10px rgba(34,197,94,0.40)",
          letterSpacing: 0.3,
        }}>
          ✓ Completed
        </span>
      )
    }

    // In progress — show how many questions done
    return (
      <span style={{
        display: "inline-flex", alignItems: "center", gap: 4,
        background: "#3b82f6", color: "#fff",
        fontSize: 11, fontWeight: 800,
        padding: "5px 12px", borderRadius: 99,
        whiteSpace: "nowrap", flexShrink: 0,
      }}>
        ▶ {progress.total_attempted} done
      </span>
    )
  }

  // ── Progress bar: fills based on attempted / total_questions ───────────────
  function SkillProgressBar({ skillId, skill }: { skillId: number; skill: Skill }) {
    const progress = skillProgressMap[skillId]
    if (!progress || progress.status === "not_started") return null

    const pct       = completionPct(skillId, skill)
    const completed = isSkillCompleted(skillId, skill)
    const color     = completed ? "#22c55e" : "#3b82f6"

    return (
      <div className="skill-progress-bar-wrap">
        <div
          className="skill-progress-bar-fill"
          style={{ width: `${pct}%`, background: color }}
        />
      </div>
    )
  }

  // ── STEP: confirm ──────────────────────────────────────────────────────────
  if (step === "confirm" && picked) {
    const cfg                = getSubjectConfig(activeSubject?.thumbnail ?? "")
    const subjectDisplayName = activeSubject ? localSubjectName(activeSubject) : picked.subject_name
    // Use resolveTotal so secondary-quiz skills get the authoritative count from /skill-info
    const totalQ             = resolveTotal(picked.id, picked) || (picked.total_questions ?? picked.number_question)
    const prevProgress       = skillProgressMap[picked.id]
    const prevCompleted      = isSkillCompleted(picked.id, picked)
    const prevPct            = completionPct(picked.id, picked)

    const confirmRows = [
      { label: t("subjectSkillSelector.confirmDetails.class"),      value: activeClass ? localClassName(activeClass) : "—", emoji: "🏫" },
      { label: t("subjectSkillSelector.confirmDetails.subject"),    value: subjectDisplayName || "—",                       emoji: "📚" },
      { label: t("subjectSkillSelector.confirmDetails.chapter"),    value: localSkillName(picked),                          emoji: "📋" },
      { label: "Total Questions",                                    value: (totalQ && totalQ > 0) ? `${totalQ} questions` : "—", emoji: "❓" },
      { label: t("subjectSkillSelector.confirmDetails.quizType"),   value: t("subjectSkillSelector.confirmDetails.quizTypeValue"),   emoji: "🧠" },
      { label: t("subjectSkillSelector.confirmDetails.difficulty"), value: t("subjectSkillSelector.confirmDetails.difficultyValue"), emoji: "📊" },
    ]

    return (
      <div className={`sss-root${isRTL ? " sss-rtl" : ""}`} style={wrap}>
        <style>{CSS}</style>
        <div style={{ width: "100%", maxWidth: 560 }}>
          <Breadcrumb />
          <div style={{ background: "#fff", borderRadius: 24, boxShadow: "0 8px 48px rgba(0,0,0,0.10)", overflow: "hidden" }}>
            <div style={{ background: cfg.gradient, padding: "28px 28px 20px" }}>
              <button
                onClick={() => { setPicked(null); setStep("skills") }}
                style={{ background: "rgba(255,255,255,0.2)", border: "none", borderRadius: 99, padding: "6px 14px", fontSize: 13, fontWeight: 600, color: "#fff", cursor: "pointer", backdropFilter: "blur(4px)" }}
              >
                {t("subjectSkillSelector.actions.back")}
              </button>
              <div style={{ marginTop: 16, textAlign: "center" }}>
                <div style={{ fontSize: 48, marginBottom: 8 }}>{prevCompleted ? "🏆" : "🚀"}</div>
                <h2 style={{ fontSize: 22, fontWeight: 900, color: "#fff", margin: "0 0 4px", textShadow: "0 2px 8px rgba(0,0,0,0.2)" }}>
                  {t("subjectSkillSelector.steps.confirm.title")}
                </h2>
                <p style={{ fontSize: 13, color: "rgba(255,255,255,0.85)", margin: 0 }}>
                  {t("subjectSkillSelector.steps.confirm.subtitle")}
                </p>
              </div>
            </div>

            <div style={{ padding: "24px 28px" }}>

              {/* Previous progress banner */}
              {prevProgress && prevProgress.status !== "not_started" && (
                <div style={{
                  marginBottom: 20,
                  padding: "14px 16px",
                  borderRadius: 14,
                  background: prevCompleted ? "#f0fdf4" : "#eff6ff",
                  border: `1.5px solid ${prevCompleted ? "#86efac" : "#93c5fd"}`,
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                    <span style={{ fontSize: 13, fontWeight: 800, color: prevCompleted ? "#166534" : "#1e40af" }}>
                      {prevCompleted ? "✓ You completed this quiz!" : "▶ Quiz in progress"}
                    </span>
                    <span style={{ fontSize: 13, fontWeight: 800, color: prevCompleted ? "#166534" : "#1e40af" }}>
                      {prevPct}%
                    </span>
                  </div>
                  {/* Progress bar: completion-based */}
                  <div style={{ background: prevCompleted ? "#dcfce7" : "#dbeafe", borderRadius: 99, height: 6, overflow: "hidden" }}>
                    <div style={{
                      height: 6,
                      borderRadius: 99,
                      width: `${prevPct}%`,
                      background: prevCompleted ? "#22c55e" : "#3b82f6",
                      transition: "width .5s",
                    }} />
                  </div>
                  <p style={{ margin: "8px 0 0", fontSize: 12, color: "#6b7280" }}>
                    {prevProgress.correct} correct · {prevProgress.accuracy.toFixed(0)}% accuracy · {prevProgress.total_attempted} of {totalQ ?? "?"} questions attempted
                  </p>
                </div>
              )}

              {confirmRows.map(({ label, value, emoji }, i, arr) => (
                <div key={label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "13px 0", borderBottom: i < arr.length - 1 ? "1px solid #f3f4f6" : "none", flexDirection: isRTL ? "row-reverse" : "row" }}>
                  <span style={{ display: "flex", alignItems: "center", gap: 8, color: "#6b7280", fontSize: 14, fontWeight: 500, flexDirection: isRTL ? "row-reverse" : "row" }}>
                    <span style={{ fontSize: 16 }}>{emoji}</span> {label}
                  </span>
                  <span style={{ fontWeight: 700, color: "#111827", fontSize: 14, maxWidth: "55%", textAlign: isRTL ? "left" : "right" }}>
                    {value}
                  </span>
                </div>
              ))}

              <button
                onClick={() => onStart(picked)}
                style={{ marginTop: 24, width: "100%", background: prevCompleted ? "linear-gradient(135deg,#16a34a,#22c55e)" : cfg.gradient, color: "#fff", border: "none", borderRadius: 14, padding: "16px 0", fontSize: 17, fontWeight: 800, cursor: "pointer", letterSpacing: isRTL ? "0" : "0.3px", boxShadow: "0 6px 24px rgba(0,0,0,0.18)", transition: "opacity 0.15s, transform 0.15s" }}
                onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.opacity = "0.92"; el.style.transform = "scale(1.01)" }}
                onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.opacity = "1"; el.style.transform = "scale(1)" }}
              >
                {prevCompleted
                  ? "🔄 " + t("subjectSkillSelector.actions.startQuiz") + " Again"
                  : t("subjectSkillSelector.actions.startQuiz")
                }
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // ── STEP: skills ───────────────────────────────────────────────────────────
  if (step === "skills") {
    const cfg = activeSubject ? getSubjectConfig(activeSubject.thumbnail) : DEFAULT_CONFIG
    return (
      <div className={`sss-root${isRTL ? " sss-rtl" : ""}`} style={wrap}>
        <style>{CSS}</style>
        <div style={{ width: "100%", maxWidth: 640 }}>
          <Breadcrumb />
          <PageHeader
            icon={t("subjectSkillSelector.steps.selectSkill.icon")}
            title={t("subjectSkillSelector.steps.selectSkill.title")}
            subtitle={activeSubject ? localSubjectName(activeSubject) : t("subjectSkillSelector.steps.selectSkill.subtitleDefault")}
          />
          <div style={{ background: "#fff", borderRadius: 24, boxShadow: "0 4px 32px rgba(0,0,0,0.07)", padding: "24px", display: "flex", flexDirection: "column", gap: 10 }}>
            {skillsLoading && <LoadingSpinner text={t("subjectSkillSelector.loading.skills")} />}
            {!skillsLoading && skillsError && (
              <ErrorState message={skillsError} onRetry={() => activeSubject && loadSkills(activeSubject.subject_id)} />
            )}
            {!skillsLoading && !skillsError && skills.length === 0 && (
              <div style={{ textAlign: "center", padding: "56px 0" }}>
                <div style={{ fontSize: 56, marginBottom: 14 }}>📭</div>
                <p style={{ fontWeight: 700, fontSize: 16, color: "#111827", margin: "0 0 6px" }}>
                  {t("subjectSkillSelector.empty.skillsTitle")}
                </p>
                <p style={{ fontSize: 13, color: "#9ca3af", margin: 0 }}>
                  {t("subjectSkillSelector.empty.skillsSubtitle")}
                </p>
              </div>
            )}

            {!skillsLoading && !skillsError && skills.map((skill, i) => {
              const ok        = skill.has_questions === 1
              // Use resolveTotal: prefers api_total_questions from /skill-info
              // so secondary-quiz skills with null in the list show correctly
              const totalQ    = resolveTotal(skill.id, skill) || skill.total_questions || skill.number_question
              const progress  = skillProgressMap[skill.id]
              const status    = progress?.status ?? "not_started"
              const completed = isSkillCompleted(skill.id, skill)
              const pct       = completionPct(skill.id, skill)

              // CSS class: completed → green border, progressing → blue border
              const rowClass = !ok
                ? "skill-row unavailable"
                : completed
                  ? "skill-row available completed"
                  : status === "progressing"
                    ? "skill-row available progressing"
                    : "skill-row available"

              return (
                <div
                  key={skill.id}
                  className={rowClass}
                  onClick={() => { if (ok) { setPicked(skill); setStep("confirm") } }}
                  style={{ flexDirection: isRTL ? "row-reverse" : "row" }}
                >
                  {/* Number badge — green ✓ when completed, blue when in progress */}
                  <div style={{
                    width: 44, height: 44, borderRadius: 12, flexShrink: 0,
                    background: completed
                      ? "#22c55e"
                      : status === "progressing"
                        ? "#3b82f6"
                        : ok ? cfg.gradient : "#e5e7eb",
                    color: ok ? "#fff" : "#9ca3af",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontWeight: 800,
                    fontSize: completed ? 20 : 15,
                    boxShadow: ok ? "0 4px 12px rgba(0,0,0,0.15)" : "none",
                    transition: "background 0.2s",
                  }}>
                    {completed ? "✓" : i + 1}
                  </div>

                  {/* Name + question count + completion bar */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ margin: 0, fontWeight: 700, fontSize: 15, color: ok ? "#111827" : "#6b7280", lineHeight: 1.3, textAlign: isRTL ? "right" : "left" }}>
                      {localSkillName(skill)}
                    </p>

                    {ok && totalQ != null && (
                      <p style={{ margin: "3px 0 2px", fontSize: 12, color: "#9ca3af", fontWeight: 500, textAlign: isRTL ? "right" : "left" }}>
                        ❓ {totalQ} questions
                        {progress && progress.status !== "not_started" && (
                          <span style={{ marginLeft: 8, color: completed ? "#16a34a" : "#3b82f6", fontWeight: 600 }}>
                            · {progress.total_attempted}/{totalQ} done ({pct}%)
                          </span>
                        )}
                      </p>
                    )}

                    {/* Completion-based progress bar */}
                    {ok && <SkillProgressBar skillId={skill.id} skill={skill} />}
                  </div>

                  {/* Right badge */}
                  {!ok ? (
                    <span style={{ background: "#f3f4f6", color: "#9ca3af", fontSize: 11, fontWeight: 700, padding: "6px 12px", borderRadius: 99, whiteSpace: "nowrap", flexShrink: 0 }}>
                      {t("subjectSkillSelector.actions.comingSoon")}
                    </span>
                  ) : progressLoading && !progress ? (
                    <span style={{ background: "#f3f4f6", color: "#9ca3af", fontSize: 11, fontWeight: 600, padding: "6px 12px", borderRadius: 99, whiteSpace: "nowrap", flexShrink: 0 }}>
                      …
                    </span>
                  ) : (
                    <>
                      <SkillStatusBadge skillId={skill.id} skill={skill} />
                      {/* Show "Start" pill only when no progress at all */}
                      {(!progress || progress.status === "not_started") && (
                        <span style={{ background: accentLight, color: accent, fontSize: 12, fontWeight: 700, padding: "6px 14px", borderRadius: 99, whiteSpace: "nowrap", border: `1.5px solid ${accentBorder}`, flexShrink: 0 }}>
                          {t("subjectSkillSelector.actions.start")}
                        </span>
                      )}
                    </>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    )
  }

  // ── STEP: subjects ─────────────────────────────────────────────────────────
  if (step === "subjects") {
    const subjectSubtitle = activeClass
      ? t("subjectSkillSelector.steps.selectSubject.subtitleWithClass", { className: localClassName(activeClass) })
      : t("subjectSkillSelector.steps.selectSubject.subtitleDefault")

    return (
      <div className={`sss-root${isRTL ? " sss-rtl" : ""}`} style={wrap}>
        <style>{CSS}</style>
        <div style={{ width: "100%", maxWidth: 1100 }}>
          <Breadcrumb />
          <PageHeader
            icon={t("subjectSkillSelector.steps.selectSubject.icon")}
            title={t("subjectSkillSelector.steps.selectSubject.title")}
            subtitle={subjectSubtitle}
          />
          <div style={{ background: "#fff", borderRadius: 24, boxShadow: "0 4px 32px rgba(0,0,0,0.07)", padding: "36px" }}>
            {subjectsLoading && <LoadingSpinner text={t("subjectSkillSelector.loading.subjects")} />}
            {!subjectsLoading && subjectsError && (
              <ErrorState
                message={subjectsError}
                onRetry={() => effectiveClassId ? loadSubjects(effectiveClassId) : activeClass ? loadSubjects(activeClass.id) : undefined}
              />
            )}
            {!subjectsLoading && !subjectsError && subjects.length === 0 && (
              <div style={{ textAlign: "center", padding: "56px 0" }}>
                <div style={{ fontSize: 56, marginBottom: 14 }}>📭</div>
                <p style={{ fontWeight: 700, fontSize: 16, color: "#111827", margin: "0 0 6px" }}>
                  {t("subjectSkillSelector.empty.subjectsTitle")}
                </p>
                <p style={{ fontSize: 13, color: "#9ca3af", margin: 0 }}>
                  {t("subjectSkillSelector.empty.subjectsSubtitle")}
                </p>
              </div>
            )}
            {!subjectsLoading && !subjectsError && subjects.length > 0 && (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 24 }}>
                {subjects.map(s => {
                  const cfg = getSubjectConfig(s.thumbnail)
                  return (
                    <div key={s.subject_id} className="subject-card" onClick={() => handleSubjectPick(s)}>
                      <div style={{ background: cfg.gradient, padding: "36px 26px 28px", position: "relative", overflow: "hidden" }}>
                        <div style={{ position: "absolute", top: -24, right: -24, width: 120, height: 120, borderRadius: "50%", background: "rgba(255,255,255,0.12)" }} />
                        <div style={{ position: "absolute", bottom: -36, left: -14, width: 100, height: 100, borderRadius: "50%", background: "rgba(255,255,255,0.08)" }} />
                        <div style={{ width: 70, height: 70, borderRadius: 20, background: "rgba(255,255,255,0.22)", backdropFilter: "blur(8px)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 36, boxShadow: "0 4px 16px rgba(0,0,0,0.12)", position: "relative", zIndex: 1 }}>
                          {cfg.emoji}
                        </div>
                      </div>
                      <div style={{ background: "#fff", padding: "20px 22px" }}>
                        <p style={{ margin: "0 0 12px", fontWeight: 800, fontSize: 16, color: "#111827", lineHeight: 1.3, textAlign: isRTL ? "right" : "left" }}>
                          {localSubjectName(s)}
                        </p>
                        <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap", flexDirection: isRTL ? "row-reverse" : "row" }}>
                          <span style={{ fontSize: 11, fontWeight: 700, padding: "4px 10px", borderRadius: 99, background: "#f3f4f6", color: "#374151" }}>
                            📋 {t("subjectSkillSelector.badges.chapters", { count: String(s.total_skills) })}
                          </span>
                          {s.total_questions > 0 && (
                            <span style={{ fontSize: 11, fontWeight: 700, padding: "4px 10px", borderRadius: 99, background: "#f3f4f6", color: "#374151" }}>
                              ❓ {t("subjectSkillSelector.badges.questions", { count: String(s.total_questions) })}
                            </span>
                          )}
                        </div>
                      </div>
                      <div style={{ background: cfg.gradient, padding: "13px 22px", display: "flex", alignItems: "center", justifyContent: "space-between", flexDirection: isRTL ? "row-reverse" : "row" }}>
                        <span style={{ fontSize: 14, fontWeight: 700, color: "#fff", letterSpacing: isRTL ? "0" : "0.2px" }}>
                          {t("subjectSkillSelector.actions.startPractising")}
                        </span>
                        <span style={{ fontSize: 18, color: "#fff" }}>{isRTL ? "←" : "→"}</span>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  // ── STEP: classes ──────────────────────────────────────────────────────────
  return (
    <div className={`sss-root${isRTL ? " sss-rtl" : ""}`} style={wrap}>
      <style>{CSS}</style>
      <div style={{ width: "100%", maxWidth: 1100 }}>
        <PageHeader
          icon={t("subjectSkillSelector.steps.selectClass.icon")}
          title={t("subjectSkillSelector.steps.selectClass.title")}
          subtitle={t("subjectSkillSelector.steps.selectClass.subtitle")}
        />
        <div style={{ background: "#fff", borderRadius: 24, boxShadow: "0 4px 32px rgba(0,0,0,0.07)", padding: "28px" }}>
          {classesLoading && <LoadingSpinner text={t("subjectSkillSelector.loading.classes")} />}
          {!classesLoading && classesError && (
            <ErrorState message={classesError} onRetry={() => window.location.reload()} />
          )}
          {!classesLoading && !classesError && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: 14 }}>
              {classes.map(c => (
                <div
                  key={c.id}
                  className="class-card"
                  onClick={() => handleClassPick(c)}
                  style={{ padding: "24px 14px", textAlign: "center" }}
                  onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = accent; el.style.background = accentLight }}
                  onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = "#e5e7eb"; el.style.background = "#fff" }}
                >
                  <div style={{ fontSize: 36, marginBottom: 10 }}>{classEmoji(c.name)}</div>
                  <p style={{ margin: "0 0 4px", fontWeight: 800, fontSize: 14, color: "#111827" }}>
                    {localClassName(c)}
                  </p>
                  {isUrdu
                    ? <p style={{ margin: 0, fontSize: 11, color: "#9ca3af" }}>{c.name}</p>
                    : c.urdu_name && <p style={{ margin: 0, fontSize: 11, color: "#9ca3af", direction: "rtl" }}>{c.urdu_name}</p>
                  }
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default SubjectSkillSelector