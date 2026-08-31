<<<<<<< HEAD
import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

/* ---------------- TYPES ---------------- */

type Option = { id: number; option_text: string };
type Question = {
  id: number;
  type: "mcq" | "input";
  prompt: string;
  image_url?: string | null;
  options: Option[];
};
type Props = { studentId?: number; chapterId?: number };

/* ---------------- RESPONSIVE HELPERS ---------------- */
const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);
  return isMobile;
};

/* ---------------- STYLES ---------------- */
const S: any = {
  app: {
    display: "flex",
    width: "100%",
    minHeight: "100vh",
    background: "#f4f6fb",
    fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
    position: "relative" as const,
  },
  sidebar: (open: boolean, isMobile: boolean) => ({
    width: isMobile ? (open ? "100vw" : 0) : 220,
    minWidth: isMobile ? undefined : 220,
    maxWidth: isMobile ? "100vw" : 220,
    background: "#f4f6fb",
    borderRight: isMobile ? "none" : "1px solid #e2e8f0",
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column" as const,
    flexShrink: 0,
    overflow: "hidden",
    transition: "width 0.25s ease",
    position: isMobile ? ("fixed" as const) : ("relative" as const),
    top: 0,
    left: 0,
    zIndex: isMobile ? 200 : "auto",
    boxShadow: isMobile && open ? "4px 0 24px rgba(0,0,0,0.15)" : "none",
  }),
  sidebarOverlay: (open: boolean) => ({
    display: open ? "block" : "none",
    position: "fixed" as const,
    inset: 0,
    background: "rgba(0,0,0,0.35)",
    zIndex: 199,
  }),
  sidebarBrand: {
    padding: "20px 16px 16px",
    borderBottom: "1px solid rgba(62, 193, 1, 0.1)",
    flexShrink: 0,
  },
  brandIcon: {
    width: 36, height: 36,
    background: "rgba(255,255,255,0.15)",
    borderRadius: 8,
    display: "flex", alignItems: "center", justifyContent: "center",
    marginBottom: 8,
  },
  brandTitle: { fontSize: 14, fontWeight: 600, color: "#1e293b", lineHeight: 1.2, whiteSpace: "nowrap" as const },
  brandSub: { fontSize: 11, color: "#64748b", marginTop: 2, letterSpacing: "0.3px", whiteSpace: "nowrap" as const },
  navSection: { padding: "14px 10px", flex: 1, overflowY: "auto" as const },
  navItem: (active: boolean) => ({
    display: "flex", alignItems: "center", gap: 9,
    padding: "9px 11px", borderRadius: 8, cursor: "pointer",
    color: active ? "#2563eb" : "#1e293b",
    fontSize: 15, fontWeight: 500,
    background: active ? "rgba(37,99,235,0.08)" : "transparent",
    border: "none", width: "100%", textAlign: "left" as const,
    marginBottom: 2, transition: "all 0.15s", whiteSpace: "nowrap" as const,
  }),
  navDivider: { height: 1, background: "#e2e8f0", margin: "8px 0" },
  main: { flex: 1, display: "flex", flexDirection: "column" as const, minWidth: 0 },
  topbar: (isMobile: boolean) => ({
    background: "#fff", borderBottom: "1px solid #e2e8f0",
    padding: isMobile ? "0 14px" : "0 24px", height: 54,
    display: "flex", alignItems: "center", justifyContent: "space-between",
    gap: 10, flexShrink: 0,
  }),
  topbarLeft: { display: "flex", alignItems: "center", gap: 10, minWidth: 0 },
  hamburger: {
    background: "none", border: "none", cursor: "pointer",
    padding: 6, display: "flex", alignItems: "center", justifyContent: "center",
    color: "#1e293b", flexShrink: 0,
  },
  topbarTitle: { fontSize: 14, fontWeight: 600, color: "#1e293b", whiteSpace: "nowrap" as const, overflow: "hidden", textOverflow: "ellipsis" },
  topbarSub: { fontSize: 11, color: "#64748b", marginTop: 1, whiteSpace: "nowrap" as const },
  sectionBadge: {
    fontSize: 11, color: "#64748b", background: "#f4f6fb",
    border: "1px solid #e2e8f0", padding: "3px 9px", borderRadius: 6, whiteSpace: "nowrap" as const, flexShrink: 0,
  },
  content: (isMobile: boolean) => ({
    display: "flex",
    flexDirection: isMobile ? ("column" as const) : ("row" as const),
    gap: 16,
    padding: isMobile ? "14px 12px" : "20px 24px",
    flex: 1,
    alignItems: "flex-start",
  }),
  mobileTopWidgets: {
    display: "flex",
    gap: 10,
    marginBottom: 12,
    alignItems: "stretch",
  },
  mobileTimerCard: {
    background: "#fff",
    border: "1px solid #e2e8f0",
    borderRadius: 12,
    padding: "10px 14px",
    display: "flex",
    alignItems: "center",
    gap: 8,
    flexShrink: 0,
  },
  mobileTimerLabel: {
    fontSize: 10,
    fontWeight: 600,
    color: "#64748b",
    letterSpacing: "0.6px",
    textTransform: "uppercase" as const,
    lineHeight: 1.2,
  },
  mobileTimerValue: {
    fontSize: 18,
    fontWeight: 700,
    color: "#1a2f5e",
    letterSpacing: 1,
    lineHeight: 1,
  },
  mobileNavCard: {
    background: "#fff",
    border: "1px solid #e2e8f0",
    borderRadius: 12,
    padding: "10px 12px",
    flex: 1,
    minWidth: 0,
  },
  mobileNavTitle: {
    fontSize: 11,
    fontWeight: 600,
    color: "#1e293b",
    marginBottom: 7,
    letterSpacing: "0.2px",
  },
  mobileQGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(8, 1fr)",
    gap: 4,
  },
  quizArea: { flex: 1, minWidth: 0, width: "100%" },
  qLabelRow: { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 },
  qLabel: { fontSize: 12, fontWeight: 600, color: "#2563eb", letterSpacing: "0.3px" },
  ptsBadge: {
    background: "#eff4ff", color: "#2563eb",
    fontSize: 11, padding: "2px 9px", borderRadius: 6, fontWeight: 600,
  },
  questionCard: {
    background: "#fff", border: "1px solid #e2e8f0",
    borderRadius: 12, padding: 20, marginBottom: 14,
  },
  qTextRow: { display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 10, marginBottom: 6 },
  qText: { fontSize: 17, fontWeight: 600, lineHeight: 1.45, color: "#1e293b", flex: 1 },
  speakBtn: {
    background: "none", border: "1px solid #e2e8f0", borderRadius: 8,
    padding: 6, cursor: "pointer", color: "#64748b",
    display: "flex", alignItems: "center", flexShrink: 0,
  },
  qHint: { fontSize: 13, color: "#64748b", marginBottom: 16, lineHeight: 1.5 },
  optionBtn: (selected: boolean, correct: boolean | null, wrong: boolean | null) => ({
    width: "100%", padding: "12px 14px",
    background: correct ? "#f0fdf4" : wrong ? "#fef2f2" : selected ? "#eff4ff" : "#fff",
    border: `1.5px solid ${correct ? "#86efac" : wrong ? "#fca5a5" : selected ? "#2563eb" : "#e2e8f0"}`,
    borderRadius: 10, cursor: "pointer", textAlign: "left" as const,
    fontSize: 14, fontFamily: "inherit",
    color: correct ? "#16a34a" : wrong ? "#dc2626" : selected ? "#2563eb" : "#1e293b",
    fontWeight: selected || correct || wrong ? 600 : 400,
    transition: "all 0.15s", display: "flex", alignItems: "center", gap: 10,
    marginTop: 8,
  }),
  optCircle: (selected: boolean) => ({
    width: 18, height: 18, borderRadius: "50%",
    border: `2px solid ${selected ? "#2563eb" : "#e2e8f0"}`,
    background: selected ? "#2563eb" : "transparent",
    flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center",
  }),
  optDot: { width: 7, height: 7, borderRadius: "50%", background: "#fff" },
  inputField: {
    width: "100%", padding: "12px 14px",
    border: "1.5px solid #e2e8f0", borderRadius: 10,
    fontSize: 14, fontFamily: "inherit", color: "#1e293b",
    background: "#fff", outline: "none", marginTop: 8,
    boxSizing: "border-box" as const,
  },
  feedbackBanner: (status: "correct" | "wrong") => ({
    padding: "9px 14px", borderRadius: 10, fontSize: 13.5, fontWeight: 600,
    marginTop: 10, display: "flex", alignItems: "center", gap: 8,
    background: status === "correct" ? "#f0fdf4" : "#fef2f2",
    border: `1px solid ${status === "correct" ? "#86efac" : "#fca5a5"}`,
    color: status === "correct" ? "#16a34a" : "#dc2626",
  }),
  btnRow: { display: "flex", gap: 8, marginTop: 14, alignItems: "center" },
  btnSubmit: (disabled: boolean) => ({
    padding: "9px 18px",
    background: disabled ? "#9ca3af" : "#2563eb",
    color: "#fff", border: "none", borderRadius: 8,
    fontSize: 13.5, fontWeight: 600, cursor: disabled ? "not-allowed" : "pointer",
    fontFamily: "inherit", transition: "all 0.15s", whiteSpace: "nowrap" as const,
  }),
  btnNext: (disabled: boolean) => ({
    padding: "9px 16px", background: "#fff",
    color: disabled ? "#9ca3af" : "#1e293b",
    border: `1.5px solid ${disabled ? "#e2e8f0" : "#e2e8f0"}`,
    borderRadius: 8, fontSize: 13.5, fontWeight: 600,
    cursor: disabled ? "not-allowed" : "pointer",
    fontFamily: "inherit", display: "flex", alignItems: "center", gap: 5,
    opacity: disabled ? 0.5 : 1, whiteSpace: "nowrap" as const,
  }),
  btnExplain: (disabled: boolean) => ({
    padding: "9px 16px", background: disabled ? "#f4f6fb" : "#fffbeb",
    color: disabled ? "#9ca3af" : "#92400e",
    border: `1.5px solid ${disabled ? "#e2e8f0" : "#fde68a"}`,
    borderRadius: 8, fontSize: 13.5, fontWeight: 600,
    cursor: disabled ? "not-allowed" : "pointer",
    fontFamily: "inherit", display: "flex", alignItems: "center", gap: 5,
    whiteSpace: "nowrap" as const, marginLeft: "auto",
  }),
  explainBox: {
    marginTop: 12, padding: 14,
    background: "#fffbeb", border: "1px solid #fde68a",
    borderRadius: 10, fontSize: 13.5, color: "#92400e", lineHeight: 1.6,
  },
  sidePanel: {
    width: 230,
    flexShrink: 0,
    display: "flex",
    flexDirection: "column" as const,
    gap: 14,
  },
  timerCard: {
    background: "#fff", border: "1px solid #e2e8f0",
    borderRadius: 12, padding: 16, textAlign: "center" as const,
  },
  timerLabel: {
    fontSize: 10, fontWeight: 600, color: "#64748b",
    letterSpacing: "0.8px", textTransform: "uppercase" as const, marginBottom: 6,
  },
  timerDisplay: {
    fontSize: 32, fontWeight: 700, color: "#1a2f5e",
    letterSpacing: 2, display: "flex", alignItems: "center", justifyContent: "center", gap: 4,
  },
  timerBar: { height: 4, background: "#e2e8f0", borderRadius: 3, marginTop: 10, overflow: "hidden" },
  timerFill: (pct: number) => ({
    height: "100%",
    background: pct < 60 ? "#1a2f5e" : pct < 80 ? "#f59e0b" : "#dc2626",
    borderRadius: 3, width: pct + "%", transition: "width 1s linear",
  }),
  navigatorCard: {
    background: "#fff", border: "1px solid #e2e8f0",
    borderRadius: 12, padding: 16,
  },
  navCardTitle: { fontSize: 13.5, fontWeight: 600, color: "#1e293b", marginBottom: 10 },
  legend: { display: "flex", gap: 12, marginBottom: 10, flexWrap: "wrap" as const },
  legendItem: { display: "flex", alignItems: "center", gap: 5, fontSize: 11.5, color: "#64748b" },
  legendDot: (color: string) => ({
    width: 9, height: 9, borderRadius: "50%",
    background: color,
    flexShrink: 0,
  }),
  // Dynamic columns for desktop navigator: 5 per row up to 10 max
  qGrid: (total: number) => ({
    display: "grid",
    gridTemplateColumns: `repeat(${total <= 20 ? 5 : total <= 50 ? 7 : 10}, 1fr)`,
    gap: 6,
  }),
  qNum: (state: "current" | "correct" | "wrong" | "done" | "none") => ({
    width: "100%", aspectRatio: "1", borderRadius: 7,
    border: `1.5px solid ${state === "current" ? "#1a2f5e" : state === "correct" ? "#86efac" : state === "wrong" ? "#fca5a5" : state === "done" ? "#bfdbfe" : "#e2e8f0"}`,
    background: state === "current" ? "#1a2f5e" : state === "correct" ? "#dcfce7" : state === "wrong" ? "#fee2e2" : state === "done" ? "#eff4ff" : "#fff",
    fontSize: 12, fontWeight: 500, cursor: "pointer",
    display: "flex", alignItems: "center", justifyContent: "center",
    color: state === "current" ? "#fff" : state === "correct" ? "#16a34a" : state === "wrong" ? "#dc2626" : state === "done" ? "#2563eb" : "#1e293b",
    padding: 0, fontFamily: "inherit",
  }),
  infoBox: {
    background: "#fff", border: "1px solid #e2e8f0",
    borderRadius: 12, padding: 14,
  },
  infoTitle: { fontSize: 12, fontWeight: 700, color: "#1e293b", marginBottom: 10, letterSpacing: "0.3px", textTransform: "uppercase" as const },
  infoRow: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 7 },
  infoLabel: { fontSize: 12.5, color: "#64748b" },
  infoValue: (color?: string) => ({ fontSize: 13, fontWeight: 600, color: color || "#1e293b" }),
  infoBar: { height: 5, background: "#e2e8f0", borderRadius: 3, marginTop: 10, overflow: "hidden" },
  infoBarFill: (pct: number) => ({
    height: "100%",
    background: pct >= 70 ? "#16a34a" : pct >= 40 ? "#f59e0b" : "#dc2626",
    borderRadius: 3, width: pct + "%", transition: "width 0.4s ease",
  }),
  resultWrapper: {
    flex: 1, display: "flex", alignItems: "center", justifyContent: "center",
    background: "#f4f6fb", padding: 24,
  },
  resultCard: {
    background: "#fff", padding: 32, borderRadius: 18,
    textAlign: "center" as const, width: "100%", maxWidth: 400,
    border: "1px solid #e2e8f0",
  },
  resultTitle: { fontSize: 24, fontWeight: 700, color: "#1a2f5e", marginBottom: 6 },
  resultSub: { fontSize: 13.5, color: "#64748b", marginBottom: 24 },
  resultGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 22 },
  resultBox: {
    background: "#f4f6fb", padding: 14, borderRadius: 10,
    border: "1px solid #e2e8f0",
  },
  resultNum: { fontSize: 24, fontWeight: 700 },
  resultLbl: { fontSize: 11.5, color: "#64748b", marginTop: 3 },
  resultBtns: { display: "flex", gap: 10, justifyContent: "center" },
  rBtnPrimary: {
    padding: "11px 22px", background: "#2563eb", color: "#fff",
    border: "none", borderRadius: 9, fontSize: 13.5, fontWeight: 600, cursor: "pointer",
    fontFamily: "inherit",
  },
  rBtnSecondary: {
    padding: "11px 22px", background: "#fff", color: "#1e293b",
    border: "1.5px solid #e2e8f0", borderRadius: 9, fontSize: 13.5, fontWeight: 600,
    cursor: "pointer", fontFamily: "inherit",
  },
};

/* ---- ICON HELPERS ---- */
const Icon = {
  Home: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
  Video: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2"/></svg>,
  Check: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/></svg>,
  Doc: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a 2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>,
  Settings: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M19.07 4.93a10 10 0 010 14.14M4.93 4.93a10 10 0 000 14.14"/></svg>,
  Help: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
  Speaker: () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 010 7.07"/></svg>,
  ChevronRight: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6"/></svg>,
  Menu: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>,
  Close: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  Bulb: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21h6M12 3a6 6 0 016 6c0 2.22-1.21 4.16-3 5.2V17H9v-2.8A6 6 0 0112 3z"/></svg>,
  Timer: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
};

const NAV = [
  { label: "Home", icon: <Icon.Home />, path: "/" },
  { label: "Video Lectures", icon: <Icon.Video />, path: "//class/10/subject/27" },
  { label: "Assessments", icon: <Icon.Check />, path: "/assessment/1" },
  { label: "Past Papers", icon: <Icon.Doc />, path: "/class/10/subject/27/past-papers" },
 
];

/* ---- MOBILE TOP WIDGETS ---- */
function MobileTopWidgets({
  elapsedTime,
  formatTime,
  currentQ,
  answeredMap,
  totalQuestions,
  qNumState,
}: {
  elapsedTime: number;
  formatTime: (s: number) => string;
  currentQ: number;
  answeredMap: Record<number, "correct" | "wrong" | "done">;
  totalQuestions: number;        // ← now dynamic
  qNumState: (i: number) => "current" | "correct" | "wrong" | "done" | "none";
}) {
  return (
    <div style={S.mobileTopWidgets}>
      {/* Compact timer */}
      <div style={S.mobileTimerCard}>
        <div style={{ color: "#64748b", display: "flex" }}><Icon.Timer /></div>
        <div>
          <div style={S.mobileTimerLabel}>Time</div>
          <div style={S.mobileTimerValue}>{formatTime(elapsedTime)}</div>
        </div>
      </div>

      {/* Compact navigator */}
      <div style={S.mobileNavCard}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
          <div style={S.mobileNavTitle}>Navigator</div>
          <div style={{ display: "flex", gap: 8 }}>
            <span style={{ display: "flex", alignItems: "center", gap: 3, fontSize: 10, color: "#16a34a" }}>
              <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#22c55e", display: "inline-block" }} />
              Correct
            </span>
            <span style={{ display: "flex", alignItems: "center", gap: 3, fontSize: 10, color: "#dc2626" }}>
              <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#ef4444", display: "inline-block" }} />
              Wrong
            </span>
          </div>
        </div>
        {/* Grid columns adapt: max 10 per row */}
        <div style={S.mobileQGrid}>
          {Array.from({ length: totalQuestions }, (_, i) => {
            const state = qNumState(i);
            return (
              <div
                key={i}
                style={{
                  height: 22,
                  borderRadius: 5,
                  border: `1.5px solid ${state === "current" ? "#1a2f5e" : state === "correct" ? "#86efac" : state === "wrong" ? "#fca5a5" : state === "done" ? "#bfdbfe" : "#e2e8f0"}`,
                  background: state === "current" ? "#1a2f5e" : state === "correct" ? "#dcfce7" : state === "wrong" ? "#fee2e2" : state === "done" ? "#eff4ff" : "#fff",
                  fontSize: 10,
                  fontWeight: 500,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: state === "current" ? "#fff" : state === "correct" ? "#16a34a" : state === "wrong" ? "#dc2626" : state === "done" ? "#2563eb" : "#64748b",
                }}
              >
                {i + 1}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   MAIN COMPONENT
   ============================================================ */
function Quiz({ studentId = 2, chapterId = 105 }: Props) {
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // ── DYNAMIC: starts at 10 as a sensible default, updated once chapter API responds ──
  const [totalQuestions, setTotalQuestions] = useState(10);

  const [question, setQuestion] = useState<Question | null>(null);
  const [selected, setSelected] = useState<Option | null>(null);
  const [inputAnswer, setInputAnswer] = useState("");

  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);
  const [currentQ, setCurrentQ] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [status, setStatus] = useState<"correct" | "wrong" | null>(null);

  const [elapsedTime, setElapsedTime] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const [testName, setTestName] = useState("Loading...");
  const [answeredMap, setAnsweredMap] = useState<Record<number, "correct" | "wrong" | "done">>({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(true);

  const [showExplain, setShowExplain] = useState(false);
  const [explanation, setExplanation] = useState<string | null>(null);
  const [explainLoading, setExplainLoading] = useState(false);

  const isMCQ = question?.type === "mcq";
  const isInput = question?.type === "input";

  // ── Fetch chapter info — name AND total question count ──
  useEffect(() => {
    fetch(`https://zai.zaheen.com.pk/api/adaptive/chapter?chapterId=${chapterId}`)
      .then(r => r.json())
      .then(d => {
        setTestName(d?.name || d?.title || d?.chapter_name || "Adaptive Quiz");

        // Accept any of these common field names from the API
        const count =
          d?.total_questions ??
          d?.question_count ??
          d?.totalQuestions ??
          d?.questionsCount ??
          d?.count ??
          null;

        if (typeof count === "number" && count > 0) {
          setTotalQuestions(count);
        }
      })
      .catch(() => setTestName("Adaptive Quiz"));
  }, [chapterId]);

  useEffect(() => {
    timerRef.current = setInterval(() => setElapsedTime(p => p + 1), 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, []);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

  const loadQuestion = (qIndex: number) => {
    window.speechSynthesis.cancel();
    setSubmitted(false);
    setSelected(null);
    setInputAnswer("");
    setStatus(null);
    setQuestion(null);
    setLoading(true);
    setShowExplain(false);
    setExplanation(null);

    fetch(`https://zai.zaheen.com.pk/api/adaptive/next?studentId=${studentId}&chapterId=${chapterId}&t=${Date.now()}`)
      .then(r => r.json())
      .then(data => {
        const q = data?.question || data?.data || data;

        // ── If the API tells us the quiz is finished or sends a new total, respect it ──
        if (data?.total_questions && typeof data.total_questions === "number") {
          setTotalQuestions(data.total_questions);
        }

        if (!q || q.finished) {
          setShowResult(true);
          if (timerRef.current) clearInterval(timerRef.current);
          return;
        }
        setQuestion({
          id: q.id,
          type: q.type || "mcq",
          prompt: q.prompt,
          image_url: q.image_url || null,
          options: q.options || [],
        });
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    loadQuestion(0);
    return () => { window.speechSynthesis.cancel(); };
  }, []);

  const speak = () => {
    if (!question) return;
    window.speechSynthesis.cancel();
    let text = question.prompt;
    if (isMCQ) text += ". Options: " + question.options.map(o => o.option_text).join(", ");
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "en-US";
    window.speechSynthesis.speak(u);
  };

  const handleSubmit = () => {
    if (!question || submitted) return;
    setSubmitted(true);

    const payload: any = { studentId, questionId: question.id };
    if (isMCQ) payload.selectedOptionId = selected?.id;
    if (isInput) payload.answerText = inputAnswer;

    fetch("https://zai.zaheen.com.pk/api/adaptive/submit", {
      method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload),
    })
      .then(r => r.json())
      .then(data => {
        const isCorrect = data.correct === true || data.is_correct === true;
        if (isCorrect) setCorrectCount(p => p + 1);
        else setWrongCount(p => p + 1);
        setStatus(isCorrect ? "correct" : "wrong");
        setAnsweredMap(prev => ({ ...prev, [currentQ]: isCorrect ? "correct" : "wrong" }));
      })
      .catch(() => setSubmitted(false));
  };

  const handleNext = () => {
    window.speechSynthesis.cancel();
    if (!submitted) setAnsweredMap(prev => ({ ...prev, [currentQ]: "done" }));
    const next = currentQ + 1;
    if (next >= totalQuestions) {
      setShowResult(true);
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }
    setCurrentQ(next);
    loadQuestion(next);
  };

  const handleExplain = () => {
    if (!submitted || !question) return;
    setShowExplain(true);
    if (explanation !== null) return;
    setExplainLoading(true);
    fetch(`https://zai.zaheen.com.pk/api/adaptive/explanation?questionId=${question.id}`)
      .then(r => r.json())
      .then(data => {
        const exp = data?.explanation || data?.text || data?.content || null;
        setExplanation(exp || "__none__");
        setExplainLoading(false);
      })
      .catch(() => { setExplanation("__none__"); setExplainLoading(false); });
  };

  const qNumState = (i: number): "current" | "correct" | "wrong" | "done" | "none" => {
    if (i === currentQ) return "current";
    if (answeredMap[i] === "correct") return "correct";
    if (answeredMap[i] === "wrong") return "wrong";
    if (answeredMap[i] === "done") return "done";
    return "none";
  };

  const isDisabled = (isMCQ && !selected) || (isInput && !inputAnswer.trim()) || submitted;

  /* ---- Result screen ---- */
  if (showResult) {
    const total = correctCount + wrongCount;
    const pct = total ? Math.round((correctCount / total) * 100) : 0;
    return (
      <div style={S.app}>
        <SidebarComp open={sidebarOpen} isMobile={isMobile} onClose={() => setSidebarOpen(false)} />
        {isMobile && <div style={S.sidebarOverlay(sidebarOpen)} onClick={() => setSidebarOpen(false)} />}
        <div style={S.main}>
          <div style={S.topbar(isMobile)}>
            <div style={S.topbarLeft}>
              {isMobile && <button style={S.hamburger} onClick={() => setSidebarOpen(o => !o)}><Icon.Menu /></button>}
              <div><div style={S.topbarTitle}>{testName}</div><div style={S.topbarSub}>Section 1: Multiple Choice Questions</div></div>
            </div>
            <span style={S.sectionBadge}>Chapter {chapterId}</span>
          </div>
          <div style={S.resultWrapper}>
            <div style={S.resultCard}>
              <div style={{ fontSize: 50, marginBottom: 10 }}>🏆</div>
              <div style={S.resultTitle}>Quiz Completed!</div>
              <div style={S.resultSub}>Great effort. Here's how you did:</div>
              <div style={S.resultGrid}>
                <div style={S.resultBox}><div style={{ ...S.resultNum, color: "#16a34a" }}>{correctCount}</div><div style={S.resultLbl}>✅ Correct</div></div>
                <div style={S.resultBox}><div style={{ ...S.resultNum, color: "#dc2626" }}>{wrongCount}</div><div style={S.resultLbl}>❌ Wrong</div></div>
                <div style={S.resultBox}><div style={{ ...S.resultNum, color: "#1a2f5e" }}>{pct}%</div><div style={S.resultLbl}>📊 Score</div></div>
                <div style={S.resultBox}><div style={{ ...S.resultNum, color: "#1a2f5e" }}>{formatTime(elapsedTime)}</div><div style={S.resultLbl}>⏱ Total Time</div></div>
              </div>
              <div style={S.resultBtns}>
                <button style={S.rBtnPrimary} onClick={() => window.location.reload()}>🔄 Restart</button>
                <button style={S.rBtnSecondary} onClick={() => window.history.back()}>🚪 Exit</button>
              </div>
            </div>
=======
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
>>>>>>> c30dad3035bc685687766d655829ba3a37a7dcc0
          </div>
        </div>
      </div>
    );
  }

<<<<<<< HEAD
  return (
    <div style={S.app}>
      <SidebarComp open={sidebarOpen} isMobile={isMobile} onClose={() => setSidebarOpen(false)} />
      {isMobile && <div style={S.sidebarOverlay(sidebarOpen)} onClick={() => setSidebarOpen(false)} />}
      <div style={S.main}>
        {/* TOP BAR */}
        <div style={S.topbar(isMobile)}>
          <div style={S.topbarLeft}>
            {isMobile && (
              <button style={S.hamburger} onClick={() => setSidebarOpen(o => !o)}>
                {sidebarOpen ? <Icon.Close /> : <Icon.Menu />}
              </button>
            )}
            <div>
              <div style={S.topbarTitle}>{testName}</div>
              <div style={S.topbarSub}>Section 1: Multiple Choice Questions</div>
            </div>
          </div>
          <span style={S.sectionBadge}>Chapter {chapterId}</span>
        </div>

        {/* CONTENT */}
        <div style={S.content(isMobile)}>
          {/* LEFT: QUIZ */}
          <div style={S.quizArea}>

            {/* ── MOBILE ONLY: timer + navigator above the quiz card ── */}
            {isMobile && (
              <MobileTopWidgets
                elapsedTime={elapsedTime}
                formatTime={formatTime}
                currentQ={currentQ}
                answeredMap={answeredMap}
                totalQuestions={totalQuestions}
                qNumState={qNumState}
              />
            )}

            <div style={S.qLabelRow}>
              <span style={S.qLabel}>QUESTION {currentQ + 1} OF {totalQuestions}</span>
              <span style={S.ptsBadge}>1.5 Points</span>
            </div>

            <div style={S.questionCard}>
              {loading ? (
                <div style={{ color: "#64748b", fontSize: 14, padding: "16px 0" }}>Loading question...</div>
              ) : question ? (
                <>
                  <div style={S.qTextRow}>
                    <div style={S.qText}>{question.prompt}</div>
                    <button style={S.speakBtn} onClick={speak} title="Read aloud"><Icon.Speaker /></button>
                  </div>
                  <div style={S.qHint}>Choose the best answer below.</div>

                  {question.image_url && (
                    <img src={question.image_url} alt="" style={{ width: "100%", borderRadius: 8, marginBottom: 10 }} />
                  )}

                  {/* MCQ OPTIONS */}
                  {isMCQ && question.options.map(opt => {
                    const isSel = selected?.id === opt.id;
                    const isCorrectOpt = status === "correct" && isSel;
                    const isWrongOpt = status === "wrong" && isSel;
                    return (
                      <button
                        key={opt.id}
                        style={S.optionBtn(isSel, isCorrectOpt, isWrongOpt)}
                        onClick={() => { if (!submitted) setSelected(opt); }}
                        disabled={submitted}
                      >
                        <div style={S.optCircle(isSel)}>
                          {isSel && <div style={S.optDot} />}
                        </div>
                        <span>{opt.option_text}</span>
                      </button>
                    );
                  })}

                  {/* INPUT */}
                  {isInput && (
                    <input
                      style={S.inputField}
                      value={inputAnswer}
                      onChange={e => setInputAnswer(e.target.value)}
                      placeholder="Type your answer here..."
                      disabled={submitted}
                    />
                  )}

                  {/* FEEDBACK */}
                  {status && (
                    <div style={S.feedbackBanner(status)}>
                      {status === "correct" ? "🎉 Correct! Well done." : "❌ Incorrect. Keep going!"}
                    </div>
                  )}

                  {/* BUTTONS */}
                  <div style={S.btnRow}>
                    <button style={S.btnSubmit(isDisabled)} onClick={handleSubmit} disabled={isDisabled}>
                      Submit
                    </button>
                    <button style={S.btnNext(!submitted)} onClick={handleNext} disabled={!submitted}>
                      Next <Icon.ChevronRight />
                    </button>
                    <button style={S.btnExplain(!submitted)} onClick={handleExplain} disabled={!submitted}>
                      <Icon.Bulb /> Explain
                    </button>
                  </div>

                  {/* EXPLANATION BOX */}
                  {showExplain && (
                    <div style={S.explainBox}>
                      {explainLoading ? (
                        <span style={{ color: "#92400e", opacity: 0.7 }}>Loading explanation...</span>
                      ) : explanation === "__none__" || !explanation ? (
                        <span>💡 We don't have an explanation for this question yet. Check back soon!</span>
                      ) : (
                        <span>💡 <strong>Explanation:</strong> {explanation}</span>
                      )}
                    </div>
                  )}
                </>
              ) : (
                <div style={{ color: "#dc2626", fontSize: 13.5 }}>Failed to load question. Please check your connection.</div>
              )}
            </div>
          </div>

          {/* RIGHT PANEL — desktop only */}
          {!isMobile && (
            <div style={S.sidePanel}>
              {/* TIMER */}
              <div style={S.timerCard}>
                <div style={S.timerLabel}>Time Elapsed</div>
                <div style={S.timerDisplay}>
                  <span style={{ fontSize: 18, color: "#64748b" }}>⏱</span>
                  &nbsp;{formatTime(elapsedTime)}
                </div>
                <div style={S.timerBar}>
                  <div style={S.timerFill(Math.min(100, Math.round((elapsedTime / 2700) * 100)))} />
                </div>
              </div>

              {/* NAVIGATOR — grid columns scale with question count */}
              <div style={S.navigatorCard}>
                <div style={S.navCardTitle}>Question Navigator</div>
                <div style={S.legend}>
                  <div style={S.legendItem}><div style={S.legendDot("#22c55e")} /> Correct</div>
                  <div style={S.legendItem}><div style={S.legendDot("#ef4444")} /> Wrong</div>
                </div>
                <div style={S.qGrid(totalQuestions)}>
                  {Array.from({ length: totalQuestions }, (_, i) => (
                    <button key={i} style={S.qNum(qNumState(i))}>{i + 1}</button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
=======
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
>>>>>>> c30dad3035bc685687766d655829ba3a37a7dcc0
      </div>
    </div>
  );
}

<<<<<<< HEAD
/* ---- SIDEBAR COMPONENT ---- */
function SidebarComp({ open, isMobile, onClose }: { open: boolean; isMobile: boolean; onClose: () => void }) {
  const [hovered, setHovered] = useState<number | null>(null);
  const navigate = useNavigate();
  return (
    <div style={S.sidebar(open, isMobile)}>
      <div style={S.sidebarBrand}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={S.brandIcon}>
            <svg width="40" height="40" viewBox="0 0 24 24" fill="#1e293b">
              <path d="M12 3L1 9l11 6 9-4.91V17h2V9M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82z" />
            </svg>
          </div>
          {isMobile && (
            <button style={{ background: "none", border: "none", cursor: "pointer", color: "#64748b", padding: 4 }} onClick={onClose}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          )}
        </div>
        <div style={{ marginTop: 8 }}>
          <div style={S.brandTitle}>Learning Center</div>
          <div style={S.brandSub}>Academic Excellence</div>
        </div>
      </div>
      <div style={S.navSection}>
       {NAV.map((item, i) =>
  item === null ? (
    <div key={i} style={S.navDivider} />
  ) : (
   <button
  key={i}
  onMouseEnter={() => setHovered(i)}
  onMouseLeave={() => setHovered(null)}
  style={{
    ...S.navItem(false),
    background:
      hovered === i
        ? "rgba(37,99,235,0.08)"
        : S.navItem(false).background,
    color: hovered === i ? "#2563eb" : S.navItem(false).color,
    transform: hovered === i ? "translateX(3px)" : "none",
    transition: "all 0.2s ease",
  }}
  onClick={() => {
    navigate(item.path);
    onClose?.();
  }}
>
  <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
    {item.icon}
    {item.label}
  </span>
</button>
  )
)}
      </div>
    </div>
  );
}

export default Quiz;
=======
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
>>>>>>> c30dad3035bc685687766d655829ba3a37a7dcc0
