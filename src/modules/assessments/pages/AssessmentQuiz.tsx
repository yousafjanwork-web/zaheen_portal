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

  top: 100,
  height: "calc(100vh - 12px)",
  paddingTop: 10,

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
  
  navSection: { padding: "14px 10px", flex: 1, overflowY: "auto" as const },
  navItem: (active: boolean) => ({
    display: "flex", alignItems: "center", gap: 9,
    padding: "9px 11px", borderRadius: 8, cursor: "pointer",
    color: active ? "#2563eb" : "#1e293b",
    fontSize: 15, fontWeight: 500,
    background: active ? "rgba(37,99,235,0.08)" : "transparent",
    border: "none", width: "100%", textAlign: "left" as const,
    marginBottom: 15, transition: "all 0.15s", whiteSpace: "nowrap" as const,
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
          </div>
        </div>
      </div>
    );
  }

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
      </div>
    </div>
  );
}

/* ---- SIDEBAR COMPONENT ---- */
function SidebarComp({ open, isMobile, onClose }: { open: boolean; isMobile: boolean; onClose: () => void }) {
  const [hovered, setHovered] = useState<number | null>(null);
  const navigate = useNavigate();
  return (
    <div style={S.sidebar(open, isMobile)}>
      
      <div style={S.sidebarBrand}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
         
          {isMobile && (
            <button style={{ background: "none", border: "none", cursor: "pointer", color: "#64748b", padding: 4 }} onClick={onClose}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          )}
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